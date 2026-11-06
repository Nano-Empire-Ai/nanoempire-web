/**
 * License Manager — Core licensing logic for Enterprise Data Products
 * Handles provisioning, validation, revocation, and tier enforcement
 */

import { createHash, randomBytes, createHmac } from 'crypto';

export interface LicenseTier {
  id: string;
  name: string;
  priceUsd: number;
  interval: 'year' | 'month';
  products: string[];
  rateLimit: { requests: number; window: 'hour' | 'day' };
  formats: ('json' | 'csv' | 'parquet')[];
  support: 'email' | 'priority' | 'dedicated';
  sla: string;
}

export const LICENSE_TIERS: Record<string, LicenseTier> = {
  'recallradar-core': {
    id: 'recallradar-core',
    name: 'RecallRadar Core License',
    priceUsd: 2400,
    interval: 'year',
    products: ['recallradar-core'],
    rateLimit: { requests: 10000, window: 'day' },
    formats: ['json', 'csv'],
    support: 'email',
    sla: '99.5% uptime, 24h response',
  },
  'skillproof-index': {
    id: 'skillproof-index',
    name: 'SkillProof MCP Index License',
    priceUsd: 1200,
    interval: 'year',
    products: ['skillproof-index'],
    rateLimit: { requests: 5000, window: 'day' },
    formats: ['json'],
    support: 'email',
    sla: '99.5% uptime, 24h response',
  },
  'bidshield-tenders': {
    id: 'bidshield-tenders',
    name: 'BidShield Tender Intelligence License',
    priceUsd: 1200,
    interval: 'year',
    products: ['bidshield-tenders'],
    rateLimit: { requests: 5000, window: 'day' },
    formats: ['json'],
    support: 'email',
    sla: '99.5% uptime, 24h response',
  },
  'enterprise-bundle': {
    id: 'enterprise-bundle',
    name: 'Enterprise Data Bundle',
    priceUsd: 5000,
    interval: 'year',
    products: ['recallradar-core', 'recallradar-delta', 'skillproof-index', 'bidshield-tenders'],
    rateLimit: { requests: 100000, window: 'day' },
    formats: ['json', 'csv', 'parquet'],
    support: 'priority',
    sla: '99.9% uptime, 4h response, dedicated Slack',
  },
  'recallradar-delta-addon': {
    id: 'recallradar-delta-addon',
    name: 'RecallRadar Delta Feed (Add-on)',
    priceUsd: 500,
    interval: 'month',
    products: ['recallradar-delta'],
    rateLimit: { requests: 50000, window: 'day' },
    formats: ['json'],
    support: 'email',
    sla: 'Hourly freshness guarantee',
  },
};

export interface License {
  id: string;
  apiKey: string;
  apiKeyHash: string;
  tierId: string;
  customerEmail: string;
  stripeCustomerId: string;
  stripeSubscriptionId: string;
  status: 'active' | 'past_due' | 'canceled' | 'trialing';
  createdAt: string;
  expiresAt: string;
  lastUsedAt: string | null;
  usage: LicenseUsage;
}

export interface LicenseUsage {
  requestsToday: number;
  requestsThisHour: number;
  lastRequestAt: string | null;
  totalRequests: number;
  endpoints: Record<string, number>;
}

export interface LicenseValidationResult {
  valid: boolean;
  license?: License;
  tier?: LicenseTier;
  error?: string;
  rateLimitInfo?: {
    limit: number;
    remaining: number;
    resetAt: string;
  };
}

class LicenseManager {
  private licenses: Map<string, License> = new Map();
  private apiKeyIndex: Map<string, string> = new Map(); // hash -> licenseId

  constructor() {
    // In production, load from persistent storage (DB/Redis)
    this.loadFromStorage();
  }

  private loadFromStorage() {
    // TODO: Implement persistent storage loading
    // For now, start empty
  }

  private saveToStorage() {
    // TODO: Implement persistent storage saving
  }

  private getHmacSecret(): string {
    return process.env.STRIPE_WEBHOOK_SECRET || process.env.STRIPE_SECRET_KEY || 'nano_signing_secret_2026';
  }

  generateApiKey(tierId?: string, email?: string, expiresAt?: Date, licenseId?: string): string {
    if (tierId && email && expiresAt) {
      const payload = {
        id: licenseId || `lic_${randomBytes(8).toString('base64url')}`,
        t: tierId,
        e: email,
        exp: Math.floor(expiresAt.getTime() / 1000),
        iat: Math.floor(Date.now() / 1000),
      };
      const payloadB64 = Buffer.from(JSON.stringify(payload)).toString('base64url');
      const sig = createHmac('sha256', this.getHmacSecret()).update(payloadB64).digest('base64url');
      return `sk_live_${payloadB64}.${sig}`;
    }
    const prefix = 'sk_live_';
    const entropy = randomBytes(24).toString('base64url');
    return `${prefix}${entropy}`;
  }

  hashApiKey(apiKey: string): string {
    return createHash('sha256').update(apiKey).digest('hex');
  }

  async provisionLicense(
    tierId: string,
    customerEmail: string,
    stripeCustomerId: string,
    stripeSubscriptionId: string
  ): Promise<{ license: License; apiKey: string }> {
    const tier = LICENSE_TIERS[tierId];
    if (!tier) {
      throw new Error(`Invalid tier: ${tierId}`);
    }

    const now = new Date();
    const expiresAt = new Date(now);
    
    if (tier.interval === 'year') {
      expiresAt.setFullYear(expiresAt.getFullYear() + 1);
    } else {
      expiresAt.setMonth(expiresAt.getMonth() + 1);
    }

    const licenseId = `lic_${randomBytes(12).toString('base64url')}`;
    const apiKey = this.generateApiKey(tierId, customerEmail, expiresAt, licenseId);
    const apiKeyHash = this.hashApiKey(apiKey);

    const license: License = {
      id: licenseId,
      apiKey,
      apiKeyHash,
      tierId,
      customerEmail,
      stripeCustomerId,
      stripeSubscriptionId,
      status: 'active',
      createdAt: now.toISOString(),
      expiresAt: expiresAt.toISOString(),
      lastUsedAt: null,
      usage: {
        requestsToday: 0,
        requestsThisHour: 0,
        lastRequestAt: null,
        totalRequests: 0,
        endpoints: {},
      },
    };

    this.licenses.set(license.id, license);
    this.apiKeyIndex.set(apiKeyHash, license.id);
    this.saveToStorage();

    return { license, apiKey };
  }

  async validateApiKey(apiKey: string): Promise<LicenseValidationResult> {
    // 1. Verify stateless cryptographically signed API token (survives cold starts and serverless boundaries)
    if (apiKey.startsWith('sk_live_') && apiKey.includes('.')) {
      try {
        const raw = apiKey.replace('sk_live_', '');
        const [payloadB64, sig] = raw.split('.');
        const expectedSig = createHmac('sha256', this.getHmacSecret()).update(payloadB64).digest('base64url');
        if (sig === expectedSig) {
          const payload = JSON.parse(Buffer.from(payloadB64, 'base64url').toString('utf-8'));
          const nowSeconds = Math.floor(Date.now() / 1000);
          if (payload.exp && payload.exp < nowSeconds) {
            return { valid: false, error: 'License expired' };
          }
          const tier = LICENSE_TIERS[payload.t];
          if (!tier) {
            return { valid: false, error: 'Invalid tier configuration' };
          }
          const license: License = {
            id: payload.id || `lic_${payloadB64.substring(0, 10)}`,
            apiKey,
            apiKeyHash: this.hashApiKey(apiKey),
            tierId: payload.t,
            customerEmail: payload.e || '',
            stripeCustomerId: '',
            stripeSubscriptionId: '',
            status: 'active',
            createdAt: new Date((payload.iat || nowSeconds) * 1000).toISOString(),
            expiresAt: new Date(payload.exp * 1000).toISOString(),
            lastUsedAt: new Date().toISOString(),
            usage: {
              requestsToday: 1,
              requestsThisHour: 1,
              lastRequestAt: new Date().toISOString(),
              totalRequests: 1,
              endpoints: {},
            },
          };
          return {
            valid: true,
            license,
            tier,
            rateLimitInfo: {
              limit: tier.rateLimit.requests,
              remaining: tier.rateLimit.requests - 1,
              resetAt: new Date(Date.now() + 3600000).toISOString(),
            },
          };
        }
      } catch {
        // Fall back to in-memory index
      }
    }

    const hash = this.hashApiKey(apiKey);
    const licenseId = this.apiKeyIndex.get(hash);
    
    if (!licenseId) {
      return { valid: false, error: 'Invalid API key' };
    }

    const license = this.licenses.get(licenseId);
    if (!license) {
      return { valid: false, error: 'License not found' };
    }

    if (license.status !== 'active') {
      return { valid: false, error: `License ${license.status}` };
    }

    if (new Date(license.expiresAt) < new Date()) {
      license.status = 'canceled';
      this.saveToStorage();
      return { valid: false, error: 'License expired' };
    }

    const tier = LICENSE_TIERS[license.tierId];
    if (!tier) {
      return { valid: false, error: 'Invalid tier configuration' };
    }

    // Check rate limits
    const now = new Date();
    const todayStart = new Date(now);
    todayStart.setHours(0, 0, 0, 0);
    const hourStart = new Date(now);
    hourStart.setMinutes(0, 0, 0);

    // Reset daily counter if new day
    if (license.usage.lastRequestAt) {
      const lastReq = new Date(license.usage.lastRequestAt);
      if (lastReq < todayStart) {
        license.usage.requestsToday = 0;
      }
      if (lastReq < hourStart) {
        license.usage.requestsThisHour = 0;
      }
    }

    const dailyLimit = tier.rateLimit.window === 'day' 
      ? tier.rateLimit.requests 
      : tier.rateLimit.requests * 24;
    const hourlyLimit = tier.rateLimit.window === 'hour'
      ? tier.rateLimit.requests
      : Math.ceil(tier.rateLimit.requests / 24);

    if (license.usage.requestsToday >= dailyLimit) {
      return {
        valid: false,
        error: 'Daily rate limit exceeded',
        rateLimitInfo: {
          limit: dailyLimit,
          remaining: 0,
          resetAt: new Date(todayStart.getTime() + 24 * 60 * 60 * 1000).toISOString(),
        },
      };
    }

    if (license.usage.requestsThisHour >= hourlyLimit) {
      return {
        valid: false,
        error: 'Hourly rate limit exceeded',
        rateLimitInfo: {
          limit: hourlyLimit,
          remaining: 0,
          resetAt: new Date(hourStart.getTime() + 60 * 60 * 1000).toISOString(),
        },
      };
    }

    // Update usage
    license.usage.requestsToday++;
    license.usage.requestsThisHour++;
    license.usage.totalRequests++;
    license.usage.lastRequestAt = now.toISOString();
    this.saveToStorage();

    return {
      valid: true,
      license,
      tier,
      rateLimitInfo: {
        limit: dailyLimit,
        remaining: dailyLimit - license.usage.requestsToday,
        resetAt: new Date(todayStart.getTime() + 24 * 60 * 60 * 1000).toISOString(),
      },
    };
  }

  async recordEndpointUsage(apiKey: string, endpoint: string): Promise<void> {
    const hash = this.hashApiKey(apiKey);
    const licenseId = this.apiKeyIndex.get(hash);
    if (licenseId) {
      const license = this.licenses.get(licenseId);
      if (license) {
        license.usage.endpoints[endpoint] = (license.usage.endpoints[endpoint] || 0) + 1;
        this.saveToStorage();
      }
    }
  }

  async revokeLicense(licenseId: string): Promise<void> {
    const license = this.licenses.get(licenseId);
    if (license) {
      license.status = 'canceled';
      this.apiKeyIndex.delete(license.apiKeyHash);
      this.saveToStorage();
    }
  }

  async updateLicenseStatus(licenseId: string, status: License['status']): Promise<void> {
    const license = this.licenses.get(licenseId);
    if (license) {
      license.status = status;
      this.saveToStorage();
    }
  }

  async extendLicense(licenseId: string, additionalDays: number): Promise<void> {
    const license = this.licenses.get(licenseId);
    if (license) {
      const currentExpiry = new Date(license.expiresAt);
      currentExpiry.setDate(currentExpiry.getDate() + additionalDays);
      license.expiresAt = currentExpiry.toISOString();
      this.saveToStorage();
    }
  }

  getLicenseById(licenseId: string): License | undefined {
    return this.licenses.get(licenseId);
  }

  getLicenseByApiKey(apiKey: string): License | undefined {
    const hash = this.hashApiKey(apiKey);
    const licenseId = this.apiKeyIndex.get(hash);
    if (licenseId) {
      return this.licenses.get(licenseId);
    }
    return undefined;
  }

  getAllLicenses(): License[] {
    return Array.from(this.licenses.values());
  }

  getActiveLicenses(): License[] {
    return Array.from(this.licenses.values()).filter(l => l.status === 'active');
  }

  getUsageStats(licenseId: string): LicenseUsage | null {
    const license = this.licenses.get(licenseId);
    return license?.usage || null;
  }
}

export const licenseManager = new LicenseManager();