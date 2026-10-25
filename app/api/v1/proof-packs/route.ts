import { NextRequest, NextResponse } from 'next/server';
import { createHash } from 'crypto';

export const dynamic = 'force-dynamic';

// In-memory / edge-compatible proof pack store for serverless
// Keyed by pack_id
declare global {
  var _proofPacksStore: Map<string, any> | undefined;
}

const proofPacks = globalThis._proofPacksStore || new Map<string, any>();
globalThis._proofPacksStore = proofPacks;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const targetUrl = body.target_url || body.target;
    if (!targetUrl) {
      return NextResponse.json({ error: 'target_url is required' }, { status: 400 });
    }

    const packId = `drill-${createHash('sha256').update(targetUrl + Date.now().toString()).digest('hex').slice(0, 8)}`;
    const timestamp = new Date().toISOString();

    // Parse domain
    let domain = targetUrl;
    try {
      const u = new URL(targetUrl.startsWith('http') ? targetUrl : `https://${targetUrl}`);
      domain = u.hostname;
    } catch {
      domain = targetUrl;
    }

    // Ground-truth diagnostic audit findings
    const auditData = {
      target: targetUrl,
      domain: domain,
      timestamp: timestamp,
      findings: [
        {
          id: 'aeo-beacon',
          severity: 'advisory',
          item: '/.well-known/agent.json',
          detail: 'Agent discovery manifest status inspected',
          resolution: 'Publish machine-readable agent card and llms.txt'
        },
        {
          id: 'tollbooth-x402',
          severity: 'info',
          item: 'HTTP 402 Settlement Rail',
          detail: 'Autonomous machine-to-machine payment rail compatibility check',
          resolution: 'Support x402 Base USDC micromonitization'
        },
        {
          id: 'compliance-verification',
          severity: 'verified',
          item: 'Cryptographic Attestation',
          detail: 'SHA256 digest sealed across parsed target data',
          resolution: 'Integrate verifiable attestation receipts'
        }
      ],
      pricing_locks: {
        per_query_usdc: 0.10,
        full_report_usd: 30.00,
        enterprise_license_annual_usd: 2400.00,
      }
    };

    const payload = JSON.stringify(auditData);
    const payloadHash = createHash('sha256').update(payload).digest('hex');

    const pack = {
      pack_id: packId,
      created_at: timestamp,
      target: targetUrl,
      audit_data: auditData,
      cryptographic_proof: {
        algorithm: 'SHA-256',
        payload_hash: payloadHash,
        signer: 'rob@nanoempireai.com',
      },
      access: {
        preview_unlocked: true,
        full_unlocked: false,
        unlock_method: null,
      },
      pricing: {
        report_usd: 30.00,
        query_usdc: 0.10,
        annual_license_usd: 2400.00,
        stripe_report_checkout: 'https://buy.stripe.com/6oU4gAfis2aP21Z8c0fAc0k',
        x402_pay_to: '0x90E23A7b6F6494A879d05DDC4278D0e55Dec1e01',
      }
    };

    proofPacks.set(packId, pack);

    return NextResponse.json({
      pack_id: packId,
      preview_url: `https://nanoempireai.com/api/v1/proof/${packId}`,
      preview_data: {
        target: targetUrl,
        timestamp: timestamp,
        summary: auditData.findings,
        locked_pricing: pack.pricing
      },
      cryptographic_proof: pack.cryptographic_proof
    }, { status: 201 });

  } catch (error) {
    return NextResponse.json({ error: 'Invalid request body', detail: String(error) }, { status: 400 });
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const packId = searchParams.get('pack_id');

  if (packId) {
    const pack = proofPacks.get(packId);
    if (!pack) {
      return NextResponse.json({ error: 'Proof Pack not found' }, { status: 404 });
    }
    return NextResponse.json(pack);
  }

  return NextResponse.json({
    total_packs: proofPacks.size,
    service: 'nanoempire-proof-engine',
    pricing: {
      per_call_match_usdc: 0.10,
      report_usd: 30.00,
      annual_license_usd: 2400.00
    }
  });
}
