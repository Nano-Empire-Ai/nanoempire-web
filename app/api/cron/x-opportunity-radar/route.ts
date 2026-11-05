import { NextRequest, NextResponse } from 'next/server';

const TARGET_DOMAINS = [
  'shopify.com',
  'liquidation.com',
  'bulq.com',
  'bstock.com',
  'directliquidation.com',
  'via-trading.com',
  'merchandize.com',
  'americanmerchandise.com',
  'liquidationdirect.com',
  'quicklotz.com',
];

const RECALL_API = process.env.RECALL_API_URL || 'https://recallguard-api.vercel.app';
const OFFERS_OUTPUT = process.env.OFFERS_OUTPUT_PATH || '/tmp/offers.json';

async function scanDomainForRecalls(domain: string) {
  try {
    const url = `https://${domain}/products.json?limit=250`;
    const res = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; NanoEmpireRadar/1.0)' },
    });
    if (!res.ok) return null;
    
    const data = await res.json();
    return data.products || [];
  } catch {
    return null;
  }
}

async function checkRecalls(products: any[]) {
  const violations = [];
  for (const product of products.slice(0, 50)) {
    try {
      const res = await fetch(`${RECALL_API}/api/v1/match`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: [{
            name: product.title || '',
            brand: product.vendor || '',
            upc: product.variants?.[0]?.barcode || '',
          }]
        }),
      });
      const data = await res.json();
      if (data.matches && data.matches.length > 0) {
        violations.push({
          product,
          match: data.matches[0],
        });
      }
    } catch {
      // Continue on error
    }
  }
  return violations;
}

async function generateOffersJson(violations: any[]) {
  const offers = violations.map((v, i) => ({
    id: `recallradar-${i}-${Date.now()}`,
    sku: `recallradar-${v.match.recall_id?.replace(/[^a-z0-9]/g, '') || 'unknown'}`,
    title: `RecallRadar Audit: ${v.product.title || 'Unknown Product'}`,
    description: `CPSC/FDA recall match found for ${v.product.vendor || 'Unknown Brand'} - ${v.match.recall_id}. Statutory liability exposure: $${v.match.max_penalty || 120000}.`,
    price_usd: 0.10,
    currency: 'USDC',
    chain: 'base',
    payment_rail: 'x402',
    target_url: `https://${v.product.url || 'unknown'}`,
    recall_id: v.match.recall_id,
    severity: v.match.severity || 'HIGH',
    match_confidence: v.match.score || 0,
    hazard: v.match.hazard || 'Product safety violation',
    created_at: new Date().toISOString(),
    expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    metadata: {
      source_type: 'x-opportunity-radar',
      product_sku: v.product.sku,
      product_upc: v.product.upc,
      vendor: v.product.vendor,
    },
  }));

  return {
    generated_at: new Date().toISOString(),
    radar_version: '1.0',
    total_offers: offers.length,
    domains_scanned: TARGET_DOMAINS.length,
    violations_found: violations.length,
    skus: offers,
  };
}

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('authorization');
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const startTime = Date.now();
  let allViolations: any[] = [];
  let domainsScanned = 0;

  for (const domain of TARGET_DOMAINS) {
    try {
      const products = await scanDomainForRecalls(domain);
      if (products && products.length > 0) {
        domainsScanned++;
        const violations = await checkRecalls(products);
        allViolations.push(...violations);
      }
    } catch (err) {
      console.error(`Error scanning ${domain}:`, err);
    }
  }

  const offersData = await generateOffersJson(allViolations);

  return NextResponse.json({
    timestamp: new Date().toISOString(),
    duration_ms: Date.now() - startTime,
    domains_scanned: domainsScanned,
    total_products_checked: allViolations.length + (domainsScanned * 50),
    violations_found: allViolations.length,
    offers_generated: offersData.total_offers,
    offers: offersData.skus,
  }, {
    headers: {
      'Cache-Control': 'no-store, max-age=0',
      'Content-Type': 'application/json',
    },
  });
}