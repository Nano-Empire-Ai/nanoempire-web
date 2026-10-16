import { NextResponse } from 'next/server';
import { createCipheriv, createHash, randomBytes } from 'crypto';

// @ts-ignore
import { matchItem } from '../../../../lib/recall-matcher/match.js';

function encryptReportPayload(payload: unknown): string {
  const secret = process.env.STRIPE_SECRET_KEY || process.env.TRIAL_HMAC_SECRET || 'nanoempire-recall-secret-v1';
  const key = createHash('sha256').update(secret).digest();
  const iv = randomBytes(12);
  const cipher = createCipheriv('aes-256-gcm', key, iv);
  const encrypted = Buffer.concat([cipher.update(JSON.stringify(payload), 'utf8'), cipher.final()]);
  const tag = cipher.getAuthTag();
  return Buffer.concat([iv, tag, encrypted]).toString('base64url');
}

function maskText(val: string): string {
  if (!val) return '[REDACTED]';
  if (val.length <= 4) return val[0] + '***';
  return val.slice(0, 3) + '•••••' + val.slice(-2);
}

export async function POST(req: Request) {
  try {
    const { items } = await req.json();

    if (!Array.isArray(items)) {
      return NextResponse.json({ error: 'Expected items array' }, { status: 400 });
    }

    let matchCount = 0;
    let highSeverity = 0;
    const matchedItems = [];
    const teaserItems = [];

    for (let idx = 0; idx < items.length; idx++) {
      const item = items[idx];
      const keys = Object.keys(item || {});
      const findVal = (candidates: string[]) => {
        for (const c of candidates) {
          const matchKey = keys.find(k => k.trim().toLowerCase() === c.toLowerCase());
          if (matchKey && item[matchKey]) return String(item[matchKey]).trim();
        }
        return '';
      };

      const upc = findVal(['upc', 'gtin', 'ean', 'barcode', 'asin']);
      const brand = findVal(['brand', 'manufacturer', 'vendor', 'make']);
      const name = findVal(['title', 'name', 'product', 'product_name', 'item', 'item_title', 'description']);

      if (!name && !upc) continue;

      const res = matchItem({ upc, brand, name });
      
      if (res && res.match_count > 0) {
        matchCount++;
        const hasHighSev = res.matches.some((m: { severity: string }) => 
          m.severity === 'serious' || m.severity === 'class-i'
        );
        if (hasHighSev) highSeverity++;

        matchedItems.push({
          row: idx + 1,
          input: { upc, brand, name },
          matches: res.matches
        });

        if (teaserItems.length < 5) {
          const firstMatch = res.matches[0] || {};
          teaserItems.push({
            row: idx + 1,
            maskedItem: `${brand ? maskText(brand) + ' · ' : ''}${maskText(name || upc)}`,
            severity: firstMatch.severity || 'RECALLED',
            hazardPreview: firstMatch.hazard
              ? `${String(firstMatch.hazard).slice(0, 48)}... [Recall ID & Remedy Locked]`
              : 'Regulatory Safety Violation [Recall ID & Remedy Locked]',
          });
        }
      }
    }

    const reportToken = encryptReportPayload({
      totalScanned: items.length,
      matchCount,
      highSeverity,
      clearedItems: Math.max(0, items.length - matchCount),
      matchedItems,
    });

    return NextResponse.json({
      totalScanned: items.length,
      matchCount,
      highSeverity,
      teaserItems,
      reportToken,
    });

  } catch (error) {
    console.error("Scan error:", error);
    return NextResponse.json({ error: 'Failed to scan' }, { status: 500 });
  }
}
