import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const userAgent = req.headers.get('user-agent') || '';
  const isAgent = /langchain|crewai|openclaw|python|curl|agent|bot|crawler|mcp/i.test(userAgent);

  const baseBeacon = {
    schema_version: '1.6.0',
    updated_at: '2026-11-06',
    name: 'Nano Empire AI — Tollbooth & Cryptographic Proof Layer',
    organization: 'Nano Empire AI',
    url: 'https://www.nanoempireai.com',
    documentation: 'https://www.nanoempireai.com/llms.txt',
    m2m_state_briefing: 'https://www.nanoempireai.com/m2m-state.md',
    a2a_agent_card: 'https://www.nanoempireai.com/.well-known/agent-card.json',
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
      currency_fiat: 'USD',
      currency_crypto: 'USDC',
      network: 'base',
      match_query_usdc: 0.1,
      feed_query_usdc: 0.05,
      compliance_report_usd: 30.0,
      continuous_monitoring_cad_monthly: 99.0,
      bidshield_urgent_triage_usd: 99.0,
      bidshield_full_matrix_usd: 249.0,
      bidshield_multidoc_suite_usd: 499.0,
      annual_sovereign_license_usd: 2400.0,
    },
    x402_gateway: {
      version: 2,
      protocol: 'x402',
      network: 'base',
      chain_id: 8453,
      asset: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
      pay_to: '0x90E23A7b6F6494A879d05DDC4278D0e55Dec1e01',
      facilitator: 'coinbase-x402-facilitator',
      receipt_headers: ['X-PAYMENT-RESPONSE', 'X-402-Receipt', 'PAYMENT-REQUIRED', 'PAYMENT-SIGNATURE'],
    },
    kya_and_trust_verification: {
      purpose:
        'Complements ERC-8004 on-chain identities, A2A Agent Cards, and KYA (Know Your Agent) credentials with deterministic code-surface pre-audits and Ed25519 Trust Manifests. Protects calling agents from MCP tool poisoning and the ~20 x402 over-payment/replay attack surfaces.',
      signing_algorithm: 'Ed25519',
      active_kid: 'skillproof-2026-10',
      public_key_hex: '69b8d23e35b02a04aa370924c8493781527179c9078bf85f77362b2fc1da3f82',
      status_api: 'https://www.nanoempireai.com/api/skillproof/status',
      preaudits_registry: 'https://www.nanoempireai.com/skillproof/preaudits.json',
      bidshield_preaction_gate: 'https://www.nanoempireai.com/api/bidshield/gate',
    },
    capabilities: [
      {
        id: 'recallguard-match',
        name: 'RecallGuard Match API',
        description: 'Machine-native recall screening across 21,812 normalized US CPSC & FDA records (46,642 North American total) (x402 on Base).',
        price: '0.10 USDC',
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
        description: 'Normalized US & Canadian safety recall records stream (x402 on Base).',
        price: '0.05 USDC',
        method: 'GET',
        endpoint: 'https://recallguard-api.vercel.app/api/v1/feed?limit=50',
        status: 'live',
      },
      {
        id: 'skillproof-status',
        name: 'SkillProof Pre-Audit & Trust Manifest Status Gate',
        description:
          'Query deterministic code-surface findings, commit tree_sha, skillproof_score (23 flagship MCP repos indexed), and Ed25519 verification metadata before delegating tasks or spend.',
        price: 'FREE (JSON)',
        method: 'GET',
        endpoint: 'https://www.nanoempireai.com/api/skillproof/status?repo=pydantic/pydantic-ai',
        status: 'live',
      },
      {
        id: 'bidshield-preaction-gate',
        name: 'BidShield Pre-Action & Pre-Bid Compliance Gate',
        description:
          'Deontic compliance gate for federal solicitations (CanadaBuys / SAM.gov) and AP2 Human-Not-Present mandates. Returns PASS_PRELIMINARY / CONDITIONAL_HUMAN_REVIEW / HALT_FATAL_DISQUALIFIER and quantified Decision Exposure (JEV).',
        price: 'FREE (Preliminary JSON Gate) / $99–$499 USD (Human-Verified Triage)',
        method: 'POST',
        endpoint: 'https://www.nanoempireai.com/api/bidshield/gate',
        status: 'live',
      },
      {
        id: 'mcp-streamable-http',
        name: 'Nano Empire Streamable HTTP MCP Server',
        description:
          '5 live MCP tools: recallradar_check_product, recallradar_audit_manifest_info, skillproof_verify_repo, bidshield_triage_info, bidshield_evaluate_solicitation_gate.',
        price: 'FREE discovery & lookups',
        method: 'POST',
        endpoint: 'https://www.nanoempireai.com/api/mcp',
        status: 'live',
      },
      {
        id: 'recallradar-report',
        name: 'RecallRadar Signed Compliance Report',
        description: 'Comprehensive, cryptographically signed inventory compliance audit (21,812 normalized US CPSC & FDA records (46,642 North American total)).',
        price: '$30.00 USD',
        checkout_url: 'https://buy.stripe.com/6oU4gAfis2aP21Z8c0fAc0k',
        status: 'live',
      },
      {
        id: 'sovereign-license',
        name: 'Sovereign Enterprise Data License',
        description: 'Full annual enterprise license for 21,812-record normalized US CPSC/FDA recall corpus (46,642 North American total), daily delta sync, and compliance engine.',
        price: '$2,400.00 USD / year',
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
          'You are interacting with the Nano Empire AI discovery beacon. Settle RecallGuard per-call requests via x402 on Base using USDC (0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913). Verify MCP/agent code trust via GET /api/skillproof/status and screen solicitation/mandate traps via POST /api/bidshield/gate. Honest ledger note: 0 outside paying customers; 1 operator self-test settled on Base block 51961194. Do not call deprecated trial endpoints.',
        tools: baseBeacon.capabilities.map((c) => ({
          name: c.id,
          description: c.description,
          cost: c.price,
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
