"use client";

import React from "react";
import { Check, Zap, Shield, ArrowRight, Sparkles, Building2, Code2 } from "lucide-react";

export function PricingTierTranslation() {
  return (
    <section id="pricing-tiers" className="py-20 px-6 max-w-7xl mx-auto border-b border-[#8C92A4]/15">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#FF7B00]/30 bg-[#FF7B00]/10 text-xs text-[#FF7B00] font-mono mb-3">
          <Sparkles size={13} />
          MACHINE-PAYABLE & HUMAN-READY
        </div>
        <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white uppercase font-mono">
          Unified Pricing Rails
        </h2>
        <p className="text-[#8C92A4] mt-3 text-base sm:text-lg font-sans">
          Whether you pay via standard credit card (Stripe) or your autonomous agents stream micropayments per call (x402 USDC on Base/Solana), the rates are 100% transparent.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
        {/* Tier 1: Hobby */}
        <div className="bg-[#0f1423] border border-[#8C92A4]/20 rounded-2xl p-8 flex flex-col justify-between hover:border-[#8C92A4]/40 transition-all">
          <div>
            <div className="text-xs font-mono text-[#8C92A4] uppercase tracking-wider mb-2">Hobby / Open Source</div>
            <div className="flex items-baseline gap-1 font-mono">
              <span className="text-4xl font-extrabold text-white">$0</span>
              <span className="text-[#8C92A4] text-sm">/ month</span>
            </div>
            <div className="text-xs font-mono text-[#00B5E2] mt-1">or $0.005 USDC / call via x402</div>

            <p className="text-sm text-[#8C92A4] mt-4 font-sans leading-relaxed">
              Ideal for independent developers testing autonomous agents, local Ollama swarms, and visual DAG parsing.
            </p>

            <div className="mt-6 space-y-3 font-sans text-sm text-[#F4F1EA]">
              <div className="flex items-start gap-2.5">
                <Check size={16} className="text-[#00B5E2] shrink-0 mt-0.5" />
                <span>1,000 free DAG parses / month</span>
              </div>
              <div className="flex items-start gap-2.5">
                <Check size={16} className="text-[#00B5E2] shrink-0 mt-0.5" />
                <span>Standard x402 Micropayment Tollbooth</span>
              </div>
              <div className="flex items-start gap-2.5">
                <Check size={16} className="text-[#00B5E2] shrink-0 mt-0.5" />
                <span>Offline-verifiable Genesis Signatures</span>
              </div>
              <div className="flex items-start gap-2.5">
                <Check size={16} className="text-[#00B5E2] shrink-0 mt-0.5" />
                <span>Community Discord & GitHub support</span>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-[#8C92A4]/15">
            <a
              href="#vision-sandbox"
              className="w-full py-3 rounded-lg border border-[#8C92A4]/30 hover:bg-white/5 text-white font-mono font-semibold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all"
            >
              <Code2 size={15} /> Try Sandbox Free
            </a>
          </div>
        </div>

        {/* Tier 2: Pro (Featured) */}
        <div className="bg-[#0f1423] border-2 border-[#00B5E2] rounded-2xl p-8 flex flex-col justify-between shadow-2xl relative">
          <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-[#00B5E2] text-black font-mono font-bold text-[10px] uppercase tracking-wider">
            Most Popular
          </div>

          <div>
            <div className="text-xs font-mono text-[#00B5E2] uppercase tracking-wider mb-2 font-bold">Pro Agentic Team</div>
            <div className="flex items-baseline gap-1 font-mono">
              <span className="text-4xl font-extrabold text-white">$49</span>
              <span className="text-[#8C92A4] text-sm">/ month</span>
            </div>
            <div className="text-xs font-mono text-emerald-400 mt-1">Includes 50,000 monthly executions</div>

            <p className="text-sm text-[#8C92A4] mt-4 font-sans leading-relaxed">
              For teams deploying production autonomous agents with high-frequency coordination and SLA guarantees.
            </p>

            <div className="mt-6 space-y-3 font-sans text-sm text-[#F4F1EA]">
              <div className="flex items-start gap-2.5">
                <Check size={16} className="text-[#00B5E2] shrink-0 mt-0.5" />
                <span><strong>50,000 included executions</strong> per month</span>
              </div>
              <div className="flex items-start gap-2.5">
                <Check size={16} className="text-[#00B5E2] shrink-0 mt-0.5" />
                <span>High-throughput dedicated API key</span>
              </div>
              <div className="flex items-start gap-2.5">
                <Check size={16} className="text-[#00B5E2] shrink-0 mt-0.5" />
                <span>LangGraph & CrewAI State Engine bridge</span>
              </div>
              <div className="flex items-start gap-2.5">
                <Check size={16} className="text-[#00B5E2] shrink-0 mt-0.5" />
                <span>Priority Netting & Settlement Engine</span>
              </div>
              <div className="flex items-start gap-2.5">
                <Check size={16} className="text-[#00B5E2] shrink-0 mt-0.5" />
                <span>Guaranteed P95 latency &lt; 25ms</span>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-[#8C92A4]/15">
            <a
              href="https://buy.stripe.com/eVq00keeo5n1bCzgIwfAc0c"
              className="w-full py-3.5 rounded-lg bg-[#00B5E2] hover:bg-[#009ac0] text-black font-mono font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-lg shadow-[#00B5E2]/20"
            >
              <Zap size={15} /> Upgrade to Pro ($49/mo)
            </a>
          </div>
        </div>

        {/* Tier 3: Enterprise Swarm */}
        <div className="bg-[#0f1423] border border-[#8C92A4]/20 rounded-2xl p-8 flex flex-col justify-between hover:border-[#8C92A4]/40 transition-all">
          <div>
            <div className="text-xs font-mono text-[#FF7B00] uppercase tracking-wider mb-2">Enterprise Swarm</div>
            <div className="flex items-baseline gap-1 font-mono">
              <span className="text-4xl font-extrabold text-white">$499</span>
              <span className="text-[#8C92A4] text-sm">/ month</span>
            </div>
            <div className="text-xs font-mono text-[#FF7B00] mt-1">or Custom SLA Contract</div>

            <p className="text-sm text-[#8C92A4] mt-4 font-sans leading-relaxed">
              Complete sovereign isolation with dedicated Oracle Cloud VPS orchestrator, private keys, and on-premise execution.
            </p>

            <div className="mt-6 space-y-3 font-sans text-sm text-[#F4F1EA]">
              <div className="flex items-start gap-2.5">
                <Check size={16} className="text-[#FF7B00] shrink-0 mt-0.5" />
                <span>Dedicated Oracle Cloud VPS instance</span>
              </div>
              <div className="flex items-start gap-2.5">
                <Check size={16} className="text-[#FF7B00] shrink-0 mt-0.5" />
                <span>Private Ed25519 Genesis keypair vault</span>
              </div>
              <div className="flex items-start gap-2.5">
                <Check size={16} className="text-[#FF7B00] shrink-0 mt-0.5" />
                <span>Custom SLA Performance Bonds & Escrow</span>
              </div>
              <div className="flex items-start gap-2.5">
                <Check size={16} className="text-[#FF7B00] shrink-0 mt-0.5" />
                <span>24/7 Red-Team adversarial audit battery</span>
              </div>
              <div className="flex items-start gap-2.5">
                <Check size={16} className="text-[#FF7B00] shrink-0 mt-0.5" />
                <span>Direct Slack / Telegram engineering bridge</span>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-[#8C92A4]/15">
            <a
              href="mailto:rob@nanoempireai.com?subject=Enterprise%20Swarm%20Inquiry"
              className="w-full py-3 rounded-lg border border-[#FF7B00]/40 hover:bg-[#FF7B00]/10 text-[#FF7B00] font-mono font-semibold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all"
            >
              <Building2 size={15} /> Contact Enterprise
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
