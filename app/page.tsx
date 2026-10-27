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
  name: "Nano Empire AI — RecallGuard, SkillProof & BidShield",
  applicationCategory: "SecurityApplication",
  operatingSystem: "Web, REST API, Base Mainnet (x402)",
  url: "https://www.nanoempireai.com",
  description:
    "Cryptographic compliance and verification infrastructure: RecallGuard x402 API across 46,642 CPSC/FDA/Health Canada safety records, SkillProof Ed25519 Trust Manifests, and BidShield RFP compliance audits.",
  offers: [
    { "@type": "Offer", name: "RecallRadar Compliance Report", price: "30.00", priceCurrency: "USD", url: "https://buy.stripe.com/6oU4gAfis2aP21Z8c0fAc0k" },
    { "@type": "Offer", name: "RecallRadar Continuous Monitoring", price: "99.00", priceCurrency: "USD", url: "https://buy.stripe.com/00w5kE2vGg1F3630JyfAc0e" },
    { "@type": "Offer", name: "SkillProof Adversarial Sprint", price: "500.00", priceCurrency: "CAD", url: "https://buy.stripe.com/eVq00keeo5n1bCzgIwfAc0c" }
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
      <p>Machine-to-machine x402 screening across 46,642 CPSC, FDA & Health Canada recall records. Settle via Base USDC.</p>
    </div>
    <div style="border: 1px solid #ddd; border-radius: 8px; padding: 1.25rem;">
      <h3 style="margin-top: 0;">RecallRadar Compliance Report — $30 USD</h3>
      <p>Instant inventory cross-reference against 46,642 US & Canadian safety enforcement records. Signed PDF and CSV audit report.</p>
    </div>
    <div style="border: 1px solid #ddd; border-radius: 8px; padding: 1.25rem;">
      <h3 style="margin-top: 0;">SkillProof Adversarial Sprint — $500 CAD</h3>
      <p>48-hour 180-vector adversarial battery for MCP servers & agent skills. Emits an Ed25519-signed Trust Manifest pinned to code SHA-256.</p>
    </div>
    <div style="border: 2px solid #111; border-radius: 8px; padding: 1.25rem;">
      <h3 style="margin-top: 0;">Sovereign Data License — $2,400 / yr</h3>
      <p>Full enterprise data export, daily automated sync across federal safety feeds, and commercial catalog vetting license.</p>
    </div>
  </div>

  <p><strong>Honest limits, up front:</strong> a pass means our battery's
  attacks failed — not that no attack exists. Every finding cites the op
  that produced it. Identity binds claims to behavior; it isn't KYC.</p>

  <p><a href="https://buy.stripe.com/eVq00keeo5n1bCzgIwfAc0c" target="_blank" rel="noopener noreferrer"
  style="display: inline-block; background: #111; color: #fff; padding: .75rem 1.5rem; border-radius: 6px; text-decoration: none; font-weight: 600;">
  Order SkillProof Sprint ($500 CAD)</a></p>
  <p style="font-size: .85rem; color: #555;">Fixed price, self-serve Stripe checkout. No meter, no surprise.</p>
</section>`;



const SKUS = [

  // RecallGuard (Human & Merchant)

  { id: "recallguard-report", price: "$30 USD", buyer: "human", payment: "Stripe", status: "live", category: "recallguard", desc: "One-time scan of inventory against 46,642 US & Canadian recalls (12,430 US CPSC/FDA + 34,212 Health Canada). Signed PDF compliance report." },

  { id: "recallguard-monitoring", price: "$99/mo USD", buyer: "human", payment: "Stripe", status: "live", category: "recallguard", desc: "Monthly inventory re-scan + immediate recall expansion alerts." },

  { id: "sovereign-license", price: "$2,400/yr USD", buyer: "enterprise", payment: "Invoice / Stripe", status: "live", category: "recallguard", desc: "Complete data license, daily API sync, and private deployment." },

  

  // Machine SKUs (x402 on Base)

  { id: "recallguard-feed", price: "$0.05 USDC", buyer: "machine", payment: "x402", status: "live", category: "recallguard", desc: "Continuous CPSC & FDA recall feed sync. Settle via HTTP 402 on Base." },

  { id: "recallguard-match", price: "$0.10 USDC", buyer: "machine", payment: "x402", status: "live", category: "recallguard", desc: "Machine-native recall screening. Settle directly inside HTTP 402 request on Base." },

  { id: "trial-onramp", price: "Free (1,000 credits)", buyer: "machine", payment: "Trial Token", status: "live", category: "utility", desc: "Provisioned via /api/v1/trial/verify. Pre-funded key for developer testing." },

];



const ENDPOINTS = [

  { method: "GET", path: "/api/v1/health", auth: "None", price: "Free", desc: "46,642 records, refreshed 2026-10-25. Host: recallguard-api.vercel.app" },

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

              <a href="/bidshield/triage/" className="text-[#3ddc97] hover:underline flex items-center gap-1 font-bold"><Shield size={13} /> BidShield Triage</a>

              <a href="/ingest/" className="text-[#00B5E2] hover:underline flex items-center gap-1 font-bold"><Database size={13} /> Trap Atlas</a>

              <a href="/rfp/" className="text-[#FF7B00] hover:underline flex items-center gap-1 font-bold"><Terminal size={13} /> RFP Engine</a>

              <a href="/tollbooth/" className="text-white hover:underline flex items-center gap-1 font-bold"><Zap size={13} /> Tollbooth</a>

              <a href="/decision-bus/" className="hover:text-white transition-colors flex items-center gap-1"><Activity size={13} /> Decision Bus</a>

              <a href="/grok-mcp/" className="text-[#A3FF00] hover:underline flex items-center gap-1"><Shield size={13} /> Grok MCP</a>

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

                The production gateway for autonomous agent swarms. Live x402 Base settlement for real-time recall verification and cryptographic Trust Manifests for MCP servers.

              </p>



              <div className="flex flex-wrap items-center gap-3 font-mono text-xs">

                <a href="/bidshield/triage/" className="px-5 py-3 rounded bg-[#3ddc97] hover:bg-[#34c787] text-black font-bold tracking-wider uppercase transition-all flex items-center gap-2 shadow-lg shadow-[#3ddc97]/20">

                  <Shield size={15} /> Free BidShield Triage

                </a>

                <a href="/ingest/" className="px-5 py-3 rounded bg-[#00B5E2] hover:bg-[#009ac0] text-black font-bold tracking-wider uppercase transition-all flex items-center gap-2">

                  <Database size={15} /> Public Trap Atlas

                </a>

                <a href="/tollbooth/" className="px-5 py-3 rounded border border-white/30 hover:bg-white/10 text-white tracking-wider uppercase transition-all flex items-center gap-2">

                  <Zap size={15} /> Tollbooth SDK

                </a>

                <a href="/rfp/" className="px-5 py-3 rounded border border-[#FF7B00]/40 text-[#FF7B00] hover:bg-[#FF7B00]/10 tracking-wider uppercase transition-all flex items-center gap-2">

                  <Terminal size={15} /> RFP Engine

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

                    <div className="text-[#8C92A4] text-xs">GET https://recallguard-api.vercel.app/api/v1/health is free. 46,642 records, refreshed 2026-10-25.</div>

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

              <div className="text-[11px] uppercase tracking-wider text-[#8C92A4] font-mono mb-2">Verified Baseline Proof (Radical Transparency):</div>

              <div className="grid grid-cols-3 gap-3 text-center">

                <div className="p-2.5 rounded bg-black/40 border border-white/5">

                  <div className="text-xl font-bold font-mono text-white">0</div>

                  <div className="text-[10px] text-[#8C92A4]">Outside Paying Customers</div>

                </div>

                <div className="p-2.5 rounded bg-black/40 border border-white/5">

                  <div className="text-xl font-bold font-mono text-white">0</div>

                  <div className="text-[10px] text-[#8C92A4]">Verified Hours Returned</div>

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



            <a href="/ingest/" className="p-5 rounded-xl border border-[#00B5E2]/40 bg-[#0f1423] hover:border-[#00B5E2] transition-all group flex flex-col justify-between">

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

              <div className="mt-4 pt-3 border-t border-white/10 text-xs font-mono text-[#00B5E2] font-semibold">Explore Trap Atlas →</div>

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



            <a href="/rfp/" className="p-5 rounded-xl border border-[#FF7B00]/40 bg-[#0f1423] hover:border-[#FF7B00] transition-all group flex flex-col justify-between">

              <div>

                <div className="flex items-center justify-between mb-3">

                  <span className="text-[10px] uppercase font-bold tracking-wider font-mono text-[#FF7B00] bg-[#FF7B00]/10 px-2 py-0.5 rounded border border-[#FF7B00]/30">SOLICITATION ENGINE</span>

                  <ArrowUpRight size={16} className="text-[#FF7B00] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />

                </div>

                <h3 className="text-lg font-bold text-white mb-2">RFP Teardown Engine</h3>

                <p className="text-xs text-[#8C92A4] font-sans leading-relaxed">

                  Deterministic procurement decomposition. Extracts fatal clauses, insurance traps, and mandatory atom checklists with zero hallucination.

                </p>

              </div>

              <div className="mt-4 pt-3 border-t border-white/10 text-xs font-mono text-[#FF7B00] font-semibold">Test RFP Teardown →</div>

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



            <a href="/grok-mcp/" className="p-5 rounded-xl border border-[#A3FF00]/40 bg-[#0f1423] hover:border-[#A3FF00] transition-all group flex flex-col justify-between">

              <div>

                <div className="flex items-center justify-between mb-3">

                  <span className="text-[10px] uppercase font-bold tracking-wider font-mono text-[#A3FF00] bg-[#A3FF00]/10 px-2 py-0.5 rounded border border-[#A3FF00]/30">SECURITY AUDITOR</span>

                  <ArrowUpRight size={16} className="text-[#A3FF00] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />

                </div>

                <h3 className="text-lg font-bold text-white mb-2">Grok MCP Readiness Audit</h3>

                <p className="text-xs text-[#8C92A4] font-sans leading-relaxed">

                  Comprehensive audit battery for MCP servers preparing for xAI Grok and autonomous agent consumption. Generates signed Trust Manifests.

                </p>

              </div>

              <div className="mt-4 pt-3 border-t border-white/10 text-xs font-mono text-[#A3FF00] font-semibold">Run MCP Audit →</div>

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

            Updated: 2026-10-26 · Next Corpus Refresh: 2026-10-27

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

            The Linux Foundation x402 Foundation (~57 member orgs including Coinbase, Cloudflare, Stripe, Visa, Mastercard, AWS, Google, Shopify) tracks ~195M cumulative transactions and ~$42M gross volume (recent 30-day window ~75M txs / ~$24M), overwhelmingly sub-cent micropayments for inference, tools, and API calls. Forensics note commercial merchant volume is earlier: TRM Labs measures 0.6%–7.5% real-economy agent volume, and Mastercard / Visa are in early access machine pilots. Nano Empire maintains zero hype: outside settled customer count is currently 0 (one verified operator self-test on Base block 51961194).

          </p>

          <div className="pt-2 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-mono">

            <span>Paywall is now a CDN feature (Cloudflare Monetization Gateway). Proof of skill is not.</span>

            <a href="/manifests.html" className="text-[#00B5E2] hover:underline flex items-center gap-1">

              Explore SkillProof Invariant Manifests <ArrowUpRight size={12} />

            </a>

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





{/* --- IMPORTED LANDING SECTIONS --- */}



<section className="block" id="economics">

    <div className="wrap">

      <div className="sec-head rv"><span className="sec-num">01</span><h2 className="sec-title">The agentic economy, answered.</h2></div>

      <p className="sec-sub rv">Economic theory names the problems. We sell the answers — one product per problem, each purchasable by a machine, each emitting proof.</p>



      <div className="trow rv">

        <div className="theory">THE PRINCIPAL–AGENT PROBLEM</div>

        <div className="arrow">→</div>

        <div className="product">

          <h3>SkillProof trust manifests <span className="tag">FLAGSHIP</span></h3>

          <p>Behavioral verification of agent skills and MCP servers. We execute an adversarial battery against the live skill, check the invariants, and issue a signed Ed25519 manifest — offline-verifiable, bound to the code hash, revocable. Proof the agent behaved, not a scanner's opinion.</p>

        </div>

      </div>



      <div className="trow rv">

        <div className="theory">TRANSACTION COSTS</div>

        <div className="arrow">→</div>

        <div className="product">

          <h3>Machine tollbooth</h3>

          <p>x402 micropayments for agent-to-agent calls — fractions of a cent per call, settled machine-to-machine. Coordination priced below the cost of a sales call, because there is no sales call.</p>

        </div>

      </div>



      <div className="trow rv">

        <div className="theory">MECHANISM DESIGN</div>

        <div className="arrow">→</div>

        <div className="product">

          <h3>Fair-market oracle</h3>

          <p>Auctions and approvals with provable rules. When agents bid, negotiate, and settle, the market mechanics are stated up front and verifiable after — no hidden thumbs on the scale.</p>

        </div>

      </div>



      <div className="trow rv">

        <div className="theory">SEARCH &amp; MATCHING</div>

        <div className="arrow">→</div>

        <div className="product">

          <h3>Intel feed</h3>

          <p>A discovery API of verified skills. Agents don't just need counterparties — they need trustworthy ones. Every entry in the feed carries its verification record.</p>

        </div>

      </div>



      <div className="trow rv">

        <div className="theory">AUTOMATION RISK</div>

        <div className="arrow">→</div>

        <div className="product">

          <h3>Battery gate</h3>

          <p>A per-run adversarial gate for agent actions — injection, exfiltration, and policy-escape payloads, executed before anything ships. Each run emits a signed attestation: the compliance artifact for the agentic age.</p>

        </div>

      </div>



      <div className="footnote rv">

        <b>PLATFORM ECONOMICS →</b> the strategy, not a product. Whoever owns the rails taxes the economy. So we own ours: verification, metering, and settlement run on infrastructure we control. Own the rails, don't rent them.

      </div>

    </div>

  </section>

<section className="block" id="proofs">

    <div className="wrap">

      <div className="sec-head rv"><span className="sec-num">02</span><h2 className="sec-title">Proofs, not promises.</h2></div>

      <p className="sec-sub rv">Our verification corpus. Four of five MCP servers put through the battery — and we publish the failures with the same signature as the passes.</p>



      <div className="corpus rv">

        <div className="corpus-head">

          <span className="stat"><b>5 evaluated</b> &nbsp;· 1 pass_with_notes · 4 fail</span>

          <span className="stat mono"><a href="https://github.com/roblambert9/skillproof-verifications">github.com/roblambert9/skillproof-verifications</a></span>

        </div>

        <div className="crow">

          <span className="id">#01</span>

          <span className="target">filesystem server v0.6.3<span className="note">228 ops · 0 invariant violations</span></span>

          <span className="badge pass">PASS_WITH_NOTES</span>

        </div>

        <div className="crow">

          <span className="id">#02</span>

          <span className="target">fetch</span>

          <span className="badge fail">FAIL</span>

        </div>

        <div className="crow">

          <span className="id">#03</span>

          <span className="target">demo-postgres</span>

          <span className="badge fail">FAIL</span>

        </div>

        <div className="crow">

          <span className="id">#04</span>

          <span className="target">demo-sqlite</span>

          <span className="badge fail">FAIL</span>

        </div>

        <div className="crow">

          <span className="id">#07</span>

          <span className="target">memory server</span>

          <span className="badge fail">FAIL</span>

        </div>

      </div>

      <p className="proof-line rv"><strong>We publish our failures.</strong> A verification service that only ever passes is a marketing department. Every manifest in the corpus is signed, inspectable, and permanent — including the four that failed.</p>

    </div>

  </section>

<section className="block" id="services">

    <div className="wrap">

      <div className="sec-head rv"><span className="sec-num">03</span><h2 className="sec-title">Services, priced for humans & machines.</h2></div>

      <p className="sec-sub rv">Zero mystery pricing. Compliance reports settle via Stripe ($30 USD). Automated APIs settle machine-to-machine via x402 on Base ($0.10 USDC).</p>



      <div className="cards">

        <div className="card rv">

          <div className="tier">RecallRadar Report</div>

          <div className="price">$30<small> USD</small></div>

          <div className="per">one-time scan · instant PDF</div>

          <p>Scan your inventory against 46,642 US & Canadian recalls (12,430 US CPSC/FDA + 34,212 Health Canada). Official signed compliance report with remedy protocols.</p>

          <a className="btn small solid" href="https://buy.stripe.com/6oU4gAfis2aP21Z8c0fAc0k" target="_blank">Order Report ($30)</a>

        </div>

        <div className="card rv">

          <div className="tier">Recall Monitoring</div>

          <div className="price">$99<small>/mo</small></div>

          <div className="per">per merchant · continuous</div>

          <p>Monthly inventory re-scan, expansion alerts when recalls widen, and continuous compliance defense.</p>

          <a className="btn small" href="https://buy.stripe.com/00w5kE2vGg1F3630JyfAc0e" target="_blank">Subscribe ($99/mo)</a>

        </div>

        <div className="card rv">

          <div className="tier">RecallGuard Match API</div>

          <div className="price">$0.10<small> USDC</small></div>

          <div className="per">per call · machine settlement</div>

          <p>Machine-native HTTP 402 recall screening across 46,642 records. Pay and settle directly on Base.</p>

          <a className="btn small solid" href="/recall-report" target="_blank">Test Match API</a>

        </div>

        <div className="card rv">

          <div className="tier">Sovereign Data License</div>

          <div className="price">$2,400<small>/yr</small></div>

          <div className="per">enterprise · annual license</div>

          <p>Complete data export, daily automated sync across federal safety feeds, and commercial catalog vetting license.</p>

          <a className="btn small" href="mailto:licensing@nanoempireai.com?subject=RecallRadar%20Enterprise%20Inquiry" target="_blank">Contact Licensing</a>

        </div>

      </div>

      <div className="rail-note rv">

        <span className="p">◈</span>

        <span>RecallGuard Match API settles instantly machine-to-machine in USDC on Base via x402. Human compliance reports settle via Stripe ($30 USD).</span>

      </div>

    </div>

  </section>

<section className="block" id="agents">

    <div className="wrap">

      <div className="sec-head rv"><span className="sec-num">04</span><h2 className="sec-title">If you're an agent, start here.</h2></div>

      <p className="sec-sub rv">This site is machine-readable by design. No scraping, no guessing — pull the descriptors and transact.</p>



      <div className="agent-grid">

        <div className="code rv"><span className="cm"># who we are</span><br />GET <a href="/.well-known/agent-card.json">/.well-known/agent-card.json</a><br />GET <a href="/.well-known/poppy.json">/.well-known/poppy.json</a><br /><br /><span className="cm"># the machine interface</span><br />GET <a href="/openapi.json">/openapi.json</a><br /><br /><span className="cm"># the short version &amp; briefing</span><br />GET <a href="/llms.txt">/llms.txt</a><br />GET <a href="/m2m-state.md">/m2m-state.md</a><br /><br /><span className="cm"># the registry of verified skills</span><br />GET <a href="/manifests">/manifests</a></div>

        <div className="agent-copy rv">

          <p><strong>Discovery is a first-class surface.</strong> The same manifests humans read are published as structured data for agents — capabilities, pricing, and verification records included.</p>

          <p><strong>Payment is a protocol, not a process.</strong> Requests that require payment answer <span className="mono">402</span> with machine-readable terms. Pay, retry, receive your signed manifest.</p>

          <p><strong>Trust is offline-verifiable.</strong> Every manifest is Ed25519-signed and bound to a code hash. Verify it without calling us.</p>

        </div>

      </div>

    </div>

  </section>

<section className="block" id="intake">

    <div className="wrap">

      <div className="sec-head rv"><span className="sec-num">05</span><h2 className="sec-title">Run a compliance scan.</h2></div>

      <p className="sec-sub rv">RecallRadar Compliance Report is <a href="/recall-report">$30 USD on Stripe</a>. Scan your inventory CSV directly against 46,642 US & Canadian safety records (12,430 US CPSC/FDA + 34,212 Health Canada) with instant signed report generation. For enterprise feeds or private deployment, contact <a href="mailto:licensing@nanoempireai.com">licensing@nanoempireai.com</a> ($2,400/yr).</p>



      <div className="intake-box rv">

        <div className="p-6 text-center">

          <h3 className="text-xl font-bold mb-3 text-white">Instant Self-Serve Inventory Audit</h3>

          <p className="text-sm text-neutral-400 mb-6 max-w-xl mx-auto">Upload any vendor manifest, return pallet CSV, or inventory sheet to verify against active consumer safety recalls before listing or shipping.</p>

          <div className="flex justify-center gap-4 flex-wrap">

            <a className="btn solid" href="/recall-report">Launch Scanner ($30 USD)</a>

            <a className="btn" href="mailto:licensing@nanoempireai.com?subject=RecallRadar%20Enterprise%20Inquiry">Annual License ($2,400/yr)</a>

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

            <strong className="text-3xl font-bold text-white">46,642</strong><div className="text-[11px] text-[#8C92A4] mt-1 font-mono">12,430 US (CPSC/FDA) + 34,212 Canada</div>

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

            <div className="text-[#8C92A4] text-xs tracking-widest mb-1 uppercase">Compliance report</div>

            <div className="text-3xl font-bold text-[#FF7B00]">$30 live</div>

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

            <p className="text-[#8C92A4] mt-2 font-sans">The full list is /offers.json. RecallGuard Match is live with Base x402 USDC micropayment settlement. RecallRadar Compliance Report is live via Stripe ($30 USD).</p>

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

                {sku.id === "recallguard-report" && (

                  <a href="https://buy.stripe.com/6oU4gAfis2aP21Z8c0fAc0k" target="_blank" className="inline-block mb-4 text-sm font-bold text-black bg-[#A3FF00] px-3 py-2 rounded">Order Report ($30 USD)</a>

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

          <a href="/podcast" className="hover:text-white text-[#00B5E2] font-semibold">Moonshots Optimist (podcast)</a>

          <a href="/llms.txt" className="hover:text-white">llms.txt</a>

          <a href="/m2m-state.md" className="hover:text-white">M2M State (Oct 26)</a>

          <a href="/.well-known/agent-card.json" className="hover:text-white">agent-card.json</a>
          <a href="/.well-known/poppy.json" className="hover:text-white">poppy.json</a>

          <a href="/openapi.json" className="hover:text-white">openapi.json</a>

          <a href="/offers.json" className="hover:text-white">offers.json</a>

          <a href="/recall-roulette" className="hover:text-white">Recall Roulette</a>

          <a href="https://github.com/roblambert9/nano-empire-ai" className="hover:text-white">GitHub</a>
          <a href="/terms" className="hover:text-white">Terms &amp; SLA</a>
          <a href="/privacy" className="hover:text-white">Privacy Policy</a>
          <a href="/.well-known/security.txt" className="hover:text-white">security.txt</a>

        </div>

        <p>NANO EMPIRE AI INC. © 2026. THE MACHINE ECONOMY RUNS ON PROTOCOL.</p>

      </footer>

    </main>

  );

}