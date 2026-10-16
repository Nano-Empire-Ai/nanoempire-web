import { NextRequest, NextResponse } from 'next/server';
import { createHash } from 'crypto';

export const dynamic = 'force-dynamic';

declare global {
  var _proofPacksStore: Map<string, any> | undefined;
  var _affiliateBalancesStore: Map<string, number> | undefined;
}

const affiliateBalances = globalThis._affiliateBalancesStore || new Map<string, number>();
globalThis._affiliateBalancesStore = affiliateBalances;

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ pack_id: string }> }
) {
  const { pack_id } = await params;
  const store = globalThis._proofPacksStore;
  const pack = store?.get(pack_id);

  if (!pack) {
    return NextResponse.json({ error: 'Proof Pack not found' }, { status: 404 });
  }

  const referrerPubkey = req.headers.get('x-referrer-agent-pubkey');
  let body: any = {};
  try {
    body = await req.json();
  } catch {
    body = {};
  }

  const xPaymentHeader = req.headers.get('x-payment') || paymentProof.x_payment || paymentProof.payment_header;
  const paymentMethod = paymentProof.method || (paymentProof.session_id ? 'stripe' : (xPaymentHeader || paymentProof.payment_payload || paymentProof.tx_hash || paymentProof.transaction_hash) ? 'x402' : null);

  // STRICT FAIL-CLOSED VERIFICATION
  let isVerified = false;
  let unlockDetails: any = {};

  if (paymentMethod === 'stripe') {
    const sessionId = paymentProof.session_id || paymentProof.payment_intent;
    const stripeKey = process.env.STRIPE_SECRET_KEY;
    if (sessionId && typeof sessionId === 'string' && sessionId.length >= 10 && stripeKey) {
      try {
        const res = await fetch(`https://api.stripe.com/v1/checkout/sessions/${sessionId}`, {
          headers: { Authorization: `Bearer ${stripeKey}` }
        });
        const session = await res.json();
        if (session.payment_status === 'paid') {
          isVerified = true;
          unlockDetails = { method: 'stripe', session_id: sessionId, amount_paid: 30.00 };
        }
      } catch {
        isVerified = false;
      }
    }
  } else if (paymentMethod === 'x402') {
    const facilitator = (process.env.X402_FACILITATOR_URL || 'https://facilitator.payai.network').replace(/\/+$/, '');
    const payTo = '0x90E23A7b6F6494A879d05DDC4278D0e55Dec1e01';
    const usdcBase = '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913';

    // Path A: Standard x402 v1 buyer-signed payment payload (X-PAYMENT base64 JSON or payment_payload)
    let signedPayload = paymentProof.payment_payload || null;
    if (!signedPayload && xPaymentHeader) {
      try {
        signedPayload = JSON.parse(Buffer.from(String(xPaymentHeader), 'base64').toString('utf8'));
      } catch {
        signedPayload = null;
      }
    }

    if (signedPayload && Number(signedPayload.x402Version) === 1 && signedPayload.scheme === 'exact' && signedPayload.network === 'base') {
      const paymentRequirements = {
        scheme: 'exact',
        network: 'base',
        maxAmountRequired: '30000000', // $30.00 USDC (6 decimals)
        resource: `https://www.nanoempireai.com/api/v1/proof/${pack_id}/unlock`,
        description: `RecallRadar Proof Pack Unlock (${pack_id})`,
        mimeType: 'application/json',
        payTo,
        maxTimeoutSeconds: 60,
        asset: usdcBase,
        extra: { name: 'USD Coin', version: '2' }
      };
      try {
        const vRes = await fetch(`${facilitator}/verify`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify({ x402Version: 1, paymentPayload: signedPayload, paymentRequirements })
        });
        const vJson = await vRes.json();
        if (vJson && vJson.isValid) {
          const sRes = await fetch(`${facilitator}/settle`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
            body: JSON.stringify({ x402Version: 1, paymentPayload: signedPayload, paymentRequirements })
          });
          const sJson = await sRes.json();
          if (sJson && sJson.success) {
            isVerified = true;
            unlockDetails = { method: 'x402_signed', transaction: sJson.transaction, payer: sJson.payer || vJson.payer, network: 'base', pay_to: payTo };
          }
        }
      } catch {
        isVerified = false;
      }
    } else {
      // Path B: Mined Base Mainnet transaction hash verified against Base RPC
      const txHash = paymentProof.tx_hash || paymentProof.transaction_hash;
      if (txHash && typeof txHash === 'string' && /^0x[0-9a-fA-F]{64}$/.test(txHash)) {
        try {
          const rpcRes = await fetch('https://mainnet.base.org', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'eth_getTransactionReceipt', params: [txHash] })
          });
          const rpcData = await rpcRes.json();
          const receipt = rpcData?.result;
          if (receipt && receipt.status === '0x1' && Array.isArray(receipt.logs)) {
            const transferTopic = '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef';
            const expectedToTopic = '0x000000000000000000000000' + payTo.toLowerCase().slice(2);
            for (const log of receipt.logs) {
              const topics = (log.topics || []).map((t: string) => t.toLowerCase());
              if (
                String(log.address || '').toLowerCase() === usdcBase.toLowerCase() &&
                topics.length >= 3 &&
                topics[0] === transferTopic &&
                topics[2] === expectedToTopic &&
                BigInt(log.data || '0x0') >= BigInt(30000000)
              ) {
                isVerified = true;
                unlockDetails = { method: 'x402_onchain', tx_hash: txHash, network: 'base', pay_to: payTo };
                break;
              }
            }
          }
        } catch {
          isVerified = false;
        }
      }
    }
  }

  if (!isVerified) {
    return NextResponse.json({
      error: 'Payment verification failed',
      detail: 'STRICT FAIL-CLOSED: Valid Stripe checkout session or Base USDC x402 payment proof required.',
      required_payment: {
        stripe_url: pack.pricing.stripe_report_checkout,
        x402_terms: {
          price_usd: 30.00,
          network: 'base',
          asset: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
          pay_to: '0x90E23A7b6F6494A879d05DDC4278D0e55Dec1e01'
        }
      }
    }, { status: 402 });
  }

  // Record unlock
  pack.access.full_unlocked = true;
  pack.access.unlock_method = unlockDetails.method;
  pack.access.unlock_details = unlockDetails;

  // Process 1% affiliate royalty if referrer present
  if (referrerPubkey) {
    const currentBalance = affiliateBalances.get(referrerPubkey) || 0;
    const royaltyUsd = 0.30; // 1% of $30
    affiliateBalances.set(referrerPubkey, currentBalance + royaltyUsd);
    pack.affiliate = {
      referrer: referrerPubkey,
      royalty_awarded_usd: royaltyUsd
    };
  }

  const unlockSig = createHash('sha256')
    .update(`${pack_id}:unlocked:${Date.now()}`)
    .digest('hex');

  return NextResponse.json({
    status: 'unlocked',
    pack_id,
    unlock_signature: unlockSig,
    full_access: true,
    full_artifact: pack.audit_data,
    cryptographic_proof: pack.cryptographic_proof,
    affiliate_credited: pack.affiliate || null
  });
}
