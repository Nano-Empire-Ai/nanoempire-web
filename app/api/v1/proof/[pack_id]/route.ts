import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

declare global {
  var _proofPacksStore: Map<string, any> | undefined;
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ pack_id: string }> }
) {
  const { pack_id } = await params;
  const store = globalThis._proofPacksStore;
  const pack = store?.get(pack_id);

  if (!pack) {
    return NextResponse.json({
      error: 'Proof Pack not found',
      pack_id,
      resolution: 'Generate a new proof pack at POST /api/v1/proof-packs'
    }, { status: 404 });
  }

  // If full unlocked, return entire pack
  if (pack.access.full_unlocked) {
    return NextResponse.json({
      ...pack,
      status: 'unlocked'
    });
  }

  // Otherwise return preview
  return NextResponse.json({
    pack_id: pack.pack_id,
    target: pack.target,
    created_at: pack.created_at,
    cryptographic_proof: pack.cryptographic_proof,
    preview: {
      diagnostic_summary: 'Preview mode: First 3 findings shown. Unlock full compliance pack via Stripe or x402 Base USDC.',
      findings: pack.audit_data.findings,
      pricing: pack.pricing,
      unlock_endpoints: {
        stripe_checkout: pack.pricing.stripe_report_checkout,
        x402_unlock: `https://nanoempireai.com/api/v1/proof/${pack_id}/unlock`
      }
    }
  });
}
