import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { initDb, markPaid, getScanById } from '@/lib/db';
import { sendReportEmail } from '@/lib/email';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16',
});

export async function POST(req: Request) {
  const body = await req.text();
  const signature = req.headers.get('stripe-signature') || '';

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET || ''
    );
  } catch (err: any) {
    console.error(`Webhook signature verification failed: ${err.message}`);
    return NextResponse.json({ error: 'Webhook Error' }, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    
    await initDb();
    const scanId = session.metadata?.scanId;
    
    if (scanId) {
      // 1. Flip the database state to paid
      await markPaid(session.id);
      
      // 2. Retrieve the vaulted scan data
      const scan = await getScanById(scanId); 
      
      if (scan && scan.status === 'paid') {
        // 3. Generate PDF and send email
        const reportData = JSON.parse(scan.scan_data as string);
        try {
          await sendReportEmail(scan.email as string, scanId, reportData);
          console.log(`[FULFILLMENT] Report emailed to ${scan.email} for scan ${scanId}`);
        } catch (emailError) {
          console.error(`[FULFILLMENT] Email failed for ${scanId}`, emailError);
          // Even if email fails, the user can still access the /success page via the redirect
        }
      }
    }
  }

  return NextResponse.json({ received: true });
}
