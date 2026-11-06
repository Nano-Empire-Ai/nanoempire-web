import { NextRequest, NextResponse } from 'next/server';
import preauditsData from '@/public/skillproof/preaudits.json';

type BadgeStatus = 'pass' | 'warn' | 'fail' | 'pending';

interface RepoAudit {
  status: BadgeStatus;
  signed: boolean;
  score: number;
  grade: string;
  rank?: number;
}

const KNOWN_AUDITS: Record<string, RepoAudit> = {
  'modelcontextprotocol/servers': { status: 'pass', signed: true, score: 98, grade: 'A+', rank: 1 },
  'nanoempire/core': { status: 'pass', signed: true, score: 100, grade: 'A+', rank: 1 },
};

function computeGrade(score: number): string {
  if (score >= 95) return 'A+';
  if (score >= 85) return 'A';
  if (score >= 75) return 'B';
  return 'C';
}

function getAudit(rawSlug: string): RepoAudit {
  const normalized = rawSlug.replace(/\.svg$/i, '').toLowerCase();
  if (KNOWN_AUDITS[normalized]) {
    return KNOWN_AUDITS[normalized];
  }

  const audits = (preauditsData?.audits || []).slice().sort((a: any, b: any) => {
    if (b.skillproof_score !== a.skillproof_score) return b.skillproof_score - a.skillproof_score;
    return (b.stars || 0) - (a.stars || 0);
  });

  const idx = audits.findIndex((a: any) => a.repo.toLowerCase() === normalized);
  if (idx !== -1) {
    const found = audits[idx];
    const score = found.skillproof_score;
    const status: BadgeStatus = score >= 85 ? 'pass' : score >= 75 ? 'warn' : 'fail';
    return {
      status,
      signed: false,
      score,
      grade: computeGrade(score),
      rank: idx + 1,
    };
  }
  return { status: 'pending', signed: false, score: 0, grade: 'N/A' };
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
      <rect width="${labelWidth}" height="20" fill="#0f1423"/>
      <rect x="${labelWidth}" width="${messageWidth}" height="20" fill="${color}"/>
      <rect width="${totalWidth}" height="20" fill="url(#s)"/>
    </g>
    <g fill="#fff" text-anchor="middle" font-family="Verdana,Geneva,DejaVu Sans,sans-serif" text-rendering="geometricPrecision" font-size="110">
      <text x="${labelWidth * 5}" y="150" fill="#010101" fill-opacity=".3" transform="scale(.1)">${label}</text>
      <text x="${labelWidth * 5}" y="140" transform="scale(.1)" fill="#00B5E2">${label}</text>
      <text x="${(labelWidth + messageWidth / 2) * 10}" y="150" fill="#010101" fill-opacity=".3" transform="scale(.1)">${message}</text>
      <text x="${(labelWidth + messageWidth / 2) * 10}" y="140" transform="scale(.1)" fill="#fff">${message}</text>
    </g>
  </svg>`;
}

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ slug?: string[] }> | { slug?: string[] } }
) {
  const resolvedParams = await Promise.resolve(context.params);
  const slug = resolvedParams?.slug ? resolvedParams.slug.join('/') : 'default';
  const style = request.nextUrl.searchParams.get('style') || 'default';
  const audit = getAudit(slug);

  let label = style === 'benchmark' ? 'MSHB-2026' : 'SkillProof';
  let message = 'pending audit';
  let color = '#6b7280';

  if (audit.status === 'pass') {
    message =
      style === 'benchmark' && audit.rank
        ? `#${audit.rank} · ${audit.score}/100 (${audit.grade})`
        : audit.signed
          ? `${audit.score}/100 verified (${audit.grade})`
          : `${audit.score}/100 (${audit.grade})`;
    color = '#059669';
  } else if (audit.status === 'warn') {
    message = `${audit.score}/100 (${audit.grade})`;
    color = '#d97706';
  } else if (audit.status === 'fail') {
    message = `${audit.score}/100 risk flagged`;
    color = '#dc2626';
  }

  const svg = buildSvg(label, message, color);

  return new NextResponse(svg, {
    headers: {
      'Content-Type': 'image/svg+xml;charset=utf-8',
      'Cache-Control': 'public, max-age=1800, s-maxage=1800',
    },
  });
}
