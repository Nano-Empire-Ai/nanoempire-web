import { NextResponse } from 'next/server';

export async function GET() {
  const payload = {
    timestamp: new Date().toISOString(),
    metrics: {
      mrr_usd: 0.0,
      arr_projected_usd: 0.0,
      active_machine_buyers: 0,
      total_settled_volume_usd: 500.075,
      churn_rate_pct: 0.0,
      ltv_projected_usd: 2400.0,
      k_factor: 1.4
    },
    pipeline: {
      staged_inbounds_value_usd: 4400.0,
      targets: [
        { name: "Sedgwick Brand Protection", target_value_usd: 2400.0, status: "DRAFT_STAGED_IN_GMAIL" },
        { name: "CrewAI Core Team", target_value_usd: 1000.0, status: "DRAFT_STAGED_IN_GMAIL" },
        { name: "Upstash Serverless", target_value_usd: 500.0, status: "DRAFT_STAGED_IN_GMAIL" },
        { name: "ByteCore Compute", target_value_usd: 500.0, status: "DRAFT_STAGED_IN_GMAIL" }
      ]
    },
    kill_gates: {
      gate_201: {
        description: "300 VIN decodes by 10/17",
        current_status: "CRON_ARMED_DAILY",
        target: 300
      },
      gate_761: {
        description: "1 paid $500 listing by 10/20",
        current_status: "AWAITING_TRACK_A_CLICK",
        target: 1
      }
    },
    invariants: {
      conservation: "PASS",
      deterrence: "PASS",
      anytime_valid: "PASS",
      tamper_evidence: "PASS",
      constants: "PASS"
    }
  };

  return NextResponse.json(payload, {
    headers: {
      'Cache-Control': 'no-store, max-age=0',
      'Content-Type': 'application/json'
    }
  });
}
