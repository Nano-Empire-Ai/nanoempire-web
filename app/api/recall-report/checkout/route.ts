import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { randomUUID } from 'crypto';
import { initDb, saveScan } from '@/lib/db';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_mock', {
  apiVersion: '2023-10-16',
});

export async function POST(req: Request) {
  try {
    const { scanResults, email } = await req.json();

    // SECURITY FIX: Prevent oversized payloads from bloating SQLite or causing DoS
    if (!scanResults || JSON.stringify(scanResults).length > 500000) { // ~500KB limit
      return NextResponse.json({ error: 'Payload too large or invalid' }, { status: 413 });
    }
    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Invalid email' }, { status: 400 });
    }
    
    await initDb();
    const scanId = randomUUID();

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: 'price_1UMqVDKm83mOzFpMlMZIRTw5',
          quantity: 1,
        },
      ],
      mode: 'payment',
      customer_email: email,
      success_url: `${req.headers.get('origin')}/recall-report/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.get('origin')}/recall-report`,
      metadata: { scanId },
    });

    await saveScan(scanId, session.id, email, scanResults);

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
