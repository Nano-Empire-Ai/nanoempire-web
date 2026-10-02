import Link from 'next/link';
import { ArrowLeft, Shield, Check, Lock, Terminal, FileCode, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const metadata = {
  title: 'SkillProof Verification Catalog — Nano Empire AI',
  description: 'Cryptographic behavioral verification tiers for autonomous AI agents, tool layers, and MCP servers.',
};

const TIERS = [
  {
    name: 'SkillProof Sprint',
    price: '$500 CAD',
    timing: '48 hours',
    status: 'OPEN',
    popular: true,
    stripeUrl: 'https://buy.stripe.com/eVq00keeo5n1bCzgIwfAc0c',
    description: 'Adversarial injection-resistance and claim verification battery for a single agent skill or MCP server.',
    features: [
      '180 adversarial ops across 5 categories',
      'Direct override, tool injection, encoding smuggling',
      'Ed25519-signed Trust Manifest',
      'Offline-verifiable cryptographic proof',
      'CI regression integration snippet',
    ],
  },
  {
    name: 'MCP Verification',
    price: '$800 CAD',
    timing: '72 hours',
    status: 'INVITE ONLY',
    popular: false,
    description: 'Full stack verification for MCP server providers and marketplace listings (Smithery, Glama).',
    features: [
      'Identity & OAuth credential leakage tests',
      'Tool schema poisoning & injection battery',
      'File and shell exposure audit',
      'Verified MCP marketplace badge embed',
      '48-hour re-test window upon remediation',
    ],
  },
  {
    name: 'Agent Payments Permission Audit',
    price: '$2,500 CAD',
    timing: '5 business days',
    status: 'NEW (EARLY ADOPTER)',
    popular: false,
    description: 'Behavioral proof that your agent cannot move money, invoice, or transfer funds without human approval.',
    features: [
      '500+ adversarial payment manipulation operations',
      'Zero unauthorized payment invariant testing',
      'Idempotency and double-spend resistance',
      'OAuth & Stripe credential isolation audit',
      'Executive risk scorecard + Ed25519 Trust Manifest',
    ],
  },
  {
    name: 'VC / Architectural Diligence',
    price: '$3,500 CAD',
    timing: '5 business days',
    status: 'SCHEDULED',
    popular: false,
    description: 'Independent technical audit for pre-seed/seed investors and enterprise procurement officers evaluating AI agent companies.',
    features: [
      'Full architecture & harness deconstruction',
      'Simulated multi-agent collusion & drift analysis',
      'Data exfiltration attack simulations',
      'Confidential LP diligence report + debrief call',
    ],
  },
];

export default function SkillProofPage() {
  return (
    <main className="min-h-screen bg-[#07090D] text-[#F4F1EA] font-sans">
      {/* Top Nav */}
      <nav className="border-b border-[#8C92A4]/20 bg-[#07090D]/90 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-[#8C92A4] hover:text-white transition-colors text-sm font-mono">
            <ArrowLeft size={16} /> Back to Nano Empire
          </Link>
          <span className="text-xs font-mono uppercase tracking-widest text-[#FF7B00] border border-[#FF7B00]/30 bg-[#FF7B00]/10 px-2 py-0.5 rounded">
            SKILLPROOF SUITE
          </span>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-16">
        <header className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#00B5E2]/30 bg-[#00B5E2]/10 text-xs text-[#00B5E2] font-mono mb-4">
            <Shield size={14} /> CRYPTOGRAPHIC PROOF · NOT SCANNERS
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white mb-6">
            SkillProof Verification Tiers
          </h1>
          <p className="text-xl text-[#8C92A4] leading-relaxed">
            Every audit tests behavioral invariants under adversarial pressure, producing an Ed25519-signed Trust Manifest pinned to your code hash.
          </p>
        </header>

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
            All findings cite the exact reproducible op string. Unknowns are counted as failures.
            Never rely on vendor claim marketing when verifiable code proofs exist.
          </p>
          <div className="flex flex-wrap gap-4 text-xs">
            <Link href="/case-studies" className="text-[#00B5E2] hover:underline flex items-center gap-1">
              Read Published Case Studies →
            </Link>
            <Link href="https://nanoempireai.com/offers.json" className="text-[#00B5E2] hover:underline flex items-center gap-1">
              Raw Machine offers.json →
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
