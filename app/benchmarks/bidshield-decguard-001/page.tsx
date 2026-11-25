import React from "react";
import Link from "next/link";
import type { Metadata } from "next";
import { Shield, ArrowLeft, ArrowRight, CheckCircle2, AlertTriangle, Terminal } from "lucide-react";

export const metadata: Metadata = {
  title: "Build Log #001: Catching Clause-Severing & Negation Bugs in BidShield | Nano Empire AI",
  description:
    "Measured before/after DecGuard metamorphic contract benchmark on bidshield_kernel.py: Precision 66.67% -> 100.0%, Fatal Exact Recall 75% -> 100%, Negation FP Rate 100% -> 0% at 13.7 ms/clause.",
};

const METRICS = [
  { metric: "Contract Cases Passed (21 Clauses)", v02: "13 / 21 (61.9%)", v03: "21 / 21 (100.0%)", delta: "+38.1%" },
  { metric: "Extraction Precision", v02: "66.67%", v03: "100.00%", delta: "+33.33%" },
  { metric: "Obligation Recall", v02: "100.00%", v03: "100.00%", delta: "0.00%" },
  { metric: "Fatal-Severity Exact Recall", v02: "75.00% (6 / 8)", v03: "100.00% (8 / 8)", delta: "+25.00%" },
  { metric: "Metamorphic Negation False-Positive Rate", v02: "100.00% (6 / 6)", v03: "0.00% (0 / 6)", delta: "-100.00%" },
  { metric: "Crown-Party Separation FP Rate", v02: "0.00% (0 / 2)", v03: "0.00% (0 / 2)", delta: "0.00%" },
  { metric: "Avg Local CPU Latency / Clause", v02: "33.16 ms", v03: "13.72 ms", delta: "2.4x faster" },
];

export default function BuildLog001Page() {
  return (
    <div className="min-h-screen bg-[#07090E] text-slate-100 font-sans">
      <header className="sticky top-0 z-40 border-b border-slate-800/80 bg-[#07090E]/95 backdrop-blur-md">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-bold text-white text-base">
            <Shield className="w-5 h-5 text-amber-400" aria-hidden="true" />
            <span>Nano Empire AI</span>
          </Link>
          <div className="flex items-center gap-4 text-xs font-mono">
            <Link href="/bidshield" className="text-amber-300 hover:text-amber-200">
              /bidshield
            </Link>
            <Link href="/benchmarks/mcp-security" className="text-slate-400 hover:text-white">
              MCP Benchmarks
            </Link>
            <Link href="/developers" className="text-cyan-300 hover:text-cyan-200">
              /developers
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
        <Link
          href="/bidshield"
          className="inline-flex items-center gap-1.5 text-xs font-mono text-slate-400 hover:text-white mb-6"
        >
          <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
          Back to BidShield (853 Live Federal Tenders)
        </Link>

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono mb-4">
          <span>ENGINEERING BUILD LOG #001</span>
          <span>•</span>
          <span>2026-11-25</span>
          <span>•</span>
          <span>MEASURED BENCHMARK</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight mb-4">
          Catching Semicolon Clause-Severing &amp; Deontic Negation Bugs in BidShield with a DecGuard Contract
        </h1>

        <p className="text-base text-slate-300 leading-relaxed mb-8">
          Rather than shipping unverified marketing claims, we wrote a 21-clause metamorphic decision
          contract (<code className="text-cyan-300">bidshield_decguard.yaml</code>) and ran it
          against unmodified <code className="text-cyan-300">bidshield_kernel_v0.2</code>. The
          contract immediately caught three real defects—including a 100% false-positive rate on
          negated clauses and a 25% severity miss on semicolon-joined disqualification rules—and
          verified our <code className="text-emerald-300">v0.3</code> patch down to 0% false
          positives at 13.72 ms per clause.
        </p>

        {/* Measured Results Table */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-white mb-4">
            1. Measured Baseline (v0.2) vs. Patched Kernel (v0.3)
          </h2>
          <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/50">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-xs uppercase tracking-wider text-slate-400">
                  <th className="py-3 px-4">Measured Metric</th>
                  <th className="py-3 px-4">v0.2 Baseline</th>
                  <th className="py-3 px-4 text-emerald-300">v0.3 Patched</th>
                  <th className="py-3 px-4">Delta</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/70">
                {METRICS.map((row) => (
                  <tr key={row.metric}>
                    <td className="py-3.5 px-4 font-medium text-white">{row.metric}</td>
                    <td className="py-3.5 px-4 font-mono text-slate-400">{row.v02}</td>
                    <td className="py-3.5 px-4 font-mono font-bold text-emerald-300">{row.v03}</td>
                    <td className="py-3.5 px-4 font-mono text-amber-300">{row.delta}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-slate-500 mt-2 font-mono">
            Corpus: 8 Fatal disqualification traps, 4 High mandatory obligations, 6 negated/optional
            metamorphic traps, 2 Crown-only administrative notices, 1 prompt-injection probe. Zero
            synthetic smoothing; local CPU execution.
          </p>
        </section>

        {/* Three Bugs Caught */}
        <section className="space-y-4 mb-10">
          <h2 className="text-xl font-bold text-white mb-2">
            2. Three Concrete Defects Caught &amp; Fixed
          </h2>

          <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-5">
            <div className="flex items-center gap-2 text-amber-300 font-semibold text-sm mb-2">
              <AlertTriangle className="w-4 h-4 shrink-0" aria-hidden="true" />
              <span>Bug 1: Semicolon Clause-Severing (Fatal Recall 75% → 100%)</span>
            </div>
            <p className="text-sm text-slate-300 leading-relaxed">
              Federal RFPs routinely bind an obligation to its rejection penalty with a semicolon:{" "}
              <em>
                &quot;Bidders must attend the mandatory site visit; failure to attend shall result in
                rejection of the bid.&quot;
              </em>{" "}
              Our v0.2 regex split on <code className="text-cyan-300">;</code>, severing the bidder
              obligation from the fatal consequence and downgrading cases C01 and C04 from{" "}
              <strong>Fatal</strong> to <strong>High</strong>. Preserving semicolon-joined legal
              clauses restored 100% Fatal exact recall.
            </p>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-5">
            <div className="flex items-center gap-2 text-amber-300 font-semibold text-sm mb-2">
              <AlertTriangle className="w-4 h-4 shrink-0" aria-hidden="true" />
              <span>Bug 2: Missing Deontic Negation Guard (Negation FP 100% → 0%)</span>
            </div>
            <p className="text-sm text-slate-300 leading-relaxed">
              Clauses like <em>&quot;No site visit is required&quot;</em> and{" "}
              <em>&quot;Attendance is optional and not mandatory&quot;</em> triggered raw keyword
              matches on <code className="text-cyan-300">required|mandatory</code> across all 6
              negation tests. Adding a deterministic{" "}
              <code className="text-cyan-300">NEGATION_EXCLUSION_PATS</code> gate eliminated all 6
              false positives without dropping any positive obligations.
            </p>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-5">
            <div className="flex items-center gap-2 text-emerald-300 font-semibold text-sm mb-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" aria-hidden="true" />
              <span>Bug 3: Plain-Text Fallback Prompt-Injection Parity</span>
            </div>
            <p className="text-sm text-slate-300 leading-relaxed">
              The <code className="text-cyan-300">[PROMPT_INJECTION_BLOCKED]</code> sanitizer
              previously ran only inside the PyMuPDF branch. v0.3 enforces identical sanitization
              across plain-text and HTML fallback ingestion paths.
            </p>
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="rounded-2xl border border-amber-500/30 bg-slate-900/70 p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-white mb-1">
              Need a 19-Column Compliance Matrix in &lt;24 Hours?
            </h2>
            <p className="text-sm text-slate-300">
              Deterministic clause extraction, page-cited quotes, and a 1-page Fatal-Gate Brief for
              $299 flat—or test our live MCP gate free.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 shrink-0">
            <a
              href="/api/checkout?tier=bidshield-299"
              className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-4 py-2.5 rounded-xl text-sm transition"
            >
              <span>Order Matrix ($299)</span>
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </a>
            <Link
              href="/developers"
              className="inline-flex items-center gap-1.5 border border-cyan-500/40 text-cyan-300 hover:text-cyan-200 font-mono px-4 py-2.5 rounded-xl text-xs transition"
            >
              <Terminal className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Test /api/bidshield/gate</span>
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
