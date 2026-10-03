import { shopify } from '@/lib/shopify';
import { extractIdentifiers } from '@/lib/shopify/products';
import { createMerchantAlert } from '@/lib/db';
import * as crypto from 'crypto';
import { NextRequest, NextResponse } from 'next/server';

// @ts-ignore
import { matchItem } from '@/lib/recall-matcher/match';

export async function POST(req: NextRequest) {
  const topic = req.headers.get('x-shopify-topic');
  const hmacHeader = req.headers.get('x-shopify-hmac-sha256');
  const shop = req.headers.get('x-shopify-shop-domain');
  const body = await req.text();

  if (!hmacHeader || !shop || !topic) {
    return NextResponse.json({ error: 'Missing headers' }, { status: 400 });
  }

  // 1. Verify HMAC signature (The OmniForge Security Pillar)
  // Note: We bypass strict shopify.webhooks.verify here for Next.js App Router compat,
  // and manually verify the raw body hash using Node crypto.
  const generatedHash = crypto
    .createHmac('sha256', process.env.SHOPIFY_API_SECRET || '')
    .update(body, 'utf8')
    .digest('base64');

  if (generatedHash !== hmacHeader) {
    return NextResponse.json({ error: 'Unauthorized HMAC' }, { status: 401 });
  }

  // 2. Parse and process based on topic
  const data = JSON.parse(body);

  if (topic === 'products/create' || topic === 'products/update') {
    // 3. Extract UPCs/Titles
    // Shopify webhook payload has `variants` directly attached in REST format usually, 
    // but extractIdentifiers was written for GraphQL structure.
    // For robust MVP, we'll map REST payload to our structure.
    const productData = {
      id: data.id,
      title: data.title,
      vendor: data.vendor,
      productType: data.product_type,
      variants: data.variants?.map((v: any) => ({
        sku: v.sku,
        barcode: v.barcode,
        title: v.title,
      })) || [],
    };

    const identifiers = extractIdentifiers([productData]);

    // Check each identifier / product data
    // We send { name: product.title, brand: product.vendor, upc: first_barcode }
    const primaryBarcode = productData.variants.find(v => v.barcode)?.barcode || '';
    
    const scanResult = matchItem({ 
      name: productData.title, 
      brand: productData.vendor, 
      upc: primaryBarcode 
    });

    if (scanResult.match_count > 0) {
      // THE CRYPTOGRAPHIC SEAL (Pillar 1)
      const alertId = crypto.randomUUID();
      const rawData = JSON.stringify(scanResult.matches);
      const cryptoSeal = crypto.createHash('sha256').update(rawData + alertId).digest('hex');
      
      // 4. Alert the merchant
      await createMerchantAlert(alertId, shop, data.id.toString(), scanResult.matches, cryptoSeal);
      console.log(`[ALERT] High-severity match found for product ${data.id} on shop ${shop}`);
    }
  }

  // Handle app/uninstalled if needed

  return NextResponse.json({ received: true });
}
