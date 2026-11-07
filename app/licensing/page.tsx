import { Metadata } from 'next';
import Link from 'next/link';
import { Shield, Database, Zap, BarChart, Globe, Lock, ArrowRight, Check, ExternalLink, Download, Code, Users, Crown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LICENSE_TIERS } from '@/lib/licensing/manager';

export const metadata: Metadata = {
  title: 'Enterprise Data Licensing — RecallRadar, SkillProof, BidShield | Nano Empire AI',
  description: 'License 46,642 safety recalls, 25+ MCP security audits, and federal tender intelligence. Self-serve API access with instant provisioning. $2,400/yr starting.',
  alternates: { canonical: '/licensing' },
  openGraph: {
    title: 'Enterprise Data Licensing — Nano Empire AI',
    description: 'Programmatic access to safety recalls, MCP security audits, and federal tender intelligence.',
    images: [{ url: 'https://www.nanoempireai.com/api/og/licensing', width: 1200, height: 630 }],
  },
};

const TIERS = [
  {
    id: 'recallradar-core',
    name: 'RecallRadar Core',
    tagline: '46,642 Safety Recalls',
    description: 'Complete CPSC, FDA, and Health Canada recall database with daily automated updates. Perfect for liquidation buyers, marketplace compliance, and insurance verification.',
    price: 2400,
    interval: 'year',
    popular: false,
    features: [
      '21,812 normalized US CPSC & FDA recall records (46,642 North American total)',
      'Daily automated sync at 08:00 ET',
      'JSON + CSV export formats',
      '10,000 requests/day rate limit',
      'REST API with OpenAPI 3.0 spec',
      'Email support (24h response)',
    ],
    products: ['recallradar-core'],
    stripePriceId: 'price_recallradar_core',
  },
  {
    id: 'skillproof-index',
    name: 'SkillProof MCP Index',
    tagline: '25+ MCP Security Audits',
    description: 'Pre-audited Model Context Protocol servers with line-cited security findings. Governance gaps, execution sinks, and supply chain risk.',
    price: 1200,
    interval: 'year',
    popular: false,
    features: [
      '25+ pre-audited MCP repositories',
      'Line-cited execution sinks (shell, env, fs, network)',
      'Governance gaps (SECURITY.md, lockfiles, tests)',
      'JSON format with Ed25519 verification',
      '5,000 requests/day rate limit',
      'Email support (24h response)',
    ],
    products: ['skillproof-index'],
    stripePriceId: 'price_skillproof_index',
  },
  {
    id: 'bidshield-tenders',
    name: 'BidShield Tender Intelligence',
    tagline: '16+ Federal Solicitations',
    description: 'Live federal procurement opportunities with disqualifier analysis. Missing annexes, fatal clauses, and JEV exposure quantification.',
    price: 1200,
    interval: 'year',
    popular: false,
    features: [
      '16+ active federal solicitations across 8 NAICS codes',
      'Missing annexes & fatal disqualifier gates',
      'Judgment Exposure Value (JEV) quantification',
      'Upwork Project Catalog integration',
      '5,000 requests/day rate limit',
      'Email support (24h response)',
    ],
    products: ['bidshield-tenders'],
    stripePriceId: 'price_bidshield_tenders',
  },
  {
    id: 'enterprise-bundle',
    name: 'Enterprise Data Bundle',
    tagline: 'All Products + Priority',
    description: 'Complete data suite: RecallRadar Core + Delta + SkillProof + BidShield. Maximum rate limits, priority support, and dedicated Slack channel.',
    price: 5000,
    interval: 'year',
    popular: true,
    features: [
      'ALL products: RecallRadar Core + Delta + SkillProof + BidShield',
      'RecallRadar Delta Feed (hourly updates)',
      '100,000 requests/day rate limit',
      'JSON + CSV + Parquet export formats',
      'Priority email support (4h response)',
      'Dedicated Slack channel + SLA',
      'Custom webhook endpoints',
      'Custom data extracts on request',
    ],
    products: ['recallradar-core', 'recallradar-delta', 'skillproof-index', 'bidshield-tenders'],
    stripePriceId: 'price_enterprise_bundle',
  },
];

const ADDONS = [
  {
    id: 'recallradar-delta-addon',
    name: 'RecallRadar Delta Feed',
    description: 'Hourly recall updates for real-time compliance monitoring. Add to any Core license.',
    price: 500,
    interval: 'month',
    features: [
      'Hourly recall delta feed',
      'New/updated/removed recall detection',
      'JSON format, 50,000 requests/day',
      'Webhook notifications available',
    ],
  },
];

const USE_CASES = [
  {
    title: 'Liquidation Pallet Compliance',
    description: 'Amazon FBA sellers, Target/Walmart liquidation buyers scan 500-SKU manifests in seconds before purchase.',
    icon: Database,
    metrics: '46,642 recalls • 10s scan • $30/report',
  },
  {
    title: 'Insurance Risk Verification',
    description: 'GL insurers verify client recall compliance before policy issuance. Automated API integration into underwriting workflows.',
    icon: Shield,
    metrics: 'Instant verification • API-first • Audit trail',
  },
  {
    title: 'Marketplace Safety Compliance',
    description: 'E-commerce platforms auto-scan seller inventory against federal bans. Prevent account suspensions and civil penalties.',
    icon: Globe,
    metrics: 'Real-time • 95% margin • Zero COGS',
  },
  {
    title: 'AI Agent Safety Evaluation',
    description: 'LangChain/CrewAI/AutoGen agents verify MCP tool safety before execution. Prevent prompt injection and tool poisoning.',
    icon: Zap,
    metrics: '25+ audited repos • Ed25519 proofs • CI/CD gates',
  },
  {
    title: 'Federal Contractor Pre-Bid',
    description: 'Contractors screen solicitations for fatal disqualifiers before bidding. JEV exposure quantified in dollars.',
    icon: BarChart,
    metrics: '16+ solicitations • 8 NAICS • $48k JEV avg',
  },
  {
    title: 'Vendor Risk Assessment',
    description: 'Enterprise procurement teams verify third-party AI tool safety. Ed25519-signed Trust Manifests for SOC2 evidence.',
    icon: Lock,
    metrics: 'Ed25519 proofs • SOC2 ready • CI/CD gates',
  },
];

export default function LicensingPage() {
  return (
    <main className="min-h-screen bg-[#07090D] text-[#F4F1EA] font-sans">
      {/* Hero */}
      <section className="relative pt-20 pb-16 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#00B5E2]/30 bg-[#00B5E2]/10 text-xs text-[#00B5E2] font-mono mb-8">
            <Zap size={14} /> SELF-SERVE API LICENSING • INSTANT PROVISIONING
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-white mb-6">
            Enterprise Data Licensing
            <br />
            <span className="text-[#00B5E2]">Programmatic Access</span> to Safety, Security & Procurement Intelligence
          </h1>

          <p className="text-xl text-[#8C92A4] max-w-2xl mb-10 leading-relaxed">
            License 46,642 safety recalls, 25+ MCP security audits, and 16+ federal tender intelligence feeds.
            Self-serve Stripe checkout → instant API key → production-ready in minutes.
          </p>

          {/* Trust Indicators */}
          <div className="flex flex-wrap items-center gap-8 text-sm font-mono text-[#8C92A4] mb-12">
            <div className="flex items-center gap-2">
              <Shield size={16} className="text-[#A3FF00]" />
              <span>Ed25519 Verified</span>
            </div>
            <div className="flex items-center gap-2">
              <Database size={16} className="text-[#00B5E2]" />
              <span>46,642 Records</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap size={16} className="text-[#FF7B00]" />
              <span>Instant Provisioning</span>
            </div>
            <div className="flex items-center gap-2">
              <Globe size={16} className="text-[#00B5E2]" />
              <span>99.9% Uptime SLA</span>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl">
            <div className="bg-[#0f1423] border border-[#8C92A4]/20 rounded-xl p-5 text-center">
              <div className="text-3xl font-extrabold font-mono text-[#A3FF00]">46,642</div>
              <div className="text-xs text-[#8C92A4] font-mono uppercase tracking-wider">Safety Recalls</div>
            </div>
            <div className="bg-[#0f1423] border border-[#8C92A4]/20 rounded-xl p-5 text-center">
              <div className="text-3xl font-extrabold font-mono text-[#00B5E2]">25+</div>
              <div className="text-xs text-[#8C92A4] font-mono uppercase tracking-wider">MCP Audits</div>
            </div>
            <div className="bg-[#0f1423] border border-[#8C92A4]/20 rounded-xl p-5 text-center">
              <div className="text-3xl font-extrabold font-mono text-[#FF7B00]">16+</div>
              <div className="text-xs text-[#8C92A4] font-mono uppercase tracking-wider">Federal Tenders</div>
            </div>
            <div className="bg-[#0f1423] border border-[#8C92A4]/20 rounded-xl p-5 text-center">
              <div className="text-3xl font-extrabold font-mono text-[#A3FF00]">95%+</div>
              <div className="text-xs text-[#8C92A4] font-mono uppercase tracking-wider">Gross Margin</div>
            </div>
          </div>
        </div>

        {/* Background pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(0,181,226,0.03),transparent_70%)] pointer-events-none" />
      </section>

      {/* Pricing Cards */}
      <section className="px-6 py-16">
        <div className="max-w-7xl mx-auto">
          <header className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#FF7B00]/30 bg-[#FF7B00]/10 text-xs text-[#FF7B00] font-mono mb-4">
              <Crown size={14} /> TRANSPARENT PRICING • NO CONTRACTS • CANCEL ANYTIME
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4">Choose Your Data License</h2>
            <p className="text-xl text-[#8C92A4] max-w-2xl mx-auto">
              All licenses include instant API key provisioning, OpenAPI documentation, and email support.
              Upgrade or downgrade anytime from your dashboard.
            </p>
          </header>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {TIERS.map((tier) => (
              <article
                key={tier.id}
                className={`relative rounded-2xl p-8 border flex flex-col justify-between transition-all ${
                  tier.popular
                    ? 'border-[#00B5E2] bg-[#0f1423] shadow-2xl shadow-[#00B5E2]/10 relative'
                    : 'border-[#8C92A4]/20 bg-[#07090D]'
                }`}
              >
                {tier.popular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#00B5E2] text-black font-mono text-xs font-bold py-1 px-3 rounded-full uppercase tracking-wider">
                    Most Popular
                  </span>
                )}

                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-mono px-2 py-0.5 rounded bg-white/5 text-[#8C92A4]">
                      {tier.tagline}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-1">{tier.name}</h3>
                  <p className="text-sm text-[#8C92A4] mb-6 leading-relaxed">{tier.description}</p>

                  <div className="mb-6">
                    <span className="text-4xl font-extrabold text-white font-mono">${tier.price.toLocaleString()}</span>
                    <span className="text-xs text-[#8C92A4] font-mono"> / {tier.interval}</span>
                  </div>

                  <ul className="space-y-3 mb-8">
                    {tier.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-sm text-[#F4F1EA]">
                        <Check size={16} className="text-[#A3FF00] mt-0.5 shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Link
                  href={`/api/checkout?tier_id=${tier.id}`}
                  className={`w-full py-3.5 rounded-lg font-bold text-center transition-colors ${
                    tier.popular
                      ? 'bg-[#00B5E2] text-black hover:bg-[#00B5E2]/90'
                      : 'bg-[#00B5E2]/10 text-[#00B5E2] border border-[#00B5E2]/30 hover:bg-[#00B5E2]/20'
                  }`}
                >
                  License {tier.name} →
                </Link>

                {tier.id === 'enterprise-bundle' && (
                  <p className="text-center text-xs text-[#8C92A4] mt-4 pt-4 border-t border-white/10">
                    Includes: RecallRadar Core + Delta + SkillProof + BidShield
                  </p>
                )}
              </article>
            ))}

            {/* Add-ons */}
            <article className="rounded-2xl p-8 border border-[#8C92A4]/20 bg-[#07090D] flex flex-col">
              <h3 className="text-lg font-bold text-white mb-2">Add-ons</h3>
              <p className="text-sm text-[#8C92A4] mb-6">Extend any license with real-time data feeds</p>
              {ADDONS.map((addon) => (
                <div key={addon.id} className="mb-4 p-4 bg-black/40 border border-white/5 rounded-lg">
                  <div className="flex items-baseline justify-between mb-2">
                    <h4 className="font-bold text-white">{addon.name}</h4>
                    <span className="text-2xl font-extrabold text-white font-mono">${addon.price}</span>
                    <span className="text-xs text-[#8C92A4] font-mono"> / {addon.interval}</span>
                  </div>
                  <p className="text-xs text-[#8C92A4] mb-2">{addon.description}</p>
                  <ul className="space-y-1 text-xs text-[#8C92A4]">
                    {addon.features.map((f, i) => (
                      <li key={i} className="flex items-center gap-1.5">
                        <span className="text-[#A3FF00]">•</span> {f}
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={`/api/checkout?tier_id=${addon.id}`}
                    className="mt-2 inline-flex items-center gap-1 text-xs font-mono text-[#00B5E2] hover:underline"
                  >
                    Add to License →
                  </Link>
                </div>
              ))}
            </article>
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="px-6 py-16 bg-[#0f1423]/50">
        <div className="max-w-7xl mx-auto">
          <header className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4">Real-World Use Cases</h2>
            <p className="text-xl text-[#8C92A4] max-w-2xl mx-auto">
              Teams across e-commerce, insurance, compliance, and AI use our data to automate safety, reduce risk, and unlock revenue.
            </p>
          </header>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {USE_CASES.map((useCase, i) => (
              <article key={i} className="p-6 bg-[#07090D] border border-[#8C92A4]/20 rounded-2xl hover:border-[#00B5E2]/30 transition-colors">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-[#00B5E2]/10 border border-[#00B5E2]/20 rounded-xl">
                    <useCase.icon size={24} className="text-[#00B5E2]" />
                  </div>
                  <h3 className="text-lg font-bold text-white">{useCase.title}</h3>
                </div>
                <p className="text-[#8C92A4] text-sm mb-4 leading-relaxed">{useCase.description}</p>
                <div className="flex items-center gap-2 text-xs font-mono text-[#A3FF00]">
                  <span>{useCase.metrics}</span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Developer Experience */}
      <section className="px-6 py-16">
        <div className="max-w-7xl mx-auto">
          <header className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4">Built for Developers</h2>
            <p className="text-xl text-[#8C92A4] max-w-2xl mx-auto">
              Production-ready tooling to get you from API key to first successful call in under 5 minutes.
            </p>
          </header>

          <div className="grid md:grid-cols-3 gap-6 mb-16">
            {[
              { icon: Code, title: 'OpenAPI 3.0 Spec', desc: 'Complete interactive docs with try-it console at /licensing/docs' },
              { icon: Download, title: 'Python & TypeScript SDKs', desc: 'pip install nanoempire-data / npm install @nanoempire/data' },
              { icon: ExternalLink, title: 'Postman Collection', desc: 'One-click import with all endpoints, auth, and examples' },
            ].map((item, i) => (
              <div key={i} className="p-6 bg-[#0f1423] border border-[#8C92A4]/20 rounded-2xl text-center">
                <div className="p-3 bg-[#00B5E2]/10 border border-[#00B5E2]/20 rounded-xl w-fit mx-auto mb-4">
                  <item.icon size={28} className="text-[#00B5E2]" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
                <p className="text-sm text-[#8C92A4]">{item.desc}</p>
              </div>
            ))}
          </div>

          {/* Code Sample */}
          <div className="bg-[#07090D] border border-[#8C92A4]/20 rounded-2xl p-6 max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-mono text-[#8C92A4]">Python SDK Example</span>
              <span className="text-xs font-mono text-[#8C92A4] bg-black/40 px-2 py-0.5 rounded">GET /api/licensing/data/recalls</span>
            </div>
            <pre className="text-xs font-mono text-[#A3FF00] overflow-x-auto bg-black/40 p-4 rounded-xl"><code>{`from nanoempire import RecallRadar

client = RecallRadar(api_key="sk_live_...")

# Search recalls by brand
results = client.recalls.search(brand="Drexel")

# Scan a manifest CSV
report = client.recalls.scan_manifest("inventory.csv")
report.save_pdf("compliance.pdf")

# Get hourly delta feed (Enterprise)
for recall in client.recalls.delta_stream():
    process(recall)`}</code></pre>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-16 bg-gradient-to-r from-[#0f1423] to-[#07090D] rounded-3xl border border-[#00B5E2]/30 mx-6 -mx-6">
        <div className="max-w-3xl mx-auto text-center py-8">
          <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4">
            Ready to Integrate Safety Intelligence?
          </h2>
          <p className="text-xl text-[#8C92A4] mb-8">
            Get your API key in 60 seconds. First 1,000 requests free for evaluation.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/api/checkout?price_id=price_recallradar_core"
              className="w-full sm:w-auto inline-flex items-center gap-2 bg-[#00B5E2] text-black font-bold px-8 py-4 rounded-lg text-lg hover:bg-[#00B5E2]/90 transition-colors"
            >
              <Shield size={20} /> Start with RecallRadar Core ($2,400/yr)
            </Link>
            <Link
              href="/licensing/docs"
              className="w-full sm:w-auto inline-flex items-center gap-2 border border-[#8C92A4]/40 text-[#8C92A4] px-8 py-4 rounded-lg text-lg hover:bg-white/5 hover:text-white transition-colors"
            >
              <Code size={20} /> Read the Docs First
            </Link>
          </div>
        </div>
      </section>

      {/* Footer Links */}
      <section className="px-6 py-12 border-t border-[#8C92A4]/20">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 text-sm">
            <div>
              <h4 className="text-xs font-mono uppercase tracking-wider text-[#00B5E2] mb-3">Products</h4>
              <ul className="space-y-2 text-[#8C92A4]">
                <li><Link href="/licensing" className="hover:text-white">RecallRadar Core</Link></li>
                <li><Link href="/licensing" className="hover:text-white">SkillProof Index</Link></li>
                <li><Link href="/licensing" className="hover:text-white">BidShield Tenders</Link></li>
                <li><Link href="/licensing" className="hover:text-white">Enterprise Bundle</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-xs font-mono uppercase tracking-wider text-[#00B5E2] mb-3">Developers</h4>
              <ul className="space-y-2 text-[#8C92A4]">
                <li><Link href="/licensing/docs" className="hover:text-white">API Documentation</Link></li>
                <li><Link href="/licensing/docs/sdks" className="hover:text-white">SDKs & Tools</Link></li>
                <li><Link href="/licensing/docs/openapi" className="hover:text-white">OpenAPI Spec</Link></li>
                <li><Link href="/licensing/docs/postman" className="hover:text-white">Postman Collection</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-xs font-mono uppercase tracking-wider text-[#00B5E2] mb-3">Company</h4>
              <ul className="space-y-2 text-[#8C92A4]">
                <li><Link href="/m2m-state.md" className="hover:text-white">M2M Economy State</Link></li>
                <li><Link href="/skillproof" className="hover:text-white">SkillProof Verification</Link></li>
                <li><Link href="/bidshield" className="hover:text-white">BidShield Triage</Link></li>
                <li><Link href="/recall-report" className="hover:text-white">RecallRadar Scanner</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-xs font-mono uppercase tracking-wider text-[#00B5E2] mb-3">Legal</h4>
              <ul className="space-y-2 text-[#8C92A4]">
                <li><Link href="/terms" className="hover:text-white">Terms of Service</Link></li>
                <li><Link href="/privacy" className="hover:text-white">Privacy Policy</Link></li>
                <li><Link href="/licensing/agreement" className="hover:text-white">Data License Agreement</Link></li>
                <li><Link href="/licensing/sla" className="hover:text-white">SLA & Support</Link></li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}