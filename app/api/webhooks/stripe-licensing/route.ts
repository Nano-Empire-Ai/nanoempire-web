/**
 * Stripe Webhook Handler — License Provisioning & Management
 * Handles checkout.session.completed, subscription updates, cancellations
 */

import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { licenseManager, LICENSE_TIERS } from '@/lib/licensing/manager';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_mock', {
  apiVersion: '2023-10-16',
});

const WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET || 'whsec_mock';

// Tier mapping from Stripe Price IDs to internal tier IDs
const PRICE_TO_TIER: Record<string, string> = {
  // These will be populated after Stripe products are created
  'price_recallradar_core': 'recallradar-core',
  'price_skillproof_index': 'skillproof-index',
  'price_bidshield_tenders': 'bidshield-tenders',
  'price_enterprise_bundle': 'enterprise-bundle',
  'price_recallradar_delta': 'recallradar-delta-addon',
};

export async function POST(request: NextRequest) {
  const body = await request.text();
  const headersList = await headers();
  const signature = headersList.get('stripe-signature');

  if (!signature) {
    return NextResponse.json({ error: 'Missing stripe-signature header' }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, WEBHOOK_SECRET);
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message);
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session);
        break;
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object as Stripe.Subscription);
        break;
      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object as Stripe.Subscription);
        break;
      case 'invoice.payment_failed':
        await handlePaymentFailed(event.data.object as Stripe.Invoice);
        break;
      case 'invoice.payment_succeeded':
        await handlePaymentSucceeded(event.data.object as Stripe.Invoice);
        break;
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error('Webhook handler error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  console.log('Checkout completed:', session.id);

  const customerEmail = session.customer_details?.email || session.customer_email;
  const stripeCustomerId = session.customer as string;
  const stripeSubscriptionId = session.subscription as string;

  if (!customerEmail || !stripeCustomerId || !stripeSubscriptionId) {
    console.error('Missing required session data:', { customerEmail, stripeCustomerId, stripeSubscriptionId });
    return;
  }

  // Determine tier from line items
  let tierId: string | null = null;
  
  if (session.line_items?.data) {
    for (const item of session.line_items.data) {
      const priceId = item.price?.id;
      if (priceId && PRICE_TO_TIER[priceId]) {
        tierId = PRICE_TO_TIER[priceId];
        break;
      }
    }
  }

  // Fallback to metadata
  if (!tierId && session.metadata?.tier_id) {
    tierId = session.metadata.tier_id;
  }

  if (!tierId) {
    console.error('Could not determine tier from checkout session:', session.id);
    return;
  }

  try {
    const { license, apiKey } = await licenseManager.provisionLicense(
      tierId,
      customerEmail,
      stripeCustomerId,
      stripeSubscriptionId
    );

    console.log('License provisioned:', { licenseId: license.id, tierId, apiKey: apiKey.substring(0, 20) + '...' });

    // TODO: Send welcome email with API key and dashboard link
    // await sendWelcomeEmail(customerEmail, license, apiKey);

    // Update Stripe customer metadata with license ID
    await stripe.customers.update(stripeCustomerId, {
      metadata: {
        license_id: license.id,
        tier_id: tierId,
      },
    });

  } catch (error: any) {
    console.error('Failed to provision license:', error);
    throw error;
  }
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  console.log('Subscription updated:', subscription.id, subscription.status);

  const tierId = getTierFromSubscription(subscription);
  if (!tierId) return;

  // Find license by subscription ID
  const licenses = licenseManager.getAllLicenses();
  const license = licenses.find(l => l.stripeSubscriptionId === subscription.id);

  if (!license) {
    console.log('No license found for subscription:', subscription.id);
    return;
  }

  // Update license status based on subscription status
  let newStatus: License['status'] = 'active';
  switch (subscription.status) {
    case 'active':
    case 'trialing':
      newStatus = 'active';
      break;
    case 'past_due':
      newStatus = 'past_due';
      break;
    case 'canceled':
    case 'unpaid':
      newStatus = 'canceled';
      break;
  }

  await licenseManager.updateLicenseStatus(license.id, newStatus);
  console.log('License status updated:', license.id, newStatus);
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  console.log('Subscription deleted:', subscription.id);

  const licenses = licenseManager.getAllLicenses();
  const license = licenses.find(l => l.stripeSubscriptionId === subscription.id);

  if (license) {
    await licenseManager.revokeLicense(license.id);
    console.log('License revoked:', license.id);
  }
}

async function handlePaymentFailed(invoice: Stripe.Invoice) {
  console.log('Payment failed:', invoice.id);

  if (invoice.subscription) {
    const licenses = licenseManager.getAllLicenses();
    const license = licenses.find(l => l.stripeSubscriptionId === invoice.subscription as string);

    if (license) {
      await licenseManager.updateLicenseStatus(license.id, 'past_due');
      console.log('License marked past_due:', license.id);

      // TODO: Send payment failed notification email
    }
  }
}

async function handlePaymentSucceeded(invoice: Stripe.Invoice) {
  console.log('Payment succeeded:', invoice.id);

  if (invoice.subscription) {
    const licenses = licenseManager.getAllLicenses();
    const license = licenses.find(l => l.stripeSubscriptionId === invoice.subscription as string);

    if (license && license.status === 'past_due') {
      await licenseManager.updateLicenseStatus(license.id, 'active');
      console.log('License reactivated:', license.id);

      // TODO: Send payment recovered notification email
    }
  }
}

function getTierFromSubscription(subscription: Stripe.Subscription): string | null {
  for (const item of subscription.items.data) {
    const priceId = item.price.id;
    if (PRICE_TO_TIER[priceId]) {
      return PRICE_TO_TIER[priceId];
    }
  }
  return null;
}

// Helper to create Stripe products and prices (run once during setup)
export async function setupStripeProducts() {
  const products = [
    {
      name: 'RecallRadar Core License',
      description: '46,642 CPSC/FDA/Health Canada recall records with daily updates. JSON/CSV formats. 10,000 requests/day.',
      price: 240000, // $2,400/year in cents
      interval: 'year' as const,
      tierId: 'recallradar-core',
      metadata: { tier_id: 'recallradar-core', products: 'recallradar-core' },
    },
    {
      name: 'SkillProof MCP Index License',
      description: '25+ pre-audited MCP repositories with line-cited security findings. JSON format. 5,000 requests/day.',
      price: 120000, // $1,200/year in cents
      interval: 'year' as const,
      tierId: 'skillproof-index',
      metadata: { tier_id: 'skillproof-index', products: 'skillproof-index' },
    },
    {
      name: 'BidShield Tender Intelligence License',
      description: '16+ federal solicitations with disqualifier analysis. JSON format. 5,000 requests/day.',
      price: 120000, // $1,200/year in cents
      interval: 'year' as const,
      tierId: 'bidshield-tenders',
      metadata: { tier_id: 'bidshield-tenders', products: 'bidshield-tenders' },
    },
    {
      name: 'Enterprise Data Bundle',
      description: 'All data products: RecallRadar Core + Delta + SkillProof + BidShield. 100,000 requests/day. Priority support.',
      price: 500000, // $5,000/year in cents
      interval: 'year' as const,
      tierId: 'enterprise-bundle',
      metadata: { tier_id: 'enterprise-bundle', products: 'recallradar-core,recallradar-delta,skillproof-index,bidshield-tenders' },
    },
    {
      name: 'RecallRadar Delta Feed (Add-on)',
      description: 'Hourly recall delta feed for real-time compliance monitoring. JSON format. 50,000 requests/day.',
      price: 50000, // $500/month in cents
      interval: 'month' as const,
      tierId: 'recallradar-delta-addon',
      metadata: { tier_id: 'recallradar-delta-addon', products: 'recallradar-delta' },
    },
  ];

  const createdPrices: Record<string, string> = {};

  for (const product of products) {
    try {
      const stripeProduct = await stripe.products.create({
        name: product.name,
        description: product.description,
        metadata: product.metadata,
      });

      const price = await stripe.prices.create({
        product: stripeProduct.id,
        unit_amount: product.price,
        currency: 'usd',
        recurring: { interval: product.interval },
        metadata: { tier_id: product.tierId },
      });

      createdPrices[product.tierId] = price.id;
      console.log(`Created Stripe product: ${product.name} -> Price ID: ${price.id}`);
    } catch (error: any) {
      if (error.code === 'resource_already_exists') {
        console.log(`Product already exists: ${product.name}`);
      } else {
        console.error(`Failed to create product ${product.name}:`, error);
      }
    }
  }

  return createdPrices;
}

export async function createCheckoutSession(
  tierId: string,
  customerEmail: string,
  successUrl: string,
  cancelUrl: string
): Promise<Stripe.Checkout.Session> {
  const tier = LICENSE_TIERS[tierId];
  if (!tier) throw new Error(`Invalid tier: ${tierId}`);

  const priceId = Object.entries(PRICE_TO_TIER).find(([, v]) => v === tierId)?.[0];
  if (!priceId) {
    // Try to find in Stripe
    const prices = await stripe.prices.list({ limit: 100 });
    const found = prices.data.find(p => p.metadata?.tier_id === tierId);
    if (found) {
      PRICE_TO_TIER[found.id] = tierId;
    } else {
      throw new Error(`No price found for tier: ${tierId}`);
    }
  }

  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    payment_method_types: ['card'],
    line_items: [{ price: priceId, quantity: 1 }],
    customer_email: customerEmail,
    success_url: successUrl,
    cancel_url: cancelUrl,
    metadata: { tier_id: tierId },
    subscription_data: {
      metadata: { tier_id: tierId },
    },
  });

  return session;
}