import { NextRequest, NextResponse } from 'next/server';
import preauditsData from '@/public/skillproof/preaudits.json';

type BadgeStatus = 'pass' | 'warn' | 'fail' | 'pending';

interface RepoAudit {
  status: BadgeStatus;
  signed: boolean;
  score: number;
}

const KNOWN_AUDITS: Record<string, RepoAudit> = {
  'modelcontextprotocol/servers': { status: 'pass', signed: true, score: 98 },
  'nanoempire/core': { status: 'pass', signed: true, score: 100 },
};

function getAudit(slug: string): RepoAudit {
  const normalized = slug.toLowerCase();
  if (KNOWN_AUDITS[normalized]) {
    return KNOWN_AUDITS[normalized];
  }
  const found = (preauditsData?.audits || []).find(
    (a) => a.repo.toLowerCase() === normalized
  );
  if (found) {
    const score = found.skillproof_score;
    const status: BadgeStatus = score >= 90 ? 'pass' : score >= 75 ? 'warn' : 'fail';
    return { status, signed: false, score };
  }
  return { status: 'pending', signed: false, score: 0 };
}

function buildSvg(label: string, message: string, color: string): string {
  const labelWidth = Math.round(label.length * 6.5 + 14);
  const messageWidth = Math.round(message.length * 6.5 + 14);
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
      <rect width="${labelWidth}" height="20" fill="#1e2433"/>
      <rect x="${labelWidth}" width="${messageWidth}" height="20" fill="${color}"/>
      <rect width="${totalWidth}" height="20" fill="url(#s)"/>
    </g>
    <g fill="#fff" text-anchor="middle" font-family="Verdana,Geneva,DejaVu Sans,sans-serif" text-rendering="geometricPrecision" font-size="110">
      <text x="${labelWidth * 5}" y="150" fill="#010101" fill-opacity=".3" transform="scale(.1)">${label}</text>
      <text x="${labelWidth * 5}" y="140" transform="scale(.1)" fill="#fff">${label}</text>
      <text x="${(labelWidth + messageWidth / 2) * 10}" y="150" fill="#010101" fill-opacity=".3" transform="scale(.1)">${message}</text>
      <text x="${(labelWidth + messageWidth / 2) * 10}" y="140" transform="scale(.1)" fill="#fff">${message}</text>
    </g>
  </svg>`;
}

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ slug?: string[] }> | { slug?: string[] } }
) {
  const resolvedParams = await Promise.resolve(context.params);
  const slug = resolvedParams?.slug ? resolvedParams.slug.join('/') : 'default';
  const audit = getAudit(slug);

  let message = 'pending audit';
  let color = '#6b7280';

  if (audit.status === 'pass') {
    message = audit.signed ? `${audit.score}/100 verified (ed25519)` : `${audit.score}/100 pre-audited`;
    color = '#10b981';
  } else if (audit.status === 'warn') {
    message = `${audit.score}/100 pre-audited`;
    color = '#f59e0b';
  } else if (audit.status === 'fail') {
    message = `${audit.score}/100 risk flagged`;
    color = '#ef4444';
  }

  const svg = buildSvg('SkillProof', message, color);

  return new NextResponse(svg, {
    headers: {
      'Content-Type': 'image/svg+xml;charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}
