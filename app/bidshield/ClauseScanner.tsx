'use client';

import { useState } from 'react';
import { Shield, AlertOctagon, CheckCircle2, Loader2, ExternalLink, Sparkles, DollarSign } from 'lucide-react';

interface TrapFinding {
  id: string;
  severity: 'FATAL' | 'HIGH' | 'MEDIUM';
  clause_type: string;
  estimated_jev_exposure_usd: number;
  remediation: string;
}

interface GateResult {
  gate_id: string;
  gate_decision: 'PASS_PRELIMINARY' | 'CONDITIONAL_HUMAN_REVIEW' | 'HALT_FATAL_DISQUALIFIER';
  risk_score_0_100: number;
  quantified_decision_exposure_jev_usd: number;
  fatal_and_high_traps_detected: TrapFinding[];
}

const SAMPLE_EXCERPT =
  'Section 2.1: Attendance at the mandatory site visit on Thursday at 10:00 EST is required for all bidders. Contractors must hold an active Facility Security Clearance (Secret Level II) at time of bid closing and provide a 100% performance bond, prevailing wage certified payroll, and $5M errors and omissions insurance. Delay liquidated damages of $2,500 per calendar day apply.';

export default function ClauseScanner() {
  const [text, setText] = useState('');
  const [naics, setNaics] = useState('238220');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<GateResult | null>(null);

  async function runScan(inputText: string) {
    if (!inputText.trim()) return;
    setLoading(true);
    try {
      const res = await fetch('/api/bidshield/gate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          solicitation_text: inputText,
          naics_code: naics,
          estimated_contract_value_usd: 2400000,
        }),
      });
      const data = await res.json();
      if (res.ok && !data.error) {
        setResult(data);
      }
    } catch {
      // ignore network error
    } finally {
      setLoading(false);
    }
  }

  function handleLoadSample() {
    setText(SAMPLE_EXCERPT);
    runScan(SAMPLE_EXCERPT);
  }

  return (
    <section className="mb-16 rounded-2xl border border-[#00B5E2]/40 bg-[#0f1423] p-6 sm:p-8 shadow-2xl shadow-[#00B5E2]/5">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-mono text-[#00B5E2] font-bold mb-1">
            <Sparkles size={14} /> INSTANT PRE-BID DISQUALIFIER SCANNER (LIVE GATE API)
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white font-mono">
            Paste Any RFP Section or SOW Excerpt
          </h2>
          <p className="text-xs sm:text-sm text-[#8C92A4] mt-1">
            Instantly test any solicitation paragraph for fatal site-visit traps, security clearance hurdles, bonding mandates, and JEV financial exposure.
          </p>
        </div>
        <button
          type="button"
          onClick={handleLoadSample}
          className="text-xs font-mono text-amber-300 border border-amber-500/40 bg-amber-500/10 hover:bg-amber-500/20 px-3.5 py-2 rounded-lg transition shrink-0"
        >
          Load Sample Federal RFP Excerpt →
        </button>
      </div>

      <div className="space-y-4">
        <textarea
          rows={4}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste solicitation clauses, mandatory requirements, bonding terms, or security clearance rules here..."
          className="w-full rounded-xl bg-black/60 border border-white/10 p-4 text-xs sm:text-sm font-mono text-white placeholder:text-slate-600 focus:outline-none focus:border-[#00B5E2]"
        />

        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <label className="text-xs font-mono text-slate-400">NAICS Sector:</label>
            <select
              value={naics}
              onChange={(e) => setNaics(e.target.value)}
              className="rounded-lg bg-black/60 border border-white/15 px-3 py-1.5 text-xs font-mono text-white"
            >
              <option value="238220">238220 — HVAC &amp; Mechanical</option>
              <option value="561720">561720 — Janitorial &amp; Custodial</option>
              <option value="236220">236220 — Commercial Construction</option>
              <option value="541512">541512 — IT &amp; DevSecOps</option>
              <option value="238210">238210 — Electrical Contractors</option>
              <option value="562111">562111 — Hazardous Waste</option>
              <option value="541330">541330 — Engineering Services</option>
              <option value="561210">561210 — Facilities Support</option>
            </select>
          </div>

          <button
            type="button"
            disabled={loading || !text.trim()}
            onClick={() => runScan(text)}
            className="inline-flex items-center gap-2 bg-[#00B5E2] hover:bg-[#00B5E2]/90 disabled:opacity-50 text-black font-bold font-mono text-xs sm:text-sm px-6 py-2.5 rounded-xl transition"
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : <Shield size={16} />}
            <span>Run Instant Disqualifier Scan</span>
          </button>
        </div>
      </div>

      {result && (
        <div className="mt-8 pt-6 border-t border-white/10 space-y-6">
          <div className="grid sm:grid-cols-3 gap-4">
            <div className="rounded-xl bg-black/50 border border-white/10 p-4">
              <span className="text-[10px] font-mono text-slate-400 block">GATE DECISION</span>
              <span
                className={`text-sm sm:text-base font-extrabold font-mono mt-1 block ${
                  result.gate_decision === 'HALT_FATAL_DISQUALIFIER'
                    ? 'text-rose-400'
                    : result.gate_decision === 'CONDITIONAL_HUMAN_REVIEW'
                      ? 'text-amber-400'
                      : 'text-emerald-400'
                }`}
              >
                {result.gate_decision}
              </span>
              <span className="text-[10px] font-mono text-slate-500">ID: {result.gate_id}</span>
            </div>

            <div className="rounded-xl bg-black/50 border border-rose-500/30 p-4">
              <span className="text-[10px] font-mono text-rose-300 block">QUANTIFIED JEV EXPOSURE</span>
              <span className="text-2xl font-extrabold font-mono text-rose-400">
                ${result.quantified_decision_exposure_jev_usd.toLocaleString()} USD
              </span>
              <span className="text-[10px] font-mono text-slate-500 block">Estimated non-compliance liability</span>
            </div>

            <div className="rounded-xl bg-black/50 border border-white/10 p-4">
              <span className="text-[10px] font-mono text-slate-400 block">PRE-BID RISK SCORE</span>
              <span className="text-2xl font-extrabold font-mono text-amber-400">
                {result.risk_score_0_100}/100
              </span>
              <span className="text-[10px] font-mono text-slate-500 block">
                {result.fatal_and_high_traps_detected.length} Disqualifier Traps Triggered
              </span>
            </div>
          </div>

          {result.fatal_and_high_traps_detected.length > 0 && (
            <div className="space-y-2.5">
              <h3 className="text-xs font-mono uppercase text-rose-400 font-bold">
                Triggered Disqualifier Clauses &amp; Remediation:
              </h3>
              {result.fatal_and_high_traps_detected.map((t) => (
                <div
                  key={t.id}
                  className="rounded-xl border border-rose-500/20 bg-rose-950/15 p-4 text-xs font-mono flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <AlertOctagon size={14} className="text-rose-400 shrink-0" />
                      <span className="font-bold text-white">
                        [{t.severity}] {t.clause_type}
                      </span>
                    </div>
                    <p className="text-slate-300 font-sans text-xs pl-5">{t.remediation}</p>
                  </div>
                  <span className="text-rose-400 font-bold shrink-0">
                    ${t.estimated_jev_exposure_usd.toLocaleString()} Risk
                  </span>
                </div>
              ))}
            </div>
          )}

          <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/20 p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs">
              <strong className="text-white font-mono block text-sm mb-1">
                Need the Full 19-Column Compliance Matrix for Your Entire RFP PDF?
              </strong>
              <span className="text-slate-300">
                We decompose every mandatory &quot;shall/must&quot; clause across all addenda with page/line citations in 72 hours.
              </span>
            </div>
            <a
              href="https://www.upwork.com/services/product/writing-translation-a-compliance-matrix-of-every-mandatory-requirement-in-your-government-rfp-2074328625924014322"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold font-mono text-xs px-5 py-3 rounded-xl transition shrink-0 shadow-lg shadow-emerald-500/20"
            >
              <span>Order Matrix on Upwork ($149–$499)</span>
              <ExternalLink size={14} />
            </a>
          </div>
        </div>
      )}
    </section>
  );
}
