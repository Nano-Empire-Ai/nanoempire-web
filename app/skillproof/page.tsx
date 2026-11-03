import Link from 'next/link';
import { ArrowLeft, Shield, Check, FileCode, ExternalLink, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import preauditsData from '@/public/skillproof/preaudits.json';
import RepoScanner from './RepoScanner';

export const metadata = {
  title: 'SkillProof Verification Catalog & Live MCP Pre-Audit Index — Nano Empire AI',
  description: 'Cryptographic behavioral verification tiers, line-cited static pre-audits, and Ed25519-signed Trust Manifests for autonomous AI agents and MCP servers.',
  alternates: {
    canonical: '/skillproof',
  },
};

const TIERS = [
  {
    name: 'RecallRadar Single Compliance Audit',
    price: '$30 USD',
    timing: 'Instant Delivery',
    status: 'LIVE',
    popular: true,
    stripeUrl: 'https://buy.stripe.com/6oU4gAfis2aP21Z8c0fAc0k',
    description: 'Instant inventory cross-reference against 46,642 US & Canadian (12,430 CPSC/FDA + 34,212 Health Canada) safety enforcement actions with signed compliance report.',
    features: [
      'Cross-reference against 46,642 active federal recall records',
      'Class I & serious hazard identification',
      'Automated SKU / UPC / title fuzzy matching',
      'Certified PDF & CSV export for marketplace compliance',
      'Official recall IDs and manufacturer remedy links',
    ],
  },
  {
    name: 'Continuous Radar & Manifest Monitoring',
    price: '$99 CAD / mo',
    timing: 'Daily Automation',
    status: 'LIVE',
    popular: false,
    stripeUrl: 'https://buy.stripe.com/00w5kE2vGg1F3630JyfAc0e',
    description: 'Automated daily delta re-scan on every new commit or federal safety registry update with immediate webhook alerts.',
    features: [
      'Daily automated delta scan against registries & commit trees',
      'Instant alert webhooks on new hazards or unpinned dependencies',
      'Continuous catalog and repository compliance protection',
      'Priority email alerts on high-severity findings',
      'Monthly consolidated Ed25519 compliance attestation',
    ],
  },
  {
    name: 'SkillProof Adversarial Verification Sprint',
    price: 'Scope on Request',
    timing: '48-Hour Turnaround · Parked Pending Ruling',
    status: 'PARKED',
    popular: false,
    stripeUrl: '',
    description: 'Full 180-vector adversarial battery against an MCP server or agent skill. Emits an offline-verifiable Ed25519 Trust Manifest pinned to your commit SHA-256.',
    features: [
      '180-vector prompt injection & tool poisoning battery',
      'Subprocess, shell execution & filesystem boundary audit',
      'Environment credential & secret exfiltration testing',
      'Pinned Ed25519 cryptographic Trust Manifest (/.well-known/skillproof-pubkey.json)',
      'Public Verified Badge & removal of unverified governance warnings',
    ],
  },
  {
    name: 'Sovereign Enterprise License',
    price: '$2,400 USD / yr',
    timing: 'Dedicated Setup',
    status: 'LIVE',
    popular: false,
    stripeUrl: '',
    description: 'Complete data export, programmatic API access, and private verification harness deployment for enterprise platforms.',
    features: [
      'Full normalized dataset & CI/CD verification harness export',
      'Daily programmatic sync feeds & webhooks',
      'Self-hosted or managed command center deployment',
      'Commercial catalog vetting and redistribution license',
      'Dedicated engineering integration support',
    ],
  },
];

export default function SkillProofPage() {
  const audits = preauditsData?.audits || [];

  return (
    <main className="min-h-screen bg-[#07090D] text-[#F4F1EA] font-sans">
      {/* Top Nav */}
      <nav className="border-b border-[#8C92A4]/20 bg-[#07090D]/90 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-[#8C92A4] hover:text-white transition-colors text-sm font-mono">
            <ArrowLeft size={16} /> Back to Nano Empire
          </Link>
          <span className="text-xs font-mono uppercase tracking-widest text-[#FF7B00] border border-[#FF7B00]/30 bg-[#FF7B00]/10 px-2 py-0.5 rounded">
            SKILLPROOF SUITE · NOV 2026
          </span>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-16">
        <header className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#00B5E2]/30 bg-[#00B5E2]/10 text-xs text-[#00B5E2] font-mono mb-4">
            <Shield size={14} /> CRYPTOGRAPHIC PROOF · GOVERNANCE &gt; PURE RAILS
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white mb-6">
            SkillProof Verification &amp; Live Pre-Audit Index
          </h1>
          <p className="text-xl text-[#8C92A4] leading-relaxed">
            Every audit tests behavioral invariants and static execution sinks, producing an Ed25519-signed Trust Manifest pinned to your commit SHA-256.
          </p>
        </header>

        {/* Interactive Self-Serve GitHub Repo Pre-Auditor */}
        <RepoScanner />

        {/* Live Pre-Audit Scorecard Section */}
        <section className="mb-20">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-[#A3FF00]">
                AUTONOMOUS PRE-AUDIT ENGINE (UPDATED DAILY 07:30 ET)
              </span>
              <h2 className="text-2xl font-bold text-white mt-1">
                Live Public MCP &amp; Agent Pre-Audit Scorecards
              </h2>
            </div>
            <Link
              href="/skillproof/preaudits.json"
              className="text-xs font-mono text-[#00B5E2] hover:underline flex items-center gap-1.5 border border-[#00B5E2]/30 bg-[#00B5E2]/10 px-3 py-2 rounded"
            >
              Raw Machine Registry (preaudits.json) <ExternalLink size={13} />
            </Link>
          </div>

          <div className="grid gap-4">
            {audits.map((item) => (
              <div
                key={item.preaudit_id}
                className="rounded-xl border border-[#8C92A4]/20 bg-[#0f1423]/90 p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-6"
              >
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-3">
                    <a
                      href={`https://github.com/${item.repo}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-lg font-bold text-white hover:text-[#00B5E2] font-mono flex items-center gap-1.5"
                    >
                      {item.repo} <ExternalLink size={14} />
                    </a>
                    <span className="text-xs font-mono px-2 py-0.5 rounded bg-white/10 text-[#F4F1EA]">
                      ★ {item.stars.toLocaleString()}
                    </span>
                    <span className="text-xs font-mono px-2 py-0.5 rounded bg-white/5 text-[#8C92A4]">
                      SHA: {item.tree_sha}
                    </span>
                    <span className="text-xs font-mono px-2 py-0.5 rounded bg-white/5 text-[#8C92A4]">
                      {item.total_files_in_repo.toLocaleString()} files ({item.license})
                    </span>
                    <span className="text-xs font-mono px-2 py-0.5 rounded border border-[#00B5E2]/30 text-[#00B5E2]">
                      {item.preaudit_id}
                    </span>
                  </div>

                  {item.governance_gaps && item.governance_gaps.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-1">
                      {item.governance_gaps.map((g: string, idx: number) => (
                        <span
                          key={idx}
                          className="text-xs font-mono text-[#FF7B00] bg-[#FF7B00]/10 border border-[#FF7B00]/30 px-2 py-0.5 rounded flex items-center gap-1"
                        >
                          <AlertTriangle size={12} /> {g}
                        </span>
                      ))}
                    </div>
                  )}

                  {item.code_surface_findings && item.code_surface_findings.length > 0 ? (
                    <div className="space-y-1 pt-2">
                      {item.code_surface_findings.map((fn: { id: string; severity: string; title: string; file: string; line: number; snippet: string }, idx: number) => (
                        <div key={idx} className="text-xs font-mono text-[#8C92A4] bg-black/40 px-3 py-1.5 rounded border border-white/5">
                          <span className="text-[#FF7B00] font-bold">[{fn.severity}]</span>{' '}
                          <span className="text-white">{fn.file}:L{fn.line}</span> — {fn.title}{' '}
                          <code className="text-[#00B5E2] ml-1">{fn.snippet}</code>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs font-mono text-[#A3FF00] pt-1">
                      ✓ Zero high-risk shell/eval execution sinks detected in sampled entrypoints.
                    </p>
                  )}
                </div>

                <div className="flex lg:flex-col items-center lg:items-end justify-between gap-3 shrink-0 border-t lg:border-t-0 pt-4 lg:pt-0 border-white/10">
                  <div className="text-right">
                    <span className="text-xs font-mono text-[#8C92A4] block">PRE-AUDIT SCORE</span>
                    <span className="text-3xl font-extrabold font-mono text-[#A3FF00]">
                      {item.skillproof_score}/100
                    </span>
                  </div>
                  <Link
                    href={`mailto:rob@nanoempireai.com?subject=${encodeURIComponent(`SkillProof Trust Manifest Inquiry: ${item.repo}`)}`}
                    className="text-xs font-mono font-bold bg-[#00B5E2] text-black px-3.5 py-2 rounded hover:bg-[#00B5E2]/90 transition-colors"
                  >
                    Request Signed Manifest →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Pricing Cards Grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-20">
          {TIERS.map((tier) => (
            <div
              key={tier.name}
              className={`rounded-2xl p-8 border flex flex-col justify-between transition-all ${
                tier.popular
                  ? 'border-[#00B5E2] bg-[#0f1423] shadow-2xl shadow-[#00B5E2]/10 relative'
                  : 'border-[#8C92A4]/20 bg-[#07090D]'
              }`}
            >
              {tier.popular && (
                <span className="absolute -top-3 right-8 bg-[#00B5E2] text-black font-mono text-xs font-bold py-1 px-3 rounded-full uppercase tracking-wider">
                  Live Checkout
                </span>
              )}

              <div>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <span className="text-xs font-mono tracking-widest text-[#8C92A4] uppercase">
                      {tier.timing}
                    </span>
                    <h2 className="text-2xl font-bold text-white mt-1">{tier.name}</h2>
                  </div>
                  <span className="text-2xl font-extrabold text-white font-mono">{tier.price}</span>
                </div>

                <p className="text-sm text-[#8C92A4] mb-6 leading-relaxed">{tier.description}</p>

                <div className="border-t border-[#8C92A4]/15 pt-6 mb-8">
                  <h3 className="text-xs font-mono text-white uppercase tracking-wider mb-4">
                    What is verified:
                  </h3>
                  <ul className="space-y-3 text-sm text-[#F4F1EA]">
                    {tier.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-2.5">
                        <Check size={16} className="text-[#A3FF00] mt-0.5 shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div>
                {tier.stripeUrl ? (
                  <Link href={tier.stripeUrl} target="_blank" rel="noopener">
                    <Button variant="default" className="w-full py-4 text-base font-bold">
                      Order {tier.name} →
                    </Button>
                  </Link>
                ) : (
                  <Link href="mailto:rob@nanoempireai.com?subject=Inquiry:%20SkillProof%20Verification">
                    <Button variant="outline" className="w-full py-4 text-sm font-mono">
                      Request Access ({tier.status})
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Technical Specification Footer */}
        <section className="bg-[#0f1423] rounded-2xl border border-[#8C92A4]/20 p-8 font-mono text-sm">
          <div className="flex items-center gap-3 text-white font-bold mb-4">
            <FileCode size={20} className="text-[#00B5E2]" />
            <h3>Trust Manifest Invariant Standard</h3>
          </div>
          <p className="text-xs text-[#8C92A4] leading-relaxed mb-4">
            A pass means our batteries failed to break your agent — not that no vulnerability exists. 
            All findings cite the exact reproducible op string and file/line coordinates. Unknowns are counted as failures.
            Never rely on vendor claim marketing when verifiable code proofs exist.
          </p>
          <div className="flex flex-wrap gap-4 text-xs">
            <Link href="/case-studies" className="text-[#00B5E2] hover:underline flex items-center gap-1">
              Read Published Case Studies →
            </Link>
            <Link href="https://nanoempireai.com/offers.json" className="text-[#00B5E2] hover:underline flex items-center gap-1">
              Raw Machine offers.json →
            </Link>
            <Link href="/m2m-state.md" className="text-[#00B5E2] hover:underline flex items-center gap-1">
              M2M Economy State (Nov 3, 2026) →
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
