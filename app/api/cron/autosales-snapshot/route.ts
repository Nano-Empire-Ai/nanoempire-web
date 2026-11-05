import { NextRequest, NextResponse } from 'next/server';

const VIN_DECODE_API = process.env.NANOEMPIRE_API || 'https://www.nanoempireai.com';
const SAMPLE_VINS = [
  '1HGCR2F83HA000000', '4T1B11HK5JU000000', '1FTEW1EP5KF000000',
  '5YJ3E1EB8LF000000', 'WA1VAAF14MD000000', '3GNAXUEV5LL000000',
  'JTDKN3DU5D1000000', '1C4RJFAG5FC000000', '2T1BURHE5KC000000',
  '1GC4YNEY5MF000000', '1FTFW1ED4MF000000', '5YJSA1E28MF000000',
  '3VW2A7AJ5FM000000', 'KMHD84LF5KU000000', 'JN1CV6AP9KM000000',
  '4S4BSANC5K3000000', 'WBA3A5C55FP000000', '1N4AL3AP8JC000000',
  '2C3CDXBG5KH000000', '5NMS23AE8KH000000', '1G1ZD5ST8JF000000',
  '3FA6P0H78HR000000', '1FM5K8F84HG000000', '4T1BF1FK5EU000000',
  '2T3C1RFV5KW000000', '5N1AL0MM5HC000000', 'SALWR2V45KA000000',
  'WAUZZZ8V5GA000000', 'YV1A22PK5K1000000', '5UXCR6C05L9000000',
];

async function decodeVin(vin: string) {
  try {
    const res = await fetch(`${VIN_DECODE_API}/api/vin/decode`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ vin }),
    });
    if (res.status === 402) {
      // Simulate x402 settlement
      const receipt = Buffer.from(
        JSON.stringify({
          amount: 0.03,
          currency: 'USDC',
          chain: 'base',
          tx: `autosales_${Date.now()}_${vin.slice(0, 6)}`,
        })
      ).toString('base64');

      const settledRes = await fetch(`${VIN_DECODE_API}/api/vin/decode`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-402-Receipt': receipt,
        },
        body: JSON.stringify({ vin }),
      });
      return settledRes;
    }
    return res;
  } catch (err) {
    return { ok: false, status: 500, error: String(err), json: async () => ({}) };
  }
}

function generateAutoSalesSnapshot(results: any[]) {
  const successful = results.filter(r => r.success);
  const failed = results.filter(r => !r.success);
  
  const makes = new Map<string, number>();
  const campaignsTotal = successful.reduce((sum, r) => sum + (r.campaigns || 0), 0);
  
  for (const r of successful) {
    if (r.decoded?.Make) {
      const make = r.decoded.Make;
      makes.set(make, (makes.get(make) || 0) + 1);
    }
  }

  return {
    generated_at: new Date().toISOString(),
    snapshot_type: 'autosales_6hr',
    summary: {
      total_decodes: results.length,
      successful: successful.length,
      failed: failed.length,
      total_campaigns_found: campaignsTotal,
      unique_makes: makes.size,
      makes_distribution: Object.fromEntries(makes),
    },
    decodes: results.map(r => ({
      vin: r.vin,
      success: r.success,
      make: r.decoded?.Make || null,
      model: r.decoded?.Model || null,
      year: r.decoded?.ModelYear || null,
      campaigns_count: r.campaigns || 0,
      campaigns: r.campaign_details || [],
      method: r.method || 'unknown',
    })),
  };
}

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('authorization');
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const startTime = Date.now();
  const results = [];

  for (const vin of SAMPLE_VINS) {
    try {
      const res = await decodeVin(vin);
      const data = await res.json();
      
      const result = {
        vin,
        status: res.status,
        success: res.ok,
        decoded: data.decoded || null,
        campaigns: data.campaigns?.length || 0,
        campaign_details: data.campaigns || [],
        method: res.status === 402 ? 'x402_fallback' : 'direct',
      };
      results.push(result);
    } catch (err: any) {
      results.push({ vin, error: err.message, success: false });
    }
  }

  const snapshot = generateAutoSalesSnapshot(results);

  return NextResponse.json(snapshot, {
    headers: {
      'Cache-Control': 'no-store, max-age=0',
      'Content-Type': 'application/json',
    },
  });
}