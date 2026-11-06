import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Shield, Trophy, AlertTriangle, CheckCircle2, ExternalLink, Scale, Terminal } from 'lucide-react';
import preauditsData from '@/public/skillproof/preaudits.json';

interface ComparePair {
  slug: string;
  category: string;
  repoA: string;
  repoB: string;
  summary: string;
}

export const COMPARE_PAIRS: ComparePair[] = [
  {
    slug: 'firecrawl-mcp-vs-browserbase-mcp',
    category: 'Web Scraping & Headless Browser MCPs',
    repoA: 'mendableai/firecrawl-mcp-server',
    repoB: 'browserbase/mcp-server-browserbase',
    summary: 'Head-to-head static security evaluation of the two leading web automation and scraping MCP servers across shell sinks, network egress, and supply-chain hygiene.',
  },
  {
    slug: 'stripe-agent-toolkit-vs-coinbase-agentkit',
    category: 'Fintech, Payments & On-Chain Agent Toolkits',
    repoA: 'stripe/agent-toolkit',
    repoB: 'coinbase/agentkit',
    summary: 'Empirical security comparison of Stripe Agent Toolkit vs. Coinbase AgentKit for autonomous financial execution, credential isolation, and mandate safety.',
  },
  {
    slug: 'pydantic-ai-vs-mcp-agent',
    category: 'Agent Orchestration & MCP Frameworks',
    repoA: 'pydantic/pydantic-ai',
    repoB: 'lastmile-ai/mcp-agent',
    summary: 'Security and governance comparison between Pydantic-AI and LastMile AI mcp-agent across static execution sinks and deterministic lockfile hygiene.',
  },
  {
    slug: 'mcp-inspector-vs-fastmcp',
    category: 'Core MCP Server SDKs & Developer Tooling',
    repoA: 'modelcontextprotocol/inspector',
    repoB: 'punkpeye/fastmcp',
    summary: 'Benchmark comparison of the official Model Context Protocol Inspector against FastMCP across 6 static code-surface vectors.',
  },
  {
    slug: 'notion-mcp-vs-pipeshub-ai',
    category: 'Enterprise Knowledge & Workspace Connectors',
    repoA: 'makenotion/notion-mcp-server',
    repoB: 'pipeshub-ai/pipeshub-ai',
    summary: 'Enterprise workspace connector comparison evaluating Notion MCP Server and PipesHub AI on environment variable isolation and governance policies.',
  },
  {
    slug: 'mcp-redis-vs-keboola-mcp',
    category: 'Database, Caching & Data Pipeline MCPs',
    repoA: 'redis/mcp-redis',
    repoB: 'keboola/mcp-server',
    summary: 'Data layer security comparison between Redis MCP and Keboola MCP Server on query injection boundaries and supply-chain lockfiles.',
  },
];

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return COMPARE_PAIRS.map((p) => ({ slug: p.slug }));
}

function getGrade(score: number) {
  if (score >= 95) return 'A+';
  if (score >= 85) return 'A';
  if (score >= 75) return 'B';
  return 'C';
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const pair = COMPARE_PAIRS.find((p) => p.slug === slug);
  if (!pair) return { title: 'Comparison Not Found | MSHB-2026' };

  const audits = preauditsData?.audits || [];
  const a = audits.find((x: any) => x.repo.toLowerCase() === pair.repoA.toLowerCase());
  const b = audits.find((x: any) => x.repo.toLowerCase() === pair.repoB.toLowerCase());

  return {
    title: `${pair.repoA} (${a?.skillproof_score ?? 'N/A'}/100) vs ${pair.repoB} (${b?.skillproof_score ?? 'N/A'}/100) — MCP Security Benchmark`,
    description: `${pair.summary} Compare MSHB-2026 scores, GitHub stars, governance gaps, and static code-surface findings.`,
    alternates: {
      canonical: `/benchmarks/compare/${pair.slug}`,
    },
  };
}

export default async function BenchmarkComparePage({ params }: Props) {
  const { slug } = await params;
  const pair = COMPARE_PAIRS.find((p) => p.slug === slug);
  if (!pair) notFound();

  const audits = preauditsData?.audits || [];
  const auditA = audits.find((x: any) => x.repo.toLowerCase() === pair.repoA.toLowerCase());
  const auditB = audits.find((x: any) => x.repo.toLowerCase() === pair.repoB.toLowerCase());

  if (!auditA || !auditB) notFound();

  const winner =
    auditA.skillproof_score > auditB.skillproof_score
      ? auditA
      : auditB.skillproof_score > auditA.skillproof_score
        ? auditB
        : null;

  return (
    <main className="min-h-screen bg-[#07090D] text-[#F4F1EA] font-sans">
      <nav className="border-b border-white/10 bg-[#07090D]/90 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/benchmarks/mcp-security" className="flex items-center gap-2 text-slate-400 hover:text-white transition text-xs font-mono">
            <ArrowLeft size={16} /> Back to MSHB-2026 Leaderboard
          </Link>
          <span className="text-[11px] font-mono uppercase tracking-widest text-cyan-400 border border-cyan-500/30 bg-cyan-500/10 px-2.5 py-1 rounded-full">
            HEAD-TO-HEAD SECURITY AUDIT
          </span>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-12">
        <header className="text-center max-w-4xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-amber-500/30 bg-amber-500/10 text-xs text-amber-400 font-mono mb-4">
            <Scale size={14} /> {pair.category.toUpperCase()}
          </div>
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold text-white font-mono tracking-tight mb-4">
            {auditA.repo.split('/')[1]} <span className="text-slate-500">vs</span> {auditB.repo.split('/')[1]}
          </h1>
          <p className="text-slate-400 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            {pair.summary}
          </p>
        </header>

        {/* Verdict Banner */}
        <div className="mb-10 rounded-2xl border border-emerald-500/30 bg-emerald-950/10 p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Trophy className="w-6 h-6 text-amber-400 shrink-0" />
            <div className="text-xs sm:text-sm font-mono">
              {winner ? (
                <span>
                  <strong className="text-white">{winner.repo}</strong> leads this category by{' '}
                  <strong className="text-emerald-400">
                    +{Math.abs(auditA.skillproof_score - auditB.skillproof_score)} points
                  </strong>{' '}
                  in the MSHB-2026 6-vector security benchmark.
                </span>
              ) : (
                <span>
                  <strong className="text-white">{auditA.repo}</strong> and <strong className="text-white">{auditB.repo}</strong> are tied at{' '}
                  <strong className="text-emerald-400">{auditA.skillproof_score}/100 (Grade {getGrade(auditA.skillproof_score)})</strong>.
                </span>
              )}
            </div>
          </div>
          <Link
            href="/skillproof"
            className="text-xs font-mono font-bold bg-emerald-500 text-slate-950 px-4 py-2 rounded-lg hover:bg-emerald-400 transition shrink-0"
          >
            Run Live Repo Audit →
          </Link>
        </div>

        {/* Side-by-Side Cards */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {[auditA, auditB].map((item: any) => {
            const [owner, repoName] = item.repo.split('/');
            const grade = getGrade(item.skillproof_score);
            return (
              <div key={item.repo} className="rounded-2xl border border-white/10 bg-[#0f1423] p-6 sm:p-8 flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between gap-4 mb-6 pb-6 border-b border-white/10">
                    <div>
                      <Link
                        href={`/skillproof/repo/${owner}/${repoName}`}
                        className="text-xl font-bold font-mono text-white hover:text-cyan-400 transition flex items-center gap-2"
                      >
                        {item.repo} <ExternalLink size={14} />
                      </Link>
                      <div className="text-xs font-mono text-slate-400 mt-2 flex flex-wrap gap-2">
                        <span>★ {item.stars?.toLocaleString()}</span>
                        <span>·</span>
                        <span>SHA: {item.tree_sha?.slice(0, 8)}</span>
                        <span>·</span>
                        <span>{item.license}</span>
                      </div>
                    </div>
                    <div className="text-right bg-black/50 border border-white/10 px-4 py-2.5 rounded-xl shrink-0">
                      <span className="text-[10px] font-mono text-slate-400 block">MSHB SCORE</span>
                      <span className="text-2xl font-extrabold font-mono text-emerald-400">
                        {item.skillproof_score}/100
                      </span>
                      <span className="text-[10px] font-mono text-amber-400 block">Grade {grade}</span>
                    </div>
                  </div>

                  {/* Governance Gaps */}
                  <div className="mb-6">
                    <h3 className="text-xs font-mono uppercase text-cyan-400 font-bold mb-3">
                      Governance &amp; Supply-Chain Hygiene
                    </h3>
                    {item.governance_gaps && item.governance_gaps.length > 0 ? (
                      <div className="space-y-2">
                        {item.governance_gaps.map((g: string, i: number) => (
                          <div key={i} className="text-xs font-mono text-amber-300 bg-amber-500/10 border border-amber-500/20 px-3 py-2 rounded flex items-center gap-2">
                            <AlertTriangle size={13} className="shrink-0" />
                            <span>{g}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-xs font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-2 rounded flex items-center gap-2">
                        <CheckCircle2 size={13} className="shrink-0" />
                        <span>Full governance hygiene verified (SECURITY.md, lockfile, license).</span>
                      </div>
                    )}
                  </div>

                  {/* Static Findings */}
                  <div className="mb-6">
                    <h3 className="text-xs font-mono uppercase text-cyan-400 font-bold mb-3">
                      Static Execution Sinks ({item.code_surface_findings?.length || 0})
                    </h3>
                    {item.code_surface_findings && item.code_surface_findings.length > 0 ? (
                      <div className="space-y-2">
                        {item.code_surface_findings.slice(0, 3).map((fn: any, i: number) => (
                          <div key={i} className="text-xs font-mono bg-black/50 p-3 rounded border border-white/5">
                            <div className="flex justify-between text-amber-400 font-bold mb-1">
                              <span>[{fn.severity}] {fn.title}</span>
                              <span className="text-slate-400">{fn.file}:L{fn.line}</span>
                            </div>
                            <code className="text-[11px] text-cyan-300 block truncate">{fn.snippet}</code>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs font-mono text-emerald-400">
                        ✓ Zero high-risk shell, eval, or unvalidated filesystem sinks detected.
                      </p>
                    )}
                  </div>
                </div>

                <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                  <img
                    src={`/api/badge/${owner}/${repoName}.svg?style=benchmark`}
                    alt={`${item.repo} badge`}
                    className="h-5"
                  />
                  <Link
                    href={`/skillproof/repo/${owner}/${repoName}`}
                    className="text-xs font-mono text-cyan-400 hover:underline"
                  >
                    Full Audit Scorecard →
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* Other Comparisons */}
        <section className="rounded-2xl border border-white/10 bg-[#0f1423]/60 p-6 sm:p-8">
          <h2 className="text-lg font-bold font-mono text-white mb-4">
            More Head-to-Head MCP Security Comparisons
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs font-mono">
            {COMPARE_PAIRS.filter((p) => p.slug !== pair.slug).map((p) => (
              <Link
                key={p.slug}
                href={`/benchmarks/compare/${p.slug}`}
                className="p-3 rounded-xl border border-white/5 bg-black/40 hover:border-cyan-500/40 transition flex flex-col justify-between gap-2"
              >
                <span className="text-[10px] text-cyan-400">{p.category}</span>
                <span className="text-white font-bold">{p.repoA.split('/')[1]} vs {p.repoB.split('/')[1]} →</span>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
