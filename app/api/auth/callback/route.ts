import { shopify, registerWebhooks } from '@/lib/shopify';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const callback = await shopify.auth.callback({
      rawRequest: req as unknown as Request,
      rawResponse: new NextResponse() as any,
    });

    const { session } = callback;

    // Store the session in SQLite and register webhooks after successful auth
    if (session) {
      await registerWebhooks(session.shop, session.accessToken || '');
      
      const host = req.nextUrl.searchParams.get('host');
      return NextResponse.redirect(`/?shop=${session.shop}&host=${host}`);
    } else {
      return NextResponse.json({ error: 'Session not created' }, { status: 400 });
    }
  } catch (error: any) {
    console.error('Callback error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
