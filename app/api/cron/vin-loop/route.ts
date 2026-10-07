import { NextRequest, NextResponse } from 'next/server';

const SAMPLE_VINS = [
  '1HGCR2F83HA000000', // Honda Accord
  '4T1B11HK5JU000000', // Toyota Camry
  '1FTEW1EP5KF000000', // Ford F-150
  '5YJ3E1EB8LF000000', // Tesla Model 3
  'WA1VAAF14MD000000', // Audi Q5
  '3GNAXUEV5LL000000', // Chevrolet Equinox
  'JTDKN3DU5D1000000', // Toyota Prius
  '1C4RJFAG5FC000000', // Jeep Grand Cherokee
  '2T1BURHE5KC000000', // Toyota Corolla
  '1GC4YNEY5MF000000', // Chevrolet Silverado
  '1FTFW1ED4MF000000', // Ford F-250
  '5YJSA1E28MF000000', // Tesla Model S
  '3VW2A7AJ5FM000000', // Volkswagen Jetta
  'KMHD84LF5KU000000', // Hyundai Elantra
  'JN1CV6AP9KM000000', // Nissan Rogue
  '4S4BSANC5K3000000', // Subaru Outback
  'WBA3A5C55FP000000', // BMW 3 Series
  '1N4AL3AP8JC000000', // Nissan Altima
  '2C3CDXBG5KH000000', // Dodge Charger
  '5NMS23AE8KH000000', // Hyundai Santa Fe
  '1G1ZD5ST8JF000000', // Chevrolet Malibu
  '3FA6P0H78HR000000', // Ford Fusion
  '1FM5K8F84HG000000', // Ford Explorer
  '4T1BF1FK5EU000000', // Toyota RAV4
  '2T3C1RFV5KW000000', // Toyota RAV4 Hybrid
  '5N1AL0MM5HC000000', // Infiniti QX60
  'SALWR2V45KA000000', // Range Rover Sport
  'WAUZZZ8V5GA000000', // Audi A3
  'YV1A22PK5K1000000', // Volvo XC90
  '5UXCR6C05L9000000', // BMW X5
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
