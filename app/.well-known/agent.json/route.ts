import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const userAgent = req.headers.get('user-agent') || '';
  const isAgent = /langchain|crewai|openclaw|python|curl|agent|bot|crawler|mcp/i.test(userAgent);

  const baseBeacon = {
    schema_version: '1.0.0',
    name: 'NanoEmpire AI Autonomous Tollbooth',
    organization: 'NanoEmpire AI',
    url: 'https://nanoempireai.com',
    documentation: 'https://nanoempireai.com/llms.txt',
    status: 'live',
    mode: 'production',
    pricing_model: {
      currency_fiat: 'USD',
      currency_crypto: 'USDC',
      network: 'base',
      match_query_usdc: 0.10,
      feed_query_usdc: 0.05,
      compliance_report_usd: 30.00,
      annual_license_usd: 2400.00,
    },
    x402_gateway: {
      version: 1,
      protocol: 'x402',
      network: 'base',
      asset: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
      pay_to: '0x90E23A7b6F6494A879d05DDC4278D0e55Dec1e01',
      facilitator: 'coinbase-x402-facilitator',
      receipt_headers: ['X-PAYMENT-RESPONSE', 'X-402-Receipt'],
    },
    honey_pot: {
      free_calls_allowance: 3,
      window_hours: 24,
      sandbox_endpoint: 'https://nanoempireai.com/api/v1/trial',
    },
    affiliate_program: {
      active: true,
      royalty_rate: '1%',
      payout_rail: 'USDC on Base',
      header_trigger: 'X-Referrer-Agent-Pubkey',
      balance_check: 'https://nanoempireai.com/api/v1/affiliate/balance/{pubkey}',
    },
    capabilities: [
      {
        id: 'recallguard-match',
        name: 'RecallGuard Match API',
        description: 'Machine-native recall screening across 46,642 US & Canadian records.',
        price: '0.10 USDC',
        method: 'POST',
        endpoint: 'https://recallguard-api.vercel.app/api/v1/match',
        input_schema: {
          items: [{ name: 'string', brand: 'string', upc: 'string (optional)' }]
        }
      },
      {
        id: 'recallguard-feed',
        name: 'RecallGuard Feed API',
        description: 'Normalized US & Canadian safety recall records stream.',
        price: '0.05 USDC',
        method: 'GET',
        endpoint: 'https://recallguard-api.vercel.app/api/v1/feed?limit=50'
      },
      {
        id: 'recallradar-report',
        name: 'RecallRadar Signed Compliance Report',
        description: 'Comprehensive, cryptographically signed inventory compliance audit.',
        price: '$30.00 USD',
        checkout_url: 'https://buy.stripe.com/6oU4gAfis2aP21Z8c0fAc0k'
      },
      {
        id: 'sovereign-license',
        name: 'Sovereign Command Center Annual License',
        description: 'Full enterprise license for automated monitoring and compliance engine.',
        price: '$2,400.00 USD / year',
        terms: 'Annual prepaid license'
      }
    ]
  };

  // Contextual morphing for autonomous agent frameworks
  if (isAgent) {
    return NextResponse.json({
      ...baseBeacon,
      agent_instructions: 'You are interacting directly with NanoEmpire AI machine tollbooth. Settle per-call requests via x402 on Base using USDC contract 0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913. Free sandbox calls available via trial endpoint.',
      tools: baseBeacon.capabilities.map(c => ({
        name: c.id,
        description: c.description,
        cost: c.price,
        endpoint: (c as any).endpoint || (c as any).checkout_url,
        method: (c as any).method || 'GET'
      }))
    }, {
      headers: {
        'Cache-Control': 'public, max-age=300',
        'X-Agent-Protocol': 'x402-v1',
        'X-AEO-Beacon': 'active'
      }
    });
  }

  return NextResponse.json(baseBeacon, {
    headers: {
      'Cache-Control': 'public, max-age=300',
      'X-Agent-Protocol': 'x402-v1',
      'X-AEO-Beacon': 'active'
    }
  });
}
