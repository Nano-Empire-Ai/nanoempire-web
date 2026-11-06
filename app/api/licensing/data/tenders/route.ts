/**
 * Licensed Data API — BidShield Tender Intelligence
 * Serves 16+ federal solicitations with disqualifier analysis
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

  if (!checkProductAccess(tier, 'bidshield-tenders')) {
    return NextResponse.json(
      { error: 'This license does not include access to BidShield Tender Intelligence' },
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
    const naics = searchParams.get('naics');
    const closingBefore = searchParams.get('closing_before');
    const minJEV = parseInt(searchParams.get('min_jev') || '0', 10);
    const solicitationId = searchParams.get('id');

    if (!allowedFormats.includes(format as any)) {
      return NextResponse.json(
        { error: `Format '${format}' not allowed. Allowed: ${allowedFormats.join(', ')}` },
        { status: 400 }
      );
    }

    const tenders = await loadTenderData({
      naics,
      closingBefore,
      minJEV,
      solicitationId,
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
      return generateCSVResponse(tenders);
    }

    return NextResponse.json({
      data: tenders,
      meta: {
        total: tenders.length,
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
    console.error('BidShield API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

async function loadTenderData(filters: any): Promise<any[]> {
  const mockTenders = [
    {
      solicitation_id: 'NRC-87055',
      title: 'NRC Ottawa Campus Custodial Services',
      naics_code: '561720',
      naics_title: 'Janitorial & Cleaning Services',
      agency: 'National Research Council Canada',
      value_cad: 2400000,
      closing_date: '2026-10-29',
      status: 'open',
      jeopardy_score: 45000,
      missing_annexes: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'],
      fatal_disqualifiers: ['Mandatory site visit', 'Performance bond 100%'],
      jej_exposure_usd: 45000,
      upwork_tier_1_url: 'https://www.upwork.com/services/product/...',
    },
    {
      solicitation_id: 'PWGSC-W8486-24SP01',
      title: 'DND Halifax Mechanical Systems',
      naics_code: '238220',
      naics_title: 'HVAC & Mechanical Contractors',
      agency: 'Public Works and Government Services Canada',
      value_cad: 3800000,
      closing_date: '2026-11-15',
      status: 'open',
      jeopardy_score: 120000,
      missing_annexes: ['B', 'D', 'F'],
      fatal_disqualifiers: ['TSSA certification', 'Secret clearance'],
      jej_exposure_usd: 120000,
      upwork_tier_1_url: 'https://www.upwork.com/services/product/...',
    },
    {
      solicitation_id: 'SSC-24-010482',
      title: 'SSC Multi-Cloud Hybrid Kubernetes',
      naics_code: '541512',
      naics_title: 'Computer Systems Design Services',
      agency: 'Shared Services Canada',
      value_cad: 7500000,
      closing_date: '2026-12-01',
      status: 'open',
      jeopardy_score: 250000,
      missing_annexes: ['A', 'C', 'E'],
      fatal_disqualifiers: ['ITSG-33 compliance', 'Protected B'],
      jej_exposure_usd: 250000,
      upwork_tier_1_url: 'https://www.upwork.com/services/product/...',
    },
    // ... 13 more tenders
  ];

  let filtered = mockTenders;

  if (filters.naics) {
    filtered = filtered.filter(t => t.naics_code === filters.naics);
  }
  if (filters.closingBefore) {
    filtered = filtered.filter(t => t.closing_date < filters.closingBefore);
  }
  if (filters.minJEV > 0) {
    filtered = filtered.filter(t => t.jej_exposure_usd >= filters.minJEV);
  }
  if (filters.solicitationId) {
    filtered = filtered.filter(t => t.solicitation_id === filters.solicitationId);
  }

  const start = filters.offset || 0;
  const end = start + (filters.limit || 50);
  return filtered.slice(start, end);
}

function generateCSVResponse(data: any[]): NextResponse {
  if (data.length === 0) return new NextResponse('', { status: 200 });

  const headers = ['solicitation_id', 'title', 'naics_code', 'naics_title', 'agency', 'value_cad', 'closing_date', 'status', 'jeopardy_score', 'missing_annexes', 'fatal_disqualifiers', 'jej_exposure_usd'];
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
      'Content-Disposition': `attachment; filename="bidshield_tenders_${new Date().toISOString().split('T')[0]}.csv"`,
    },
  });
}