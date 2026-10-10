import { NextRequest, NextResponse } from 'next/server';

// ── Config ──────────────────────────────────────────────────────────
const VPIC_BASE = 'https://vpic.nhtsa.dot.gov/api/vehicles';
const CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours
const PRICE_USD = 0.03;
const TREASURY_WALLET = process.env.EMPIRE_TREASURY_WALLET || 'PAPER_MODE';

// ── In-memory cache (Vercel serverless: use KV/Upstash in production) ──
interface CacheEntry {
  decoded: Record<string, string>;
  campaigns: CampaignMatch[];
  cached_at: number;
}
interface CampaignMatch {
  campaign_id: string;
  status: string;
  component: string;
  consequence: string;
  remedy: string;
}

const cache = new Map<string, CacheEntry>();

// ── x402 Payment Gate ───────────────────────────────────────────────
function issue402Challenge() {
  return NextResponse.json(
    {
      error: 'Payment Required',
      price_usd: PRICE_USD,
      currency: 'USDC',
      chain: 'base',
      wallet: TREASURY_WALLET,
      nonce: crypto.randomUUID().slice(0, 12),
      expires_in: 300,
      paper_mode: false,
    },
    {
      status: 402,
      headers: { 'X-402-Challenge': 'true' },
    }
  );
}

async function verifyReceipt(req: NextRequest): Promise<boolean> {
  const receipt = req.headers.get('X-402-Receipt');
  if (!receipt) return false;
  
  try {
    const parsed = JSON.parse(atob(receipt));
    
    // Stripe Fiat Verification
    if (parsed.provider === 'stripe' && parsed.tx) {
      const res = await fetch(`https://api.stripe.com/v1/payment_intents/${parsed.tx}`, {
        headers: { Authorization: `Bearer ${process.env.STRIPE_SECRET_KEY}` }
      });
      if (!res.ok) return false;
      const pi = await res.json();
      return pi.status === 'succeeded' && pi.amount >= Math.floor(PRICE_USD * 100);
    }

    // Base Chain USDC Verification
    if (parsed.chain === 'base' && parsed.tx) {
      const rpcRes = await fetch('https://mainnet.base.org', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: 1,
          method: 'eth_getTransactionReceipt',
          params: [parsed.tx]
        })
      });
      const txData = await rpcRes.json();
      return txData && txData.result && txData.result.status === '0x1';
    }

    return false;
  } catch {
    return false;
  }
}

// ── VIN Validation ──────────────────────────────────────────────────
function isValidVin(vin: string): boolean {
  return /^[A-HJ-NPR-Z0-9]{11,17}$/i.test(vin.replace(/[*]/g, 'X'));
}

// ── vPIC Decode ─────────────────────────────────────────────────────
async function decodeVin(vin: string, modelyear?: string) {
  const url = `${VPIC_BASE}/DecodeVinValues/${encodeURIComponent(vin)}?format=json${
    modelyear ? `&modelyear=${modelyear}` : ''
  }`;

  const res = await fetch(url, {
    headers: { Accept: 'application/json' },
    next: { revalidate: 86400 },
  });

  if (!res.ok) {
    throw new Error(`vPIC returned ${res.status}`);
  }

  const data = await res.json();
  const results = data.Results?.[0] || {};

  // Filter to meaningful fields
  const decoded: Record<string, string> = {};
  const keep = [
    'Make', 'Model', 'ModelYear', 'VehicleType', 'BodyClass',
    'DriveType', 'EngineConfiguration', 'FuelTypePrimary',
    'Manufacturer', 'PlantCity', 'PlantCountry', 'Series',
    'Trim', 'Doors', 'GVWR',
  ];
  for (const key of keep) {
    if (results[key]) decoded[key] = results[key];
  }

  return { decoded, error_code: data.Results?.[0]?.ErrorCode || '0' };
}

// ── Campaign Match ──────────────────────────────────────────────────
async function matchCampaigns(make: string, model: string, modelyear: string) {
  // NHTSA Safety Recalls API
  const url = `https://api.nhtsa.gov/recalls/recallsByVehicle?make=${encodeURIComponent(
    make
  )}&model=${encodeURIComponent(model)}&modelYear=${modelyear}`;

  try {
    const res = await fetch(url, {
      headers: { Accept: 'application/json' },
      next: { revalidate: 3600 },
    });
    if (!res.ok) return [];
    const data = await res.json();
    return (data.results || []).map((r: any) => ({
      campaign_id: r.NHTSACampaignNumber || r.CampaignNumber,
      status: r.CompletionStatus || 'unknown',
      component: r.Component || '',
      consequence: r.Consequence || '',
      remedy: r.Remedy || '',
    }));
  } catch {
    return [];
  }
}

// ── Route Handler ───────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  // 1. Payment gate
  const receiptHeader = req.headers.get('X-402-Receipt');
  if (!receiptHeader) {
    return issue402Challenge();
  }
  if (!(await verifyReceipt(req))) {
    return NextResponse.json({ error: 'Invalid receipt' }, { status: 402 });
  }

  // 2. Parse body
  let body: { vin?: string; modelyear?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const vin = body.vin?.trim();
  if (!vin || !isValidVin(vin)) {
    return NextResponse.json(
      { error: 'Invalid VIN. Expected 11-17 alphanumeric chars (I, O, Q excluded).' },
      { status: 400 }
    );
  }

  const cacheKey = `${vin.toUpperCase()}|${body.modelyear || ''}`;

  // 3. Cache-first
  const cached = cache.get(cacheKey);
  if (cached && Date.now() - cached.cached_at < CACHE_TTL_MS) {
    return NextResponse.json({
      decoded: cached.decoded,
      campaigns: cached.campaigns,
      cache_hit: true,
      price_usd: 0, // Cache hits are free
      manifest: '#07',
    });
  }

  // 4. Decode via vPIC
  let decoded: Record<string, string>;
  try {
    const result = await decodeVin(vin, body.modelyear);
    decoded = result.decoded;
  } catch (err: any) {
    return NextResponse.json(
      { error: `vPIC decode failed: ${err.message}` },
      { status: 502 }
    );
  }

  // 5. Campaign match (only if Make/Model/Year resolved)
  let campaigns: CampaignMatch[] = [];
  const make = decoded['Make'] || '';
  const model = decoded['Model'] || '';
  const year = decoded['ModelYear'] || body.modelyear || '';

  if (make && model && year) {
    campaigns = await matchCampaigns(make, model, year);
  }

  // 6. Store in cache
  cache.set(cacheKey, { decoded, campaigns, cached_at: Date.now() });

  // 7. Log receipt (paper mode)
  console.log(
    `[VIN-DECODE] vin=${vin.slice(0, 8)}... make=${make} model=${model} year=${year} campaigns=${campaigns.length} price=$${PRICE_USD}`
  );

  // 8. Respond
  return NextResponse.json({
    decoded,
    campaigns,
    cache_hit: false,
    price_usd: PRICE_USD,
    manifest: '#07',
    receipt: {
      vin_prefix: vin.slice(0, 8),
      timestamp: new Date().toISOString(),
      paper_mode: false,
    },
  });
}

// ── Health check ────────────────────────────────────────────────────
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    service: 'vin-decode',
    version: '0.1.0',
    price_usd: PRICE_USD,
    cache_size: cache.size,
    paper_mode: false,
  });
}
