import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createDecipheriv, createHash, randomUUID } from 'crypto';
import { initDb, saveScan } from '@/lib/db';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_mock', {
  apiVersion: '2023-10-16',
});

function decryptReportPayload(token: string): unknown {
  const secret = process.env.STRIPE_SECRET_KEY || process.env.TRIAL_HMAC_SECRET || 'nanoempire-recall-secret-v1';
  const key = createHash('sha256').update(secret).digest();
  const buf = Buffer.from(token, 'base64url');
  const iv = buf.subarray(0, 12);
  const tag = buf.subarray(12, 28);
  const encrypted = buf.subarray(28);
  const decipher = createDecipheriv('aes-256-gcm', key, iv);
  decipher.setAuthTag(tag);
  const decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()]).toString('utf8');
  return JSON.parse(decrypted);
}

export async function POST(req: Request) {
  let parsedEmail = '';
  try {
    const { scanResults, email } = await req.json();
    parsedEmail = typeof email === 'string' ? email : '';

    if (!scanResults || JSON.stringify(scanResults).length > 500000) {
      return NextResponse.json({ error: 'Payload too large or invalid' }, { status: 413 });
    }
    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Invalid email' }, { status: 400 });
    }

    let fullScanData = scanResults;
    if (typeof scanResults.reportToken === 'string') {
      try {
        fullScanData = decryptReportPayload(scanResults.reportToken);
      } catch {
        fullScanData = scanResults;
      }
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

    await saveScan(scanId, session.id, email, fullScanData);

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error("Stripe session creation failed, returning live $30 payment link:", error);
    return NextResponse.json({ 
      url: `https://buy.stripe.com/6oU4gAfis2aP21Z8c0fAc0k?prefilled_email=${encodeURIComponent(parsedEmail)}` 
    });
  }
}
