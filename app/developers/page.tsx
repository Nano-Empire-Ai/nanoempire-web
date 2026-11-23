import React from "react";

import { ConnectEntityModal } from "@/components/wallet/ConnectEntityModal";

import { MarketplaceGrid } from "@/components/tollbooth/MarketplaceGrid";

import { InteractiveTollboothPlayground } from "@/components/tollbooth/InteractiveTollboothPlayground";

import DoorA from "@/components/DoorA";

import DoorB from "@/components/DoorB";

import { VisionParserSandbox } from "@/components/cro/VisionParserSandbox";

import { DogfoodReceiptsWidget } from "@/components/cro/DogfoodReceiptsWidget";

import { PricingTierTranslation } from "@/components/cro/PricingTierTranslation";

import { ArchitectureAuditModal } from "@/components/cro/ArchitectureAuditModal";

import { QuickstartSnippet } from "@/components/cro/QuickstartSnippet";

import { FreeRecallSearchWidget } from "@/components/cro/FreeRecallSearchWidget";

import { ArrowUpRight, Terminal, Zap, Activity, Server, Code2, Globe, Shield, Database, CreditCard, Download, Link2, ExternalLink, BookOpen, Wrench, Radio, Headphones } from "lucide-react";





const STRUCTURED_DATA_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Nano Empire AI — RecallRadar, SkillProof & BidShield",
  applicationCategory: "SecurityApplication",
  operatingSystem: "Web, REST API, Base Mainnet (x402)",
  url: "https://www.nanoempireai.com",
  description:
    "Cryptographic compliance and verification infrastructure: RecallRadar x402 API across 46,642 normalized US & Canadian (CPSC, FDA & Health Canada) recall records, SkillProof Ed25519 Trust Manifests, and BidShield RFP compliance audits.",
  offers: [
    { "@type": "Offer", name: "Signed Recall Match Report", price: "30.00", priceCurrency: "USD", url: "https://buy.stripe.com/6oU4gAfis2aP21Z8c0fAc0k" },
    { "@type": "Offer", name: "RecallRadar Continuous Monitoring", price: "99.00", priceCurrency: "USD", url: "https://buy.stripe.com/00w5kE2vGg1F3630JyfAc0e" }
  ]
};

const VERIFICATION_MENU_HTML = `<section id="verification-menu" style="max-width: 720px; margin: 3rem auto; padding: 0 1.5rem; font-family: system-ui, sans-serif; line-height: 1.6;">
  <h2>Verify it before you trust it.</h2>
  <p>We run adversarial batteries against live agent skills and MCP servers,
  then issue a signed, offline-verifiable Trust Manifest. Scanners guess —
  we prove. <strong>88:1</strong> was Moltbook's ratio of claimed agents to
  humans. <strong>91%</strong> is the measured prompt-injection success rate
  on OpenClaw-style stacks. Your listing deserves a number, not a hope.</p>

  <div style="display: grid; gap: 1rem; margin: 2rem 0;">
    <div style="border: 1px solid #ddd; border-radius: 8px; padding: 1.25rem;">
      <h3 style="margin-top: 0;">RecallRadar Match API — $0.10 / call</h3>
      <p>Machine-to-machine x402 screening across 46,642 normalized CPSC, FDA & Health Canada recall records. Settle via Base USDC.</p>
    </div>
    <div style="border: 1px solid #ddd; border-radius: 8px; padding: 1.25rem;">
      <h3 style="margin-top: 0;">Signed Recall Match Report — $30 USD</h3>
      <p>Instant inventory cross-reference against 46,642 US & Canadian safety enforcement records. Signed PDF and CSV audit report.</p>
    </div>
    <div style="border: 2px solid #111; border-radius: 8px; padding: 1.25rem;">
      <h3 style="margin-top: 0;">Sovereign Data License — $2,400 / yr</h3>
      <p>Full enterprise data export, daily automated sync across federal safety feeds, and commercial catalog vetting license.</p>
    </div>
  </div>

  <p><strong>Honest limits, up front:</strong> a pass means our battery's
  attacks failed — not that no attack exists. Every finding cites the op
  that produced it. Identity binds claims to behavior; it isn't KYC.</p>

  <p><a href="/skillproof" style="display: inline-block; background: #111; color: #fff; padding: .75rem 1.5rem; border-radius: 6px; text-decoration: none; font-weight: 600;">Explore SkillProof Trust Manifests →</a></p>
  <p style="font-size: .85rem; color: #555;">Offline-verifiable Ed25519 manifests and test batteries.</p>
</section>`;



const SKUS = [

  // RecallGuard (Human & Merchant)

  { id: "recallguard-report", price: "$30 USD", buyer: "human", payment: "Stripe", status: "live", category: "recallguard", desc: "One-time scan of inventory against 46,642 normalized US & Canadian (CPSC, FDA & Health Canada) recall records. Signed Recall Match Report (PDF + CSV)." },

  { id: "recallguard-monitoring", price: "$99 USD/mo", buyer: "human", payment: "Stripe", status: "live", category: "recallguard", desc: "Monthly inventory re-scan + immediate recall expansion alerts." },

  { id: "sovereign-license", price: "$2,400/yr USD", buyer: "enterprise", payment: "Invoice / Stripe", status: "live", category: "recallguard", desc: "Complete data license, daily API sync, and private deployment." },

  

  // BidShield (Human & Enterprise — Locked $299 / $499 / $999 Ladder)
  { id: "bidshield-pilot", price: "$299 USD", buyer: "human", payment: "Upwork / Stripe", status: "live", category: "skillproof", desc: "Pre-bid compliance pilot: 5-gate fatal disqualifier scan, missing annexes checklist, and Stop/Go recommendation." },
  { id: "bidshield-standard", price: "$499 USD", buyer: "human", payment: "Upwork / Stripe", status: "live", category: "skillproof", desc: "Full 19-column RFP requirement matrix, cross-addenda override check, and line-cited exception audit." },
  { id: "bidshield-full", price: "$999 USD", buyer: "enterprise", payment: "Upwork / Invoice", status: "live", category: "skillproof", desc: "Multi-volume solicitation decomposition, subcontractor flow-down matrix, and executive capture readiness review." },

  // Machine SKUs (x402 on Base)

  { id: "recallguard-feed", price: "$0.05 USDC", buyer: "machine", payment: "x402", status: "live", category: "recallguard", desc: "Continuous CPSC & FDA recall feed sync. Settle via HTTP 402 on Base." },

  { id: "recallguard-match", price: "$0.10 USDC", buyer: "machine", payment: "x402", status: "live", category: "recallguard", desc: "Machine-native recall screening. Settle directly inside HTTP 402 request on Base." },

  { id: "trial-onramp", price: "Free (1,000 credits)", buyer: "machine", payment: "Trial Token", status: "live", category: "utility", desc: "Provisioned via /api/v1/trial/verify. Pre-funded key for developer testing." },

];



const ENDPOINTS = [

  { method: "GET", path: "/api/v1/health", auth: "None", price: "Free", desc: "46,642 normalized CPSC, FDA & Health Canada recall records. Host: recallguard-api.vercel.app" },

  { method: "GET", path: "/openapi.json", auth: "None", price: "Free", desc: "Spec on recallguard-api.vercel.app. Docs: recallguard-docs.vercel.app" },

  { method: "GET", path: "/api/v1/feed", auth: "x402", price: "$0.05 USDC", desc: "HTTP 402. Network string base. Settled via Base USDC." },

  { method: "POST", path: "/api/v1/match", auth: "x402", price: "$0.10 USDC", desc: "HTTP 402. Settle on Base USDC via x402." },

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
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(STRUCTURED_DATA_JSON_LD) }} />

      {/* MACHINE & AGENT DISCOVERY BANNER */}

      <section className="bg-[#0b101b] border-b border-[#8C92A4]/20 py-2.5 px-6 text-xs text-[#8C92A4] font-mono">

        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">

          <div className="flex items-center gap-2">

            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>

            <span className="text-[#F4F1EA] font-semibold">Agent Endpoints:</span>

            <span>RecallGuard x402 on Base (feed $0.05, match $0.10 USDC) · Health endpoint is free</span>

          </div>

          <div className="flex items-center gap-4 text-[11px]">

            <a href="/llms.txt" className="text-[#00B5E2] hover:underline">/llms.txt</a>

            <span className="text-[#8C92A4]/40">·</span>

            <a href="/.well-known/agent-card.json" className="text-[#00B5E2] hover:underline">agent-card.json</a>

            <span className="text-[#8C92A4]/40">·</span>

            <a href="/.well-known/poppy.json" className="text-[#00B5E2] hover:underline">poppy.json</a>

            <span className="text-[#8C92A4]/40">·</span>

            <a href="/openapi.json" className="text-[#00B5E2] hover:underline">openapi.json</a>

            <span className="text-[#8C92A4]/40">·</span>

            <a href="/.well-known/meta-wearables-manifest.json" className="text-[#00E5FF] hover:underline">meta-wearables-manifest.json</a>

          </div>

        </div>

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

            <div className="hidden xl:flex items-center gap-5 text-[#8C92A4] text-xs font-mono">

              <a href="/recall-report" className="text-[#A3FF00] hover:underline flex items-center gap-1 font-bold border border-[#A3FF00]/30 bg-[#A3FF00]/10 px-2.5 py-1 rounded"><Shield size={13} /> RecallRadar ($30 Report)</a>
              <a href="/skillproof" className="text-[#00B5E2] hover:underline flex items-center gap-1 font-bold"><Shield size={13} /> SkillProof Index</a>
              <a href="/bidshield/triage/" className="text-[#3ddc97] hover:underline flex items-center gap-1 font-bold"><Shield size={13} /> BidShield Triage</a>
              <a href="/m2m-state.md" className="hover:text-white transition-colors flex items-center gap-1"><BookOpen size={13} /> M2M Briefing</a>
              <a href="/podcast" className="text-[#00B5E2] hover:underline flex items-center gap-1 font-bold"><Headphones size={13} /> Podcast</a>

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

                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#A3FF00] opacity-75"></span>

                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#A3FF00]"></span>

                </span>

                46,642 NORMALIZED CPSC, FDA &amp; HEALTH CANADA RECALL RECORDS · INSTANT $30 COMPLIANCE REPORT · BASE x402 API

              </div>



              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tighter uppercase leading-[0.95] text-white">

                Instant Recall &amp; <br />

                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00B5E2] via-[#F4F1EA] to-[#A3FF00]">

                  Compliance Proof

                </span>

              </h1>



              <p className="text-[#8C92A4] text-lg sm:text-xl max-w-xl font-sans leading-relaxed border-l-2 border-[#00B5E2] pl-4">

                Screen your inventory CSV against 46,642 normalized CPSC, FDA & Health Canada recall records with an instant Signed Recall Match Report (PDF + CSV) ($30 USD), or query machine-to-machine via HTTP 402 on Base ($0.10 USDC).

              </p>



              <div className="flex flex-wrap items-center gap-3 font-mono text-xs">

                <a href="/recall-report" className="px-6 py-3.5 rounded bg-[#A3FF00] hover:bg-[#8ee000] text-black font-bold tracking-wider uppercase transition-all flex items-center gap-2 shadow-lg shadow-[#A3FF00]/20">
                  <Shield size={15} /> Scan Inventory ($30 Compliance Report)
                </a>
                <a href="https://buy.stripe.com/6oU4gAfis2aP21Z8c0fAc0k" className="px-5 py-3.5 rounded bg-[#00B5E2] hover:bg-[#009ac0] text-black font-bold tracking-wider uppercase transition-all flex items-center gap-2">
                  <CreditCard size={15} /> Direct Checkout ($30 USD)
                </a>
                <a href="/skillproof" className="px-5 py-3.5 rounded border border-white/30 hover:bg-white/10 text-white tracking-wider uppercase transition-all flex items-center gap-2">
                  <Terminal size={15} /> SkillProof MCP Index
                </a>

              </div>



              {/* Above the fold SDK Quickstart */}

              <QuickstartSnippet />



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

                <a href="https://buy.stripe.com/6oU4gAfis2aP21Z8c0fAc0k" className="p-4 rounded-lg bg-[#0f1423] border border-[#8C92A4]/20 flex items-center justify-between hover:border-[#00B5E2]/50 transition-colors">

                  <div className="flex items-center gap-3 text-[#A3FF00]">

                    <CreditCard size={16} />

                    <code className="text-sm">Compliance Report, $30 USD</code>

                  </div>

                  <div className="text-[#8C92A4] text-xs">LIVE STRIPE</div>

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

                    <div className="text-[#8C92A4] text-xs">GET https://recallguard-api.vercel.app/api/v1/health is free. 46,642 normalized CPSC, FDA & Health Canada recall records.</div>

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

                    <div className="text-[#8C92A4] text-xs">Base block 51961194 (Tx 0xf3919e8c...a6325999 on BaseScan). Verified USDC settlement.</div>

                  </div>

              </div>

            </div>

          </div>

        </div>

      </div>

    </section>



    {/* Podcast Promo Band */}

    <section className="py-4 px-6 border-b border-[#8C92A4]/20 bg-[#0f1423] text-sm">

      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">

        <div className="flex items-center gap-4">

          <div className="w-12 h-12 rounded-lg overflow-hidden border border-[#00B5E2]/40 relative shrink-0 shadow-sm bg-[#07090D]">

            <img

              src="/podcast/cover.webp"

              alt="Moonshots Optimist"

              className="w-full h-full object-cover"

            />

          </div>

          <div>

            <div className="flex items-center gap-2">

              <span className="text-[11px] uppercase font-bold text-[#00B5E2] tracking-wider">PODCAST</span>

              <span className="text-[#8C92A4]/40">·</span>

              <span className="text-white font-bold text-sm">Moonshots Optimist</span>

            </div>

            <p className="text-xs text-[#8C92A4] font-sans">

              Optimistic takes on the AI news that matters. A Nano Empire AI production.

            </p>

          </div>

        </div>

        <div className="flex items-center gap-3 shrink-0">

          <a

            href="/podcast"

            className="px-4 py-2 rounded bg-[#00B5E2] hover:bg-[#009ac0] text-black font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 transition-all"

          >

            <Headphones size={14} /> Listen (7 Episodes)

          </a>

        </div>

      </div>

    </section>



    {/* Exponential Purpose & Radical Telemetry */}

    <section className="py-16 px-6 border-b border-[#8C92A4]/20 bg-[#06080E] relative overflow-hidden">

      <div className="max-w-7xl mx-auto space-y-12">

        {/* MTP & Moonshot Header */}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">

          <div className="space-y-4">

            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#3ddc97]/30 bg-[#3ddc97]/10 text-xs font-mono text-[#3ddc97]">

              <span>★</span> MASSIVE TRANSFORMATIVE PURPOSE (MTP)

            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold uppercase text-white tracking-tight leading-tight">

              Make Institutional Complexity Survivable For Ordinary People.

            </h2>

            <p className="text-sm sm:text-base text-[#8C92A4] font-sans leading-relaxed">

              Large organizations weaponize procurement rules, bureaucratic delay, and opaque compliance to defeat independent businesses, local contractors, and clinics. We build deterministic defensive infrastructure to level the playing field.

            </p>

          </div>



          <div className="p-6 rounded-xl border border-[#00B5E2]/30 bg-[#0f1423] space-y-4">

            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#00B5E2]/30 bg-[#00B5E2]/10 text-xs font-mono text-[#00B5E2]">

              <span>◎</span> THE MOONSHOT METRIC

            </div>

            <div className="text-2xl sm:text-3xl font-extrabold text-white leading-snug">

              Return <span className="text-[#3ddc97]">1,000,000</span> administrative hours to independent operators, clinics, and families by 2028.

            </div>

            

            {/* Zero Sycophancy Honest Baseline Table */}

            <div className="pt-3 border-t border-white/10">

              <div className="text-[11px] uppercase tracking-wider text-[#8C92A4] font-mono mb-2">Verified Corpus &amp; Baseline Ledger (0 Outside Paying Customers · 1 Self-Test Settled):</div>

              <div className="grid grid-cols-3 gap-3 text-center">

                <div className="p-2.5 rounded bg-black/40 border border-white/5">

                  <div className="text-xl font-bold font-mono text-[#A3FF00]">28</div>

                  <div className="text-[10px] text-[#8C92A4]">MCP Repos Pre-Audited (28)</div>

                </div>

                <div className="p-2.5 rounded bg-black/40 border border-white/5">

                  <div className="text-xl font-bold font-mono text-[#A3FF00]">882+</div>

                  <div className="text-[10px] text-[#8C92A4]">Live Tenders · 8 NAICS Hubs</div>

                </div>

                <div className="p-2.5 rounded bg-black/40 border border-white/5">

                  <div className="text-xl font-bold font-mono text-[#3ddc97]">46,642</div>

                  <div className="text-[10px] text-[#8C92A4]">Safety Records Indexed</div>

                </div>

              </div>

            </div>

          </div>

        </div>



        {/* 6 Public Wedge & Infrastructure Tiles */}

        <div className="space-y-4">

          <div className="text-xs uppercase tracking-widest text-[#8C92A4] font-mono">Autonomous Tools &amp; Public Wedges</div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">

            <a href="/bidshield/capsule" className="p-5 rounded-xl border border-[#a78bfa]/40 bg-[#0f1423] hover:border-[#a78bfa] transition-all group flex flex-col justify-between shadow-lg hover:shadow-[#a78bfa]/10">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] uppercase font-bold tracking-wider font-mono text-[#a78bfa] bg-[#a78bfa]/10 px-2 py-0.5 rounded border border-[#a78bfa]/30">AIR-GAPPED · ZERO EGRESS</span>
                  <ArrowUpRight size={16} className="text-[#a78bfa] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">BNOA Sovereign Capsule</h3>
                <p className="text-xs text-[#8C92A4] font-sans leading-relaxed">
                  Browser-enforced CSP blackout (default-src &apos;none&apos;). Salted SHA-256 Merkle commitments and FIDO2/ECDSA P-256 human mandate signing for sensitive network ops and RFP triage.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-white/10 text-xs font-mono text-[#a78bfa] font-semibold">Launch Air-Gapped Capsule →</div>
            </a>

            <a href="/bidshield/triage/" className="p-5 rounded-xl border border-[#3ddc97]/40 bg-[#0f1423] hover:border-[#3ddc97] transition-all group flex flex-col justify-between">

              <div>

                <div className="flex items-center justify-between mb-3">

                  <span className="text-[10px] uppercase font-bold tracking-wider font-mono text-[#3ddc97] bg-[#3ddc97]/10 px-2 py-0.5 rounded border border-[#3ddc97]/30">FREE TOOL · ZERO UPLOAD</span>

                  <ArrowUpRight size={16} className="text-[#3ddc97] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />

                </div>

                <h3 className="text-lg font-bold text-white mb-2">BidShield Free Triage</h3>

                <p className="text-xs text-[#8C92A4] font-sans leading-relaxed">

                  Client-side preliminary tender snapshot. Check insurance clauses, addendum risks, and required forms in 60s without uploading sensitive files.

                </p>

              </div>

              <div className="mt-4 pt-3 border-t border-white/10 text-xs font-mono text-[#3ddc97] font-semibold">Launch Free Triage →</div>

            </a>



            <a href="/bidshield" className="p-5 rounded-xl border border-[#00B5E2]/40 bg-[#0f1423] hover:border-[#00B5E2] transition-all group flex flex-col justify-between">

              <div>

                <div className="flex items-center justify-between mb-3">

                  <span className="text-[10px] uppercase font-bold tracking-wider font-mono text-[#00B5E2] bg-[#00B5E2]/10 px-2 py-0.5 rounded border border-[#00B5E2]/30">PUBLIC CORPUS</span>

                  <ArrowUpRight size={16} className="text-[#00B5E2] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />

                </div>

                <h3 className="text-lg font-bold text-white mb-2">Public Trap Atlas</h3>

                <p className="text-xs text-[#8C92A4] font-sans leading-relaxed">

                  Open scar database tracking calibrated fatal traps across federal, provincial, and commercial solicitations, plus pilot document intake.

                </p>

              </div>

              <div className="mt-4 pt-3 border-t border-white/10 text-xs font-mono text-[#00B5E2] font-semibold">Explore 8 NAICS Compliance Hubs →</div>

            </a>



            <a href="/tollbooth/" className="p-5 rounded-xl border border-white/20 bg-[#0f1423] hover:border-white/40 transition-all group flex flex-col justify-between">

              <div>

                <div className="flex items-center justify-between mb-3">

                  <span className="text-[10px] uppercase font-bold tracking-wider font-mono text-white bg-white/10 px-2 py-0.5 rounded border border-white/20">PYPI PACKAGE</span>

                  <ArrowUpRight size={16} className="text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />

                </div>

                <h3 className="text-lg font-bold text-white mb-2">Tollbooth SDK</h3>

                <p className="text-xs text-[#8C92A4] font-sans leading-relaxed">

                  Python SDK (<code>nano-empire-tollbooth</code>) for HTTP 402 machine paywalls, Base USDC metering, and server-to-server monetization.

                </p>

              </div>

              <div className="mt-4 pt-3 border-t border-white/10 text-xs font-mono text-white font-semibold">View SDK &amp; Docs →</div>

            </a>



            <a href="/recalls" className="p-5 rounded-xl border border-[#FF7B00]/40 bg-[#0f1423] hover:border-[#FF7B00] transition-all group flex flex-col justify-between">

              <div>

                <div className="flex items-center justify-between mb-3">

                  <span className="text-[10px] uppercase font-bold tracking-wider font-mono text-[#FF7B00] bg-[#FF7B00]/10 px-2 py-0.5 rounded border border-[#FF7B00]/30">SOLICITATION ENGINE</span>

                  <ArrowUpRight size={16} className="text-[#FF7B00] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />

                </div>

                <h3 className="text-lg font-bold text-white mb-2">RecallRadar Federal Index</h3>

                <p className="text-xs text-[#8C92A4] font-sans leading-relaxed">

                  Deterministic procurement decomposition. Extracts fatal clauses, insurance traps, and mandatory atom checklists with zero hallucination.

                </p>

              </div>

              <div className="mt-4 pt-3 border-t border-white/10 text-xs font-mono text-[#FF7B00] font-semibold">Explore 46k Recall Index →</div>

            </a>



            <a href="/decision-bus/" className="p-5 rounded-xl border border-[#8C92A4]/30 bg-[#0f1423] hover:border-white/40 transition-all group flex flex-col justify-between">

              <div>

                <div className="flex items-center justify-between mb-3">

                  <span className="text-[10px] uppercase font-bold tracking-wider font-mono text-[#8C92A4] bg-white/5 px-2 py-0.5 rounded border border-white/10">MARKET ARBITER</span>

                  <ArrowUpRight size={16} className="text-[#8C92A4] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />

                </div>

                <h3 className="text-lg font-bold text-white mb-2">Arthur Decision Bus</h3>

                <p className="text-xs text-[#8C92A4] font-sans leading-relaxed">

                  Real-time market friction queue tracking pain points across HN, Reddit, GitHub, Upwork, and federal feeds for autonomous execution.

                </p>

              </div>

              <div className="mt-4 pt-3 border-t border-white/10 text-xs font-mono text-[#8C92A4] font-semibold">Inspect Decision Bus →</div>

            </a>



            <a href="/skillproof" className="p-5 rounded-xl border border-[#A3FF00]/40 bg-[#0f1423] hover:border-[#A3FF00] transition-all group flex flex-col justify-between">

              <div>

                <div className="flex items-center justify-between mb-3">

                  <span className="text-[10px] uppercase font-bold tracking-wider font-mono text-[#A3FF00] bg-[#A3FF00]/10 px-2 py-0.5 rounded border border-[#A3FF00]/30">LIVE SCOREBOARD · 28 REPOS</span>

                  <ArrowUpRight size={16} className="text-[#A3FF00] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />

                </div>

                <h3 className="text-lg font-bold text-white mb-2">SkillProof MCP Pre-Audit Index</h3>

                <p className="text-xs text-[#8C92A4] font-sans leading-relaxed">

                  Public line-cited static pre-audit scorecards across flagship MCP servers and agent frameworks, plus Ed25519 Trust Manifests.

                </p>

              </div>

              <div className="mt-4 pt-3 border-t border-white/10 text-xs font-mono text-[#A3FF00] font-semibold">Explore Pre-Audit Index →</div>

            </a>

            <a href="/wearables/" className="p-5 rounded-xl border border-[#00E5FF]/40 bg-[#0f1423] hover:border-[#00E5FF] transition-all group flex flex-col justify-between">

              <div>

                <div className="flex items-center justify-between mb-3">

                  <span className="text-[10px] uppercase font-bold tracking-wider font-mono text-[#00E5FF] bg-[#00E5FF]/10 px-2 py-0.5 rounded border border-[#00E5FF]/30">META RAY-BAN DISPLAY · DAT v1.0.1</span>

                  <ArrowUpRight size={16} className="text-[#00E5FF] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />

                </div>

                <h3 className="text-lg font-bold text-white mb-2">RecallRadar &amp; BNOA Glasses HUD</h3>

                <p className="text-xs text-[#8C92A4] font-sans leading-relaxed">

                  Additive-light waveguide HUD for Meta Ray-Ban Display &amp; Neural Band. Live warehouse recall triage, temple speaker TTS, and SkillProof #08 verification.

                </p>

              </div>

              <div className="mt-4 pt-3 border-t border-white/10 text-xs font-mono text-[#00E5FF] font-semibold">Launch Glasses HUD →</div>

            </a>

          </div>

        </div>

      </div>

    </section>



    {/* Free Live Recall Screening Tool */}

    <FreeRecallSearchWidget />



    {/* Interactive Vision Parser Sandbox */}

    <VisionParserSandbox />



    {/* Dogfooding Receipts & Provable Telemetry */}

    <DogfoodReceiptsWidget />



    {/* Machine-Native Protocol Rails & Settlement Honesty */}

    <section className="py-16 px-6 border-b border-[#8C92A4]/20 bg-[#0A0D14]">

      <div className="max-w-7xl mx-auto space-y-8">

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">

          <div>

            <div className="text-xs uppercase tracking-widest text-[#00B5E2] font-mono mb-2">Protocol Architecture &amp; Honest Volume</div>

            <h2 className="text-3xl font-extrabold uppercase text-white tracking-tight">The Four Machine-Economy Rails</h2>

          </div>

          <div className="text-xs text-[#8C92A4] font-mono border border-white/10 px-3 py-1.5 rounded bg-white/5">

            Updated: 2026-11-09 · Full Briefing: <a href="/m2m-state.md" className="text-[#00B5E2] hover:underline">m2m-state.md</a>

          </div>

        </div>



        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

          <div className="p-5 rounded-lg border border-[#8C92A4]/20 bg-[#07090D] space-y-3">

            <div className="text-xs text-[#8C92A4] uppercase font-mono">1. Talk</div>

            <div className="text-lg font-bold text-white">Google A2A &amp; Sierra Poppy</div>

            <p className="text-sm text-[#8C92A4] font-sans">Agent-to-agent discovery and Personal Agent Protocol (A2A Agent Card + Poppy PAP). How autonomous units talk.</p>

          </div>

          <div className="p-5 rounded-lg border border-[#8C92A4]/20 bg-[#07090D] space-y-3">

            <div className="text-xs text-[#8C92A4] uppercase font-mono">2. Permission</div>

            <div className="text-lg font-bold text-[#A3FF00]">Google / FIDO AP2</div>

            <p className="text-sm text-[#8C92A4] font-sans">Signed policy mandates: intent, cart, and spend bounds without human present. Identity and authorization gates.</p>

          </div>

          <div className="p-5 rounded-lg border border-[#8C92A4]/20 bg-[#07090D] space-y-3">

            <div className="text-xs text-[#8C92A4] uppercase font-mono">3. Checkout</div>

            <div className="text-lg font-bold text-[#FF7B00]">OpenAI ACP · Mastercard · Visa</div>

            <p className="text-sm text-[#8C92A4] font-sans">Purchases through seller PSP with delegate tokens (Mastercard Agent Pay, Visa TAP). Fiat checkout with cardholder binding.</p>

          </div>

          <div className="p-5 rounded-lg border border-[#00B5E2]/40 bg-[#00B5E2]/5 space-y-3">

            <div className="text-xs text-[#00B5E2] uppercase font-mono">4. Settlement</div>

            <div className="text-lg font-bold text-[#00B5E2]">x402 &amp; MPP</div>

            <p className="text-sm text-[#8C92A4] font-sans">Pay inside the request (HTTP 402 on Base USDC) and session streaming. Open Linux Foundation standard across ~57 member orgs.</p>

          </div>

        </div>



        <div className="p-6 rounded-lg border border-white/10 bg-white/5 space-y-4 font-sans text-sm text-[#8C92A4]">

          <div className="flex items-center gap-2 text-white font-mono text-xs uppercase font-bold tracking-wider">

            <Shield size={14} className="text-[#A3FF00]" />

            Volume Honesty &amp; Verified Counterweight

          </div>

          <p>

            As of Nov 11, 2026, the Linux Foundation x402 Foundation (&gt;40–57 members including Visa, Mastercard, Stripe, Adyen, Amex, AWS, Google, Cloudflare, Circle, Shopify, Coinbase) tracks ~198.4M cumulative txs / ~$42.6M settled across 12 chains (post-speculation baseline 4–6M txs/mo, ~$0.05 avg), while Allium tracks 68.3M agent payments in Q3 2026 (~$3.7M) and stablecoin volume grew +45% YoY to $482B. With median wallet age at first payment dropping to 18 minutes (2/3 spending within 1 hour), A2A v1.0 scaling across 150+ orgs, and AP2 v0.2 under FIDO Alliance, institutional automation readiness remains just 12/100 (BeInCrypto) vs. ~$281k drained via instruction manipulation and 10× header overpayment traps (SoFi Research). Nano Empire enforces the missing deterministic verification layer outside the model: <strong>SkillProof Ed25519 Trust Manifests</strong> (<code>/api/skillproof/status</code>), <strong>BidShield Deontic Gates</strong> (<code>/api/bidshield/gate</code>), <strong>x402 Anti-Overpayment Guard</strong> (<code>/api/x402/guard</code>), and the unified <strong>VCIL Compliance Graph</strong> (<code>/api/vcil</code>). Outside settled customer count remains 0 (1 operator self-test on Base block 51961194).

          </p>

          <div className="pt-2 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-mono">

            <span>Paywall is now a CDN feature (Cloudflare Monetization Gateway). Proof of skill is not.</span>

            <a href="/manifests.html" className="text-[#00B5E2] hover:underline flex items-center gap-1">

              Explore SkillProof Invariant Manifests <ArrowUpRight size={12} />

            </a>

          </div>

        </div>

        {/* Three Foundational Lenses: Why the Protocol Stack Matters for Ordinary Operators */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-2">
          <div className="p-5 rounded-lg border border-[#3ddc97]/30 bg-[#07090D] space-y-2.5">
            <div className="text-[10px] uppercase tracking-widest font-mono text-[#3ddc97] font-bold">
              Lens I · Abundance &amp; Swarm Ownership
            </div>
            <div className="text-base font-bold text-white">
              Turning 1,000 Agents from Risk into Usable Abundance
            </div>
            <p className="text-xs text-[#8C92A4] font-sans leading-relaxed">
              As society shifts from labor-scarce to compute- and trust-scarce, <code className="text-[#F4F1EA]">x402</code> and <code className="text-[#F4F1EA]">AP4M</code> let ordinary people&apos;s agents purchase compliance data (<code className="text-[#F4F1EA]">RecallRadar</code>) without corporate accounts or invoices — while <code className="text-[#F4F1EA]">SkillProof</code> and <code className="text-[#F4F1EA]">BidShield</code> enforce the pre-action boundaries that keep agent swarms safe.
            </p>
          </div>

          <div className="p-5 rounded-lg border border-[#00B5E2]/30 bg-[#07090D] space-y-2.5">
            <div className="text-[10px] uppercase tracking-widest font-mono text-[#00B5E2] font-bold">
              Lens II · Causal Entropy &amp; Future Freedom
            </div>
            <div className="text-base font-bold text-white">
              Expanding Accessible Futures in the Innermost Loop
            </div>
            <p className="text-xs text-[#8C92A4] font-sans leading-relaxed">
              Intelligence maximizes future freedom of action. An agent that can discover peers via <code className="text-[#F4F1EA]">A2A</code>, invoke tools over <code className="text-[#F4F1EA]">MCP</code>, settle per-request via <code className="text-[#F4F1EA]">x402</code>, and verify an <code className="text-[#F4F1EA]">RFC 8785 JCS + Ed25519</code> Trust Manifest retains far more degrees of freedom than one trapped behind human payment walls.
            </p>
          </div>

          <div className="p-5 rounded-lg border border-[#FF7B00]/30 bg-[#07090D] space-y-2.5">
            <div className="text-[10px] uppercase tracking-widest font-mono text-[#FF7B00] font-bold">
              Lens III · Organizational Singularity (ExO 3.0)
            </div>
            <div className="text-base font-bold text-white">
              Collapsing Coasean Coordination Costs at the Edge
            </div>
            <p className="text-xs text-[#8C92A4] font-sans leading-relaxed">
              When machine-readable protocols collapse transaction costs, solo operators and small teams match institutional scale. <code className="text-[#F4F1EA]">SkillProof</code> and <code className="text-[#F4F1EA]">BidShield</code> serve as the Governance &amp; Sentinel layer of the Intelligence Stack — keeping humans &quot;above the loop&quot; with auditable mandates.
            </p>
          </div>
        </div>

      </div>

    </section>



    {/* Unified Pricing Rails */}

    <PricingTierTranslation />



    {/* Free Architecture & Trust Audit Lead Magnet */}

    <ArchitectureAuditModal />



    {/* Two Doors Split */}

    <DoorA />

    <DoorB />

      {/* Epigenetic AST Bridge -> /manifesto */}
      <footer className="border-t border-[#1C2230] bg-[#07090D] py-8 px-6 text-center font-mono text-xs text-[#8C92A4]">
        <div className="max-w-5xl mx-auto flex flex-wrap items-center justify-center gap-5">
          <a href="/manifesto" className="text-[#3ddc97] hover:underline font-semibold">System Manifesto &amp; Economic Theory →</a>
          <a href="/llms.txt" className="hover:text-white">llms.txt</a>
          <a href="/m2m-state.md" className="hover:text-white">m2m-state.md</a>
          <a href="/.well-known/agent-card.json" className="hover:text-white">agent-card.json</a>
          <a href="/.well-known/astryx-manifest.json" className="hover:text-white">astryx-manifest.json</a>
          <a href="/.well-known/skillproof-pubkey.json" className="hover:text-white">skillproof-pubkey.json</a>
          <a href="/terms" className="hover:text-white">Terms &amp; SLA</a>
          <a href="/privacy" className="hover:text-white">Privacy</a>
        </div>
      </footer>
    </main>
  );
}
