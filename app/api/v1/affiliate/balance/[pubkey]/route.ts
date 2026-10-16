import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

declare global {
  var _affiliateBalancesStore: Map<string, number> | undefined;
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ pubkey: string }> }
) {
  const { pubkey } = await params;
  const store = globalThis._affiliateBalancesStore;
  const balance = store?.get(pubkey) || 0.0;

  return NextResponse.json({
    pubkey,
    royalty_rate: '1%',
    payout_rail: 'USDC on Base',
    balance_usd: balance,
    balance_formatted: `$${balance.toFixed(2)} USD`,
    status: balance > 0 ? 'claimable' : 'zero_balance'
  });
}
