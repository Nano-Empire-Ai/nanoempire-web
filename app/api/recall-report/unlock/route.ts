import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createDecipheriv, createHash } from 'crypto';
import { getScanBySession, initDb } from '@/lib/db';
import { signAttestation } from '@/lib/attestation';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_mock', {
  apiVersion: '2023-10-16',
});

function decryptReportPayload(token: string): any {
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
  try {
    const { reportToken, sessionId, email } = await req.json();

    let reportData: any = null;
    let verifiedEmail = email || 'verified-buyer@nanoempireai.com';
    let paymentVerified = false;

    // 1. Verify paid Stripe Checkout Session via live Stripe API
    if (sessionId && sessionId.startsWith('cs_') && process.env.STRIPE_SECRET_KEY && !process.env.STRIPE_SECRET_KEY.includes('mock')) {
      try {
        const session = await stripe.checkout.sessions.retrieve(sessionId);
        if (session && session.payment_status === 'paid') {
          paymentVerified = true;
          verifiedEmail = session.customer_email || session.customer_details?.email || verifiedEmail;
        }
      } catch (e) {
        console.warn('Stripe session lookup warning:', e);
      }
    }

    // 2. Check DB if session was marked paid via Stripe webhook
    if (sessionId) {
      try {
        await initDb();
        const scan = await getScanBySession(sessionId);
        if (scan) {
          if (scan.status === 'paid') {
            paymentVerified = true;
          }
          if (!reportData && scan.scan_data) {
            reportData = JSON.parse(scan.scan_data as string);
            verifiedEmail = (scan.email as string) || verifiedEmail;
          }
        }
      } catch (e) {
        console.warn('DB lookup warning:', e);
      }
    }

    // 3. Only decrypt stateless AES-256-GCM reportToken AFTER paymentVerified is true
    if (paymentVerified && !reportData && typeof reportToken === 'string' && reportToken.length > 32) {
      reportData = decryptReportPayload(reportToken);
    }

    if (!paymentVerified || !reportData) {
      return NextResponse.json(
        { error: 'Payment verification required ($30.00 USD via Stripe Checkout) to unlock unredacted compliance report.' },
        { status: 402 }
      );
    }

    // 4. Generate Ed25519 Certificate of Compliance Seal (pinned key if configured)
    const certId = `RR-${createHash('sha256').update(JSON.stringify(reportData) + verifiedEmail).digest('hex').slice(0, 12).toUpperCase()}`;
    const issuedAt = new Date().toISOString();

    const attestationPayload = JSON.stringify({
      certId,
      issuedAt,
      recipient: verifiedEmail,
      totalScanned: reportData.totalScanned || 0,
      matchCount: reportData.matchCount || 0,
      highSeverity: reportData.highSeverity || 0,
      clearedItems: reportData.clearedItems || 0,
      statute: '15 U.S.C. § 2068',
    });
    const att = signAttestation(Buffer.from(attestationPayload, 'utf8'));

    return NextResponse.json({
      certId,
      issuedAt,
      email: verifiedEmail,
      reportData,
      attestation: {
        algorithm: att.algorithm,
        publicKey: att.public_key_hex,
        signature: att.signature_hex,
        keyBinding: att.key_binding,
        verificationKeyUrl: att.verification_key_url,
        statute: '15 U.S.C. § 2068 (Consumer Product Safety Act)',
      },
    });
  } catch (error: any) {
    console.error('Unlock error:', error);
    return NextResponse.json({ error: 'Failed to unlock compliance report' }, { status: 500 });
  }
}
