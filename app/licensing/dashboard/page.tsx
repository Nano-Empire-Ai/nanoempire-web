import { Metadata } from 'next';
import Link from 'next/link';
import { Shield, Database, Zap, BarChart, Globe, Lock, ArrowRight, Check, ExternalLink, Download, Code, Users, Crown, Key, Trash2, Copy, AlertCircle, Clock, CreditCard, Settings, LogOut, RefreshCw, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { licenseManager, License, LicenseTier, LICENSE_TIERS } from '@/lib/licensing/manager';
import { usageTracker, LicenseUsageReport } from '@/lib/licensing/usage';

export const metadata: Metadata = {
  title: 'License Dashboard — Nano Empire AI',
  description: 'Manage your data licenses, API keys, usage, and billing.',
  alternates: { canonical: '/licensing/dashboard' },
};

interface LicenseWithDetails extends License {
  tier: LicenseTier;
  usageReport?: LicenseUsageReport;
}

async function getUserLicenses(): Promise<LicenseWithDetails[]> {
  // In production, fetch from database filtered by authenticated user
  // For now, return all licenses (demo)
  const licenses = licenseManager.getAllLicenses();
  return licenses.map(license => ({
    ...license,
    tier: LICENSE_TIERS[license.tierId],
    usageReport: licenseManager.getUsageStats(license.id) ? usageTracker.generateLicenseReport(
      license.id,
      new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      new Date()
    ) : undefined,
  }));
}

async function getSystemHealth() {
  return usageTracker.getSystemHealth();
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

function formatDateTime(dateString: string): string {
  return new Date(dateString).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function getStatusColor(status: License['status']): string {
  switch (status) {
    case 'active': return 'text-[#A3FF00] bg-[#A3FF00]/10 border-[#A3FF00]/30';
    case 'past_due': return 'text-[#FF7B00] bg-[#FF7B00]/10 border-[#FF7B00]/30';
    case 'canceled': return 'text-[#FF4444] bg-[#FF4444]/10 border-[#FF4444]/30';
    case 'trialing': return 'text-[#00B5E2] bg-[#00B5E2]/10 border-[#00B5E2]/30';
    default: return 'text-[#8C92A4] bg-white/5 border-white/10';
  }
}

function getStatusIcon(status: License['status']) {
  switch (status) {
    case 'active': return <Shield size={14} className="text-[#A3FF00]" />;
    case 'past_due': return <AlertCircle size={14} className="text-[#FF7B00]" />;
    case 'canceled': return <Trash2 size={14} className="text-[#FF4444]" />;
    case 'trialing': return <Clock size={14} className="text-[#00B5E2]" />;
    default: return <Shield size={14} className="text-[#8C92A4]" />;
  }
}

function maskApiKey(apiKey: string): string {
  if (apiKey.length <= 12) return apiKey;
  return apiKey.substring(0, 8) + '•'.repeat(apiKey.length - 12) + apiKey.substring(apiKey.length - 4);
}

export default async function LicensingDashboardPage() {
  const licenses = await getUserLicenses();
  const systemHealth = await getSystemHealth();

  return (
    <main className="min-h-screen bg-[#07090D] text-[#F4F1EA] font-sans">
      {/* Top Nav */}
      <nav className="border-b border-[#8C92A4]/20 bg-[#07090D]/90 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/licensing" className="flex items-center gap-2 text-[#8C92A4] hover:text-white transition-colors text-sm font-mono">
            <ArrowRight size={16} /> Back to Licensing
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/licensing" className="text-xs font-mono text-[#8C92A4] hover:text-white">
              View Plans
            </Link>
            <Link href="/licensing/docs" className="text-xs font-mono text-[#8C92A4] hover:text-white">
              Docs
            </Link>
            <span className="text-xs font-mono text-[#A3FF00]">v1.0.0</span>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <header className="mb-12">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#00B5E2]/30 bg-[#00B5E2]/10 text-xs text-[#00B5E2] font-mono mb-4">
                <Key size={14} /> LICENSE DASHBOARD
              </div>
              <h1 className="text-3xl md:text-4xl font-extrabold text-white">
                License Management
              </h1>
              <p className="text-xl text-[#8C92A4] mt-2 max-w-2xl">
                Manage your API keys, monitor usage, view billing, and access documentation.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/licensing" className="text-xs font-mono font-bold bg-[#00B5E2]/10 text-[#00B5E2] px-4 py-2 rounded hover:bg-[#00B5E2]/20 transition-colors">
                Browse Plans
              </Link>
              <Link href="/licensing/docs" className="text-xs font-mono font-bold bg-[#00B5E2] text-black px-4 py-2 rounded hover:bg-[#00B5E2]/90 transition-colors">
                API Docs
              </Link>
            </div>
          </div>

          {/* System Health */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-[#0f1423] border border-[#8C92A4]/20 rounded-xl p-5">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[#A3FF00]/10 border border-[#A3FF00]/20 rounded-lg">
                  <Shield size={20} className="text-[#A3FF00]" />
                </div>
                <div>
                  <div className="text-2xl font-extrabold font-mono text-[#A3FF00]">{systemHealth.activeLicenses}</div>
                  <div className="text-xs text-[#8C92A4] font-mono">Active Licenses</div>
                </div>
              </div>
            </div>
            <div className="bg-[#0f1423] border border-[#8C92A4]/20 rounded-xl p-5">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[#00B5E2]/10 border border-[#00B5E2]/20 rounded-lg">
                  <Zap size={20} className="text-[#00B5E2]" />
                </div>
                <div>
                  <div className="text-2xl font-extrabold font-mono text-[#00B5E2]">{systemHealth.eventsLastHour.toLocaleString()}</div>
                  <div className="text-xs text-[#8C92A4] font-mono">Requests (Last Hour)</div>
                </div>
              </div>
            </div>
            <div className="bg-[#0f1423] border border-[#8C92A4]/20 rounded-xl p-5">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[#FF7B00]/10 border border-[#FF7B00]/20 rounded-lg">
                  <AlertCircle size={20} className="text-[#FF7B00]" />
                </div>
                <div>
                  <div className="text-2xl font-extrabold font-mono text-[#FF7B00]">{(systemHealth.errorRate * 100).toFixed(2)}%</div>
                  <div className="text-xs text-[#8C92A4] font-mono">Error Rate (Last Hour)</div>
                </div>
              </div>
            </div>
            <div className="bg-[#0f1423] border border-[#8C92A4]/20 rounded-xl p-5">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[#A3FF00]/10 border border-[#A3FF00]/20 rounded-lg">
                  <Clock size={20} className="text-[#A3FF00]" />
                </div>
                <div>
                  <div className="text-2xl font-extrabold font-mono text-[#A3FF00]">{systemHealth.avgLatencyMs.toFixed(1)}ms</div>
                  <div className="text-xs text-[#8C92A4] font-mono">Avg Latency (Last Hour)</div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Licenses Grid */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">Your Licenses</h2>
            <Link
              href="/licensing"
              className="text-xs font-mono text-[#00B5E2] hover:underline flex items-center gap-1"
            >
              <span>Add License</span>
              <ChevronRight size={14} />
            </Link>
          </div>

          {licenses.length === 0 ? (
            <div className="bg-[#0f1423] border border-[#8C92A4]/20 rounded-2xl p-12 text-center">
              <Key size={48} className="text-[#8C92A4] mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">No Licenses Yet</h3>
              <p className="text-[#8C92A4] mb-6 max-w-md mx-auto">
                Get started by licensing RecallRadar, SkillProof, BidShield, or the Enterprise Bundle.
              </p>
              <Link
                href="/licensing"
                className="inline-flex items-center gap-2 bg-[#00B5E2] text-black font-bold px-6 py-3 rounded-lg hover:bg-[#00B5E2]/90 transition-colors"
              >
                <Shield size={18} /> Browse Plans
              </Link>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {licenses.map((license) => (
                <article
                  key={license.id}
                  className={`rounded-2xl p-6 border flex flex-col ${
                    license.status === 'active'
                      ? 'border-[#A3FF00]/30 bg-[#0f1423]/50'
                      : license.status === 'past_due'
                        ? 'border-[#FF7B00]/30 bg-[#0f1423]/50'
                        : 'border-[#8C92A4]/20 bg-[#07090D]'
                  }`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-mono px-2 py-0.5 rounded bg-white/5 text-[#8C92A4]">
                          {license.tier.name}
                        </span>
                        <span className={`px-2 py-0.5 rounded text-xs font-mono font-bold ${getStatusColor(license.status)} flex items-center gap-1`}>
                          {getStatusIcon(license.status)}
                          {license.status.toUpperCase()}
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-white">{license.tier.name}</h3>
                    </div>
                  </div>

                  <div className="space-y-3 mb-6">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-[#8C92A4]">API Key</span>
                      <div className="flex items-center gap-2">
                        <code className="text-xs font-mono text-[#A3FF00] bg-black/40 px-2 py-1 rounded">
                          {maskApiKey(license.apiKey)}
                        </code>
                        <button
                          className="text-xs text-[#00B5E2] hover:underline flex items-center gap-1"
                          onClick={() => navigator.clipboard.writeText(license.apiKey)}
                        >
                          <Copy size={12} /> Copy
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <span className="text-[#8C92A4]">Status</span>
                      <span className={`font-mono font-bold ${getStatusColor(license.status)}`}>
                        {license.status.replace('_', ' ').toUpperCase()}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <span className="text-[#8C92A4]">Expires</span>
                      <span className="font-mono text-white">{formatDate(license.expiresAt)}</span>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <span className="text-[#8C92A4]">Created</span>
                      <span className="font-mono text-white">{formatDate(license.createdAt)}</span>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <span className="text-[#8C92A4]">Last Used</span>
                      <span className="font-mono text-white">
                        {license.lastUsedAt ? formatDateTime(license.lastUsedAt) : 'Never'}
                      </span>
                    </div>
                  </div>

                  {/* Usage Stats */}
                  {license.usageReport && (
                    <div className="bg-black/40 border border-white/5 rounded-xl p-4 mb-6">
                      <h4 className="text-xs font-mono uppercase tracking-wider text-[#00B5E2] mb-3">30-Day Usage</h4>
                      <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                          <div className="text-2xl font-extrabold font-mono text-[#A3FF00]">
                            {license.usageReport.aggregates.totalRequests.toLocaleString()}
                          </div>
                          <div className="text-xs text-[#8C92A4]">Total Requests</div>
                        </div>
                        <div>
                          <div className="text-2xl font-extrabold font-mono text-[#00B5E2]">
                            {(license.usageReport.aggregates.errorRate * 100).toFixed(2)}%
                          </div>
                          <div className="text-xs text-[#8C92A4]">Error Rate</div>
                        </div>
                        <div>
                          <div className="text-2xl font-extrabold font-mono text-[#A3FF00]">
                            {license.usageReport.aggregates.avgLatencyMs.toFixed(0)}ms
                          </div>
                          <div className="text-xs text-[#8C92A4]">Avg Latency</div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex flex-wrap gap-3 pt-4 border-t border-white/10">
                    <Link
                      href={`/licensing/docs?license=${license.id}`}
                      className="flex-1 sm:flex-none text-xs font-mono font-bold bg-[#00B5E2]/10 text-[#00B5E2] px-3 py-2 rounded hover:bg-[#00B5E2]/20 transition-colors text-center"
                    >
                      <ExternalLink size={14} className="inline mr-1" /> API Docs
                    </Link>
                    <Link
                      href={`/licensing/dashboard/usage/${license.id}`}
                      className="flex-1 sm:flex-none text-xs font-mono font-bold bg-white/5 text-white px-3 py-2 rounded hover:bg-white/10 transition-colors text-center"
                    >
                      <BarChart size={14} className="inline mr-1" /> Usage Details
                    </Link>
                    {license.status === 'active' && (
                      <button className="flex-1 sm:flex-none text-xs font-mono font-bold bg-[#FF4444]/10 text-[#FF4444] px-3 py-2 rounded hover:bg-[#FF4444]/20 transition-colors text-center">
                        <Trash2 size={14} className="inline mr-1" /> Cancel
                      </button>
                    )}
                  </div>
                </article>
              ))}
            </div>
          )}

          {/* Usage Trends */}
          {licenses.length > 0 && (
            <div className="mt-12">
              <h2 className="text-2xl font-bold text-white mb-6">System Usage Overview</h2>
              <div className="bg-[#0f1423] border border-[#8C92A4]/20 rounded-2xl p-6">
                <div className="grid md:grid-cols-4 gap-6">
                  <div className="text-center p-4 bg-black/40 border border-white/5 rounded-xl">
                    <div className="text-3xl font-extrabold font-mono text-[#A3FF00]">{systemHealth.eventsLastHour.toLocaleString()}</div>
                    <div className="text-xs text-[#8C92A4] font-mono uppercase tracking-wider">Requests (Last Hour)</div>
                  </div>
                  <div className="text-center p-4 bg-black/40 border border-white/5 rounded-xl">
                    <div className="text-3xl font-extrabold font-mono text-[#00B5E2]">{systemHealth.eventsLastDay.toLocaleString()}</div>
                    <div className="text-xs text-[#8C92A4] font-mono uppercase tracking-wider">Requests (Last 24h)</div>
                  </div>
                  <div className="text-center p-4 bg-black/40 border border-white/5 rounded-xl">
                    <div className="text-3xl font-extrabold font-mono text-[#FF7B00]">{(systemHealth.errorRate * 100).toFixed(2)}%</div>
                    <div className="text-xs text-[#8C92A4] font-mono uppercase tracking-wider">Error Rate</div>
                  </div>
                  <div className="text-center p-4 bg-black/40 border border-white/5 rounded-xl">
                    <div className="text-3xl font-extrabold font-mono text-[#A3FF00]">{systemHealth.avgLatencyMs.toFixed(1)}ms</div>
                    <div className="text-xs text-[#8C92A4] font-mono uppercase tracking-wider">Avg Latency</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* Quick Links */}
        <section className="bg-[#0f1423] border border-[#8C92A4]/20 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Settings size={20} className="text-[#00B5E2]" /> Quick Actions
          </h2>
          <div className="grid md:grid-cols-4 gap-4">
            <Link href="/licensing/docs" className="p-4 bg-black/40 border border-white/5 rounded-xl hover:border-[#00B5E2]/30 transition-colors text-center">
              <Code size={24} className="text-[#00B5E2] mx-auto mb-2" />
              <div className="font-medium text-white">API Documentation</div>
              <div className="text-xs text-[#8C92A4]">OpenAPI specs, SDKs, examples</div>
            </Link>
            <Link href="/licensing/docs/sdks" className="p-4 bg-black/40 border border-white/5 rounded-xl hover:border-[#00B5E2]/30 transition-colors text-center">
              <Download size={24} className="text-[#A3FF00] mx-auto mb-2" />
              <div className="font-medium text-white">Download SDKs</div>
              <div className="text-xs text-[#8C92A4]">Python, TypeScript, Postman</div>
            </Link>
            <Link href="/licensing/agreement" className="p-4 bg-black/40 border border-white/5 rounded-xl hover:border-[#00B5E2]/30 transition-colors text-center">
              <Shield size={24} className="text-[#FF7B00] mx-auto mb-2" />
              <div className="font-medium text-white">License Agreement</div>
              <div className="text-xs text-[#8C92A4]">Terms & Data License</div>
            </Link>
            <Link href="/licensing/sla" className="p-4 bg-black/40 border border-white/5 rounded-xl hover:border-[#00B5E2]/30 transition-colors text-center">
              <Clock size={24} className="text-[#00B5E2] mx-auto mb-2" />
              <div className="font-medium text-white">SLA & Support</div>
              <div className="text-xs text-[#8C92A4]">Uptime, response times, escalation</div>
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}