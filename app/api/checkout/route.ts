import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { LICENSE_TIERS } from '@/lib/licensing/manager';

const stripeSecret = process.env.STRIPE_SECRET_KEY;
const stripe = stripeSecret ? new Stripe(stripeSecret, { apiVersion: '2023-10-16' }) : null;

// Map possible price string aliases to canonical tier IDs
const ALIAS_TO_TIER: Record<string, string> = {
  'price_recallguard_shield': 'recallguard-shield',
  'recallguard-shield': 'recallguard-shield',
  'price_recallradar_core': 'recallradar-core',
  'recallradar-core': 'recallradar-core',
  'price_skillproof_index': 'skillproof-index',
  'skillproof-index': 'skillproof-index',
  'price_bidshield_tenders': 'bidshield-tenders',
  'bidshield-tenders': 'bidshield-tenders',
  'price_enterprise_bundle': 'enterprise-bundle',
  'enterprise-bundle': 'enterprise-bundle',
  'price_recallradar_delta': 'recallradar-delta-addon',
  'recallradar-delta-addon': 'recallradar-delta-addon',
};

// One-time BidShield compliance matrix & JV packages (card checkout without requiring Upwork account)
const ONE_TIME_PACKAGES: Record<string, { id: string; name: string; priceUsd: number; description: string }> = {
  'bidshield-299': {
    id: 'bidshield-299',
    name: 'BidShield <24h Rapid Deontic Triage & 19-Column Matrix (Pilot)',
    priceUsd: 299,
    description: '19-Column Excel/CSV Compliance Matrix + Fatal-Gate Brief (<24h Express Turnaround, Zero-Risk Guarantee)',
  },
  'bidshield-499': {
    id: 'bidshield-499',
    name: 'BidShield Standard 19-Column Compliance Matrix + SOW Cross-Check',
    priceUsd: 499,
    description: 'Complete 19-Column Compliance Matrix + Statement of Work & Basis of Payment Clause Mapping (<24h Turnaround)',
  },
  'bidshield-999': {
    id: 'bidshield-999',
    name: 'BidShield Full Proposal Red-Team & Multi-Amendment Suite',
    priceUsd: 999,
    description: 'Full 19-Column Matrix + All Amendments + Executive Red-Team Audit & Remediation Checklist',
  },
  'bidshield-jv-1500': {
    id: 'bidshield-jv-1500',
    name: 'BidShield IFR / PSIB Joint-Venture & Socio-Economic Compliance Package',
    priceUsd: 1500,
    description: 'Complete Inuit Benefits Plan (IBP) / PSIB Joint-Venture Compliance Structuring + 19-Column Matrix',
  },
};

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const priceId = searchParams.get('price_id');
  const tierId = searchParams.get('tier_id');
  const solicitationId = searchParams.get('solicitation_id') || '';

  const rawKey = tierId || priceId || '';
  const oneTime = ONE_TIME_PACKAGES[rawKey];
  const resolvedTierId = ALIAS_TO_TIER[rawKey] || (rawKey in LICENSE_TIERS ? rawKey : null);
  const tier = resolvedTierId ? LICENSE_TIERS[resolvedTierId] : null;

  if (!tier && !oneTime) {
    return NextResponse.json(
      {
        error: 'Invalid or missing tier_id / price_id',
        supported_tiers: [...Object.keys(LICENSE_TIERS), ...Object.keys(ONE_TIME_PACKAGES)],
      },
      { status: 400 }
    );
  }

  const origin = request.headers.get('origin') || 'https://www.nanoempireai.com';

  if (oneTime) {
    const solLabel = solicitationId ? ` [Solicitation: ${solicitationId}]` : '';
    if (!stripe || !stripeSecret || stripeSecret.includes('mock')) {
      return NextResponse.redirect(
        `${origin}/bidshield/tender/${solicitationId || 'cb-936-66068078'}?checkout=demo_success&pkg=${oneTime.id}`,
        303
      );
    }
    try {
      const session = await stripe.checkout.sessions.create({
        mode: 'payment',
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: 'usd',
              unit_amount: oneTime.priceUsd * 100,
              product_data: {
                name: `${oneTime.name}${solLabel}`,
                description: oneTime.description,
                metadata: {
                  package_id: oneTime.id,
                  solicitation_id: solicitationId,
                },
              },
            },
            quantity: 1,
          },
        ],
        success_url: `${origin}/bidshield/tender/${solicitationId}?session_id={CHECKOUT_SESSION_ID}&pkg=${oneTime.id}`,
        cancel_url: solicitationId ? `${origin}/bidshield/tender/${solicitationId}` : `${origin}/bidshield`,
        metadata: {
          package_id: oneTime.id,
          solicitation_id: solicitationId,
        },
        allow_promotion_codes: true,
        billing_address_collection: 'auto',
      });
      return NextResponse.redirect(session.url!, 303);
    } catch (err: any) {
      return NextResponse.json({ error: 'Failed to create one-time checkout session', details: err.message }, { status: 502 });
    }
  }

  // If no Stripe secret key configured (or mock in local dev), provide instant demo checkout redirect
  if (!stripe || !stripeSecret || stripeSecret.includes('mock')) {
    return NextResponse.redirect(`${origin}/licensing/dashboard?mock_session=dev_${Date.now()}&tier=${tier.id}`, 303);
  }

  try {
    // If a real custom Stripe price ID (like price_1Oz...) was passed that isn't our alias, use it directly.
    // Otherwise, use Stripe's inline price_data for 100% reliable zero-configuration checkout!
    const isCustomRealPriceId = priceId && priceId.startsWith('price_') && !ALIAS_TO_TIER[priceId];

    const lineItem: Stripe.Checkout.SessionCreateParams.LineItem = isCustomRealPriceId
      ? { price: priceId, quantity: 1 }
      : {
          price_data: {
            currency: 'usd',
            unit_amount: tier.priceUsd * 100,
            recurring: {
              interval: tier.interval,
            },
            product_data: {
              name: tier.name,
              description: `Nano Empire AI Data License — ${tier.name} (${tier.interval}ly access)`,
              metadata: {
                tier_id: tier.id,
              },
            },
          },
          quantity: 1,
        };

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [lineItem],
      success_url: `${origin}/licensing/dashboard?session_id={CHECKOUT_SESSION_ID}&tier_id=${tier.id}`,
      cancel_url: `${origin}/licensing`,
      metadata: {
        tier_id: tier.id,
      },
      subscription_data: {
        metadata: {
          tier_id: tier.id,
        },
      },
      allow_promotion_codes: true,
      billing_address_collection: 'auto',
    });

    return NextResponse.redirect(session.url!, 303);
  } catch (error: any) {
    console.error('Checkout session creation failed:', error);
    return NextResponse.json(
      {
        error: 'Failed to create checkout session',
        details: error.message,
        tier: tier.id,
        price_usd: tier.priceUsd,
      },
      { status: 502 }
    );
  }
}
