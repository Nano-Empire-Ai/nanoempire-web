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

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const priceId = searchParams.get('price_id');
  const tierId = searchParams.get('tier_id');

  const rawKey = tierId || priceId || '';
  const resolvedTierId = ALIAS_TO_TIER[rawKey] || (rawKey in LICENSE_TIERS ? rawKey : null);
  const tier = resolvedTierId ? LICENSE_TIERS[resolvedTierId] : null;

  if (!tier) {
    return NextResponse.json(
      { error: 'Invalid or missing tier_id / price_id', supported_tiers: Object.keys(LICENSE_TIERS) },
      { status: 400 }
    );
  }

  const origin = request.headers.get('origin') || 'https://www.nanoempireai.com';

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
