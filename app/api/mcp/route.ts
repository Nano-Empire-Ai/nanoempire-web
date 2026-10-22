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
      'Returns pricing and endpoint details for full wholesale/liquidation manifest audits (15 U.S.C. § 2068 supplier refund certificates).',
    inputSchema: {
      type: 'object',
      properties: {},
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
                    statute: '15 U.S.C. § 2068 (Prohibition on sale of recalled or unilaterally flagged consumer products)',
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
