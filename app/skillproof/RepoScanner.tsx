'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Search, AlertTriangle, ExternalLink, Loader2, CheckCircle2 } from 'lucide-react';

interface PreAuditResult {
  repo: string;
  stars: number;
  tree_sha: string;
  license: string;
  total_files_in_repo: number;
  skillproof_score: number;
  governance_gaps: string[];
  code_surface_findings: Array<{
    id: string;
    severity: string;
    title: string;
    file: string;
    line: number;
    snippet: string;
  }>;
  preaudit_id: string;
}

export default function RepoScanner() {
  const [repoInput, setRepoInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<PreAuditResult | null>(null);

  async function handleScan(e: React.FormEvent) {
    e.preventDefault();
    if (!repoInput.trim()) return;
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch('/api/skillproof/preaudit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ repo: repoInput }),
      });
      const data = await res.json();
      if (!res.ok || data.error) {
        setError(data.error || 'Unable to scan repository.');
      } else {
        setResult(data);
      }
    } catch {
      setError('Network error while scanning repository.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mb-14 rounded-2xl border border-[#00B5E2]/40 bg-[#0f1423] p-6 md:p-8 shadow-xl shadow-[#00B5E2]/5">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-[#00B5E2]">
            INSTANT SELF-SERVE X-RAY (ZERO CLONE · LIVE GITHUB TREE)
          </span>
          <h2 className="text-xl md:text-2xl font-bold text-white mt-1">
            Pre-Audit Any Public MCP Server or AI Agent Repo
          </h2>
        </div>
        <span className="text-xs font-mono text-[#8C92A4]">
          Checks `SECURITY.md`, lockfiles, tests &amp; static execution sinks
        </span>
      </div>

      <form onSubmit={handleScan} className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8C92A4]" />
          <input
            type="text"
            value={repoInput}
            onChange={(e) => setRepoInput(e.target.value)}
            placeholder="owner/repo or https://github.com/owner/repo (e.g. modelcontextprotocol/servers)"
            className="w-full pl-10 pr-4 py-3 rounded-lg bg-[#07090D] border border-[#8C92A4]/30 text-white font-mono text-sm focus:outline-none focus:border-[#00B5E2]"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-3 rounded-lg bg-[#00B5E2] text-black font-mono font-bold text-sm hover:bg-[#00B5E2]/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2 shrink-0 cursor-pointer"
        >
          {loading ? (
            <>
              <Loader2 size={16} className="animate-spin" /> Scanning Tree...
            </>
          ) : (
            'Run Free Pre-Audit →'
          )}
        </button>
      </form>

      {error && (
        <div className="mt-4 p-3 rounded-lg border border-red-500/40 bg-red-500/10 text-red-300 text-xs font-mono">
          {error}
        </div>
      )}

      {result && (
        <div className="mt-6 rounded-xl border border-[#A3FF00]/40 bg-[#07090D] p-5 space-y-4">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-3">
                <a
                  href={`https://github.com/${result.repo}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-lg font-bold text-white hover:text-[#00B5E2] font-mono flex items-center gap-1.5"
                >
                  {result.repo} <ExternalLink size={14} />
                </a>
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-white/10 text-[#F4F1EA]">
                  ★ {result.stars.toLocaleString()}
                </span>
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-white/5 text-[#8C92A4]">
                  SHA: {result.tree_sha}
                </span>
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-white/5 text-[#8C92A4]">
                  {result.total_files_in_repo.toLocaleString()} files ({result.license})
                </span>
                <span className="text-xs font-mono px-2 py-0.5 rounded border border-[#00B5E2]/30 text-[#00B5E2]">
                  {result.preaudit_id}
                </span>
              </div>

              {result.governance_gaps.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {result.governance_gaps.map((g, i) => (
                    <span
                      key={i}
                      className="text-xs font-mono text-[#FF7B00] bg-[#FF7B00]/10 border border-[#FF7B00]/30 px-2 py-0.5 rounded flex items-center gap-1"
                    >
                      <AlertTriangle size={12} /> {g}
                    </span>
                  ))}
                </div>
              )}

              {result.code_surface_findings.length > 0 ? (
                <div className="space-y-1 pt-1">
                  {result.code_surface_findings.map((fn, i) => (
                    <div
                      key={i}
                      className="text-xs font-mono text-[#8C92A4] bg-black/40 px-3 py-1.5 rounded border border-white/5"
                    >
                      <span className="text-[#FF7B00] font-bold">[{fn.severity}]</span>{' '}
                      <span className="text-white">
                        {fn.file}:L{fn.line}
                      </span>{' '}
                      — {fn.title} <code className="text-[#00B5E2] ml-1">{fn.snippet}</code>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs font-mono text-[#A3FF00] flex items-center gap-1.5">
                  <CheckCircle2 size={14} /> Zero high-risk shell/eval execution sinks detected in sampled entrypoints.
                </p>
              )}
            </div>

            <div className="flex lg:flex-col items-center lg:items-end justify-between gap-3 shrink-0 border-t lg:border-t-0 pt-4 lg:pt-0 border-white/10">
              <div className="text-right">
                <span className="text-xs font-mono text-[#8C92A4] block">LIVE PRE-AUDIT SCORE</span>
                <span className="text-3xl font-extrabold font-mono text-[#A3FF00]">
                  {result.skillproof_score}/100
                </span>
              </div>
              <Link
                href={`mailto:rob@nanoempireai.com?subject=${encodeURIComponent(`SkillProof Trust Manifest Inquiry: ${result.repo}`)}`}
                className="text-xs font-mono font-bold bg-[#A3FF00] text-black px-4 py-2.5 rounded hover:bg-[#A3FF00]/90 transition-colors"
              >
                Request Ed25519 Manifest for {result.repo} →
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
