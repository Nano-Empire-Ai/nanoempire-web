import { NextRequest, NextResponse } from 'next/server';

const STRIPE_SECRET = process.env.STRIPE_SECRET_KEY;
const SIDECAR_URL = process.env.SIDECAR_URL || 'http://147.5.105.20:8404';
const ORCHESTRATOR_URL = process.env.ORCHESTRATOR_URL || 'http://147.5.105.20:8080';
const QUOTE_BOX_URL = process.env.QUOTE_BOX_URL || 'http://147.5.105.20:8405';
const NANOEMPIRE_API = process.env.NANOEMPIRE_API || 'https://www.nanoempireai.com';

async function fetchStripeRevenue() {
  if (!STRIPE_SECRET) return { mrr: 0, arr: 0, subscriptions: 0, pipeline: 0 };
  try {
    const subsRes = await fetch('https://api.stripe.com/v1/subscriptions?status=active&limit=100', {
      headers: { 'Authorization': `Bearer ${STRIPE_SECRET}` },
    });
    const subsData = await subsRes.json();
    
    let mrr = 0;
    for (const sub of subsData.data || []) {
      for (const item of sub.items.data) {
        const price = item.price;
        if (price.recurring?.interval === 'month') {
          mrr += (price.unit_amount || 0) / 100;
        } else if (price.recurring?.interval === 'year') {
          mrr += (price.unit_amount || 0) / 100 / 12;
        }
      }
    }
    
    const paymentsRes = await fetch('https://api.stripe.com/v1/payment_intents?limit=50', {
      headers: { 'Authorization': `Bearer ${STRIPE_SECRET}` },
    });
    const paymentsData = await paymentsRes.json();
    const pipeline = paymentsData.data
      .filter((p: any) => p.status === 'succeeded')
      .reduce((sum: number, p: any) => sum + (p.amount || 0) / 100, 0);
    
    return { mrr, arr: mrr * 12, subscriptions: subsData.data?.length || 0, pipeline };
  } catch (e) {
    console.error('Stripe fetch error:', e);
    return { mrr: 0, arr: 0, subscriptions: 0, pipeline: 0 };
  }
}

async function fetchTrialMetrics() {
  try {
    const res = await fetch(`${QUOTE_BOX_URL}/v1/trial/stats`);
    if (!res.ok) return { claims_today: 0, conversions_today: 0, active_trials: 0, conversion_rate: 0 };
    return res.json();
  } catch (e) {
    console.error('Trial metrics error:', e);
    return { claims_today: 0, conversions_today: 0, active_trials: 0, conversion_rate: 0 };
  }
}

async function fetchX402Volume() {
  try {
    const res = await fetch(`${SIDECAR_URL}/v1/receipts/stats`);
    if (!res.ok) return { volume_usd: 0, transactions: 0 };
    return res.json();
  } catch (e) {
    console.error('x402 volume error:', e);
    return { volume_usd: 0, transactions: 0 };
  }
}

async function fetchAgentMailPipeline() {
  try {
    const res = await fetch(`${ORCHESTRATOR_URL}/v1/agentmail/pipeline`);
    if (!res.ok) return { pipeline_value: 0, sequences_active: 0 };
    return res.json();
  } catch (e) {
    console.error('AgentMail pipeline error:', e);
    return { pipeline_value: 0, sequences_active: 0 };
  }
}

async function fetchMCPRegistryStatus() {
  try {
    const res = await fetch(`${ORCHESTRATOR_URL}/v1/mcp/registry/status`);
    if (!res.ok) return { submitted: 0, approved: 0, pending: 0 };
    return res.json();
  } catch (e) {
    console.error('MCP registry error:', e);
    return { submitted: 0, approved: 0, pending: 0 };
  }
}

export async function GET(req: NextRequest) {
  const startTime = Date.now();
  
  const [
    stripeData,
    trialData,
    x402Data,
    agentmailData,
    mcpData,
  ] = await Promise.all([
    fetchStripeRevenue(),
    fetchTrialMetrics(),
    fetchX402Volume(),
    fetchAgentMailPipeline(),
    fetchMCPRegistryStatus(),
  ]);

  const trialConversionRate = trialData.claims_today > 0 
    ? (trialData.conversions_today / trialData.claims_today) * 100 
    : 0;
  
  const churnEstimate = trialData.active_trials > 0 
    ? Math.max(0, 100 - trialConversionRate * 2)
    : 0;

  const dashboard = {
    timestamp: new Date().toISOString(),
    revenue: {
      mrr_usd: stripeData.mrr,
      arr_usd: stripeData.arr,
      active_subscriptions: stripeData.subscriptions,
      stripe_pipeline_usd: stripeData.pipeline,
    },
    trial_onramp: {
      claims_today: trialData.claims_today || 0,
      conversions_today: trialData.conversions_today || 0,
      active_trials: trialData.active_trials || 0,
      conversion_rate_pct: Math.round(trialConversionRate * 100) / 100,
    },
    x402_rail: {
      volume_usd: x402Data.volume_usd || 0,
      transactions: x402Data.transactions || 0,
    },
    pipeline: {
      stripe_pipeline_usd: stripeData.pipeline,
      agentmail_pipeline_usd: agentmailData.pipeline_value || 0,
      total_pipeline_usd: stripeData.pipeline + (agentmailData.pipeline_value || 0),
      mcp_registry: {
        submitted: mcpData.submitted || 0,
        approved: mcpData.approved || 0,
        pending: mcpData.pending || 0,
      },
    },
    health: {
      trial_conversion_rate_pct: Math.round(trialConversionRate * 100) / 100,
      churn_estimate_pct: Math.round(churnEstimate * 100) / 100,
      agentmail_sequences_active: agentmailData.sequences_active || 0,
    },
    kill_gates: {
      gate_201: {
        target: 300,
        deadline: '2026-10-17',
        current: 0,
        on_track: false,
      },
      gate_761: {
        target: 500,
        deadline: '2026-10-20',
        current: 0,
        on_track: false,
      },
    },
    meta: {
      fetch_duration_ms: Date.now() - startTime,
      data_sources: ['stripe', 'trial', 'x402_sidecar', 'agentmail', 'mcp_registry'],
    },
  };

  return NextResponse.json(dashboard, {
    headers: {
      'Cache-Control': 'no-store, max-age=0',
      'Content-Type': 'application/json'
    }
  });
}
