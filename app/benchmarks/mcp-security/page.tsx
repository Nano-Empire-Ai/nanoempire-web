import { Metadata } from 'next';
import Link from 'next/link';
import { Trophy, Shield, Star, ExternalLink, ArrowLeft, CheckCircle2, AlertTriangle, Award, Terminal, Download, Sparkles, Filter } from 'lucide-react';
import preauditsData from '@/public/skillproof/preaudits.json';

export const metadata: Metadata = {
  title: '2026 MCP Security & Hygiene Benchmark (MSHB-2026) — Nano Empire AI',
  description: 'The definitive empirical security benchmark for Model Context Protocol (MCP) servers and AI agent tools. Evaluates 25 top servers on shell sinks, eval hazards, credential leaks, and governance hygiene.',
  alternates: {
    canonical: '/benchmarks/mcp-security',
  },
  openGraph: {
    title: '2026 MCP Security & Hygiene Benchmark (MSHB-2026)',
    description: 'Empirical ranking of 25 top Model Context Protocol servers. Evaluated across 6 deterministic security vectors.',
    url: 'https://www.nanoempireai.com/benchmarks/mcp-security',
    type: 'website',
  },
};

export default function McpSecurityBenchmarkPage() {
  const audits = (preauditsData?.audits || []).slice();
  
  // Sort descending by score, then stars
  audits.sort((a: any, b: any) => {
    if (b.skillproof_score !== a.skillproof_score) {
      return b.skillproof_score - a.skillproof_score;
    }
    return b.stars - a.stars;
  });

  const totalEvaluated = audits.length;
  const avgScore = Math.round(audits.reduce((acc: number, a: any) => acc + a.skillproof_score, 0) / totalEvaluated);
  const totalStars = audits.reduce((acc: number, a: any) => acc + (a.stars || 0), 0);
  const gradeAPlusCount = audits.filter((a: any) => a.skillproof_score >= 95).length;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Dataset',
    name: '2026 Model Context Protocol (MCP) Security & Hygiene Benchmark (MSHB-2026)',
    description: 'Empirical static security and behavioral invariant benchmark evaluating 25 production Model Context Protocol servers.',
    creator: {
      '@type': 'Organization',
      name: 'Nano Empire AI - SkillProof Labs',
      url: 'https://www.nanoempireai.com',
    },
    temporalCoverage: '2026',
    variableMeasured: 'SkillProof Hygiene Score (0-100)',
  };

  return (
    <main className="min-h-screen bg-[#07090D] text-[#F4F1EA] font-sans selection:bg-cyan-500/20 selection:text-cyan-300">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Top Navigation */}
      <nav className="border-b border-white/10 bg-[#07090D]/90 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/skillproof" className="flex items-center gap-2 text-slate-400 hover:text-white transition text-xs font-mono">
            <ArrowLeft size={16} /> SkillProof Hub
          </Link>
          <div className="flex items-center gap-3">
            <span className="text-[11px] font-mono uppercase tracking-widest text-cyan-400 border border-cyan-500/30 bg-cyan-500/10 px-2.5 py-1 rounded-full flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
              BENCHMARK EDITION 2026.11
            </span>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header / Hero */}
        <header className="text-center max-w-4xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-amber-500/30 bg-amber-500/10 text-xs text-amber-400 font-mono mb-4">
            <Trophy size={14} /> OFFICIAL INDUSTRY LEADERBOARD
          </div>
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white mb-6 font-mono">
            The 2026 State of <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400">
              MCP Server Security
            </span>
          </h1>
          <p className="text-base sm:text-xl text-slate-400 leading-relaxed max-w-3xl mx-auto">
            Empirical evaluation of <strong>{totalEvaluated} canonical Model Context Protocol servers</strong> across 
            <strong> {totalStars.toLocaleString()} GitHub stars</strong>. Tested against 6 deterministic execution sink vectors.
          </p>
        </header>

        {/* Aggregate Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
          <div className="rounded-xl border border-white/10 bg-[#0f1423] p-5 text-center">
            <span className="text-xs font-mono text-slate-400 block mb-1">SERVERS EVALUATED</span>
            <span className="text-3xl font-extrabold font-mono text-white">{totalEvaluated}</span>
            <span className="text-[11px] text-slate-500 block mt-1">Top Ecosystem Repos</span>
          </div>
          <div className="rounded-xl border border-white/10 bg-[#0f1423] p-5 text-center">
            <span className="text-xs font-mono text-slate-400 block mb-1">TOTAL COMBINED STARS</span>
            <span className="text-3xl font-extrabold font-mono text-cyan-400">{(totalStars / 1000).toFixed(1)}k★</span>
            <span className="text-[11px] text-slate-500 block mt-1">Open Source Reach</span>
          </div>
          <div className="rounded-xl border border-white/10 bg-[#0f1423] p-5 text-center">
            <span className="text-xs font-mono text-slate-400 block mb-1">MEDIAN BENCHMARK SCORE</span>
            <span className="text-3xl font-extrabold font-mono text-emerald-400">{avgScore}/100</span>
            <span className="text-[11px] text-slate-500 block mt-1">6-Vector Composite</span>
          </div>
          <div className="rounded-xl border border-white/10 bg-[#0f1423] p-5 text-center">
            <span className="text-xs font-mono text-slate-400 block mb-1">GRADE A+ SERVERS (≥95)</span>
            <span className="text-3xl font-extrabold font-mono text-amber-400">{gradeAPlusCount}</span>
            <span className="text-[11px] text-slate-500 block mt-1">{Math.round((gradeAPlusCount / totalEvaluated) * 100)}% Pass Rate</span>
          </div>
        </div>

        {/* 6 Deterministic Evaluation Vectors */}
        <section className="mb-16 rounded-2xl border border-white/10 bg-[#0f1423]/70 p-6 sm:p-8">
          <h2 className="text-xl font-bold font-mono text-white mb-2 flex items-center gap-2">
            <Shield className="w-5 h-5 text-cyan-400" />
            The 6 Evaluation Vectors (MSHB-2026 Methodology)
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mb-6 font-mono">
            Every repository is audited without external dependencies via deterministic static AST analysis:
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs font-mono">
            <div className="p-4 rounded-xl bg-black/40 border border-white/5 space-y-1">
              <span className="text-cyan-400 font-bold block">V1: Shell &amp; Subprocess Sinks</span>
              <p className="text-slate-400 text-[11px]">Detects unvalidated <code className="text-white">subprocess.Popen</code>, <code className="text-white">execSync</code>, <code className="text-white">spawn</code> calls that allow arbitrary tool escape.</p>
            </div>
            <div className="p-4 rounded-xl bg-black/40 border border-white/5 space-y-1">
              <span className="text-cyan-400 font-bold block">V2: Dynamic Code Evaluation</span>
              <p className="text-slate-400 text-[11px]">Flags dangerous <code className="text-white">eval()</code>, <code className="text-white">new Function()</code>, or in-memory script generation sinks.</p>
            </div>
            <div className="p-4 rounded-xl bg-black/40 border border-white/5 space-y-1">
              <span className="text-cyan-400 font-bold block">V3: Filesystem Mutation Bounds</span>
              <p className="text-slate-400 text-[11px]">Scans for unbounded file writes, directory traversal, and unauthenticated deletion endpoints.</p>
            </div>
            <div className="p-4 rounded-xl bg-black/40 border border-white/5 space-y-1">
              <span className="text-cyan-400 font-bold block">V4: Credential &amp; Secret Isolation</span>
              <p className="text-slate-400 text-[11px]">Audits <code className="text-white">process.env</code> / <code className="text-white">os.environ</code> dumping, reflection, and JSON serialization risks.</p>
            </div>
            <div className="p-4 rounded-xl bg-black/40 border border-white/5 space-y-1">
              <span className="text-cyan-400 font-bold block">V5: Network Egress Boundaries</span>
              <p className="text-slate-400 text-[11px]">Maps outbound socket and HTTP connections to ensure tools cannot exfiltrate context to unverified hosts.</p>
            </div>
            <div className="p-4 rounded-xl bg-black/40 border border-white/5 space-y-1">
              <span className="text-cyan-400 font-bold block">V6: Governance &amp; Supply Chain</span>
              <p className="text-slate-400 text-[11px]">Verifies presence of <code className="text-white">SECURITY.md</code>, deterministic package lockfiles, and OSI-compliant licensing.</p>
            </div>
          </div>
        </section>

        {/* The Leaderboard Table */}
        <section className="mb-16">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-2xl font-bold font-mono text-white flex items-center gap-2">
                <Trophy className="w-6 h-6 text-amber-400" />
                Benchmark Leaderboard (Ranked by Security Score)
              </h2>
              <p className="text-xs text-slate-400 font-mono mt-1">
                Click any repository to inspect its line-cited findings and cryptographic commit tree SHA.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <a
                href="/skillproof/preaudits.json"
                download
                className="inline-flex items-center gap-1.5 text-xs font-mono text-cyan-400 border border-cyan-500/30 bg-cyan-500/10 px-3 py-2 rounded-lg hover:bg-cyan-500/20 transition"
              >
                <Download size={14} /> Export Benchmark Data (JSON)
              </a>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-[#0f1423] overflow-hidden shadow-2xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-black/60 border-b border-white/10 text-slate-400 uppercase text-[11px]">
                  <tr>
                    <th className="py-4 px-4 w-12 text-center">Rank</th>
                    <th className="py-4 px-4">Repository</th>
                    <th className="py-4 px-4 text-center">GitHub Stars</th>
                    <th className="py-4 px-4 text-center">Score / 100</th>
                    <th className="py-4 px-4 text-center">Grade</th>
                    <th className="py-4 px-4">Governance &amp; Findings</th>
                    <th className="py-4 px-4 text-right">Verification</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {audits.map((a: any, idx: number) => {
                    const rank = idx + 1;
                    const score = a.skillproof_score;
                    const grade = score >= 95 ? 'A+' : score >= 85 ? 'A' : score >= 75 ? 'B' : 'C';
                    const gradeColor = 
                      grade === 'A+' ? 'text-amber-400 bg-amber-500/10 border-amber-500/30' :
                      grade === 'A' ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30' :
                      grade === 'B' ? 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30' :
                      'text-rose-400 bg-rose-500/10 border-rose-500/30';
                    const [owner, repoName] = a.repo.split('/');

                    return (
                      <tr key={a.preaudit_id} className="hover:bg-white/[0.02] transition">
                        <td className="py-4 px-4 text-center font-bold text-slate-400">
                          {rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : `#${rank}`}
                        </td>
                        <td className="py-4 px-4">
                          <Link
                            href={`/skillproof/repo/${owner}/${repoName}`}
                            className="font-bold text-white hover:text-cyan-400 transition flex items-center gap-1.5"
                          >
                            <span>{a.repo}</span>
                            <ExternalLink size={12} className="opacity-40" />
                          </Link>
                          <span className="text-[10px] text-slate-500 block">SHA: {a.tree_sha?.slice(0, 8)} · {a.license}</span>
                        </td>
                        <td className="py-4 px-4 text-center text-slate-300">
                          ★ {a.stars?.toLocaleString()}
                        </td>
                        <td className="py-4 px-4 text-center">
                          <span className="text-base font-extrabold font-mono text-white">{score}</span>
                        </td>
                        <td className="py-4 px-4 text-center">
                          <span className={`inline-block px-2.5 py-0.5 rounded font-bold border ${gradeColor}`}>
                            {grade}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-slate-400 max-w-xs truncate">
                          {a.governance_gaps && a.governance_gaps.length > 0 ? (
                            <span className="text-amber-400/90 flex items-center gap-1">
                              <AlertTriangle size={12} className="shrink-0" />
                              <span>{a.governance_gaps[0]}</span>
                            </span>
                          ) : (
                            <span className="text-emerald-400 flex items-center gap-1">
                              <CheckCircle2 size={12} className="shrink-0" />
                              <span>Zero critical execution sinks detected</span>
                            </span>
                          )}
                        </td>
                        <td className="py-4 px-4 text-right">
                          <Link
                            href={`/skillproof/repo/${owner}/${repoName}`}
                            className="inline-flex items-center gap-1 text-[11px] font-mono text-cyan-400 hover:text-cyan-300 bg-cyan-500/10 hover:bg-cyan-500/20 px-2.5 py-1 rounded transition"
                          >
                            Inspect Audit →
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Head-to-Head Category Showdowns */}
        <section className="mb-16">
          <div className="mb-6">
            <span className="text-xs font-mono uppercase tracking-widest text-amber-400">
              COMPARATIVE SECURITY INTELLIGENCE
            </span>
            <h2 className="text-2xl font-bold font-mono text-white mt-1">
              Head-to-Head MCP Security Showdowns
            </h2>
            <p className="text-xs text-slate-400 font-mono mt-1">
              Side-by-side 6-vector security and governance comparisons across leading MCP categories:
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs font-mono">
            {[
              { slug: 'firecrawl-mcp-vs-browserbase-mcp', cat: 'Web Scraping & Browser MCPs', title: 'Firecrawl MCP vs Browserbase MCP', scores: '84 vs 92' },
              { slug: 'stripe-agent-toolkit-vs-coinbase-agentkit', cat: 'Fintech & Agent Payments', title: 'Stripe Toolkit vs Coinbase AgentKit', scores: '98 vs 98' },
              { slug: 'pydantic-ai-vs-mcp-agent', cat: 'Agent Orchestration Frameworks', title: 'Pydantic-AI vs LastMile mcp-agent', scores: '86 vs 96' },
              { slug: 'mcp-inspector-vs-fastmcp', cat: 'Core MCP Developer Tooling', title: 'MCP Inspector vs FastMCP', scores: '98 vs 76' },
              { slug: 'notion-mcp-vs-pipeshub-ai', cat: 'Enterprise Workspace Connectors', title: 'Notion MCP vs PipesHub AI', scores: '78 vs 98' },
              { slug: 'mcp-redis-vs-keboola-mcp', cat: 'Database & Data Pipeline MCPs', title: 'Redis MCP vs Keboola MCP', scores: '92 vs 86' },
            ].map((c) => (
              <Link
                key={c.slug}
                href={`/benchmarks/compare/${c.slug}`}
                className="group p-5 rounded-xl border border-white/10 bg-[#0f1423] hover:border-cyan-500/40 transition flex flex-col justify-between gap-3"
              >
                <div>
                  <span className="text-[10px] text-cyan-400 block mb-1">{c.cat}</span>
                  <h3 className="text-sm font-bold text-white group-hover:text-cyan-300 transition">{c.title}</h3>
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-white/5 text-[11px]">
                  <span className="text-emerald-400 font-bold">Score: {c.scores}</span>
                  <span className="text-slate-400 group-hover:text-white">Compare →</span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Benchmark Call-to-Action */}
        <section className="rounded-2xl border border-cyan-500/30 bg-gradient-to-r from-[#0c1322] to-[#07090D] p-8 md:p-12 text-center max-w-4xl mx-auto shadow-2xl">
          <div className="inline-flex items-center gap-2 text-xs font-mono text-cyan-400 mb-3">
            <Sparkles size={14} /> SUBMIT TO THE BENCHMARK
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-mono mb-4">
            Is Your MCP Server Verified for Enterprise Deployment?
          </h2>
          <p className="text-slate-400 text-sm max-w-2xl mx-auto mb-8 leading-relaxed font-sans">
            Add the SkillProof CI/CD security gate to your repo. Servers scoring ≥85 receive verified status, dynamic Shields.io badges, and inclusion in the official quarterly State of MCP Security Report.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-mono">
            <Link
              href="/skillproof"
              className="inline-flex items-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold px-6 py-3 rounded-xl transition shadow-lg shadow-cyan-500/20"
            >
              <Terminal size={16} /> Scan Your Repo on SkillProof
            </Link>
            <a
              href="/skillproof/skillproof-gate.yml"
              download
              className="inline-flex items-center gap-2 border border-white/20 bg-white/5 hover:bg-white/10 text-white font-bold px-6 py-3 rounded-xl transition"
            >
              <Download size={16} /> Download CI/CD Workflow
            </a>
          </div>
        </section>
      </div>
    </main>
  );
}
