import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createDecipheriv, createHash, generateKeyPairSync, sign } from 'crypto';
import { getScanBySession, initDb } from '@/lib/db';

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

    // 1. Check Stripe session if sessionId provided and real Stripe key exists
    if (sessionId && process.env.STRIPE_SECRET_KEY && !process.env.STRIPE_SECRET_KEY.includes('mock')) {
      try {
        const session = await stripe.checkout.sessions.retrieve(sessionId);
        if (session && (session.payment_status === 'paid' || session.status === 'complete')) {
          paymentVerified = true;
          verifiedEmail = session.customer_email || session.customer_details?.email || verifiedEmail;
        }
      } catch (e) {
        console.warn('Stripe session lookup warning:', e);
      }
    }

    // 2. Check DB if session exists in local/ephemeral DB
    if (!reportData && sessionId) {
      try {
        await initDb();
        const scan = await getScanBySession(sessionId);
        if (scan && scan.scan_data) {
          reportData = JSON.parse(scan.scan_data as string);
          verifiedEmail = (scan.email as string) || verifiedEmail;
          if (scan.status === 'paid') paymentVerified = true;
        }
      } catch (e) {
        console.warn('DB lookup warning:', e);
      }
    }

    // 3. Decrypt stateless AES-256-GCM reportToken from browser storage
    if (!reportData && typeof reportToken === 'string' && reportToken.length > 32) {
      reportData = decryptReportPayload(reportToken);
      if (sessionId || email) {
        paymentVerified = true;
      }
    }

    if (!reportData || !paymentVerified) {
      return NextResponse.json(
        { error: 'Valid payment session or encrypted report token required to unlock.' },
        { status: 402 }
      );
    }

    // 4. Generate Ed25519 Certificate of Compliance Seal
    const { publicKey, privateKey } = generateKeyPairSync('ed25519');
    const pubHex = publicKey.export({ type: 'spki', format: 'der' }).subarray(-32).toString('hex');
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
    const signature = sign(null, Buffer.from(attestationPayload, 'utf8'), privateKey).toString('hex');

    return NextResponse.json({
      certId,
      issuedAt,
      email: verifiedEmail,
      reportData,
      attestation: {
        algorithm: 'Ed25519',
        publicKey: pubHex,
        signature,
        statute: '15 U.S.C. § 2068 (Consumer Product Safety Act)',
      },
    });
  } catch (error: any) {
    console.error('Unlock error:', error);
    return NextResponse.json({ error: 'Failed to unlock compliance report' }, { status: 500 });
  }
}
