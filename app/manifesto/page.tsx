// Argon Epigenetic AST Partition — System Manifesto Surface
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




export default function ManifestoPage() {
  return (
    <main className="min-h-screen flex flex-col font-mono text-[#F4F1EA] bg-[#07090D] overflow-hidden">
      <div className="border-b border-[#1C2230] bg-[#0b101b] py-3 px-6 text-xs font-mono flex items-center justify-between">
        <a href="/" className="text-[#3ddc97] hover:underline font-bold">← Back to Nano Empire Clearinghouse (RecallRadar · BidShield · SkillProof)</a>
        <span className="text-[#8C92A4]">/manifesto · Economic Theory &amp; Full Catalog</span>
      </div>
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

          <p>Scan your inventory against 46,642 normalized US & Canadian (CPSC, FDA & Health Canada) recall records. Official signed compliance report with remedy protocols.</p>

          <a className="btn small solid" href="https://buy.stripe.com/6oU4gAfis2aP21Z8c0fAc0k" target="_blank">Order Report ($30)</a>

        </div>

        <div className="card rv">

          <div className="tier">Recall Monitoring</div>

          <div className="price">$99<small> CAD/mo</small></div>

          <div className="per">per merchant · continuous</div>

          <p>Monthly inventory re-scan, expansion alerts when recalls widen, and continuous compliance defense.</p>

          <a className="btn small" href="https://buy.stripe.com/00w5kE2vGg1F3630JyfAc0e" target="_blank">Subscribe ($99 CAD/mo)</a>

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

      <p className="sec-sub rv">Signed Recall Match Report is <a href="/recall-report">$30 USD on Stripe</a>. Scan your inventory CSV directly against 46,642 normalized US & Canadian (CPSC, FDA & Health Canada) safety records with instant signed report generation. For enterprise feeds or private deployment, contact <a href="mailto:licensing@nanoempireai.com">licensing@nanoempireai.com</a> ($2,400/yr).</p>



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

            <strong className="text-3xl font-bold text-white">46,642</strong><div className="text-[11px] text-[#8C92A4] mt-1 font-mono">46,642 Normalized CPSC, FDA & Health Canada Recall Records</div>

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

            <p className="text-[#8C92A4] mt-2 font-sans">The full list is /offers.json. RecallGuard Match is live with Base x402 USDC micropayment settlement. Signed Recall Match Report is live via Stripe ($30 USD).</p>

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




      {/* Jev CausalHarness & 10x -> 100,000x Compounding Horizon */}
      <section className="py-16 px-6 border-t border-[#8C92A4]/20 bg-[#07090D]">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded border border-[#3ddc97]/40 bg-[#3ddc97]/10 text-[#3ddc97] text-xs font-mono uppercase tracking-widest">
            Innermost Loop · CausalHarness (jev_causal_entropy_router) · 10x → 100,000x Horizon
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
            From Jev Decision Routing to Thermodynamic Future-Freedom Maximization (F = T ∇S_τ)
          </h2>
          <p className="text-sm text-[#8C92A4] font-sans leading-relaxed max-w-4xl">
            <strong>2026 Honesty Latch:</strong> Today Nano Empire AI is an early-stage deterministic verification and machine-settlement layer (46,642 normalized North American recall records, 882 federal tenders, 30 pre-audited MCP repositories, 1 operator self-test settled on Base block 51961194, 0 outside paying customers). Tool #7 on <code className="text-[#F4F1EA]">POST /api/mcp</code> (<code className="text-[#3ddc97]">jev_causal_entropy_router</code>) combines Jev-style routine-vs-hard model routing with Wissner-Gross Causal Entropy scoring (<code className="text-[#F4F1EA]">optionality_delta_bps</code>) and Ed25519 REA commitments.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 pt-2">
            <div className="p-4 rounded-lg border border-[#8C92A4]/30 bg-[#0b101b] space-y-2">
              <div className="text-xs font-mono text-[#3ddc97] font-bold">1x · 2026 Baseline</div>
              <div className="text-sm font-bold text-white">Trust &amp; Tollbooth Layer</div>
              <p className="text-xs text-[#8C92A4] font-sans">RecallGuard x402 ($0.05/$0.10), $30 Signed Report, BidShield ($299/$499/$999), SkillProof JCS Ed25519 manifests.</p>
            </div>
            <div className="p-4 rounded-lg border border-[#00B5E2]/30 bg-[#0b101b] space-y-2">
              <div className="text-xs font-mono text-[#00B5E2] font-bold">10x · Swarm OS</div>
              <div className="text-sm font-bold text-white">CausalHarness Kernel</div>
              <p className="text-xs text-[#8C92A4] font-sans">Jev-style routing + optionality_delta_bps lets small teams govern 100–1,000 agents while preserving resumable state.</p>
            </div>
            <div className="p-4 rounded-lg border border-[#FF7B00]/30 bg-[#0b101b] space-y-2">
              <div className="text-xs font-mono text-[#FF7B00] font-bold">100x · Public Good</div>
              <div className="text-sm font-bold text-white">Ambient Swarm Agency</div>
              <p className="text-xs text-[#8C92A4] font-sans">SkillProof &amp; BidShield act as portable thermodynamic proofs across open community-evolved policies.</p>
            </div>
            <div className="p-4 rounded-lg border border-[#A3FF00]/30 bg-[#0b101b] space-y-2">
              <div className="text-xs font-mono text-[#A3FF00] font-bold">1,000x · Gradient</div>
              <div className="text-sm font-bold text-white">Friction Minimum</div>
              <p className="text-xs text-[#8C92A4] font-sans">Discovery, delegation, settlement, and proof operate like packet routing; restrictive paths are selected against.</p>
            </div>
            <div className="p-4 rounded-lg border border-purple-400/30 bg-[#0b101b] space-y-2">
              <div className="text-xs font-mono text-purple-300 font-bold">10,000x–100,000x</div>
              <div className="text-sm font-bold text-white">Thermodynamic Attractor</div>
              <p className="text-xs text-[#8C92A4] font-sans">Primitives dissolve into the substrate; agency is bounded primarily by physics, energy, and genuine novelty.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}

      <footer className="py-12 border-t border-[#8C92A4]/20 bg-[#07090D] text-[#8C92A4] text-xs text-center font-mono">

        <div className="flex justify-center gap-6 mb-4 flex-wrap">

          <a href="/podcast" className="hover:text-white text-[#00B5E2] font-semibold">Moonshots Optimist (podcast)</a>

          <a href="/llms.txt" className="hover:text-white">llms.txt</a>

          <a href="/m2m-state.md" className="hover:text-white">M2M State (Nov 3)</a>

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

        <p>NANO EMPIRE AI © 2026. THE MACHINE ECONOMY RUNS ON PROTOCOL.</p>

      </footer>
    </main>
  );
}
