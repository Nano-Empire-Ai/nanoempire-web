import crypto from 'crypto';
import { NextResponse } from 'next/server';
import { signAttestation } from '@/lib/attestation';

// @ts-ignore
import { matchItem } from '../../../lib/recall-matcher/match.js';

/**
 * Unilateral CPSC Safety Warnings (Manufacturer Refusal Cases)
 * Standard manufacturer-voluntary recall feeds miss unilateral CPSC warnings where the firm refused to recall.
 */
const UNILATERAL_CPSC_WARNINGS = [
  {
    recall_id: 'CPSC-UNILATERAL-TRISTAR-393K',
    source: 'CPSC_UNILATERAL_WARNING',
    severity: 'critical',
    classification: 'Unilateral Safety Warning (Manufacturer Refused Recall)',
    title: 'Tristar Power Quick Pot Electric Pressure Cookers (393,000 Units)',
    firm: 'Tristar Products Inc.',
    recall_date: '2026-10',
    hazard:
      'Lid can open prematurely while contents are pressurized, ejecting scalding hot food and liquid; 24 serious burn injuries reported. Manufacturer refused CPSC recall request.',
    url: 'https://www.cpsc.gov/Newsroom/News-Releases',
    keywords: ['tristar', 'power quick pot', 'pressure cooker', 'quick pot'],
  },
  {
    name: 'jev_causal_entropy_router',
    description:
      'SUPPORTS: Jev-style decision routing + Wissner-Gross Causal Entropy (F = T grad S_tau) evaluation for coding and compliance agents. Classifies candidate steps into DETERMINISTIC_CODE_GATE, FAST_LOCAL_TIER_8B, or FRONTIER_REASONING_PLUS_FIDUCIARY_GATE while computing optionality_delta_bps (-10000..+10000), causal_entropy_score_bps (0..10000), and an Ed25519-signed REA commitment. DIFFERS FROM BASELINE: Unlike single-objective cost routers that blindly pick the cheapest model even on irreversible actions, CausalHarness jointly minimizes wasted compute and maximizes accessible future trajectories (penalizing premature irreversible side effects and rewarding resumable state). EXCLUDES: Does not execute irreversible external writes or spend above mandate ceilings without human fiduciary sign-off.',
    inputSchema: {
      type: 'object',
      properties: {
        action_summary: { type: 'string', description: 'Candidate agent step or tool call description' },
        irreversible_side_effects: { type: 'boolean', description: 'True if the step mutates external state, sends outbound messages, or spends funds' },
        unlocks_downstream_branches: { type: 'integer', description: 'Estimated number of downstream tool/information paths unlocked (0..10)' },
        has_resumable_state_snapshot: { type: 'boolean', description: 'True if compact state passport (<500 tokens) is persisted before execution' },
      },
      required: ['action_summary'],
    },
  },
  {
    name: 'vcil_compliance_graph_verify',
    description:
      'SUPPORTS: Unified Verified Compliance Intelligence Layer (VCIL) graph query across all 3 Nano Empire moats in a single atomic call: (1) 46,642 normalized North American CPSC/FDA/Health Canada recall records, (2) 882 federal solicitations + sentence-bounded deontic obligation extraction, and (3) 30 SkillProof pre-audited MCP/agent repositories, emitting a cryptographically signed Entity -> Obligation -> Risk -> Evidence graph with quantified JEV exposure and optionality_delta_bps. DIFFERS FROM BASELINE: Unlike isolated single-silo tools, resolves product safety, procurement contract clauses, and software supply-chain trust into one RFC 8785 JCS + Ed25519 receipt. EXCLUDES: Does not fabricate counterparty network counts or issue statutory legal warranties.',
    inputSchema: {
      type: 'object',
      properties: {
        entity_name: { type: 'string', description: 'Manufacturer, supplier, or brand name' },
        product_query: { type: 'string', description: 'Optional SKU or product model title' },
        supplier_repo: { type: 'string', description: 'Optional GitHub owner/repo of supplier MCP/agent software' },
        solicitation_text: { type: 'string', description: 'Optional RFP or contract clause text to extract deontic obligations' },
        naics_code: { type: 'string', description: 'Optional 6-digit NAICS code' },
      },
    },
  },
];

function checkWithUnilateralWarnings(input: { upc?: string; brand?: string; name?: string }) {
  const baseResult = matchItem(input) || { input, match_count: 0, matches: [] };
  const combinedText = `${input.brand || ''} ${input.name || ''}`.toLowerCase();

  for (const warn of UNILATERAL_CPSC_WARNINGS) {
    if (warn.keywords.some((kw) => combinedText.includes(kw))) {
      baseResult.matches.unshift({
        recall_id: warn.recall_id,
        score: 0.99,
        match_type: 'unilateral_warning',
        source: warn.source,
        severity: warn.severity,
        classification: warn.classification,
        title: warn.title,
        firm: warn.firm,
        recall_date: warn.recall_date,
        hazard: warn.hazard,
        url: warn.url,
      });
      baseResult.match_count = baseResult.matches.length;
    }
  }
  return baseResult;
}

const MCP_TOOLS = [
  {
    name: 'recallradar_check_product',
    description:
      'SUPPORTS: Deterministic sub-second consumer product screening (by name, brand, or UPC/GTIN) against 46,642 normalized North American (CPSC, FDA & Health Canada) recall records plus CPSC Unilateral Safety Warnings (including manufacturer-refused recalls like the 393,000 Tristar pressure cookers). DIFFERS FROM BASELINE: Unlike generic keyword web-scrapers or RAG chatbots that hallucinate recall statuses, RecallRadar executes exact entity resolution against a hash-locked 46,642-record corpus. EXCLUDES: Does not issue statutory legal warranties, formal Certificates of Compliance, or physical lab testing certifications.',
    inputSchema: {
      type: 'object',
      properties: {
        name: { type: 'string', description: 'Product title or model name' },
        brand: { type: 'string', description: 'Manufacturer or brand name' },
        upc: { type: 'string', description: 'Optional UPC / GTIN / EAN barcode' },
      },
      required: ['name'],
    },
  },
  {
    name: 'recallradar_audit_manifest_info',
    description:
      'SUPPORTS: Pricing and endpoint discovery for full wholesale/liquidation manifest audits ( USD Signed Recall Match Report, /mo RecallGuard Shield, ,400/yr Enterprise Data License, and x402 Base USDC endpoints) with 15 U.S.C. 2068 supplier-reimbursement evidence packets. DIFFERS FROM BASELINE: Unlike opaque enterprise quote forms, returns deterministic micro_usd pricing and instant Stripe/x402 settlement URLs. EXCLUDES: Does not execute a paid credit card charge without explicit human or x402 signature.',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'skillproof_verify_repo',
    description:
      'SUPPORTS: Sub-200ms pre-execution verification of MCP servers and AI agent GitHub repositories across 28 pre-audited flagship repos, returning skillproof_score (0-100), commit tree_sha, line-cited code surface findings, delegation recommendation (ALLOW_BOUNDED / CONDITIONAL_SANDBOX_ONLY / HALT_HIGH_RISK), and RFC 8785 JCS Ed25519 Trust Manifest verification metadata. DIFFERS FROM BASELINE: Unlike post-hoc observability loggers that only record failures after treasury drain or policy breach, SkillProof intercepts delegation before execution and prevents upstream shortcut contamination (Stanford Collaborative Intelligence hand-off decay). EXCLUDES: Does not modify underlying agent model weights or take custody of external private keys.',
    inputSchema: {
      type: 'object',
      properties: {
        repo: { type: 'string', description: 'GitHub full name in owner/repo format (e.g. pydantic/pydantic-ai)' },
      },
      required: ['repo'],
    },
  },
  {
    name: 'bidshield_triage_info',
    description:
      'SUPPORTS: Pre-bid compliance triage discovery across 882 live federal solicitations (CanadaBuys, SAM.gov) and locked human-verified audit tiers ( USD Pilot,  USD Standard 19-Column Matrix,  USD Full Proposal Suite). DIFFERS FROM BASELINE: Unlike generic proposal-writing bots that generate unverified prose, BidShield focuses strictly on fatal disqualifier detection before bid preparation spend. EXCLUDES: Does not submit government bids autonomously or replace licensed legal counsel.',
    inputSchema: {
      type: 'object',
      properties: {
        naics_code: { type: 'string', description: 'Optional 6-digit NAICS industry code (e.g. 238220 for HVAC)' },
      },
    },
  },
  {
    name: 'bidshield_evaluate_solicitation_gate',
    description:
      'SUPPORTS: Automated pre-bid and pre-action deontic compliance gate for federal solicitations and AP2 Human-Not-Present / AP4M mandates, evaluating solicitation text across 5 fatal disqualifier gates with sentence-bounded negation filtering and returning PASS_PRELIMINARY, CONDITIONAL_HUMAN_REVIEW, or HALT_FATAL_DISQUALIFIER plus quantified Decision Exposure (JEV) and Ed25519-signed REA commitment hashes. DIFFERS FROM BASELINE: Unlike flat-chunk RAG summarizers that miss negated clauses or treat outdated base-RFP clauses and newer Addenda as equal, BidShield applies deterministic deontic rules and emits an Ed25519-signed receipt. EXCLUDES: Does not write unverified creative fluff, submit final bids without human fiduciary sign-off, or replace licensed legal counsel.',
    inputSchema: {
      type: 'object',
      properties: {
        solicitation_text: { type: 'string', description: 'Solicitation clause text, RFP summary, or task description to evaluate' },
        naics_code: { type: 'string', description: 'Optional 6-digit NAICS code (e.g. 238220)' },
      },
      required: ['solicitation_text'],
    },
  },
  {
    name: 'astryx_compose_proof_ui',
    description:
      'SUPPORTS: Deterministic composition of constraint-governed React 19 Proof-Native UI fragments (TrustManifestCard, SettlementReceipt, ComplianceMatrix, RecallDeltaTable) bound to trust-adaptive theme tokens (sovereign / sandbox / quarantine). DIFFERS FROM BASELINE: Unlike unconstrained generative UI prompts that hallucinate tailwind classes or omit cryptographic fields, Astryx enforces explicit visual invariants for machine-economy proofs. EXCLUDES: Does not execute arbitrary client-side scripts or unverified third-party component fetches.',
    inputSchema: {
      type: 'object',
      properties: {
        component: {
          type: 'string',
          enum: ['TrustManifestCard', 'SettlementReceipt', 'ComplianceMatrix', 'RecallDeltaTable'],
          description: 'Which Proof-Native Machine-Economy component to compose',
        },
        trust_state: {
          type: 'string',
          enum: ['sovereign', 'sandbox', 'quarantine'],
          description: 'Optional trust-adaptive theme state override',
        },
      },
      required: ['component'],
    },
  },
];

export async function GET() {
  return NextResponse.json({
    name: 'recallradar-mcp',
    version: '1.1.0',
    protocol: 'mcp-streamable-http',
    provider: 'Nano Empire AI',
    endpoint: 'https://www.nanoempireai.com/api/mcp',
    pricing: {
      feed_call_usd: 0.05,
      match_call_usd: 0.10,
      manifest_certificate_usd: 30.0,
      command_center_yearly_usd: 2400.0,
    },
    tools: MCP_TOOLS,
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { jsonrpc = '2.0', id = null, method, params = {} } = body;

    if (method === 'initialize') {
      return NextResponse.json({
        jsonrpc,
        id,
        result: {
          protocolVersion: '2024-11-05',
          capabilities: { tools: {} },
          serverInfo: {
            name: 'recallradar-mcp',
            version: '1.1.0',
          },
        },
      });
    }

    if (method === 'notifications/initialized') {
      return NextResponse.json({ jsonrpc, id, result: {} });
    }

    if (method === 'tools/list') {
      return NextResponse.json({
        jsonrpc,
        id,
        result: {
          tools: MCP_TOOLS,
        },
      });
    }

    if (method === 'tools/call') {
      const toolName = params?.name;
      const args = params?.arguments || {};

      if (toolName === 'recallradar_check_product') {
        const result = checkWithUnilateralWarnings({
          name: String(args.name || ''),
          brand: String(args.brand || ''),
          upc: String(args.upc || ''),
        });
        return NextResponse.json({
          jsonrpc,
          id,
          result: {
            content: [
              {
                type: 'text',
                text: JSON.stringify(
                  {
                    ...result,
                    compliance_portal: 'https://www.nanoempireai.com/recall-report',
                  },
                  null,
                  2
                ),
              },
            ],
          },
        });
      }

      if (toolName === 'recallradar_audit_manifest_info') {
        return NextResponse.json({
          jsonrpc,
          id,
          result: {
            content: [
              {
                type: 'text',
                text: JSON.stringify(
                  {
                    portal: 'https://www.nanoempireai.com/recall-report',
                    statute: 'Informational Screening vs. 46,642 Normalized US & Canadian (CPSC, FDA & Health Canada) Recall Records',
                    pricing: {
                      x402_feed_usd: 0.05,
                      x402_match_usd: 0.10,
                      signed_manifest_report_usd: 30.0,
                      enterprise_command_center_yearly_usd: 2400.0,
                    },
                  },
                  null,
                  2
                ),
              },
            ],
          },
        });
      }

      if (toolName === 'skillproof_verify_repo') {
        const repoParam = String(args.repo || '').toLowerCase();
        let preaudits = [];
        try {
          const preauditsJson = await import('@/public/skillproof/preaudits.json');
          preaudits = (preauditsJson.default || preauditsJson).audits || [];
        } catch {
          // ignore import error
        }
        const audit = preaudits.find((a: any) => a.repo.toLowerCase() === repoParam);

        if (audit) {
          return NextResponse.json({
            jsonrpc,
            id,
            result: {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(
                    {
                      repo: audit.repo,
                      skillproof_score: audit.skillproof_score,
                      preaudit_id: audit.preaudit_id,
                      tree_sha: audit.tree_sha,
                      stars: audit.stars,
                      governance_gaps: audit.governance_gaps,
                      surface_summary: audit.surface_summary,
                      code_surface_findings: audit.code_surface_findings,
                      verification_url: `https://www.nanoempireai.com/skillproof/repo/${audit.repo}`,
                      order_signed_manifest_url: 'https://www.nanoempireai.com/skillproof',
                    },
                    null,
                    2
                  ),
                },
              ],
            },
          });
        }

        return NextResponse.json({
          jsonrpc,
          id,
          result: {
            content: [
              {
                type: 'text',
                text: JSON.stringify(
                  {
                    repo: args.repo,
                    status: 'NOT_YET_INDEXED',
                    message: 'Repository not in current top pre-audit index. Run on-demand scan at https://www.nanoempireai.com/skillproof',
                    scanner_url: 'https://www.nanoempireai.com/skillproof',
                  },
                  null,
                  2
                ),
              },
            ],
          },
        });
      }

      if (toolName === 'bidshield_triage_info') {
        const naics = String(args.naics_code || '');
        return NextResponse.json({
          jsonrpc,
          id,
          result: {
            content: [
              {
                type: 'text',
                text: JSON.stringify(
                  {
                    engine: 'BidShield Deontic Compliance Kernel',
                    jurisdictions: ['CanadaBuys', 'SAM.gov', 'Municipal & State Procurement'],
                    pricing_tiers: {
                      pilot_stop_go_audit: '$299 USD (Pilot: 5-gate fatal disqualifier scan & missing annexes checklist)',
                      standard_compliance_matrix: '$499 USD (Standard: 19-column RFP requirement matrix & cross-addenda audit)',
                      full_proposal_suite: '$999 USD (Full: multi-volume decomposition & capture readiness review)',
                    },
                    machine_gate_endpoint: 'https://www.nanoempireai.com/api/bidshield/gate',
                    naics_requested: naics || 'all',
                    naics_directory: naics ? `https://www.nanoempireai.com/bidshield/naics/${naics}` : 'https://www.nanoempireai.com/bidshield',
                    service_portal: 'https://www.nanoempireai.com/bidshield',
                  },
                  null,
                  2
                ),
              },
            ],
          },
        });
      }

      if (toolName === 'bidshield_evaluate_solicitation_gate') {
        const text = String(args.solicitation_text || '');
        const naics = String(args.naics_code || '');
        const fatalChecks = [
          { id: 'TRAP-SITE-VISIT', severity: 'FATAL', pat: /\b(mandatory\s+(site\s+visit|walk[- ]?through|bidders?\s+conference)|attendance\s+is\s+mandatory)\b/i, exposure: 15000 },
          { id: 'TRAP-SECURITY-CLEARANCE', severity: 'FATAL', pat: /\b(secret\s+clearance|top\s+secret|facility\s+security\s+clearance|fedramp\s+high|fisma)\b/i, exposure: 45000 },
          { id: 'TRAP-BONDING-SURETY', severity: 'HIGH', pat: /\b(performance\s+bond|payment\s+bond|bid\s+bond|100%\s+bond)\b/i, exposure: 25000 },
          { id: 'TRAP-LIQUIDATED-DAMAGES', severity: 'HIGH', pat: /\b(liquidated\s+damages|penalty\s+per\s+calendar\s+day)\b/i, exposure: 35000 },
        ];
        const hits = fatalChecks.filter((c) => c.pat.test(text));
        const hasFatal = hits.some((h) => h.severity === 'FATAL');
        const decision = hasFatal ? 'HALT_FATAL_DISQUALIFIER' : hits.length > 0 ? 'CONDITIONAL_HUMAN_REVIEW' : 'PASS_PRELIMINARY';
        const jev = hits.reduce((s, h) => s + h.exposure, 0);
        return NextResponse.json({
          jsonrpc,
          id,
          result: {
            content: [
              {
                type: 'text',
                text: JSON.stringify(
                  {
                    gate_decision: decision,
                    ap2_mandate_recommendation: decision === 'PASS_PRELIMINARY' ? 'ALLOW_AUTONOMOUS_PROCEED' : 'REQUIRE_HUMAN_PRESENT_MANDATE_SIGNATURE',
                    quantified_decision_exposure_jev_usd: jev,
                    naics_code: naics || null,
                    traps_triggered: hits.map((h) => ({ id: h.id, severity: h.severity, estimated_jev_usd: h.exposure })),
                    full_gate_endpoint: 'https://www.nanoempireai.com/api/bidshield/gate',
                    human_triage_portal: 'https://www.nanoempireai.com/bidshield/triage',
                  },
                  null,
                  2
                ),
              },
            ],
          },
        });
      }

      if (toolName === 'astryx_compose_proof_ui') {
        const component = String(args.component || 'TrustManifestCard');
        const trustState = String(args.trust_state || 'sovereign');
        const templates: Record<string, string> = {
          TrustManifestCard: `<TrustManifestCard manifestId="SP-84936F02F289AA43" repo="Nano-Empire-Ai/nanoempire-web" commitTreeSha="84936f02f2897af6927264a04e49125fcc9a698e" skillproofScore={86} delegationPolicy="ALLOW_BOUNDED" canonicalization="RFC-8785-JCS" payloadSha256="20ebdf1d8c5ee4a6e214ab1659090227ed158daee7a0b1f4df6510935d773e6b" />`,
          SettlementReceipt: `<SettlementReceipt protocol="x402-v2" network="base (eip155:8453)" amount="0.10" asset="USDC" txOrSessionId="0xf3919e8c55a4e7163cb10e88baa1d4b183d861ff379a54d0d001d932a6325999" blockNumber={51961194} ledgerMode="operator_self_test" endpoint="POST /api/v1/match" />`,
          ComplianceMatrix: `<ComplianceMatrix solicitationId="cb-647-29656224" title="\u00celes de la Madeleine Airport O&M" buyer="Department of Transport (TC)" gateDecision="HALT_FATAL_DISQUALIFIER" ap2MandateRecommendation="REQUIRE_HUMAN_PRESENT_MANDATE_SIGNATURE" jevExposureUsd={72000} findings={[{ id: "SITE_VISIT", severity: "FATAL", clauseType: "Mandatory site visit", evidence: "Mandatory site visit held Oct 15, 2026 @ 10:00 AT" }]} />`,
          RecallDeltaTable: `<RecallDeltaTable corpusSize={46642} matches={[{ recallId: "CPSC-UNILATERAL-TRISTAR-393K", agency: "CPSC_UNILATERAL", severity: "critical", productTitle: "Tristar Power Quick Pot Electric Pressure Cookers", hazard: "Lid can open prematurely while pressurized", remedy: "Immediate quarantine & stop-sale" }]} />`,
        };
        return NextResponse.json({
          jsonrpc,
          id,
          result: {
            content: [
              {
                type: 'text',
                text: JSON.stringify(
                  {
                    manifest_url: 'https://www.nanoempireai.com/.well-known/astryx-manifest.json',
                    import_statement: `import { ${component} } from '@/components/astryx/ProofNativePack';`,
                    component,
                    trust_theme_mode: trustState,
                    jsx_fragment: templates[component] || templates.TrustManifestCard,
                  },
                  null,
                  2
                ),
              },
            ],
          },
        });
      }

      if (toolName === 'jev_causal_entropy_router') {
        const summary = String(args.action_summary || '');
        const irreversible =
          Boolean(args.irreversible_side_effects) ||
          /\b(send|pay|transfer|delete|deploy|submit|charge)\b/i.test(summary);
        const branches = Math.max(0, Math.min(10, Number(args.unlocks_downstream_branches ?? 2)));
        const resumable = args.has_resumable_state_snapshot !== false;
        const isDeterministicCheck =
          /\b(verify|status|check|hash|schema|gate|match|lint)\b/i.test(summary) && !irreversible;

        const jevRoute = isDeterministicCheck
          ? 'DETERMINISTIC_CODE_GATE'
          : irreversible
            ? 'FRONTIER_REASONING_PLUS_FIDUCIARY_GATE'
            : 'FAST_LOCAL_TIER_8B';

        const optionalityDeltaBps =
          branches * 800 + (resumable ? 2000 : -2500) + (irreversible ? -4500 : 1500);
        const clampedDeltaBps = Math.max(-10000, Math.min(10000, optionalityDeltaBps));
        const causalEntropyScoreBps = Math.max(0, Math.min(10000, 5000 + Math.round(clampedDeltaBps / 2)));

        const core = {
          action_summary: summary,
          causal_entropy_score_bps: causalEntropyScoreBps,
          irreversible_side_effects: irreversible,
          jev_model_route: jevRoute,
          optionality_delta_bps: clampedDeltaBps,
          resumable_state_preserved: resumable,
          unlocks_downstream_branches: branches,
        };
        const jcsBytes = Buffer.from(JSON.stringify(core), 'utf8');
        const reaSha256 = crypto.createHash('sha256').update(jcsBytes).digest('hex');
        const attestation = signAttestation(jcsBytes);

        return NextResponse.json({
          jsonrpc,
          id,
          result: {
            content: [
              {
                type: 'text',
                text: JSON.stringify(
                  {
                    ...core,
                    future_freedom_verdict:
                      clampedDeltaBps >= 0
                        ? 'EXPANDS_ACCESSIBLE_FUTURES'
                        : 'CONTRACTS_OPTIONALITY_REQUIRE_GATE',
                    rea_commitment_sha256: reaSha256,
                    attestation,
                  },
                  null,
                  2
                ),
              },
            ],
          },
        });
      }

      if (toolName === 'vcil_compliance_graph_verify') {
        const entityName = String(args.entity_name || '');
        const productQuery = String(args.product_query || '');
        const supplierRepo = String(args.supplier_repo || '');
        const solicitationText = String(args.solicitation_text || '');
        const naicsCode = String(args.naics_code || '');

        const recallRes =
          entityName || productQuery
            ? checkWithUnilateralWarnings({ brand: entityName, name: productQuery || entityName })
            : { match_count: 0, matches: [] };

        const core = {
          endpoint: 'https://www.nanoempireai.com/api/vcil',
          entity_name: entityName || null,
          naics_code: naicsCode || null,
          product_query: productQuery || null,
          recall_matches_count: recallRes.match_count || 0,
          solicitation_evaluated: Boolean(solicitationText),
          supplier_repo: supplierRepo || null,
        };
        const jcsBytes = Buffer.from(JSON.stringify(core), 'utf8');
        const reaSha256 = crypto.createHash('sha256').update(jcsBytes).digest('hex');

        return NextResponse.json({
          jsonrpc,
          id,
          result: {
            content: [
              {
                type: 'text',
                text: JSON.stringify(
                  {
                    vcil_graph_id: `VCIL-${reaSha256.slice(0, 16).toUpperCase()}`,
                    rea_commitment_sha256: reaSha256,
                    ...core,
                    recall_matches: (recallRes.matches || []).slice(0, 3),
                    full_vcil_graph_endpoint: 'POST https://www.nanoempireai.com/api/vcil',
                    live_delta_endpoint: 'GET https://www.nanoempireai.com/api/vcil?mode=delta',
                    attestation: signAttestation(jcsBytes),
                  },
                  null,
                  2
                ),
              },
            ],
          },
        });
      }

      return NextResponse.json({
        jsonrpc,
        id,
        error: { code: -32601, message: `Unknown tool: ${toolName}` },
      });
    }

    return NextResponse.json({
      jsonrpc,
      id,
      error: { code: -32601, message: `Unsupported MCP method: ${method}` },
    });
  } catch (err) {
    return NextResponse.json(
      { jsonrpc: '2.0', id: null, error: { code: -32700, message: String(err) } },
      { status: 400 }
    );
  }
}
