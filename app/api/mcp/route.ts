import { NextResponse } from 'next/server';

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
      'Check a consumer product (by name, brand, or UPC/GTIN) against CPSC, FDA, and CPSC Unilateral Safety Warnings (including manufacturer-refused recalls like the 393,000 Tristar pressure cookers).',
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
      'Returns pricing and endpoint details for full wholesale/liquidation manifest audits (Signed Recall Match Reports).',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'skillproof_verify_repo',
    description:
      'Returns the cached 6-vector static security scorecard and governance hygiene evaluation for a public GitHub MCP or AI agent repository.',
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
      'Returns RFP pre-bid compliance triage and disqualifier audit capabilities for government solicitations (CanadaBuys, SAM.gov).',
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
      'Pre-action deontic compliance gate for federal solicitations and B2B agent mandates (AP2 Human-Not-Present / AP4M). Evaluates solicitation text for fatal disqualifiers (mandatory site visits, clearances, bonding, liquidated damages) and returns PASS_PRELIMINARY, CONDITIONAL_HUMAN_REVIEW, or HALT_FATAL_DISQUALIFIER plus quantified Decision Exposure (JEV).',
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
      'Returns an Astryx Proof-Native Machine-Economy React 19 component fragment and trust-adaptive theme specification (sovereign / sandbox / quarantine) for TrustManifestCard, SettlementReceipt, ComplianceMatrix, or RecallDeltaTable.',
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
          ComplianceMatrix: `<ComplianceMatrix solicitationId="cb-647-29656224" title="Îles de la Madeleine Airport O&M" buyer="Department of Transport (TC)" gateDecision="HALT_FATAL_DISQUALIFIER" ap2MandateRecommendation="REQUIRE_HUMAN_PRESENT_MANDATE_SIGNATURE" jevExposureUsd={72000} findings={[{ id: "SITE_VISIT", severity: "FATAL", clauseType: "Mandatory site visit", evidence: "Mandatory site visit held Oct 15, 2026 @ 10:00 AT" }]} />`,
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
