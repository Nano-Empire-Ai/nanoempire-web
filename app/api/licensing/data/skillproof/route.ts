/**
 * Licensed Data API — SkillProof MCP Index
 * Serves 25+ pre-audited MCP repository security findings
 */

import { NextRequest, NextResponse } from 'next/server';
import { licenseManager } from '@/lib/licensing/manager';
import { usageTracker } from '@/lib/licensing/usage';
import { createLicenseMiddleware, checkProductAccess, getAllowedFormats } from '@/lib/licensing/gateway';

const middleware = createLicenseMiddleware();

export async function GET(request: NextRequest) {
  const authResult = await middleware(request);
  if (authResult instanceof NextResponse) {
    return authResult;
  }

  const licensedRequest = authResult as any;
  const license = licensedRequest.license;
  const tier = licensedRequest.tier;

  if (!checkProductAccess(tier, 'skillproof-index')) {
    return NextResponse.json(
      { error: 'This license does not include access to SkillProof MCP Index' },
      { status: 403 }
    );
  }

  const allowedFormats = getAllowedFormats(tier);
  const startTime = Date.now();

  try {
    const { searchParams } = new URL(request.url);
    const format = searchParams.get('format') || 'json';
    const limit = Math.min(parseInt(searchParams.get('limit') || '50', 10), 100);
    const offset = parseInt(searchParams.get('offset') || '0', 10);
    const minScore = parseInt(searchParams.get('min_score') || '0', 10);
    const maxScore = parseInt(searchParams.get('max_score') || '100', 10);
    const hasCritical = searchParams.get('has_critical') === 'true';
    const repo = searchParams.get('repo');

    if (!allowedFormats.includes(format as any)) {
      return NextResponse.json(
        { error: `Format '${format}' not allowed. Allowed: ${allowedFormats.join(', ')}` },
        { status: 400 }
      );
    }

    const audits = await loadSkillProofAudits({
      minScore,
      maxScore,
      hasCritical,
      repo,
      limit,
      offset,
    });

    await licenseManager.recordEndpointUsage(
      request.headers.get('authorization')?.substring(7) || '',
      request.nextUrl.pathname
    );

    usageTracker.record({
      timestamp: new Date().toISOString(),
      licenseId: license.id,
      endpoint: request.nextUrl.pathname,
      method: 'GET',
      statusCode: 200,
      latencyMs: Date.now() - startTime,
      requestSize: 0,
      responseSize: 0,
    });

    if (format === 'csv') {
      return generateCSVResponse(audits);
    }

    return NextResponse.json({
      data: audits,
      meta: {
        total: audits.length,
        limit,
        offset,
        format,
        license: { tier: license.tierId, licenseId: license.id },
      },
    }, {
      headers: {
        'X-RateLimit-Limit': tier.rateLimit.requests.toString(),
        'X-RateLimit-Remaining': Math.max(0, tier.rateLimit.requests - license.usage.requestsToday).toString(),
        'X-License-Tier': license.tierId,
        'X-License-ID': license.id,
      },
    });

  } catch (error: any) {
    console.error('SkillProof API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

async function loadSkillProofAudits(filters: any): Promise<any[]> {
  // In production, load from preaudits.json or database
  const mockAudits = [
    {
      repo: 'pydantic/pydantic-ai',
      stars: 21014,
      tree_sha: '5616c21994d4',
      license: 'MIT',
      skillproof_score: 86,
      governance_gaps: ['Missing `SECURITY.md` vulnerability disclosure policy'],
      code_surface_findings: [
        {
          id: 'ENV_SECRET_EXPOSURE',
          severity: 'MEDIUM',
          title: 'Sensitive Credential / Full-Env Access',
          file: '.github/set_docs_main_preview_url.py',
          line: 9,
          snippet: "GITHUB_TOKEN = os.environ['GITHUB_TOKEN']",
        },
      ],
      preaudit_id: 'SP-2CFCA711F2847151',
      audited_at: '2026-11-03',
    },
    {
      repo: 'modelcontextprotocol/inspector',
      stars: 11220,
      tree_sha: 'e3217388c859',
      license: 'NOASSERTION',
      skillproof_score: 98,
      governance_gaps: [],
      code_surface_findings: [],
      preaudit_id: 'SP-F0B754A4F044E235',
      audited_at: '2026-11-03',
    },
    // ... 23 more audits
  ];

  let filtered = mockAudits;

  if (filters.repo) {
    filtered = filtered.filter(a => a.repo === filters.repo);
  }
  if (filters.minScore > 0) {
    filtered = filtered.filter(a => a.skillproof_score >= filters.minScore);
  }
  if (filters.maxScore < 100) {
    filtered = filtered.filter(a => a.skillproof_score <= filters.maxScore);
  }
  if (filters.hasCritical) {
    filtered = filtered.filter(a => 
      a.code_surface_findings?.some((f: any) => f.severity === 'HIGH')
    );
  }

  const start = filters.offset || 0;
  const end = start + (filters.limit || 50);
  return filtered.slice(start, end);
}

function generateCSVResponse(data: any[]): NextResponse {
  if (data.length === 0) return new NextResponse('', { status: 200 });

  const headers = ['repo', 'stars', 'tree_sha', 'license', 'skillproof_score', 'governance_gaps', 'finding_count', 'preaudit_id', 'audited_at'];
  const csvRows = [
    headers.join(','),
    ...data.map(row => 
      headers.map(h => {
        const val = row[h];
        if (val === null || val === undefined) return '';
        if (typeof val === 'object') return JSON.stringify(val).replace(/"/g, '""');
        return String(val).replace(/"/g, '""');
      }).map(v => `"${v}"`).join(',')
    )
  ];

  return new NextResponse(csvRows.join('\n'), {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="skillproof_audits_${new Date().toISOString().split('T')[0]}.csv"`,
    },
  });
}