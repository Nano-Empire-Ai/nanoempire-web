import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    mcpVersion: '2024-11-05',
    name: 'RecallRadar by Nano Empire AI',
    description:
      'Real-time CPSC, FDA, and Unilateral Safety Warning product recall verification for shopping agents, marketplaces, and pallet liquidators.',
    serverUrl: 'https://www.nanoempireai.com/api/mcp',
    transport: 'streamable-http',
    authentication: 'none',
    pricing: {
      freeTier: 'Interactive product lookups & 3-item manifest preview',
      x402FeedUsd: 0.05,
      x402MatchUsd: 0.10,
      fullManifestCertificateUsd: 30.0,
      commandCenterYearlyUsd: 2400.0,
    },
    documentationUrl: 'https://www.nanoempireai.com/recall-report',
    contactEmail: 'rob@nanoempireai.com',
  });
}
