import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    mcpVersion: '2024-11-05',
    schemaVersion: '1.7.0',
    name: 'Nano Empire AI — RecallRadar, SkillProof, BidShield & Astryx MCP',
    description:
      'Streamable HTTP MCP server exposing 7 deterministic Skill++ tools: (1) recallradar_check_product (46,642 normalized US/CA recalls + unilateral CPSC warnings), (2) recallradar_audit_manifest_info, (3) skillproof_verify_repo (30-repo MCP pre-audit index + RFC 8785 JCS Ed25519 trust verification), (4) bidshield_triage_info (882 federal tenders & 8 NAICS compliance hubs), (5) bidshield_evaluate_solicitation_gate (sentence-bounded deontic compliance gate for federal tenders & AP2 Human-Not-Present mandates), (6) astryx_compose_proof_ui (constraint-governed React 19 Proof-Native UI composer), and (7) jev_causal_entropy_router (CausalHarness Jev model router + Wissner-Gross optionality_delta_bps evaluator).',
    serverUrl: 'https://www.nanoempireai.com/api/mcp',
    transport: 'streamable-http',
    authentication: 'none',
    governance_home: 'Agentic AI Foundation (AAIF / Linux Foundation) compatible',
    verification_authority: {
      issuer: 'Nano Empire AI',
      algorithm: 'Ed25519',
      canonicalization: 'RFC-8785-JCS',
      kid: 'skillproof-2026-10',
      public_key_hex: '69b8d23e35b02a04aa370924c8493781527179c9078bf85f77362b2fc1da3f82',
      pubkey_well_known: 'https://www.nanoempireai.com/.well-known/skillproof-pubkey.json',
      astryx_manifest: 'https://www.nanoempireai.com/.well-known/astryx-manifest.json',
      workflow_plan: 'https://www.nanoempireai.com/.well-known/workflow-plan.json',
    },
    pricing: {
      accounting_unit: 'micro_usd_int64',
      mcpToolCalls: 'FREE (product checks, SkillProof repo lookups, preliminary BidShield gate, Astryx UI composition)',
      x402FeedUsd: 0.05,
      x402FeedMicroUsd: 50000,
      x402MatchUsd: 0.1,
      x402MatchMicroUsd: 100000,
      fullManifestCertificateUsd: 30.0,
      fullManifestCertificateMicroUsd: 30000000,
      recallGuardShieldMonthlyUsd: 99.0,
      recallGuardShieldMonthlyMicroUsd: 99000000,
      bidshieldTriageTiersUsd: '299.00 / 499.00 / 999.00',
      bidshieldTriageTiersMicroUsd: [299000000, 499000000, 999000000],
      commandCenterYearlyUsd: 2400.0,
      commandCenterYearlyMicroUsd: 2400000000,
    },
    honest_ledger_status: {
      outside_paying_customers: 0,
      verified_operator_self_tests: 1,
      settlement_block: 51961194,
    },
    documentationUrl: 'https://www.nanoempireai.com/llms.txt',
    m2mStateUrl: 'https://www.nanoempireai.com/m2m-state.md',
    contactEmail: 'rob@nanoempireai.com',
  });
}
