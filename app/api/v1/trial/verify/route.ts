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

function extractReferralCode(auth: string | null): string | null {
  if (!auth || !auth.startsWith('Bearer ')) return null;
  const token = auth.slice(7);
  // Extract referral code from token if embedded, or return null
  return null; // Token parsing would go here
}

export async function GET(req: NextRequest) {
  const auth = req.headers.get('authorization');
  const referralCode = extractReferralCode(auth);
  const resp = await proxyRequest(`${QUOTE_BOX_URL}/v1/trial/verify`, {
    method: 'GET',
    headers: auth ? { Authorization: auth } : {},
  });
  if (referralCode) {
    try {
      const text = await resp.text();
      const data = JSON.parse(text);
      data.referral_code = referralCode;
      return new NextResponse(JSON.stringify(data), {
        status: resp.status,
        headers: { 'Content-Type': 'application/json' },
      });
    } catch {
      return resp;
    }
  }
  return resp;
}

export async function POST(req: NextRequest) {
  const auth = req.headers.get('authorization');
  const referralCode = extractReferralCode(auth);
  const resp = await proxyRequest(`${QUOTE_BOX_URL}/v1/trial/verify`, {
    method: 'POST',
    headers: auth ? { Authorization: auth } : {},
  });
  if (referralCode) {
    try {
      const text = await resp.text();
      const data = JSON.parse(text);
      data.referral_code = referralCode;
      return new NextResponse(JSON.stringify(data), {
        status: resp.status,
        headers: { 'Content-Type': 'application/json' },
      });
    } catch {
      return resp;
    }
  }
  return resp;
}