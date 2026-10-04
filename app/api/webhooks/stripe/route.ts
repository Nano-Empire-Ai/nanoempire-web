import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_mock', {
  apiVersion: '2024-12-18.acacia',
});

const WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET || '';

// Maps Stripe price IDs to our SKU IDs
const PRICE_TO_SKU: Record<string, string> = {
  // Fill in after creating Stripe products
  // 'price_xxx': 'recallguard-report',
  // 'price_yyy': 'recallguard-monitoring',
  // 'price_zzz': 'skillproof-standard',
  // 'price_www': 'skillproof-sprint',
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
    const sku = mapSessionToSku(session);

    console.log(
      `[REVENUE] sku=${sku} email=${session.customer_email} amount=$${(session.amount_total || 0) / 100} currency=${session.currency} session=${session.id}`
    );

    // Here you would:
    // 1. Insert into Supabase revenue_receipts table
    // 2. Trigger fulfillment (send report, activate monitoring, start audit)
    // 3. Emit TASK_EXECUTION_COMPLETE to reputation bridge
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

function mapSessionToSku(session: Stripe.Checkout.Session): string {
  const lineItem = session.line_items?.data?.[0];
  const priceId = lineItem?.price?.id;
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
