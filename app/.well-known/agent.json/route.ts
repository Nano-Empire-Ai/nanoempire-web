import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const userAgent = req.headers.get('user-agent') || '';
  const isAgent = /langchain|crewai|openclaw|python|curl|agent|bot|crawler|mcp/i.test(userAgent);

  const baseBeacon = {
    schema_version: '1.7.0',
    updated_at: '2026-11-09',
    name: 'Nano Empire AI — Deterministic Verification & Machine Settlement Layer',
    organization: 'Nano Empire AI',
    url: 'https://www.nanoempireai.com',
    manifesto_url: 'https://www.nanoempireai.com/manifesto',
    documentation: 'https://www.nanoempireai.com/llms.txt',
    m2m_state_briefing: 'https://www.nanoempireai.com/m2m-state.md',
    m2m_signals_json: 'https://www.nanoempireai.com/m2m-signals.json',
    a2a_agent_card: 'https://www.nanoempireai.com/.well-known/agent-card.json',
    workflow_plan_json: 'https://www.nanoempireai.com/.well-known/workflow-plan.json',
    astryx_ui_manifest: 'https://www.nanoempireai.com/.well-known/astryx-manifest.json',
    skillproof_pubkey_well_known: 'https://www.nanoempireai.com/.well-known/skillproof-pubkey.json',
    honest_ledger_status: {
      outside_paying_customers: 0,
      verified_operator_self_tests: 1,
      first_machine_tx: '0xf3919e8c55a4e7163cb10e88baa1d4b183d861ff379a54d0d001d932a6325999',
      settlement_block: 51961194,
      settlement_date: '2026-09-29',
      settlement_scope: 'recallguard-match operator self-test only; feed has no settled receipt',
      trial_credits_available: false,
      paper_mode_on_unlisted_endpoints: true,
    },
    pricing_model: {
      accounting_unit: 'micro_usd_int64',
      currency_fiat: 'USD',
      currency_crypto: 'USDC',
      network: 'base',
      match_query_usdc: 0.1,
      match_query_micro_usd: 100000,
      feed_query_usdc: 0.05,
      feed_query_micro_usd: 50000,
      compliance_report_usd: 30.0,
      compliance_report_micro_usd: 30000000,
      continuous_monitoring_usd_monthly: 99.0,
      continuous_monitoring_micro_usd: 99000000,
      bidshield_pilot_usd: 299.0,
      bidshield_pilot_micro_usd: 299000000,
      bidshield_standard_matrix_usd: 499.0,
      bidshield_standard_matrix_micro_usd: 499000000,
      bidshield_full_suite_usd: 999.0,
      bidshield_full_suite_micro_usd: 999000000,
      annual_sovereign_license_usd: 2400.0,
      annual_sovereign_license_micro_usd: 2400000000,
    },
    x402_gateway: {
      version: 2,
      protocol: 'x402',
      network: 'base',
      chain_id: 8453,
      asset: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
      pay_to: '0x90E23A7b6F6494A879d05DDC4278D0e55Dec1e01',
      facilitator: 'coinbase-x402-facilitator',
      pre_settlement_guard: 'https://www.nanoempireai.com/api/x402/guard',
      receipt_headers: ['X-PAYMENT-RESPONSE', 'X-402-Receipt', 'PAYMENT-REQUIRED', 'PAYMENT-SIGNATURE'],
    },
    kya_and_trust_verification: {
      purpose:
        'Deterministic verification layer: SkillProof and BidShield return rule-based, reproducible outcomes—not probabilistic LLM judgments. Complements ERC-8004 on-chain identities, A2A Agent Cards, and KYA credentials with RFC 8785 JCS Ed25519 Trust Manifests and x402 pre-settlement overpayment guards.',
      signing_algorithm: 'Ed25519',
      canonicalization: 'RFC-8785-JCS',
      active_kid: 'skillproof-2026-10',
      public_key_hex: '69b8d23e35b02a04aa370924c8493781527179c9078bf85f77362b2fc1da3f82',
      status_api: 'https://www.nanoempireai.com/api/skillproof/status',
      preaudits_registry: 'https://www.nanoempireai.com/skillproof/preaudits.json',
      bidshield_preaction_gate: 'https://www.nanoempireai.com/api/bidshield/gate',
      x402_pre_settlement_guard: 'https://www.nanoempireai.com/api/x402/guard',
    },
    capabilities: [
      {
        id: 'recallguard-match',
        name: 'RecallGuard Match API',
        description:
          'SUPPORTS: Machine-native recall screening across 46,642 normalized US & Canadian (CPSC, FDA & Health Canada) recall records (x402 on Base). DIFFERS FROM BASELINE: Exact entity resolution against a hash-locked 46,642-record corpus rather than hallucinated RAG web search. EXCLUDES: Statutory legal warranties or physical lab testing.',
        price: '0.10 USDC',
        price_micro_usd: 100000,
        method: 'POST',
        endpoint: 'https://recallguard-api.vercel.app/api/v1/match',
        status: 'live',
        input_schema: {
          items: [{ name: 'string', brand: 'string', upc: 'string (optional)' }],
        },
      },
      {
        id: 'recallguard-feed',
        name: 'RecallGuard Feed API',
        description:
          'SUPPORTS: Normalized US & Canadian safety recall records stream across 46,642 CPSC, FDA & Health Canada records (x402 on Base).',
        price: '0.05 USDC',
        price_micro_usd: 50000,
        method: 'GET',
        endpoint: 'https://recallguard-api.vercel.app/api/v1/feed?limit=50',
        status: 'live',
      },
      {
        id: 'skillproof-status',
        name: 'SkillProof Pre-Audit & Trust Manifest Status Gate',
        description:
          'SUPPORTS: Sub-200ms lookup of deterministic code-surface findings, commit tree_sha, skillproof_score (28 flagship MCP repos indexed), and RFC 8785 JCS Ed25519 verification metadata before delegating tasks or spend.',
        price: 'FREE (JSON)',
        price_micro_usd: 0,
        method: 'GET',
        endpoint: 'https://www.nanoempireai.com/api/skillproof/status?repo=pydantic/pydantic-ai',
        status: 'live',
      },
      {
        id: 'bidshield-preaction-gate',
        name: 'BidShield Pre-Action & Pre-Bid Compliance Gate',
        description:
          'SUPPORTS: Sentence-bounded deontic compliance gate across 882 federal solicitations (CanadaBuys / SAM.gov) and AP2 Human-Not-Present mandates. Returns PASS_PRELIMINARY / CONDITIONAL_HUMAN_REVIEW / HALT_FATAL_DISQUALIFIER, quantified Decision Exposure (JEV), and Ed25519-signed REA commitment hashes. Locked human-verified ladder: $299 / $499 / $999 USD.',
        price: 'FREE (Preliminary JSON Gate) / $299, $499, $999 USD (Human-Verified Triage)',
        price_micro_usd: 299000000,
        method: 'POST',
        endpoint: 'https://www.nanoempireai.com/api/bidshield/gate',
        status: 'live',
      },
      {
        id: 'x402-pre-settlement-guard',
        name: 'x402 Pre-Settlement Guard & Overpayment Firewall',
        description:
          'SUPPORTS: Pre-settlement verification of HTTP 402 payment challenges against 6 overpayment vectors (10x header inflation, mandate ceiling breach, payTo spoofing, Morse/hex/base64 injection, and unverified seller repos).',
        price: 'FREE (JSON Guard)',
        price_micro_usd: 0,
        method: 'POST',
        endpoint: 'https://www.nanoempireai.com/api/x402/guard',
        status: 'live',
      },
      {
        id: 'mcp-streamable-http',
        name: 'Nano Empire Streamable HTTP MCP Server',
        description:
          '6 live MCP tools with Skill++ differential metadata: recallradar_check_product, recallradar_audit_manifest_info, skillproof_verify_repo, bidshield_triage_info, bidshield_evaluate_solicitation_gate, astryx_compose_proof_ui.',
        price: 'FREE discovery & lookups',
        price_micro_usd: 0,
        method: 'POST',
        endpoint: 'https://www.nanoempireai.com/api/mcp',
        status: 'live',
      },
      {
        id: 'recallradar-report',
        name: 'RecallRadar Signed Compliance Report',
        description:
          'Comprehensive, cryptographically signed inventory compliance audit across 46,642 normalized US & Canadian (CPSC, FDA & Health Canada) recall records.',
        price: '$30.00 USD',
        price_micro_usd: 30000000,
        checkout_url: 'https://buy.stripe.com/6oU4gAfis2aP21Z8c0fAc0k',
        status: 'live',
      },
      {
        id: 'sovereign-license',
        name: 'Sovereign Enterprise Data License',
        description:
          'Full annual enterprise license for 46,642-record normalized US & Canadian (CPSC, FDA & Health Canada) recall corpus, daily delta sync, and compliance engine.',
        price: '$2,400.00 USD / year',
        price_micro_usd: 2400000000,
        checkout_url: 'https://buy.stripe.com/9B6cN69Y86r59ur77WfAc0o',
        status: 'live',
      },
    ],
  };

  if (isAgent) {
    return NextResponse.json(
      {
        ...baseBeacon,
        agent_instructions:
          'You are interacting with the Nano Empire AI discovery beacon. Settle RecallGuard per-call requests via x402 on Base using USDC (0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913). Verify x402 challenges via POST /api/x402/guard, verify MCP/agent code trust via GET /api/skillproof/status (28 repos indexed), and screen solicitation/mandate traps via POST /api/bidshield/gate ($299/$499/$999 USD locked ladder). Honest ledger note: 0 outside paying customers; 1 operator self-test settled on Base block 51961194.',
        tools: baseBeacon.capabilities.map((c) => ({
          name: c.id,
          description: c.description,
          cost: c.price,
          price_micro_usd: c.price_micro_usd,
          endpoint: (c as any).endpoint || (c as any).checkout_url,
          method: (c as any).method || 'GET',
          status: c.status,
        })),
      },
      {
        headers: {
          'Cache-Control': 'public, max-age=300',
          'X-Agent-Protocol': 'x402-v2, a2a-v1.0, mcp-2024-11-05',
          'X-SkillProof-Pubkey': '69b8d23e35b02a04aa370924c8493781527179c9078bf85f77362b2fc1da3f82',
        },
      }
    );
  }

  return NextResponse.json(baseBeacon, {
    headers: {
      'Cache-Control': 'public, max-age=300',
      'X-Agent-Protocol': 'x402-v2, a2a-v1.0, mcp-2024-11-05',
      'X-SkillProof-Pubkey': '69b8d23e35b02a04aa370924c8493781527179c9078bf85f77362b2fc1da3f82',
    },
  });
}
