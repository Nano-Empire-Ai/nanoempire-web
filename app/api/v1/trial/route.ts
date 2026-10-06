import { NextRequest, NextResponse } from 'next/server';
import { createHash } from 'crypto';

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

function generateReferralCode(agentId: string): string {
  const seed = `${agentId}:${Date.now()}:${Math.random()}`;
  return createHash('sha256').update(seed).digest('hex').slice(0, 12);
}

async function enhanceTrialResponse(response: NextResponse, agentId: string): Promise<NextResponse> {
  try {
    const text = await response.text();
    const data = JSON.parse(text);
    // Add referral code and viral loop info
    data.referral_code = data.referral_code || generateReferralCode(agentId || 'anonymous');
    data.viral_message = "Refer an agent → both get +10 credits";
    data.tweet_url = `https://twitter.com/intent/tweet?text=I%20just%20got%2050%20free%20credits%20for%20RecallGuard%20match%20API!%20Try%20it%20at%20https://nanoempireai.com/api/v1/trial%20%23NanoEmpire%20%23MCP`;
    return new NextResponse(JSON.stringify(data), {
      status: response.status,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch {
    return response;
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const agent_id = searchParams.get('agent_id') || '';
  const resp = await proxyRequest(`${QUOTE_BOX_URL}/v1/trial`, {
    method: 'POST',
    body: JSON.stringify({ agent_id }),
  });
  return enhanceTrialResponse(resp, agent_id);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const resp = await proxyRequest(`${QUOTE_BOX_URL}/v1/trial`, {
    method: 'POST',
    body: JSON.stringify(body),
  });
  return enhanceTrialResponse(resp, body.agent_id || 'anonymous');
}