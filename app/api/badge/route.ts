import { NextRequest, NextResponse } from 'next/server';

function createBadgeSvg(label: string, status: string, color: string) {
  const labelWidth = Math.max(label.length * 7 + 12, 60);
  const statusWidth = Math.max(status.length * 7 + 12, 60);
  const totalWidth = labelWidth + statusWidth;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${totalWidth}" height="20" role="img" aria-label="${label}: ${status}">
  <title>${label}: ${status}</title>
  <linearGradient id="s" x2="0" y2="100%">
    <stop offset="0" stop-color="#bbb" stop-opacity=".1"/>
    <stop offset="1" stop-opacity=".1"/>
  </linearGradient>
  <clipPath id="r">
    <rect width="${totalWidth}" height="20" rx="3" fill="#fff"/>
  </clipPath>
  <g clip-path="url(#r)">
    <rect width="${labelWidth}" height="20" fill="#1e293b"/>
    <rect x="${labelWidth}" width="${statusWidth}" height="20" fill="${color}"/>
    <rect width="${totalWidth}" height="20" fill="url(#s)"/>
  </g>
  <g fill="#fff" text-anchor="middle" font-family="Verdana,Geneva,DejaVu Sans,sans-serif" text-rendering="geometricPrecision" font-size="110">
    <text aria-hidden="true" x="${(labelWidth * 10) / 2}" y="150" fill="#010101" fill-opacity=".3" transform="scale(.1)" textLength="${(labelWidth - 12) * 10}">${label}</text>
    <text x="${(labelWidth * 10) / 2}" y="140" transform="scale(.1)" fill="#fff" textLength="${(labelWidth - 12) * 10}">${label}</text>
    <text aria-hidden="true" x="${labelWidth * 10 + (statusWidth * 10) / 2}" y="150" fill="#010101" fill-opacity=".3" transform="scale(.1)" textLength="${(statusWidth - 12) * 10}">${status}</text>
    <text x="${labelWidth * 10 + (statusWidth * 10) / 2}" y="140" transform="scale(.1)" fill="#fff" textLength="${(statusWidth - 12) * 10}">${status}</text>
  </g>
</svg>`;
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const grade = searchParams.get('grade') || 'A';
  const label = searchParams.get('label') || 'NanoEmpire';

  let status = 'Verified';
  let color = '#10b981'; // Green

  if (grade.toUpperCase().startsWith('B')) {
    status = 'Grade B';
    color = '#f59e0b'; // Amber
  } else if (grade.toUpperCase().startsWith('F') || grade.toUpperCase().includes('FAIL')) {
    status = 'Unverified';
    color = '#ef4444'; // Red
  } else if (grade.toUpperCase() === 'PASS') {
    status = 'Signed Manifest';
    color = '#3b82f6'; // Blue
  }

  const svg = createBadgeSvg(label, status, color);

  return new NextResponse(svg, {
    status: 200,
    headers: {
      'Content-Type': 'image/svg+xml;charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=86400',
    },
  });
}
