import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_mock', {
  apiVersion: '2023-10-16',
});

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const priceId = searchParams.get('price_id');
  const tierId = searchParams.get('tier_id');

  if (!priceId && !tierId) {
    return NextResponse.json(
      { error: 'Missing price_id or tier_id parameter' },
      { status: 400 }
    );
  }

  // Map tier_id to price_id if needed
  let finalPriceId = priceId;
  if (!finalPriceId && tierId) {
    const PRICE_TO_TIER: Record<string, string> = {
      'price_recallradar_core': 'recallradar-core',
      'price_skillproof_index': 'skillproof-index',
      'price_bidshield_tenders': 'bidshield-tenders',
      'price_enterprise_bundle': 'enterprise-bundle',
      'price_recallradar_delta': 'recallradar-delta-addon',
    };
    const found = Object.entries(PRICE_TO_TIER).find(([, v]) => v === tierId);
    if (found) finalPriceId = found[0];
  }

  if (!finalPriceId) {
    return NextResponse.json(
      { error: 'Invalid price_id or tier_id' },
      { status: 400 }
    );
  }

  const origin = request.headers.get('origin') || 'https://www.nanoempireai.com';

  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [{ price: finalPriceId, quantity: 1 }],
      success_url: `${origin}/licensing/dashboard?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/licensing`,
      metadata: {
        tier_id: tierId || '',
      },
      subscription_data: {
        metadata: {
          tier_id: tierId || '',
        },
      },
      allow_promotion_codes: true,
      billing_address_collection: 'auto',
      customer_email: undefined, // Let customer enter
    });

    return NextResponse.redirect(session.url!, 303);
  } catch (error: any) {
    console.error('Checkout session creation failed:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session', details: error.message },
      { status: 500 }
    );
  }
}