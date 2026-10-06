import { NextRequest, NextResponse } from 'next/server';

const QUOTE_BOX_URL = process.env.QUOTE_BOX_URL || 'http://147.5.105.20:8405';

async function proxyRequest(url: string, options: RequestInit) {
  try {
    const res = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });
    const data = await res.text();
    return new NextResponse(data, {
      status: res.status,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Upstream unavailable', detail: String(error) },
      { status: 502 }
    );
  }
}

export async function GET(req: NextRequest) {
  const auth = req.headers.get('authorization');
  return proxyRequest(`${QUOTE_BOX_URL}/v1/trial/verify`, {
    method: 'GET',
    headers: auth ? { Authorization: auth } : {},
  });
}

export async function POST(req: NextRequest) {
  const auth = req.headers.get('authorization');
  return proxyRequest(`${QUOTE_BOX_URL}/v1/trial/verify`, {
    method: 'POST',
    headers: auth ? { Authorization: auth } : {},
  });
}