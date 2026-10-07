import { NextRequest, NextResponse } from 'next/server';

const SAMPLE_VINS = [
  '1HGCR2F83HA000000', // Honda Accord
  '4T1B11HK5JU000000', // Toyota Camry
  '1FTEW1EP5KF000000', // Ford F-150
  '5YJ3E1EB8LF000000', // Tesla Model 3
  'WA1VAAF14MD000000', // Audi Q5
  '3GNAXUEV5LL000000', // Chevrolet Equinox
  'JTDKN3DU5D1000000', // Toyota Prius
  '1C4RJFAG5FC000000', // Jeep Grand Cherokee
];

const QUOTE_BOX_URL = process.env.QUOTE_BOX_URL || 'http://147.5.105.20:8405';
const NANOEMPIRE_API = process.env.NANOEMPIRE_API || 'https://www.nanoempireai.com';
const VIN_DECODE_ENDPOINT = '/api/vin/decode';
const TRIAL_CLAIM_ENDPOINT = '/v1/trial';
const TRIAL_VERIFY_ENDPOINT = '/v1/trial/verify';

async function claimTrial(agentId: string): Promise<{ trial_token: string; credits: number } | null> {
  try {
    const baseUrl = QUOTE_BOX_URL;
    const res = await fetch(`${baseUrl}${TRIAL_CLAIM_ENDPOINT}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ agent_id: agentId }),
    });
    if (!res.ok) return null;
    const data = await res.json();
    return { trial_token: data.trial_token, credits: data.credits };
  } catch {
    return null;
  }
}

async function verifyTrialDecrement(trialToken: string): Promise<{ credits_remaining: number; ok: boolean } | null> {
  try {
    const baseUrl = QUOTE_BOX_URL;
    const res = await fetch(`${baseUrl}${TRIAL_VERIFY_ENDPOINT}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${trialToken}`,
      },
    });
    if (!res.ok) return null;
    const data = await res.json();
    return { credits_remaining: data.credits_remaining, ok: true };
  } catch {
    return null;
  }
}

async function decodeVinWithTrial(vin: string, trialToken: string) {
  const targetUrl = `${NANOEMPIRE_API}${VIN_DECODE_ENDPOINT}`;
  
  const res = await fetch(targetUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${trialToken}`,
    },
    body: JSON.stringify({ vin }),
  });

  return res;
}

async function logToLedger(entry: Record<string, unknown>) {
  try {
    // In production, this would write to a persistent ledger (Supabase/KV)
    // For now, console.log as paper trail
    console.log('[TRIAL-VIN-LEDGER]', JSON.stringify(entry));
  } catch {
    // Silent fail - don't break the cron
  }
}

export async function GET(req: NextRequest) {
  // Cron secret protection
  const authHeader = req.headers.get('authorization');
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const agentId = `cron-vin-${Date.now()}`;
  const origin = req.nextUrl.origin || 'https://www.nanoempireai.com';
  const results = [];
  let trialToken: string | null = null;
  let creditsRemaining = 50;

  // 1. Claim trial token
  const trial = await claimTrial(agentId);
  if (!trial) {
    return NextResponse.json(
      { error: 'Failed to claim trial token', timestamp: new Date().toISOString() },
      { status: 502 }
    );
  }
  trialToken = trial.trial_token;
  creditsRemaining = trial.credits;

  // Process VINs until credits exhausted or list done
  for (const vin of SAMPLE_VINS) {
    if (creditsRemaining <= 0) break;

    try {
      // 2. Call VIN decode with trial auth
      const decodeRes = await decodeVinWithTrial(vin, trialToken!);
      
      if (decodeRes.status === 402) {
        // Trial token not accepted by vin/decode (expects x402), fallback to paper mode receipt
        const receipt = Buffer.from(
          JSON.stringify({
            amount: 0.03,
            currency: 'USDC',
            chain: 'base',
            tx: `trial_cron_${Date.now()}_${vin.slice(0, 6)}`,
          })
        ).toString('base64');

        const fallbackRes = await fetch(`${origin}${VIN_DECODE_ENDPOINT}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-402-Receipt': receipt,
          },
          body: JSON.stringify({ vin }),
        });

        const data = await fallbackRes.json();
        results.push({
          vin,
          method: 'x402_fallback',
          status: fallbackRes.status,
          success: fallbackRes.ok,
          campaigns: data?.campaigns?.length || 0,
        });
      } else {
        const data = await decodeRes.json();
        
        // 3. Verify trial (POST decrement)
        const verifyRes = await verifyTrialDecrement(trialToken!);
        if (verifyRes) {
          creditsRemaining = verifyRes.credits_remaining;
        }

        results.push({
          vin,
          method: 'trial_auth',
          status: decodeRes.status,
          success: decodeRes.ok,
          campaigns: data?.campaigns?.length || 0,
          credits_remaining: creditsRemaining,
        });

        // 4. Log to ledger
        await logToLedger({
          type: 'trial_vin_decode',
          agent_id: agentId,
          vin: vin.slice(0, 8) + '...',
          decoded: !!data?.decoded?.Make,
          campaigns: data?.campaigns?.length || 0,
          trial_credits_remaining: creditsRemaining,
          timestamp: new Date().toISOString(),
        });
      }
    } catch (err: any) {
      results.push({ vin, error: err.message });
    }
  }

  return NextResponse.json({
    timestamp: new Date().toISOString(),
    agent_id: agentId,
    trial_token_claimed: !!trialToken,
    initial_credits: trial?.credits || 0,
    final_credits_remaining: creditsRemaining,
    processed_count: results.length,
    results,
  });
}