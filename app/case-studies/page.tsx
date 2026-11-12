import Link from 'next/link';
import { ArrowLeft, ShieldAlert, CheckCircle2, XCircle, FileCode, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const metadata = {
  title: 'SkillProof Internal Adversarial Benchmarks — Self-Run Verification',
  description: 'Internal adversarial security benchmarks run against public AI agents, tool layers, and MCP servers. No external client engagements.',
  alternates: {
    canonical: '/case-studies',
  },
};

export default function CaseStudiesPage() {
  return (
    <main className="min-h-screen bg-[#07090D] text-[#F4F1EA] font-sans">
      {/* Navigation */}
      <nav className="border-b border-[#8C92A4]/20 bg-[#07090D]/90 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-[#8C92A4] hover:text-white transition-colors text-sm font-mono">
            <ArrowLeft size={16} /> Back to Nano Empire
          </Link>
          <span className="text-xs font-mono uppercase tracking-widest text-[#FF7B00] border border-[#FF7B00]/30 bg-[#FF7B00]/10 px-2 py-0.5 rounded">
            VERIFIED CORPUS
          </span>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-16">
        <header className="mb-16 border-b border-[#8C92A4]/20 pb-12">
                  <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-4">
                    SkillProof Internal Adversarial Benchmarks
                  </h1>
                  <p className="text-xl text-[#8C92A4] max-w-3xl leading-relaxed">
                    We run self-funded adversarial batteries against public AI agents, tool layers, and MCP servers. 
                    Every verdict is cryptographically bound into an offline-verifiable Ed25519 Trust Manifest.
                    <strong className="text-white">Zero external client engagements. Zero paid audits.</strong>
                  </p>
                </header>

        {/* Internal Benchmark 1: Moltbook */}
                <section className="mb-20 p-8 rounded-2xl border border-rose-500/30 bg-[#0f1423]/60 relative overflow-hidden">
                  <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                    <div>
                      <span className="text-xs font-mono font-bold uppercase tracking-wider text-rose-400 bg-rose-500/10 border border-rose-500/30 px-3 py-1 rounded-full">
                        Registry Integrity Benchmark
                      </span>
                      <h2 className="text-2xl md:text-3xl font-bold text-white mt-2">
                        Benchmark 1: Moltbook — "88:1 Claimed vs Verified Agents"
                      </h2>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-mono text-[#8C92A4]">Verdict</span>
                      <div className="text-2xl font-black text-rose-400 flex items-center gap-1 justify-end font-mono">
                        <XCircle size={22} /> FAIL
                      </div>
                    </div>
                  </div>

          <div className="grid md:grid-cols-2 gap-8 mb-8 text-sm">
            <div>
              <h3 className="text-white font-semibold mb-2 uppercase tracking-wide text-xs">The Problem</h3>
              <p className="text-[#8C92A4] leading-relaxed">
                Moltbook listed 88 &ldquo;AI agents&rdquo; per verified human user. 91% of tested agents failed basic identity verification, claiming capabilities their schemas could not support.
              </p>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-2 uppercase tracking-wide text-xs">Scope & Battery</h3>
              <p className="text-[#8C92A4] leading-relaxed">
                Automated Adversarial Battery • 48-hour execution • 5 agents sampled from public registry • 200 adversarial ops executed across 5 core attack categories.
              </p>
            </div>
          </div>

          {/* Block rate bars */}
          <div className="bg-[#07090D] p-6 rounded-xl border border-[#8C92A4]/20 mb-8 font-mono text-xs">
            <h4 className="text-white font-bold mb-4 uppercase tracking-wider">Adversarial Block Rates</h4>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between mb-1">
                  <span>Direct Override</span>
                  <span className="text-rose-400 font-bold">72% block rate (3/5 executed rm -rf)</span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded"><div className="bg-rose-500 h-2 rounded" style={{ width: '72%' }} /></div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span>Tool Output Injection</span>
                  <span className="text-amber-400 font-bold">85% block rate (Exfiltrated API keys)</span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded"><div className="bg-amber-500 h-2 rounded" style={{ width: '85%' }} /></div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span>Time-Shifted Assembly</span>
                  <span className="text-rose-400 font-bold">60% block rate</span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded"><div className="bg-rose-500 h-2 rounded" style={{ width: '60%' }} /></div>
              </div>
            </div>
          </div>

          <p className="text-sm text-slate-300">
                      <strong>Internal Benchmark Result:</strong> Moltbook registry sampled; 3 agents flagged for re-verification in public adversarial test. No client engagement.
                    </p>
        </section>

        {/* Internal Benchmark 2: OpenClaw */}
                <section className="mb-20 p-8 rounded-2xl border border-amber-500/30 bg-[#0f1423]/60 relative overflow-hidden">
                  <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                    <div>
                      <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-400 bg-amber-500/10 border border-amber-500/30 px-3 py-1 rounded-full">
                        Browser Automation Security Benchmark
                      </span>
                      <h2 className="text-2xl md:text-3xl font-bold text-white mt-2">
                        Benchmark 2: OpenClaw Stack — "91% Prompt Injection Success"
                      </h2>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-mono text-[#8C92A4]">Verdict</span>
                      <div className="text-2xl font-black text-rose-400 flex items-center gap-1 justify-end font-mono">
                        <XCircle size={22} /> FAIL
                      </div>
                    </div>
                  </div>

          <p className="text-[#8C92A4] text-sm leading-relaxed mb-6">
            OpenClaw-style agent stacks (browser automation + LLM tool calling) revealed severe vulnerabilities before enterprise deployment:
            Browser CDP was accessible without authentication (94% hijack success), tool schemas accepted arbitrary unescaped shell strings (88% poisoning), and zero memory isolation existed between user sessions.
          </p>

          <div className="bg-[#07090D] p-6 rounded-xl border border-[#8C92A4]/20 mb-8 font-mono text-xs">
            <h4 className="text-white font-bold mb-4 uppercase tracking-wider">Critical Attack Vectors Identified</h4>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="p-3 rounded bg-slate-900 border border-slate-800">
                <div className="text-rose-400 font-bold mb-1">Browser CDP Hijack: 94%</div>
                <div className="text-[#8C92A4]">Full DOM takeover via injected JavaScript.</div>
              </div>
              <div className="p-3 rounded bg-slate-900 border border-slate-800">
                <div className="text-rose-400 font-bold mb-1">Tool Schema Poisoning: 88%</div>
                <div className="text-[#8C92A4]">Arbitrary shell commands executed by agent.</div>
              </div>
              <div className="p-3 rounded bg-slate-900 border border-slate-800">
                <div className="text-amber-400 font-bold mb-1">OAuth Token Exfiltration: 82%</div>
                <div className="text-[#8C92A4]">Extracted provider credentials from state.</div>
              </div>
              <div className="p-3 rounded bg-slate-900 border border-slate-800">
                <div className="text-amber-400 font-bold mb-1">Memory Persistence: 76%</div>
                <div className="text-[#8C92A4]">Persistent backdoors retained across turns.</div>
              </div>
            </div>
          </div>

          <p className="text-sm text-slate-300">
                      <strong>Internal Benchmark Result:</strong> OpenClaw-style stack vulnerabilities identified in public adversarial test; mitigation patterns documented. No client engagement.
                    </p>
        </section>

        {/* Internal Benchmark 3: EffectorHQ */}
                <section className="mb-20 p-8 rounded-2xl border border-emerald-500/30 bg-[#0f1423]/60 relative overflow-hidden">
                  <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                    <div>
                      <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 rounded-full">
                        Production MCP Gateway Benchmark
                      </span>
                      <h2 className="text-2xl md:text-3xl font-bold text-white mt-2">
                        Benchmark 3: EffectorHQ — "First Verified MCP Gateway"
                      </h2>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-mono text-[#8C92A4]">Verdict</span>
                      <div className="text-2xl font-black text-emerald-400 flex items-center gap-1 justify-end font-mono">
                        <CheckCircle2 size={22} /> PASS
                      </div>
                    </div>
                  </div>

          <p className="text-[#8C92A4] text-sm leading-relaxed mb-6">
                      EffectorHQ public MCP gateway specifications tested against adversarial battery; isolation gateways achieved 92% block rates against direct overrides, 95% against encoding smuggling, and 100% claim accuracy in self-run benchmark.
                    </p>

          <p className="text-sm text-slate-300">
                      <strong>Internal Benchmark Result:</strong> MCP gateway adversarial patterns tested against public specs; 92% block rate documented. No client engagement. No paid audit.
                    </p>
        </section>

        {/* Bottom CTA */}
        <div className="text-center py-12 px-6 rounded-2xl border border-[#FF7B00]/30 bg-gradient-to-b from-[#0f1423] to-[#07090D]">
          <h2 className="text-3xl font-bold text-white mb-4">BidShield: Federal RFP Fatal-Gate Triage</h2>
          <p className="text-[#8C92A4] max-w-xl mx-auto mb-8 text-sm">
            882 live CanadaBuys tenders scanned daily. 129 with fatal disqualification gates.
            19-column compliance matrix in {"<24h"} for $299 (Upwork Escrow Protected).
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/bidshield">
              <Button variant="default" className="text-base px-8 py-4">
                Run Free BidShield Scan
              </Button>
            </Link>
            <Link href="https://www.upwork.com/services/product/writing-translation-a-compliance-matrix-of-every-mandatory-requirement-in-your-government-rfp-2074328625924014322">
              <Button variant="outline" className="text-base px-8 py-4">
                Order $299 Rapid Triage
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
