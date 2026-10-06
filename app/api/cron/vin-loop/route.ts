import { NextRequest, NextResponse } from 'next/server';

const SAMPLE_VINS = [
  '1HGCR2F83HA000000', // Honda Accord
  '4T1B11HK5JU000000', // Toyota Camry
  '1FTEW1EP5KF000000', // Ford F-150
  '5YJ3E1EB8LF000000', // Tesla Model 3
  'WA1VAAF14MD000000', // Audi Q5
];

export async function GET(req: NextRequest) {
  // Simple cron secret protection if configured
  const authHeader = req.headers.get('authorization');
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const results = [];
  const origin = req.nextUrl.origin || 'https://www.nanoempireai.com';
  const targetUrl = `${origin}/api/vin/decode`;

  for (const vin of SAMPLE_VINS) {
    try {
      // 1. Initial hit triggers 402 challenge
      const initialRes = await fetch(targetUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ vin }),
      });

      if (initialRes.status === 402) {
        // 2. Simulate machine x402 settlement receipt
        const receipt = Buffer.from(
          JSON.stringify({
            amount: 0.03,
            currency: 'USDC',
            chain: 'base',
            tx: `cron_loop_${Date.now()}_${vin.slice(0, 6)}`,
          })
        ).toString('base64');

        // 3. Re-verify with receipt to complete decode
        const settledRes = await fetch(targetUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-402-Receipt': receipt,
          },
          body: JSON.stringify({ vin }),
        });

        const data = await settledRes.json();
        results.push({
          vin,
          status: settledRes.status,
          success: settledRes.ok,
          campaigns: data?.campaigns?.length || 0,
        });
      }
    } catch (err: any) {
      results.push({ vin, error: err.message });
    }
  }

  return NextResponse.json({
    timestamp: new Date().toISOString(),
    processed_count: results.length,
    results,
  });
}
