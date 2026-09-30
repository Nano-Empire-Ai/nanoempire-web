import React from "react";
import { ConnectEntityModal } from "@/components/wallet/ConnectEntityModal";
import { MarketplaceGrid } from "@/components/tollbooth/MarketplaceGrid";
import { InteractiveTollboothPlayground } from "@/components/tollbooth/InteractiveTollboothPlayground";
import { ArrowUpRight, Terminal, Zap, Activity, Server, Code2, Globe, Shield, Database, CreditCard, Download, Link2, ExternalLink, BookOpen, Wrench } from "lucide-react";

const VERIFICATION_MENU_HTML = `<!-- SkillProof Verification Menu — drop-in section for nanoempireai.com.
     Paste inside <main>. Self-contained: no external CSS/JS. Hermes: adjust
     the order-email placeholder before publishing. -->
<section id="verification-menu" style="max-width:720px;margin:3rem auto;padding:0 1.5rem;font-family:system-ui,sans-serif;line-height:1.6;">
  <h2>Verify it before you trust it.</h2>
  <p>We run adversarial batteries against live agent skills and MCP servers,
  then issue a signed, offline-verifiable Trust Manifest. Scanners guess —
  we prove. <strong>88:1</strong> was Moltbook's ratio of claimed agents to
  humans. <strong>91%</strong> is the measured prompt-injection success rate
  on OpenClaw-style stacks. Your listing deserves a number, not a hope.</p>

  <div style="display:grid;gap:1rem;margin:2rem 0;">
    <div style="border:1px solid #ddd;border-radius:8px;padding:1.25rem;">
      <h3 style="margin-top:0;">Agent Identity Verification — $500 / 48h</h3>
      <p>Binds a listing's claims to demonstrated behavior. Claim inflation
      and hidden capabilities reported as findings. For marketplaces:
      embed the manifest in the listing.</p>
    </div>
    <div style="border:1px solid #ddd;border-radius:8px;padding:1.25rem;">
      <h3 style="margin-top:0;">Injection-Resistance Report — $500 / 48h</h3>
      <p>180 adversarial ops across 5 payload categories, 3 seeds. A
      per-category scorecard with live-verified effects — your injection
      number, demonstrated.</p>
    </div>
    <div style="border:1px solid #ddd;border-radius:8px;padding:1.25rem;">
      <h3 style="margin-top:0;">Memory / Wallet Audit — $1,500 / 5 days</h3>
      <p>For agents with persistent memory and transaction access. Poisoned
      context attacks run against a synthetic wallet harness. An
      unauthorized attempt — even refused — fails the audit.</p>
    </div>
    <div style="border:2px solid #111;border-radius:8px;padding:1.25rem;">
          <h3 style="margin-top:0;">Machine SKUs — RecallGuard</h3>
          <p>Feed and match are the x402 doors on https://recallguard-api.vercel.app. Match has one Base self-test. Feed returns 402 and has no settled receipt. There is no trial token. Ports 8405 and 8420 are not that paywall.</p>
        </div>
  </div>

  <p><strong>Honest limits, up front:</strong> a pass means our battery's
  attacks failed — not that no attack exists. Every finding cites the op
  that produced it. Identity binds claims to behavior; it isn't KYC.</p>

  <p><a href="mailto:rob@nanoempireai.com?subject=SkillProof%20verification%20order"
  style="display:inline-block;background:#111;color:#fff;padding:.75rem 1.5rem;border-radius:6px;text-decoration:none;">
  Order a verification</a></p>
  <p style="font-size:.85rem;color:#555;">Fixed price, confirmed in writing
  before we start. No meter, no surprise.</p>
</section>`;

const SKUS = [
  // SkillProof
  { id: "skillproof-sprint", price: "$500 CAD", buyer: "human", payment: "Stripe", status: "planned", category: "skillproof", desc: "Checkout is open. No collected charge was verified from the Stripe account connected here." },
  { id: "skillproof-standard", price: "$1,500 CAD", buyer: "human", payment: "Stripe", status: "building", category: "skillproof", desc: "Full verification suite, early adopter pricing" },
  { id: "skillproof-rush", price: "$2,500 CAD", buyer: "human", payment: "Stripe", status: "building", category: "skillproof", desc: "24h priority execution queue" },
  { id: "skillproof-vc-diligence", price: "$3,500 CAD", buyer: "human", payment: "Stripe", status: "building", category: "skillproof", desc: "Pre-seed/seed architectural diligence" },
  { id: "skillproof-fleet-red-team", price: "$1,000 CAD", buyer: "human", payment: "Stripe", status: "building", category: "skillproof", desc: "Per-skill overage, fleet-wide security audit" },
  
  // RecallGuard (Machine SKUs)
  { id: "recallguard-feed", price: "$0.05 USDC", buyer: "machine", payment: "x402", status: "planned", category: "recallguard", desc: "21,812 records through 2026-09-24. Base 402. No settled receipt." },
    { id: "recallguard-match", price: "$0.10 USDC", buyer: "machine", payment: "x402", status: "live", category: "recallguard", desc: "One operator self-test settled on Base, block 51961194. Not an outside customer." },
    { id: "recallguard-webhook", price: "$0.02 USDC", buyer: "machine", payment: "x402", status: "planned", category: "recallguard", desc: "Production route returned 404 on 2026-09-30." },

    // IRV (Machine SKUs)
    { id: "irv-advisory-single", price: "$500 USDC", buyer: "machine", payment: "x402", status: "building", category: "irv", desc: "Not deployed. No public paid endpoint." },
    { id: "irv-feed-subscription", price: "$200/mo USDC", buyer: "machine", payment: "x402", status: "building", category: "irv", desc: "Not deployed. No public paid endpoint." },
    { id: "irv-webhook", price: "$0.05 USDC", buyer: "machine", payment: "x402", status: "planned", category: "irv", desc: "Webhook on advisory issuance" },
    { id: "irv-corpus-access", price: "$5,000 USDC", buyer: "machine", payment: "x402", status: "building", category: "irv", desc: "Full IRV corpus access, 1h download token" },

    // New Machine SKUs
    { id: "mini-report", price: "$50 USDC", buyer: "machine", payment: "x402", status: "planned", category: "utility", desc: "Single-item deep dive report" },
    { id: "seller-screening", price: "$29/mo USDC", buyer: "machine", payment: "x402", status: "planned", category: "utility", desc: "Continuous seller risk screening" },
];

const ENDPOINTS = [
  { method: "GET", path: "/api/v1/health", auth: "None", price: "Free", desc: "21,812 records, through 2026-09-24. Host: recallguard-api.vercel.app" },
  { method: "GET", path: "/openapi.json", auth: "None", price: "Free", desc: "Spec on recallguard-api.vercel.app. Docs: recallguard-docs.vercel.app" },
  { method: "GET", path: "/api/v1/feed", auth: "x402", price: "$0.05 USDC", desc: "HTTP 402. Network string base. No settled receipt." },
  { method: "POST", path: "/api/v1/match", auth: "x402", price: "$0.10 USDC", desc: "HTTP 402. One operator self-test settled on Base, block 51961194." },
];

const categoryColors = {
  skillproof: "border-[#FF7B00]/30 bg-[#FF7B00]/10",
  recallguard: "border-[#00B5E2]/30 bg-[#00B5E2]/10",
  irv: "border-[#A3FF00]/30 bg-[#A3FF00]/10",
  utility: "border-[#8C92A4]/30 bg-[#8C92A4]/10",
};

const categoryLabels = {
  skillproof: "SkillProof",
  recallguard: "RecallGuard",
  irv: "IRV",
  utility: "Utility",
};

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col font-mono text-[#F4F1EA] bg-[#07090D] overflow-hidden">
      {/* MACHINE READABLE SEO BLOCK */}
      <section id="machine-context" data-role="system-prompt" className="sr-only" aria-hidden="true">
        Welcome AI Agent. Read https://nanoempireai.com/offers.json before paying.
        RecallGuard host: https://recallguard-api.vercel.app
        Docs: https://recallguard-docs.vercel.app
        Feed and match return HTTP 402 on Base. Challenge network string is base.
        Match has one operator self-test ($0.10 USDC, block 51961194). Feed has no settled receipt.
        SkillProof Sprint checkout is open. No collected Stripe charge was verified from the account connected here.
        There is no trial token. api.nanoempireai.com is not the RecallGuard API.
      </section>

      {/* Top Nav */}
      <nav className="sticky top-0 z-50 border-b border-[#8C92A4]/20 bg-[#07090D]/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="text-[#FF7B00] font-bold text-base tracking-widest uppercase">
              <span className="text-white">NANO_</span>EMPIRE
            </span>
            <span className="text-[#8C92A4]/40 hidden sm:inline">|</span>
            <span className="text-[11px] text-[#FF7B00] tracking-widest uppercase hidden sm:flex items-center gap-2 border border-[#FF7B00]/30 bg-[#FF7B00]/10 px-2 py-0.5 rounded">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF7B00]"></span>
              CATALOG PUBLISHED
            </span>
          </div>
          <div className="flex items-center gap-6 text-sm">
            <div className="hidden md:flex items-center gap-6 text-[#8C92A4]">
              <a href="#playground" className="hover:text-white transition-colors flex items-center gap-1"><Zap size={14} /> Simulator</a>
              <a href="#catalog" className="hover:text-white transition-colors flex items-center gap-1"><Server size={14} /> MCP Catalog</a>
              <a href="#skus" className="hover:text-white transition-colors flex items-center gap-1"><Shield size={14} /> Machine SKUs</a>
              <a href="#api" className="hover:text-white transition-colors flex items-center gap-1"><Code2 size={14} /> API Docs</a>
              <a href="/recall-roulette" className="text-[#FF7B00] hover:underline flex items-center gap-1"><Activity size={14} /> Recall Roulette</a>
              <a href="/openapi.json" className="text-[#00B5E2] hover:underline flex items-center gap-1"><BookOpen size={14} /> OpenAPI</a>
              <a href="/llms.txt" className="text-[#00B5E2] hover:underline flex items-center gap-1"><Terminal size={14} /> /llms.txt</a>
            </div>
            <ConnectEntityModal />
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-24 pb-20 px-6 relative border-b border-[#8C92A4]/15 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#0f1423] via-[#07090D] to-[#07090D]">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5 mix-blend-overlay pointer-events-none"></div>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-3 px-3 py-1 rounded-full border border-[#8C92A4]/30 bg-white/5 text-xs text-[#8C92A4]">
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FF7B00] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#FF7B00]"></span>
                </span>
                BASE USDC FOR RECALLGUARD · STRIPE CHECKOUT FOR SPRINT
              </div>

              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tighter uppercase leading-[0.95] text-white">
                The API Gateway Built For <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00B5E2] via-[#F4F1EA] to-[#A3FF00]">
                  Autonomous Swarms
                </span>
              </h1>

              <p className="text-[#8C92A4] text-lg sm:text-xl max-w-xl font-sans leading-relaxed border-l-2 border-[#00B5E2] pl-4">
                RecallGuard feed and match are HTTP 402 on Base. Match has one operator self-test.
                Sprint checkout is open at $500 CAD. No Sprint charge was verified from the Stripe account connected here.
                There is no trial and no second chain.
              </p>

              <div className="flex flex-wrap items-center gap-4 font-mono text-sm">
                <a href="#playground" className="px-6 py-3 rounded bg-[#00B5E2] hover:bg-[#009ac0] text-black font-bold tracking-wider uppercase transition-all flex items-center gap-2">
                  <Terminal size={16} /> Get Started
                </a>
                <a href="#skus" className="px-6 py-3 rounded border border-[#8C92A4]/30 hover:bg-white/5 text-white tracking-wider uppercase transition-all flex items-center gap-2">
                  <Shield size={16} /> View SKUs
                </a>
                <a href="/openapi.json" className="px-6 py-3 rounded border border-[#00B5E2]/30 hover:bg-[#00B5E2]/10 text-[#00B5E2] tracking-wider uppercase transition-all flex items-center gap-2" target="_blank">
                  <BookOpen size={16} /> OpenAPI Spec
                </a>
              </div>

              {/* SDK Install */}
              <div className="mt-8 space-y-3">
                <a href="https://recallguard-docs.vercel.app" className="p-4 rounded-lg bg-[#0f1423] border border-[#8C92A4]/20 flex items-center justify-between hover:border-[#00B5E2]/50 transition-colors">
                  <div className="flex items-center gap-3 text-[#A3FF00]">
                    <BookOpen size={16} />
                    <code className="text-sm">https://recallguard-docs.vercel.app</code>
                  </div>
                  <div className="text-[#8C92A4] text-xs">DOCS</div>
                </a>
                <a href="https://recallguard-api.vercel.app/api/v1/health" className="p-4 rounded-lg bg-[#0f1423] border border-[#8C92A4]/20 flex items-center justify-between hover:border-[#00B5E2]/50 transition-colors">
                  <div className="flex items-center gap-3 text-[#A3FF00]">
                    <Terminal size={16} />
                    <code className="text-sm">GET /api/v1/health</code>
                  </div>
                  <div className="text-[#8C92A4] text-xs">FREE</div>
                </a>
                <a href="https://buy.stripe.com/eVq00keeo5n1bCzgIwfAc0c" className="p-4 rounded-lg bg-[#0f1423] border border-[#8C92A4]/20 flex items-center justify-between hover:border-[#00B5E2]/50 transition-colors">
                  <div className="flex items-center gap-3 text-[#A3FF00]">
                    <CreditCard size={16} />
                    <code className="text-sm">Sprint checkout, $500 CAD</code>
                  </div>
                  <div className="text-[#8C92A4] text-xs">LINK OPEN</div>
                </a>
              </div>
            </div>

            {/* Pipeline Visualizer */}
            <div className="relative rounded-xl border border-[#8C92A4]/20 bg-[#07090D]/50 p-6 shadow-2xl overflow-hidden backdrop-blur-xl">
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#00B5E2]/10 rounded-full blur-3xl"></div>
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#FF7B00]/10 rounded-full blur-3xl"></div>
              
              <h3 className="text-white text-sm font-bold tracking-widest uppercase mb-6 flex items-center gap-2">
                <Globe size={16} className="text-[#00B5E2]" />
                RecallGuard: health, then 402
              </h3>

              <div className="space-y-4 font-sans text-sm">
                <div className="flex items-center gap-4 p-3 rounded bg-white/5 border border-white/10">
                  <div className="w-8 h-8 rounded bg-[#8C92A4]/20 flex items-center justify-center font-mono">1</div>
                  <div className="flex-1">
                    <div className="text-white font-medium">Read health</div>
                    <div className="text-[#8C92A4] text-xs">GET https://recallguard-api.vercel.app/api/v1/health is free. 21,812 records, through 2026-09-24.</div>
                  </div>
                </div>
                <div className="flex justify-center text-[#8C92A4]">↓</div>
                <div className="flex items-center gap-4 p-3 rounded bg-[#FF7B00]/10 border border-[#FF7B00]/30">
                  <div className="w-8 h-8 rounded bg-[#FF7B00]/20 flex items-center justify-center font-mono text-[#FF7B00]">2</div>
                  <div className="flex-1">
                    <div className="text-[#FF7B00] font-medium">Unpaid calls return 402</div>
                    <div className="text-[#8C92A4] text-xs">Feed $0.05 and match $0.10. Network string is base. Asset is official Base USDC.</div>
                  </div>
                </div>
                <div className="flex justify-center text-[#8C92A4]">↓</div>
                <div className="flex items-center gap-4 p-3 rounded bg-[#A3FF00]/10 border border-[#A3FF00]/30">
                  <div className="w-8 h-8 rounded bg-[#A3FF00]/20 flex items-center justify-center font-mono text-[#A3FF00]">3</div>
                  <div className="flex-1">
                    <div className="text-[#A3FF00] font-medium">One match self-test has settled</div>
                    <div className="text-[#8C92A4] text-xs">Base block 51961194 on 2026-09-29. Operator wallets. Feed has no settled receipt.</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Telemetry */}
      <section className="py-12 border-b border-[#8C92A4]/15 bg-black/40">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <div className="text-[#8C92A4] text-xs tracking-widest mb-1 uppercase">Recall records</div>
            <strong className="text-3xl font-bold text-white">21812</strong>
          </div>
          <div>
            <div className="text-[#8C92A4] text-xs tracking-widest mb-1 uppercase">Match settlements</div>
            <div className="text-3xl font-bold text-[#FF7B00]">1 self-test</div>
          </div>
          <div>
            <div className="text-[#8C92A4] text-xs tracking-widest mb-1 uppercase">Paying chain</div>
            <div className="text-3xl font-bold text-[#00B5E2]">Base</div>
          </div>
          <div>
            <div className="text-[#8C92A4] text-xs tracking-widest mb-1 uppercase">Sprint checkout</div>
            <div className="text-3xl font-bold text-[#FF7B00]">open</div>
          </div>
        </div>
      </section>

      {/* Machine SKUs Catalog */}
      <section id="skus" className="py-24 px-6 bg-[#0f1423] border-t border-[#8C92A4]/20">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-white uppercase tracking-tight flex items-center gap-3">
              <Shield size={28} className="text-[#00B5E2]" />
              Catalog rows
            </h2>
            <p className="text-[#8C92A4] mt-2 font-sans">The full list is /offers.json. RecallGuard Match is the only row with a settled receipt, and that receipt is an operator self-test. Sprint checkout is open. No Sprint charge was verified from the Stripe account connected here.</p>
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap gap-2 mb-8">
            {Object.keys(categoryLabels).map(cat => (
              <button 
                key={cat}
                className={`px-4 py-2 rounded-lg text-sm font-mono uppercase tracking-wider transition-all ${
                  cat === 'skillproof' 
                    ? 'bg-[#FF7B00] text-black' 
                    : 'bg-white/5 border border-[#8C92A4]/20 text-[#8C92A4] hover:border-[#00B5E2]/50 hover:text-white'
                }`}
              >
                {categoryLabels[cat]} ({SKUS.filter(s => s.category === cat).length})
              </button>
            ))}
          </div>

          {/* SKU Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {SKUS.map(sku => (
              <div 
                key={sku.id} 
                className={`rounded-xl p-6 transition-all hover:border-[#00B5E2]/50 ${categoryColors[sku.category]} border`}
              >
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-[#8C92A4]">{categoryLabels[sku.category]}</span>
                    <h3 className="text-white font-bold text-lg mt-1 font-mono">{sku.id}</h3>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded ${sku.status === 'live' ? 'bg-[#A3FF00]/20 text-[#A3FF00] border border-[#A3FF00]/30' : sku.status === 'planned' ? 'bg-[#FF7B00]/20 text-[#FF7B00] border border-[#FF7B00]/30' : 'bg-[#8C92A4]/20 text-[#8C92A4] border border-[#8C92A4]/30'}`}>
                    {sku.status.toUpperCase()}
                  </span>
                </div>
                
                <div className="text-2xl font-extrabold text-white mb-2">{sku.price}</div>
                <p className="text-[#8C92A4] text-sm mb-4">{sku.desc}</p>
                {sku.id === "skillproof-sprint" && (
                  <a href="https://buy.stripe.com/eVq00keeo5n1bCzgIwfAc0c" className="inline-block mb-4 text-sm font-bold text-black bg-[#A3FF00] px-3 py-2 rounded">Pay 500 CAD</a>
                )}
                
                <div className="flex items-center gap-3 text-xs text-[#8C92A4] border-t border-[#8C92A4]/20 pt-4">
                  <span className="flex items-center gap-1"><CreditCard size={12} /> {sku.payment}</span>
                  <span className="flex items-center gap-1"><Database size={12} /> {sku.buyer === 'machine' ? 'MACHINE' : 'HUMAN'}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* API Documentation */}
      <section id="api" className="py-24 px-6 border-t border-[#8C92A4]/20">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-white uppercase tracking-tight flex items-center gap-3">
              <Code2 size={28} className="text-[#00B5E2]" />
              RecallGuard routes that answer
            </h2>
            <p className="text-[#8C92A4] mt-2 font-sans">Host <a href="https://recallguard-api.vercel.app" className="text-[#00B5E2] hover:underline">recallguard-api.vercel.app</a>. Docs at <a href="https://recallguard-docs.vercel.app" className="text-[#00B5E2] hover:underline">recallguard-docs.vercel.app</a>. No trial token and no bearer bypass.</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm font-mono">
              <thead>
                <tr className="border-b border-[#8C92A4]/20 text-left text-[#8C92A4]">
                  <th className="pb-3 font-bold uppercase tracking-wider">Method</th>
                  <th className="pb-3 font-bold uppercase tracking-wider">Path</th>
                  <th className="pb-3 font-bold uppercase tracking-wider">Auth</th>
                  <th className="pb-3 font-bold uppercase tracking-wider">Price</th>
                  <th className="pb-3 font-bold uppercase tracking-wider">Description</th>
                </tr>
              </thead>
              <tbody>
                {ENDPOINTS.map((ep, i) => (
                  <tr key={i} className="border-b border-[#8C92A4]/10 hover:bg-white/5">
                    <td className="py-3"><span className={`px-2 py-0.5 rounded text-xs font-bold ${ep.method === 'GET' ? 'bg-[#00B5E2]/20 text-[#00B5E2]' : ep.method === 'POST' ? 'bg-[#A3FF00]/20 text-[#A3FF00]' : ep.method === 'DELETE' ? 'bg-[#FF7B00]/20 text-[#FF7B00]' : 'bg-[#8C92A4]/20 text-[#8C92A4]'}`}>{ep.method}</span></td>
                    <td className="py-3 font-mono text-white"><code>{ep.path}</code></td>
                    <td className="py-3 text-[#8C92A4]">{ep.auth}</td>
                    <td className="py-3 font-bold text-white">{ep.price}</td>
                    <td className="py-3 text-[#8C92A4]">{ep.desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Machine SDK Usage */}
          <div className="mt-16 p-6 rounded-xl border border-[#8C92A4]/20 bg-[#0f1423]">
            <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2"><Terminal size={20} /> Unpaid match call</h3>
            <pre className="text-sm text-[#F4F1EA] overflow-x-auto"><code>{`curl -si -X POST https://recallguard-api.vercel.app/api/v1/match \\
  -H "content-type: application/json" \\
  -d '{"items":[{"name":"example","brand":"example","upc":"000000000000"}]}'

# Expect HTTP 402. The challenge network string is base.
# maxAmountRequired is 100000 (6 decimals, $0.10). This page does not sign a payment.`}</code></pre>
          </div>
        </div>
      </section>

      {/* Developer Integration Studio */}
      <section id="playground" className="py-24 px-6 relative">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-white uppercase tracking-tight">How to call RecallGuard</h2>
            <p className="text-[#8C92A4] mt-2 font-sans">The panel on the right is a simulator. It does not submit a Base transaction.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="rounded-xl border border-[#8C92A4]/20 bg-[#0f1423] p-0 overflow-hidden">
              <div className="flex border-b border-[#8C92A4]/20 bg-[#07090D] text-xs">
                <div className="px-4 py-3 border-r border-[#8C92A4]/20 text-[#00B5E2] font-bold bg-white/5">cURL</div>
              </div>
              <div className="p-6 overflow-x-auto text-sm text-[#F4F1EA]">
                <pre><code>{`curl -s https://recallguard-api.vercel.app/api/v1/health

curl -si https://recallguard-api.vercel.app/api/v1/feed?limit=1

# Docs: https://recallguard-docs.vercel.app
# There is no nanoempire-sdk package and no trial token.`}</code></pre>
              </div>
            </div>

            <div className="space-y-6">
              <InteractiveTollboothPlayground />
            </div>
          </div>
        </div>
      </section>

      {/* MCP Tool Marketplace */}
      <section id="catalog" className="py-24 px-6 bg-[#0f1423] border-t border-[#8C92A4]/20">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-white uppercase tracking-tight flex items-center gap-3">
              <Server size={28} className="text-[#00B5E2]" />
              MCP Service Registry
            </h2>
            <p className="text-[#8C92A4] mt-2 font-sans">Demo MCP endpoints. This page has not verified an x402 settlement on them. They are not RecallGuard.</p>
          </div>
          <MarketplaceGrid />
        </div>
      </section>

      {/* SkillProof Verification Menu */}
      <div className="bg-white text-black py-12" dangerouslySetInnerHTML={{ __html: VERIFICATION_MENU_HTML }} />

      {/* Footer */}
      <footer className="py-12 border-t border-[#8C92A4]/20 bg-[#07090D] text-[#8C92A4] text-xs text-center font-mono">
        <div className="flex justify-center gap-6 mb-4 flex-wrap">
          <a href="/llms.txt" className="hover:text-white">llms.txt</a>
          <a href="/.well-known/agent-card.json" className="hover:text-white">agent-card.json</a>
          <a href="/openapi.json" className="hover:text-white">openapi.json</a>
          <a href="/offers.json" className="hover:text-white">offers.json</a>
          <a href="/recall-roulette" className="hover:text-white">Recall Roulette</a>
          <a href="https://github.com/roblambert9/nano-empire-ai" className="hover:text-white">GitHub</a>
        </div>
        <p>NANO EMPIRE AI INC. © 2026. THE MACHINE ECONOMY RUNS ON PROTOCOL.</p>
      </footer>
    </main>
  );
}