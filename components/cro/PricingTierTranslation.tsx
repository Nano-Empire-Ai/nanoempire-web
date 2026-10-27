"use client";

import React from "react";
import { Check, Zap, Shield, Sparkles, Building2, CreditCard } from "lucide-react";

export function PricingTierTranslation() {
  return (
    <section id="pricing-tiers" className="py-20 px-6 max-w-7xl mx-auto border-b border-[#8C92A4]/15">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#FF7B00]/30 bg-[#FF7B00]/10 text-xs text-[#FF7B00] font-mono mb-3">
          <Sparkles size={13} />
          SELF-SERVE STRIPE &amp; BASE x402 SETTLEMENT
        </div>
        <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white uppercase font-mono">
          Compliance &amp; Verification Tiers
        </h2>
        <p className="text-[#8C92A4] mt-3 text-base sm:text-lg font-sans">
          A single CPSC recall lawsuit or disqualified federal bid costs $500K–$10M+. Protect your catalog and agent stack via instant Stripe checkout or x402 Base USDC micropayments.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
        {/* Tier 1: Self-Serve Compliance Report & x402 Pay-Per-Call */}
        <div className="bg-[#0f1423] border border-[#8C92A4]/20 rounded-2xl p-8 flex flex-col justify-between hover:border-[#8C92A4]/40 transition-all">
          <div>
            <div className="text-xs font-mono text-[#8C92A4] uppercase tracking-wider mb-2">RecallRadar Audit / x402 API</div>
            <div className="flex items-baseline gap-1 font-mono">
              <span className="text-4xl font-extrabold text-white">$30</span>
              <span className="text-[#8C92A4] text-sm">USD / report</span>
            </div>
            <div className="text-xs font-mono text-[#00B5E2] mt-1">or $0.10 USDC / match call via x402 on Base</div>

            <p className="text-sm text-[#8C92A4] mt-4 font-sans leading-relaxed">
              Instant self-serve inventory screening against 46,642 CPSC, FDA, and Health Canada recall records with signed PDF/CSV attestation.
            </p>

            <div className="mt-6 space-y-3 font-sans text-sm text-[#F4F1EA]">
              <div className="flex items-start gap-2.5">
                <Check size={16} className="text-[#00B5E2] shrink-0 mt-0.5" />
                <span>Full catalog scan vs. 46,642 safety records</span>
              </div>
              <div className="flex items-start gap-2.5">
                <Check size={16} className="text-[#00B5E2] shrink-0 mt-0.5" />
                <span>Signed PDF &amp; CSV compliance certificate</span>
              </div>
              <div className="flex items-start gap-2.5">
                <Check size={16} className="text-[#00B5E2] shrink-0 mt-0.5" />
                <span>1,000 free Vision DAG parses / month ($0.001 overage)</span>
              </div>
              <div className="flex items-start gap-2.5">
                <Check size={16} className="text-[#00B5E2] shrink-0 mt-0.5" />
                <span>Machine-payable HTTP 402 endpoints on Base</span>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-[#8C92A4]/15">
            <a
              href="https://buy.stripe.com/6oU4gAfis2aP21Z8c0fAc0k"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 rounded-lg border border-[#00B5E2]/50 hover:bg-[#00B5E2]/10 text-white font-mono font-semibold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all"
            >
              <CreditCard size={15} /> Buy Instant Report ($30 USD)
            </a>
          </div>
        </div>

        {/* Tier 2: Continuous Monitoring & Safety Stack (Self-Serve Stripe) */}
        <div className="bg-[#0f1423] border-2 border-[#00B5E2] rounded-2xl p-8 flex flex-col justify-between shadow-2xl relative">
          <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-[#00B5E2] text-black font-mono font-bold text-[10px] uppercase tracking-wider">
            Self-Serve Subscription
          </div>

          <div>
            <div className="text-xs font-mono text-[#00B5E2] uppercase tracking-wider mb-2 font-bold">Continuous Recall Monitoring</div>
            <div className="flex items-baseline gap-1 font-mono">
              <span className="text-4xl font-extrabold text-white">$99</span>
              <span className="text-[#8C92A4] text-sm">USD / month</span>
            </div>
            <div className="text-xs font-mono text-emerald-400 mt-1">Zero-touch Stripe Checkout · Cancel anytime</div>

            <p className="text-sm text-[#8C92A4] mt-4 font-sans leading-relaxed">
              Automated catalog re-scans, compliance delta tracking, and instant alerts whenever CPSC, FDA, or Health Canada recalls expand.
            </p>

            <div className="mt-6 space-y-3 font-sans text-sm text-[#F4F1EA]">
              <div className="flex items-start gap-2.5">
                <Check size={16} className="text-[#00B5E2] shrink-0 mt-0.5" />
                <span><strong>Automated monthly catalog re-scans</strong> + delta reports</span>
              </div>
              <div className="flex items-start gap-2.5">
                <Check size={16} className="text-[#00B5E2] shrink-0 mt-0.5" />
                <span>Immediate recall expansion &amp; remedy alerts</span>
              </div>
              <div className="flex items-start gap-2.5">
                <Check size={16} className="text-[#00B5E2] shrink-0 mt-0.5" />
                <span>50,000 included API / DAG executions per month</span>
              </div>
              <div className="flex items-start gap-2.5">
                <Check size={16} className="text-[#00B5E2] shrink-0 mt-0.5" />
                <span>Signed monthly Ed25519 audit trail for insurers</span>
              </div>
              <div className="flex items-start gap-2.5">
                <Check size={16} className="text-[#00B5E2] shrink-0 mt-0.5" />
                <span>Guaranteed P95 latency &lt; 25ms</span>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-[#8C92A4]/15">
            <a
              href="https://buy.stripe.com/00w5kE2vGg1F3630JyfAc0e"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3.5 rounded-lg bg-[#00B5E2] hover:bg-[#009ac0] text-black font-mono font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-lg shadow-[#00B5E2]/20"
            >
              <Zap size={15} /> Subscribe Instantly ($99/mo)
            </a>
          </div>
        </div>

        {/* Tier 3: Compliance Shield & SkillProof Flagship */}
        <div className="bg-[#0f1423] border border-[#FF7B00]/40 rounded-2xl p-8 flex flex-col justify-between hover:border-[#FF7B00] transition-all">
          <div>
            <div className="text-xs font-mono text-[#FF7B00] uppercase tracking-wider mb-2 font-bold">Flagship · SkillProof / Compliance Shield</div>
            <div className="flex items-baseline gap-1 font-mono">
              <span className="text-4xl font-extrabold text-white">$500</span>
              <span className="text-[#8C92A4] text-sm">CAD / sprint</span>
            </div>
            <div className="text-xs font-mono text-[#FF7B00] mt-1">or $2,400/yr Sovereign Enterprise License</div>

            <p className="text-sm text-[#8C92A4] mt-4 font-sans leading-relaxed">
              48-hour adversarial verification battery for MCP servers, agent skills, or full-solicitation BidShield / ClaimShield compliance packs.
            </p>

            <div className="mt-6 space-y-3 font-sans text-sm text-[#F4F1EA]">
              <div className="flex items-start gap-2.5">
                <Check size={16} className="text-[#FF7B00] shrink-0 mt-0.5" />
                <span>180-vector adversarial battery + Ed25519 Trust Manifest</span>
              </div>
              <div className="flex items-start gap-2.5">
                <Check size={16} className="text-[#FF7B00] shrink-0 mt-0.5" />
                <span>BidShield RFP Mandatory Gate / ClaimShield ERISA Appeal</span>
              </div>
              <div className="flex items-start gap-2.5">
                <Check size={16} className="text-[#FF7B00] shrink-0 mt-0.5" />
                <span>Offline-verifiable SHA-256 code &amp; corpus pinning</span>
              </div>
              <div className="flex items-start gap-2.5">
                <Check size={16} className="text-[#FF7B00] shrink-0 mt-0.5" />
                <span>Public listing in Verified Trust Manifest Registry</span>
              </div>
              <div className="flex items-start gap-2.5">
                <Check size={16} className="text-[#FF7B00] shrink-0 mt-0.5" />
                <span>48-hour turnaround target</span>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-[#8C92A4]/15 space-y-2">
            <a
              href="https://buy.stripe.com/eVq00keeo5n1bCzgIwfAc0c"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 rounded-lg bg-[#FF7B00] hover:bg-[#e06c00] text-black font-mono font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all"
            >
              <Shield size={15} /> Order SkillProof Sprint ($500)
            </a>
            <a
              href="https://buy.stripe.com/9B6cN69Y86r59ur77WfAc0o"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 rounded-lg border border-[#8C92A4]/30 hover:bg-white/5 text-[#8C92A4] hover:text-white font-mono text-[11px] uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all"
            >
              <Building2 size={13} /> Sovereign Enterprise License ($2,400/yr)
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
