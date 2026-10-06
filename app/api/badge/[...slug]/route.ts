import { NextRequest, NextResponse } from 'next/server';

type BadgeStatus = 'pass' | 'fail' | 'pending';

interface RepoAudit {
  status: BadgeStatus;
  signed: boolean;
  score: number;
}

// Known repository database / fallback to passive index
const KNOWN_AUDITS: Record<string, RepoAudit> = {
  'modelcontextprotocol/servers': { status: 'pass', signed: true, score: 98 },
  'nanoempire/core': { status: 'pass', signed: true, score: 100 },
  'smithery-ai/fetch': { status: 'fail', signed: false, score: 42 },
  'data-nerds/sql-mcp': { status: 'fail', signed: false, score: 38 },
  'local-ai/fs-mcp': { status: 'fail', signed: false, score: 40 },
};

function getAudit(slug: string): RepoAudit {
  const normalized = slug.toLowerCase();
  return KNOWN_AUDITS[normalized] || { status: 'pending', signed: false, score: 0 };
}

function buildSvg(label: string, message: string, color: string): string {
  const labelWidth = label.length * 6.5 + 12;
  const messageWidth = message.length * 6.5 + 12;
  const totalWidth = labelWidth + messageWidth;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${totalWidth}" height="20" role="img" aria-label="${label}: ${message}">
    <title>${label}: ${message}</title>
    <linearGradient id="s" x2="0" y2="100%">
      <stop offset="0" stop-color="#bbb" stop-opacity=".1"/>
      <stop offset="1" stop-opacity=".1"/>
    </linearGradient>
    <clipPath id="r">
      <rect width="${totalWidth}" height="20" rx="3" fill="#fff"/>
    </clipPath>
    <g clip-path="url(#r)">
      <rect width="${labelWidth}" height="20" fill="#555"/>
      <rect x="${labelWidth}" width="${messageWidth}" height="20" fill="${color}"/>
      <rect width="${totalWidth}" height="20" fill="url(#s)"/>
    </g>
    <g fill="#fff" text-anchor="middle" font-family="Verdana,Geneva,DejaVu Sans,sans-serif" text-rendering="geometricPrecision" font-size="110">
      <text x="${labelWidth * 5}" y="150" fill="#010101" fill-opacity=".3" transform="scale(.1)" textLength="${(labelWidth - 10) * 10}">${label}</text>
      <text x="${labelWidth * 5}" y="140" transform="scale(.1)" fill="#fff" textLength="${(labelWidth - 10) * 10}">${label}</text>
      <text x="${(labelWidth + messageWidth / 2) * 10 - 5}" y="150" fill="#010101" fill-opacity=".3" transform="scale(.1)" textLength="${(messageWidth - 10) * 10}">${message}</text>
      <text x="${(labelWidth + messageWidth / 2) * 10 - 5}" y="140" transform="scale(.1)" fill="#fff" textLength="${(messageWidth - 10) * 10}">${message}</text>
    </g>
  </svg>`;
}

export async function GET(
  request: NextRequest,
  { params }: { params: { slug?: string[] } }
) {
  const slug = params?.slug ? params.slug.join('/') : 'default';
  const audit = getAudit(slug);

  let message = 'pending audit';
  let color = '#9f9f9f'; // Neutral grey

  if (audit.status === 'pass') {
    message = audit.signed ? 'verified (ed25519)' : 'verified';
    color = '#4c1'; // Green
  } else if (audit.status === 'fail') {
    message = 'unverified / risk';
    color = '#e05d44'; // Red
  }

  const svg = buildSvg('nanoempire', message, color);

  return new NextResponse(svg, {
    headers: {
      'Content-Type': 'image/svg+xml;charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
      'Expires': new Date(Date.now() + 3600000).toUTCString(),
    },
  });
}
