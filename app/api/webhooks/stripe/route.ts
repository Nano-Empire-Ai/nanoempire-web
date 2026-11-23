import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { Resend } from 'resend';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_mock', {
  apiVersion: '2024-12-18.acacia',
});

const resend = new Resend(process.env.RESEND_API_KEY);

const WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET || '';

// Maps Stripe price IDs to our SKU IDs
const PRICE_TO_SKU: Record<string, string> = {
  'price_1UMqVDKm83mOzFpMlMZIRTw5': 'recallguard-report',
  'price_1UMqWcKm83mOzFpMYaAXtgzU': 'recallguard-monitoring',
  'price_1UMqXSKm83mOzFpMbU3q5uEE': 'skillproof-standard',
  'price_1UMqYGKm83mOzFpMvcdaLlCI': 'skillproof-sprint',
};

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get('stripe-signature') || '';

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, WEBHOOK_SECRET);
  } catch (err: any) {
    console.error('[STRIPE-WEBHOOK] Signature verification failed:', err.message);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  // Handle successful checkout
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const sku = await mapSessionToSku(session);

    const amount = (session.amount_total || 0) / 100;
    const currency = session.currency;
    const email = session.customer_details?.email || session.customer_email;

    console.log(
      `[REVENUE] sku=${sku} email=${email} amount=$${amount} currency=${currency} session=${session.id}`
    );

    // INSTANT EMAIL ALERT — never miss a sale
    if (resend && email) {
      try {
        await resend.emails.send({
          from: 'Nano Empire AI <sales@nanoempireai.com>',
          to: 'roblambert9@gmail.com',
          subject: `💰 NEW SALE: ${sku} — $${amount} ${currency.toUpperCase()}`,
          html: `
            <h2>New Stripe Payment Received</h2>
            <p><strong>SKU:</strong> ${sku}</p>
            <p><strong>Amount:</strong> $${amount} ${currency.toUpperCase()}</p>
            <p><strong>Customer:</strong> ${email}</p>
            <p><strong>Session:</strong> ${session.id}</p>
            <p><strong>Time:</strong> ${new Date().toISOString()}</p>
            <hr>
            <p><a href="https://dashboard.stripe.com/test/payments/${session.payment_intent}">View in Stripe Dashboard</a></p>
          `,
        });
        console.log(`[ALERT] Resend sale notification sent for ${sku}`);
      } catch (err: any) {
        console.warn(`[ALERT] Resend failed: ${err.message}`);
      }
    }

    await fulfillOrder(session, sku);
  }

  // Handle subscription renewals
  if (event.type === 'invoice.paid') {
    const invoice = event.data.object as Stripe.Invoice;
    console.log(
      `[RENEWAL] customer=${invoice.customer_email} amount=$${(invoice.amount_paid || 0) / 100}`
    );
  }

  return NextResponse.json({ received: true });
}

async function mapSessionToSku(session: Stripe.Checkout.Session): Promise<string> {
  // 1. Prefer explicit metadata set at Checkout Session creation
  const metaSku = session.metadata?.tier_id || session.metadata?.package_id || session.metadata?.sku;
  if (metaSku) {
    return metaSku;
  }

  // 2. Stripe does not expand line_items on checkout.session.completed webhook payloads by default
  let items = session.line_items?.data;
  if (!items || items.length === 0) {
    try {
      const listed = await stripe.checkout.sessions.listLineItems(session.id, { limit: 5 });
      items = listed.data;
    } catch (err: any) {
      console.warn(`[STRIPE-WEBHOOK] listLineItems failed for ${session.id}:`, err?.message);
    }
  }

  const priceId = items?.[0]?.price?.id;
  if (priceId && PRICE_TO_SKU[priceId]) {
    return PRICE_TO_SKU[priceId];
  }
  return 'unknown';
}

async function fulfillOrder(session: Stripe.Checkout.Session, sku: string) {
  // Fulfillment logic per SKU
  switch (sku) {
    case 'recallguard-report':
      // Trigger: run recall scan, generate PDF, email to customer_email
      console.log(`[FULFILL] Sending compliance report to ${session.customer_email}`);
      break;
    case 'recallguard-monitoring':
      // Trigger: add to monthly monitoring queue
      console.log(`[FULFILL] Activating continuous monitoring for ${session.customer_email}`);
      break;
    case 'skillproof-standard':
    case 'skillproof-sprint':
      // Trigger: add to audit queue, human operator (Rob) picks up
      console.log(`[FULFILL] Queued SkillProof ${sku} for ${session.customer_email}`);
      break;
    default:
      console.warn(`[FULFILL] Unknown SKU: ${sku}`);
  }
}

export const runtime = 'nodejs';
