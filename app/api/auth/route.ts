import { shopify } from '@/lib/shopify';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const shop = req.nextUrl.searchParams.get('shop');
  
  // SECURITY FIX: Strict regex to prevent Open Redirects and SSRF 
  // (e.g. malicious.com?fake=.myshopify.com)
  const shopRegex = /^[a-zA-Z0-9-]+\.myshopify\.com$/;
  if (!shop || !shopRegex.test(shop)) {
    return NextResponse.json({ error: 'Invalid shop domain' }, { status: 400 });
  }

  // NextRequest does not perfectly map to standard Node requests required by older Shopify implementations,
  // but Shopify API typically expects standard Web Fetch Request in Next.js 14+
  const reqObj = req as unknown as Request;
  const resObj = new NextResponse();

  try {
    await shopify.auth.begin({
      shop,
      callbackPath: '/api/auth/callback',
      isOnline: true,
      rawRequest: reqObj,
      rawResponse: resObj as any,
    });
    return resObj;
  } catch (error) {
    console.error('Auth begin error:', error);
    return NextResponse.json({ error: 'Failed to begin auth' }, { status: 500 });
  }
}
