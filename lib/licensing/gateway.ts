/**
 * Licensing API Gateway — Authentication, Rate Limiting, and Proxy
 * Protects all licensed data endpoints
 */

import { NextRequest, NextResponse } from 'next/server';
import { licenseManager, LicenseValidationResult } from './manager';
import { usageTracker, UsageEvent } from './usage';

export interface LicensedRequest extends NextRequest {
  license?: LicenseValidationResult['license'];
  tier?: LicenseValidationResult['tier'];
}

export function createLicenseMiddleware() {
  return async function licenseAuth(
    request: NextRequest,
    context: { params?: Promise<Record<string, string>> }
  ): Promise<NextResponse | LicensedRequest> {
    const startTime = Date.now();
    
    // Extract API key from Authorization header
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Missing or invalid Authorization header. Use: Bearer sk_live_...' },
        { status: 401 }
      );
    }

    const apiKey = authHeader.substring(7); // Remove 'Bearer '
    const validation = await licenseManager.validateApiKey(apiKey);
    
    if (!validation.valid) {
      const statusCode = validation.error?.includes('rate limit') ? 429 : 401;
      return NextResponse.json(
        { error: validation.error },
        { 
          status: statusCode,
          headers: validation.rateLimitInfo ? {
            'X-RateLimit-Limit': validation.rateLimitInfo.limit.toString(),
            'X-RateLimit-Remaining': validation.rateLimitInfo.remaining.toString(),
            'X-RateLimit-Reset': validation.rateLimitInfo.resetAt,
          } : {},
        }
      );
    }

    // Attach license info to request for downstream use
    const licensedRequest = request as LicensedRequest;
    licensedRequest.license = validation.license!;
    licensedRequest.tier = validation.tier!;

    // Add rate limit headers to successful responses
    const response = NextResponse.next();
    if (validation.rateLimitInfo) {
      response.headers.set('X-RateLimit-Limit', validation.rateLimitInfo.limit.toString());
      response.headers.set('X-RateLimit-Remaining', validation.rateLimitInfo.remaining.toString());
      response.headers.set('X-RateLimit-Reset', validation.rateLimitInfo.resetAt);
    }
    response.headers.set('X-License-Tier', validation.license!.tierId);
    response.headers.set('X-License-ID', validation.license!.id);

    // Record usage asynchronously
    const latencyMs = Date.now() - startTime;
    usageTracker.record({
      timestamp: new Date().toISOString(),
      licenseId: validation.license!.id,
      endpoint: request.nextUrl.pathname,
      method: request.method,
      statusCode: 200, // Will be updated by actual handler
      latencyMs,
      requestSize: parseInt(request.headers.get('content-length') || '0', 10),
      responseSize: 0, // Will be updated
      userAgent: request.headers.get('user-agent') || undefined,
      ip: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || undefined,
    });

    return licensedRequest;
  };
}

export function createRateLimitHeaders(validation: LicenseValidationResult): Record<string, string> {
  const headers: Record<string, string> = {};
  if (validation.rateLimitInfo) {
    headers['X-RateLimit-Limit'] = validation.rateLimitInfo.limit.toString();
    headers['X-RateLimit-Remaining'] = validation.rateLimitInfo.remaining.toString();
    headers['X-RateLimit-Reset'] = validation.rateLimitInfo.resetAt;
  }
  if (validation.license) {
    headers['X-License-Tier'] = validation.license.tierId;
    headers['X-License-ID'] = validation.license.id;
  }
  return headers;
}

export function createLicenseErrorResponse(
  error: string,
  statusCode: number = 401,
  rateLimitInfo?: LicenseValidationResult['rateLimitInfo']
): NextResponse {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (rateLimitInfo) {
    headers['X-RateLimit-Limit'] = rateLimitInfo.limit.toString();
    headers['X-RateLimit-Remaining'] = rateLimitInfo.remaining.toString();
    headers['X-RateLimit-Reset'] = rateLimitInfo.resetAt;
    headers['Retry-After'] = Math.ceil(
      (new Date(rateLimitInfo.resetAt).getTime() - Date.now()) / 1000
    ).toString();
  }
  return NextResponse.json({ error }, { status: statusCode, headers });
}

// Product access control
export function checkProductAccess(tier: LicenseValidationResult['tier'], product: string): boolean {
  if (!tier) return false;
  return tier.products.includes(product) || tier.products.includes('*');
}

export function getPermittedProducts(tier: LicenseValidationResult['tier']): string[] {
  if (!tier) return [];
  return tier.products;
}

export function getAllowedFormats(tier: LicenseValidationResult['tier']): ('json' | 'csv' | 'parquet')[] {
  if (!tier) return ['json'];
  return tier.formats;
}

// Data product routing
export const LICENSED_PRODUCTS = {
  'recallradar-core': {
    paths: ['/api/licensing/data/recalls', '/api/licensing/data/recalls/'],
    methods: ['GET'],
  },
  'recallradar-delta': {
    paths: ['/api/licensing/data/recalls/delta', '/api/licensing/data/recalls/delta/'],
    methods: ['GET'],
  },
  'skillproof-index': {
    paths: ['/api/licensing/data/skillproof', '/api/licensing/data/skillproof/'],
    methods: ['GET'],
  },
  'bidshield-tenders': {
    paths: ['/api/licensing/data/tenders', '/api/licensing/data/tenders/'],
    methods: ['GET'],
  },
};

export function getProductForPath(pathname: string): string | null {
  for (const [product, config] of Object.entries(LICENSED_PRODUCTS)) {
    for (const path of config.paths) {
      if (pathname.startsWith(path)) {
        return product;
      }
    }
  }
  return null;
}