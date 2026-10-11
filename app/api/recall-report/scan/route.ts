import { NextResponse } from 'next/server';

// @ts-ignore
import { matchItem } from '../../../../lib/recall-matcher/match.js';

export async function POST(req: Request) {
  try {
    const { items } = await req.json();

    if (!Array.isArray(items)) {
      return NextResponse.json({ error: 'Expected items array' }, { status: 400 });
    }

    let matchCount = 0;
    let highSeverity = 0;
    const matchedItems = [];

    for (const item of items) {
      // Normalize input item based on any case or alternate headers
      const keys = Object.keys(item);
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
        // Check if any match is high severity
        const hasHighSev = res.matches.some((m: { severity: string }) => 
          m.severity === 'serious' || m.severity === 'class-i'
        );
        if (hasHighSev) highSeverity++;

        // Store first match info for the report later
        matchedItems.push({
          input: { upc, brand, name },
          matches: res.matches
        });
      }
    }

    // Optional: Store matchedItems in a temporary DB or session, returning a session ID
    // so that when they pay $30, we can render the PDF of `matchedItems`.
    // For now, we just return the counts for the frontend summary.

    return NextResponse.json({
      totalScanned: items.length,
      matchCount,
      highSeverity,
      // Provide matched items array so the client can simulate passing it to checkout
      matchedItems 
    });

  } catch (error) {
    console.error("Scan error:", error);
    return NextResponse.json({ error: 'Failed to scan' }, { status: 500 });
  }
}
