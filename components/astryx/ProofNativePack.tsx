import React from 'react';
import { Shield, CheckCircle2, AlertTriangle, AlertOctagon, ExternalLink, Terminal, Lock } from 'lucide-react';

/**
 * Astryx Proof-Native Machine-Economy Component Pack (React 19)
 * =============================================================
 * Constraint-driven, zero-slop UI primitives for the Deterministic Verification Layer:
 *   1. <TrustManifestCard />  — SkillProof RFC 8785 (JCS) + Ed25519 Trust Manifest
 *   2. <SettlementReceipt />  — x402 Base USDC / Stripe / AP4M Settlement Receipt
 *   3. <ComplianceMatrix />   — BidShield Deontic Solicitation Gate & JEV Exposure
 *   4. <RecallDeltaTable />   — RecallRadar 46,642-Record Match & Quarantine Schedule
 *
 * Trust-Adaptive Theme Tokens:
 *   - 'sovereign'  (score >= 80 | ALLOW_BOUNDED | PASS_PRELIMINARY): High-contrast Emerald/Cyan
 *   - 'sandbox'    (score 60..79 | CONDITIONAL_SANDBOX_ONLY | CONDITIONAL_HUMAN_REVIEW): Amber Caution
 *   - 'quarantine' (score < 60  | HALT_HIGH_RISK | HALT_FATAL_DISQUALIFIER): Crimson Halt
 */

export type TrustThemeMode = 'sovereign' | 'sandbox' | 'quarantine';

export const ASTRYX_TRUST_THEMES: Record<
  TrustThemeMode,
  {
    border: string;
    bg: string;
    badgeBg: string;
    badgeText: string;
    accentText: string;
    label: string;
  }
> = {
  sovereign: {
    border: 'border-[#3ddc97]/40',
    bg: 'bg-[#07090D]',
    badgeBg: 'bg-[#3ddc97]/10 border-[#3ddc97]/40',
    badgeText: 'text-[#3ddc97]',
    accentText: 'text-[#00B5E2]',
    label: 'SOVEREIGN · ALLOW_BOUNDED',
  },
  sandbox: {
    border: 'border-[#FF7B00]/50',
    bg: 'bg-[#0b0d13]',
    badgeBg: 'bg-[#FF7B00]/15 border-[#FF7B00]/40',
    badgeText: 'text-[#FF7B00]',
    accentText: 'text-[#FF7B00]',
    label: 'SANDBOX · CONDITIONAL_REVIEW',
  },
  quarantine: {
    border: 'border-rose-500/60',
    bg: 'bg-[#12080c]',
    badgeBg: 'bg-rose-500/15 border-rose-500/40',
    badgeText: 'text-rose-400',
    accentText: 'text-rose-400',
    label: 'QUARANTINE · HALT_GATE',
  },
};

export function resolveTrustTheme(input: {
  score?: number;
  delegation?: string;
  gateDecision?: string;
}): TrustThemeMode {
  const decision = (input.delegation || input.gateDecision || '').toUpperCase();
  if (decision.includes('HALT')) return 'quarantine';
  if (decision.includes('CONDITIONAL')) return 'sandbox';
  if (typeof input.score === 'number') {
    if (input.score < 60) return 'quarantine';
    if (input.score < 75) return 'sandbox';
  }
  return 'sovereign';
}

/* -------------------------------------------------------------------------- */
/* 1. <TrustManifestCard />                                                   */
/* -------------------------------------------------------------------------- */

export interface TrustManifestCardProps {
  manifestId: string;
  repo: string;
  commitTreeSha: string;
  skillproofScore: number;
  delegationPolicy: 'ALLOW_BOUNDED' | 'CONDITIONAL_SANDBOX_ONLY' | 'HALT_HIGH_RISK';
  canonicalization?: 'RFC-8785-JCS' | 'PYTHON-SORT-KEYS-V1';
  payloadSha256: string;
  kid?: string;
  publicKeyHex?: string;
  criticalCount?: number;
  highCount?: number;
}

export function TrustManifestCard({
  manifestId,
  repo,
  commitTreeSha,
  skillproofScore,
  delegationPolicy,
  canonicalization = 'RFC-8785-JCS',
  payloadSha256,
  kid = 'skillproof-2026-10',
  publicKeyHex = '69b8d23e35b02a04aa370924c8493781527179c9078bf85f77362b2fc1da3f82',
  criticalCount = 0,
  highCount = 0,
}: TrustManifestCardProps) {
  const mode = resolveTrustTheme({ score: skillproofScore, delegation: delegationPolicy });
  const theme = ASTRYX_TRUST_THEMES[mode];

  return (
    <article
      aria-label={`SkillProof Trust Manifest for ${repo}`}
      className={`rounded-xl border ${theme.border} ${theme.bg} p-6 font-mono text-[#F4F1EA] shadow-xl space-y-4`}
    >
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
        <div className="flex items-center gap-2.5">
          <Shield size={18} className={theme.badgeText} />
          <div>
            <div className="text-xs uppercase tracking-widest text-[#8C92A4]">SkillProof Trust Manifest</div>
            <h3 className="text-base font-bold text-white">{repo}</h3>
          </div>
        </div>
        <span className={`px-2.5 py-1 rounded border text-[11px] font-bold uppercase ${theme.badgeBg} ${theme.badgeText}`}>
          {delegationPolicy} · {skillproofScore}/100
        </span>
      </header>

      <dl className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
        <div className="p-2.5 rounded bg-white/5 border border-white/10">
          <dt className="text-[#8C92A4] text-[10px] uppercase">Manifest ID &amp; Git Tree SHA</dt>
          <dd className="text-white font-semibold mt-0.5 truncate">
            {manifestId} · {commitTreeSha.slice(0, 12)}
          </dd>
        </div>
        <div className="p-2.5 rounded bg-white/5 border border-white/10">
          <dt className="text-[#8C92A4] text-[10px] uppercase">Canonicalization &amp; Signer KID</dt>
          <dd className="text-white font-semibold mt-0.5">
            {canonicalization} · Ed25519 ({kid})
          </dd>
        </div>
        <div className="p-2.5 rounded bg-white/5 border border-white/10 sm:col-span-2">
          <dt className="text-[#8C92A4] text-[10px] uppercase">Payload SHA-256 Commitment</dt>
          <dd className="text-[#00B5E2] truncate mt-0.5">{payloadSha256}</dd>
        </div>
      </dl>

      <footer className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-white/10 text-[11px] text-[#8C92A4]">
        <span>
          Sinks: {criticalCount} CRITICAL · {highCount} HIGH · PubKey {publicKeyHex.slice(0, 12)}…
        </span>
        <a
          href={`https://www.nanoempireai.com/skillproof/repo/${repo}`}
          className={`${theme.accentText} hover:underline inline-flex items-center gap-1`}
        >
          Verify Scorecard <ExternalLink size={11} />
        </a>
      </footer>
    </article>
  );
}

/* -------------------------------------------------------------------------- */
/* 2. <SettlementReceipt />                                                   */
/* -------------------------------------------------------------------------- */

export interface SettlementReceiptProps {
  protocol: 'x402-v2' | 'stripe-checkout' | 'ap4m-voucher';
  network: string;
  amount: string;
  asset: string;
  txOrSessionId: string;
  blockNumber?: number;
  ledgerMode: 'operator_self_test' | 'production_settled';
  endpoint: string;
}

export function SettlementReceipt({
  protocol,
  network,
  amount,
  asset,
  txOrSessionId,
  blockNumber,
  ledgerMode,
  endpoint,
}: SettlementReceiptProps) {
  return (
    <article
      aria-label={`Machine Economy Settlement Receipt (${protocol})`}
      className="rounded-xl border border-[#00B5E2]/40 bg-[#07090D] p-6 font-mono text-[#F4F1EA] shadow-xl space-y-4"
    >
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
        <div className="flex items-center gap-2">
          <Lock size={16} className="text-[#00B5E2]" />
          <div>
            <div className="text-[10px] uppercase tracking-widest text-[#8C92A4]">Cryptographic Settlement Receipt</div>
            <h3 className="text-sm font-bold text-white">
              {amount} {asset} via {protocol.toUpperCase()}
            </h3>
          </div>
        </div>
        <span
          className={`px-2.5 py-1 rounded border text-[10px] font-bold uppercase ${
            ledgerMode === 'production_settled'
              ? 'bg-[#3ddc97]/10 border-[#3ddc97]/40 text-[#3ddc97]'
              : 'bg-[#A3FF00]/10 border-[#A3FF00]/40 text-[#A3FF00]'
          }`}
        >
          {ledgerMode === 'production_settled' ? 'PRODUCTION SETTLED' : 'VERIFIED SELF-TEST (0 OUTSIDE CUSTOMERS)'}
        </span>
      </header>

      <dl className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
        <div className="p-2.5 rounded bg-white/5 border border-white/10">
          <dt className="text-[#8C92A4] text-[10px] uppercase">Network &amp; Endpoint</dt>
          <dd className="text-white mt-0.5 truncate">
            {network} · {endpoint}
          </dd>
        </div>
        <div className="p-2.5 rounded bg-white/5 border border-white/10">
          <dt className="text-[#8C92A4] text-[10px] uppercase">Transaction / Session Hash</dt>
          <dd className="text-[#00B5E2] mt-0.5 truncate">
            {txOrSessionId.slice(0, 18)}… {blockNumber ? `(Block ${blockNumber})` : ''}
          </dd>
        </div>
      </dl>
    </article>
  );
}

/* -------------------------------------------------------------------------- */
/* 3. <ComplianceMatrix />                                                    */
/* -------------------------------------------------------------------------- */

export interface DeonticClauseFinding {
  id: string;
  severity: 'FATAL' | 'HIGH' | 'MEDIUM';
  clauseType: string;
  evidence: string;
}

export interface ComplianceMatrixProps {
  solicitationId: string;
  title: string;
  buyer: string;
  gateDecision: 'PASS_PRELIMINARY' | 'CONDITIONAL_HUMAN_REVIEW' | 'HALT_FATAL_DISQUALIFIER';
  ap2MandateRecommendation: string;
  jevExposureUsd: number;
  findings: DeonticClauseFinding[];
}

export function ComplianceMatrix({
  solicitationId,
  title,
  buyer,
  gateDecision,
  ap2MandateRecommendation,
  jevExposureUsd,
  findings,
}: ComplianceMatrixProps) {
  const mode = resolveTrustTheme({ gateDecision });
  const theme = ASTRYX_TRUST_THEMES[mode];

  return (
    <article
      aria-label={`BidShield Compliance Matrix for ${solicitationId}`}
      className={`rounded-xl border ${theme.border} ${theme.bg} p-6 font-mono text-[#F4F1EA] shadow-xl space-y-4`}
    >
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
        <div>
          <div className="text-[10px] uppercase tracking-widest text-[#8C92A4]">
            BidShield Deontic Gate · {solicitationId} ({buyer})
          </div>
          <h3 className="text-base font-bold text-white mt-0.5">{title}</h3>
        </div>
        <span className={`px-2.5 py-1 rounded border text-[11px] font-bold uppercase ${theme.badgeBg} ${theme.badgeText}`}>
          {gateDecision}
        </span>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
        <div className="p-2.5 rounded bg-white/5 border border-white/10">
          <div className="text-[10px] text-[#8C92A4] uppercase">Quantified Decision Exposure (JEV)</div>
          <div className="text-base font-bold text-white mt-0.5">${jevExposureUsd.toLocaleString()} USD</div>
        </div>
        <div className="p-2.5 rounded bg-white/5 border border-white/10">
          <div className="text-[10px] text-[#8C92A4] uppercase">AP2 Mandate Gate Recommendation</div>
          <div className={`text-xs font-bold mt-1 ${theme.badgeText}`}>{ap2MandateRecommendation}</div>
        </div>
      </div>

      <div className="space-y-2">
        <div className="text-[10px] uppercase tracking-wider text-[#8C92A4]">Triggered Deontic Clauses ({findings.length})</div>
        {findings.map((f) => (
          <div key={f.id} className="p-3 rounded bg-black/40 border border-white/10 text-xs space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-bold text-white">
                [{f.severity}] {f.id} — {f.clauseType}
              </span>
            </div>
            <p className="text-[#8C92A4] font-sans text-xs">{f.evidence}</p>
          </div>
        ))}
      </div>
    </article>
  );
}

/* -------------------------------------------------------------------------- */
/* 4. <RecallDeltaTable />                                                    */
/* -------------------------------------------------------------------------- */

export interface RecallMatchRow {
  recallId: string;
  agency: 'CPSC' | 'FDA' | 'HEALTH_CANADA' | 'CPSC_UNILATERAL';
  severity: 'critical' | 'high' | 'medium';
  productTitle: string;
  hazard: string;
  remedy: string;
}

export interface RecallDeltaTableProps {
  corpusSize?: number;
  matches: RecallMatchRow[];
}

export function RecallDeltaTable({ corpusSize = 46642, matches }: RecallDeltaTableProps) {
  return (
    <section
      aria-label="RecallRadar Normalized Match Schedule"
      className="rounded-xl border border-[#8C92A4]/30 bg-[#07090D] p-6 font-mono text-[#F4F1EA] shadow-xl space-y-4"
    >
      <header className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-3">
        <div>
          <div className="text-[10px] uppercase tracking-widest text-[#00B5E2]">
            RecallRadar Deterministic Screen · {corpusSize.toLocaleString()} CPSC, FDA &amp; Health Canada Records
          </div>
          <h3 className="text-base font-bold text-white">Matched Safety Enforcement Notices ({matches.length})</h3>
        </div>
      </header>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-white/10 text-[#8C92A4] text-[10px] uppercase">
              <th className="py-2 pr-3">Notice ID</th>
              <th className="py-2 pr-3">Agency</th>
              <th className="py-2 pr-3">Severity</th>
              <th className="py-2 pr-3">Product</th>
              <th className="py-2">Hazard &amp; Required Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10 font-sans">
            {matches.map((m) => (
              <tr key={m.recallId}>
                <td className="py-2.5 pr-3 font-mono text-[#00B5E2] whitespace-nowrap">{m.recallId}</td>
                <td className="py-2.5 pr-3 font-mono text-xs text-white">{m.agency}</td>
                <td className="py-2.5 pr-3 font-mono uppercase text-[10px]">
                  <span
                    className={`px-2 py-0.5 rounded border ${
                      m.severity === 'critical'
                        ? 'bg-rose-500/15 border-rose-500/40 text-rose-400'
                        : 'bg-[#FF7B00]/15 border-[#FF7B00]/40 text-[#FF7B00]'
                    }`}
                  >
                    {m.severity}
                  </span>
                </td>
                <td className="py-2.5 pr-3 text-white font-medium">{m.productTitle}</td>
                <td className="py-2.5 text-[#8C92A4]">
                  {m.hazard} <strong className="text-white">({m.remedy})</strong>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
