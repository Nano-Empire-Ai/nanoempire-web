/**
 * Usage Tracker — Detailed analytics for license usage
 * Tracks requests, endpoints, errors, latency, and generates reports
 */

import { LicenseUsage } from './manager';

export interface UsageEvent {
  timestamp: string;
  licenseId: string;
  endpoint: string;
  method: string;
  statusCode: number;
  latencyMs: number;
  requestSize: number;
  responseSize: number;
  userAgent?: string;
  ip?: string;
}

export interface UsageAggregates {
  totalRequests: number;
  requestsByEndpoint: Record<string, number>;
  requestsByStatusCode: Record<number, number>;
  avgLatencyMs: number;
  p50LatencyMs: number;
  p95LatencyMs: number;
  p99LatencyMs: number;
  errorRate: number;
  uniqueLicenses: number;
  topLicenses: { licenseId: string; requests: number }[];
  timeSeries: { timestamp: string; requests: number }[];
}

export interface LicenseUsageReport {
  licenseId: string;
  period: { start: string; end: string };
  aggregates: UsageAggregates;
  dailyBreakdown: { date: string; requests: number; errors: number }[];
  endpointBreakdown: { endpoint: string; requests: number; avgLatencyMs: number }[];
}

class UsageTracker {
  private events: UsageEvent[] = [];
  private maxEvents = 100000; // Keep last 100k events in memory
  private flushInterval: NodeJS.Timeout | null = null;

  constructor() {
    // Flush to persistent storage every 5 minutes
    this.flushInterval = setInterval(() => this.flush(), 5 * 60 * 1000);
  }

  record(event: UsageEvent): void {
    this.events.push(event);
    if (this.events.length > this.maxEvents) {
      this.events = this.events.slice(-this.maxEvents);
    }
  }

  private flush(): void {
    // TODO: Implement persistent storage (Redis/DB)
    // For now, just log summary
    if (this.events.length > 0) {
      const recent = this.events.slice(-1000);
      const total = recent.length;
      const errors = recent.filter(e => e.statusCode >= 400).length;
      const avgLatency = recent.reduce((sum, e) => sum + e.latencyMs, 0) / total;
      console.log(`[UsageTracker] Flush: ${total} events, ${errors} errors, ${avgLatency.toFixed(1)}ms avg`);
    }
  }

  getAggregates(
    since?: Date,
    licenseId?: string
  ): UsageAggregates {
    let filtered = this.events;
    
    if (since) {
      filtered = filtered.filter(e => new Date(e.timestamp) >= since);
    }
    if (licenseId) {
      filtered = filtered.filter(e => e.licenseId === licenseId);
    }

    if (filtered.length === 0) {
      return this.emptyAggregates();
    }

    const total = filtered.length;
    const requestsByEndpoint: Record<string, number> = {};
    const requestsByStatusCode: Record<number, number> = {};
    const latencies: number[] = [];
    const licenseCounts: Record<string, number> = {};

    for (const event of filtered) {
      requestsByEndpoint[event.endpoint] = (requestsByEndpoint[event.endpoint] || 0) + 1;
      requestsByStatusCode[event.statusCode] = (requestsByStatusCode[event.statusCode] || 0) + 1;
      latencies.push(event.latencyMs);
      licenseCounts[event.licenseId] = (licenseCounts[event.licenseId] || 0) + 1;
    }

    latencies.sort((a, b) => a - b);
    const errors = filtered.filter(e => e.statusCode >= 400).length;

    return {
      totalRequests: total,
      requestsByEndpoint,
      requestsByStatusCode,
      avgLatencyMs: latencies.reduce((a, b) => a + b, 0) / total,
      p50LatencyMs: latencies[Math.floor(total * 0.5)],
      p95LatencyMs: latencies[Math.floor(total * 0.95)],
      p99LatencyMs: latencies[Math.floor(total * 0.99)],
      errorRate: errors / total,
      uniqueLicenses: Object.keys(licenseCounts).length,
      topLicenses: Object.entries(licenseCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
        .map(([licenseId, requests]) => ({ licenseId, requests })),
      timeSeries: this.generateTimeSeries(filtered),
    };
  }

  private generateTimeSeries(events: UsageEvent[]): { timestamp: string; requests: number }[] {
    const hourly: Record<string, number> = {};
    for (const event of events) {
      const hour = event.timestamp.substring(0, 13); // YYYY-MM-DDTHH
      hourly[hour] = (hourly[hour] || 0) + 1;
    }
    return Object.entries(hourly)
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([timestamp, requests]) => ({ timestamp, requests }));
  }

  private emptyAggregates(): UsageAggregates {
    return {
      totalRequests: 0,
      requestsByEndpoint: {},
      requestsByStatusCode: {},
      avgLatencyMs: 0,
      p50LatencyMs: 0,
      p95LatencyMs: 0,
      p99LatencyMs: 0,
      errorRate: 0,
      uniqueLicenses: 0,
      topLicenses: [],
      timeSeries: [],
    };
  }

  generateLicenseReport(
    licenseId: string,
    periodStart: Date,
    periodEnd: Date
  ): LicenseUsageReport {
    const filtered = this.events.filter(
      e => e.licenseId === licenseId &&
           new Date(e.timestamp) >= periodStart &&
           new Date(e.timestamp) <= periodEnd
    );

    const aggregates = this.getAggregates(periodStart, licenseId);
    
    // Daily breakdown
    const dailyMap: Record<string, { requests: number; errors: number }> = {};
    for (const event of filtered) {
      const date = event.timestamp.substring(0, 10);
      if (!dailyMap[date]) dailyMap[date] = { requests: 0, errors: 0 };
      dailyMap[date].requests++;
      if (event.statusCode >= 400) dailyMap[date].errors++;
    }
    const dailyBreakdown = Object.entries(dailyMap)
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([date, data]) => ({ date, ...data }));

    // Endpoint breakdown
    const endpointMap: Record<string, { requests: number; latencies: number[] }> = {};
    for (const event of filtered) {
      if (!endpointMap[event.endpoint]) {
        endpointMap[event.endpoint] = { requests: 0, latencies: [] };
      }
      endpointMap[event.endpoint].requests++;
      endpointMap[event.endpoint].latencies.push(event.latencyMs);
    }
    const endpointBreakdown = Object.entries(endpointMap)
      .map(([endpoint, data]) => ({
        endpoint,
        requests: data.requests,
        avgLatencyMs: data.latencies.reduce((a, b) => a + b, 0) / data.latencies.length,
      }))
      .sort((a, b) => b.requests - a.requests);

    return {
      licenseId,
      period: {
        start: periodStart.toISOString(),
        end: periodEnd.toISOString(),
      },
      aggregates,
      dailyBreakdown,
      endpointBreakdown,
    };
  }

  getSystemHealth(): {
    totalEvents: number;
    eventsLastHour: number;
    eventsLastDay: number;
    errorRate: number;
    avgLatencyMs: number;
    activeLicenses: number;
  } {
    const now = new Date();
    const hourAgo = new Date(now.getTime() - 60 * 60 * 1000);
    const dayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    const lastHour = this.events.filter(e => new Date(e.timestamp) >= hourAgo);
    const lastDay = this.events.filter(e => new Date(e.timestamp) >= dayAgo);

    const errorsLastHour = lastHour.filter(e => e.statusCode >= 400).length;
    const avgLatency = lastHour.length > 0
      ? lastHour.reduce((s, e) => s + e.latencyMs, 0) / lastHour.length
      : 0;

    const activeLicenses = new Set(
      this.events.filter(e => new Date(e.timestamp) >= dayAgo).map(e => e.licenseId)
    ).size;

    return {
      totalEvents: this.events.length,
      eventsLastHour: lastHour.length,
      eventsLastDay: lastDay.length,
      errorRate: lastHour.length > 0 ? errorsLastHour / lastHour.length : 0,
      avgLatencyMs: avgLatency,
      activeLicenses,
    };
  }

  shutdown(): void {
    if (this.flushInterval) {
      clearInterval(this.flushInterval);
      this.flush();
    }
  }
}

export const usageTracker = new UsageTracker();