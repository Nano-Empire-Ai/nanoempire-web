import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    mcpVersion: '2024-11-05',
    name: 'Nano Empire AI — RecallRadar, SkillProof & BidShield MCP',
    description:
      'Streamable HTTP MCP server exposing 5 deterministic tools: (1) recallradar_check_product (46,642 US/CA recalls + unilateral CPSC warnings), (2) recallradar_audit_manifest_info, (3) skillproof_verify_repo (23-repo MCP pre-audit index + Ed25519 trust verification), (4) bidshield_triage_info (8 NAICS compliance hubs), and (5) bidshield_evaluate_solicitation_gate (pre-action deontic compliance gate for federal tenders & AP2 Human-Not-Present mandates).',
    serverUrl: 'https://www.nanoempireai.com/api/mcp',
    transport: 'streamable-http',
    authentication: 'none',
    governance_home: 'Agentic AI Foundation (AAIF / Linux Foundation) compatible',
    verification_authority: {
      issuer: 'Nano Empire AI',
      algorithm: 'Ed25519',
      kid: 'skillproof-2026-10',
      public_key_hex: '69b8d23e35b02a04aa370924c8493781527179c9078bf85f77362b2fc1da3f82',
      pubkey_well_known: 'https://www.nanoempireai.com/.well-known/skillproof-pubkey.json',
    },
    pricing: {
      mcpToolCalls: 'FREE (product checks, SkillProof repo lookups, preliminary BidShield gate)',
      x402FeedUsd: 0.05,
      x402MatchUsd: 0.1,
      fullManifestCertificateUsd: 30.0,
      bidshieldTriageTiersUsd: '99.00 / 249.00 / 499.00',
      commandCenterYearlyUsd: 2400.0,
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
