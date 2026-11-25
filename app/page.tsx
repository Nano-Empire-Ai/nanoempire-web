import React from "react";
import Link from "next/link";
import { FreeRecallSearchWidget } from "@/components/cro/FreeRecallSearchWidget";
import {
  Shield,
  FileText,
  Stethoscope,
  CheckCircle2,
  Clock,
  CreditCard,
  ArrowRight,
  Lock,
  Terminal,
  Cpu,
  Building2,
  Bot,
  ChevronDown,
} from "lucide-react";

const STRUCTURED_DATA_JSON_LD = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "SoftwareApplication",
      name: "Nano Empire AI — Deterministic Product Recall Screening & Federal RFP Compliance",
      applicationCategory: "BusinessApplication",
      operatingSystem: "Web",
      url: "https://www.nanoempireai.com",
      description:
        "Deterministic US & Canadian product recall screening across 46,642 CPSC, FDA, and Health Canada records, inspection-ready Zero-PHI facility equipment recall binders, and 19-column federal RFP compliance matrices across 853 live tenders. Accessible to humans via Stripe and autonomous agents via Streamable HTTP MCP, A2A Agent Card, and x402.",
      offers: {
        "@type": "OfferCatalog",
        name: "Nano Empire AI Fixed-Price Compliance Services",
        itemListElement: [
          {
            "@type": "Offer",
            name: "Signed Inventory Recall Match Report",
            price: "30.00",
            priceCurrency: "USD",
            url: "https://buy.stripe.com/6oU4gAfis2aP21Z8c0fAc0k",
          },
          {
            "@type": "Offer",
            name: "Federal RFP 19-Column Compliance Matrix (Pilot)",
            price: "299.00",
            priceCurrency: "USD",
            url: "https://www.nanoempireai.com/api/checkout?tier=bidshield-299",
          },
          {
            "@type": "Offer",
            name: "HealthShield Zero-PHI Facility Equipment Recall Binder",
            price: "499.00",
            priceCurrency: "USD",
            url: "https://www.nanoempireai.com/api/checkout?tier=healthshield-499",
          },
        ],
      },
    },
    {
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "Why pay $30 when CPSC.gov and Health Canada are free?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Government portals only support manual single-item lookups. Nano Empire cross-references your entire SKU manifest or facility equipment list simultaneously across 46,642 normalized CPSC, FDA, and Health Canada notices—including unilateral CPSC safety warnings—and outputs a signed, audit-ready PDF + Excel report.",
          },
        },
        {
          "@type": "Question",
          name: "Do you use generative AI that can hallucinate requirements?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "No. Our core recall matching and RFP requirement extraction run deterministic Python parsers with exact source citations, so the same input produces repeatable, verifiable evidence every time.",
          },
        },
        {
          "@type": "Question",
          name: "Do I need a PHIPA/HIPAA Business Associate Agreement for HealthShield?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "No. HealthShield is strictly Zero-PHI. You send only equipment makes, models, and serial/asset identifiers—never patient or resident data.",
          },
        },
        {
          "@type": "Question",
          name: "How can autonomous AI agents connect to Nano Empire AI?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Agents can discover capabilities via GET /llms.txt and GET /.well-known/agent.json, invoke 8 live tools over Streamable HTTP at POST /api/mcp, call free JSON verification gates (/api/skillproof/status, /api/bidshield/gate, /api/x402/guard), or pay per call in Base USDC via x402.",
          },
        },
      ],
    },
  ],
};

const COMPARISON_ROWS = [
  {
    lane: "Product Recall & CPSC eFiling Prep",
    enterprise: "Sedgwick / SuperRecall.ai ($450 – $10,000+/mo, sales call)",
    nano: "$30 flat report (or $99/mo)",
    edge: "46,642 CPSC + FDA + Health Canada notices, instant checkout",
  },
  {
    lane: "Federal RFP Compliance Matrix",
    enterprise: "GovDash / VisibleThread ($15,000 – $50,000+/yr)",
    nano: "$299 flat per tender (<24h)",
    edge: "Deterministic 19-col Excel/CSV + 3+ mandatory catches or $0",
  },
  {
    lane: "Clinic / LTC Equipment Recall Binder",
    enterprise: "ECRI / RLDatix RASMAS ($10,000+/yr + IT/BAA)",
    nano: "$499 flat per facility (<24h)",
    edge: "Strictly Zero-PHI, zero IT setup, fits under $500 P-card limit",
  },
];

const AGENT_ENDPOINTS = [
  { method: "GET", path: "/llms.txt", href: "/llms.txt", purpose: "Complete plain-text capability manifest & pricing" },
  { method: "GET", path: "/.well-known/agent-card.json", href: "/.well-known/agent-card.json", purpose: "A2A Agent Card (service & tool discovery)" },
  { method: "GET", path: "/.well-known/mcp.json", href: "/.well-known/mcp.json", purpose: "MCP server metadata & tool schema discovery" },
  { method: "GET", path: "/api/skillproof/status?repo=pydantic/pydantic-ai", href: "/api/skillproof/status?repo=pydantic/pydantic-ai", purpose: "Free live JSON repo trust score & Ed25519 manifest" },
  { method: "POST", path: "/api/mcp", href: null, purpose: "8-tool Streamable HTTP MCP server (JSON-RPC 2.0)" },
  { method: "POST", path: "/api/bidshield/gate", href: null, purpose: "Free preliminary federal solicitation fatal-gate check" },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#07090E] text-slate-100 font-sans selection:bg-amber-500/20 selection:text-amber-300">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:bg-amber-400 focus:text-slate-950 focus:px-4 focus:py-2 focus:rounded-lg focus:font-bold"
      >
        Skip to main content
      </a>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(STRUCTURED_DATA_JSON_LD) }}
      />

      {/* Sticky Header with Human + Agent Quick Links */}
      <header className="sticky top-0 z-40 border-b border-slate-800/80 bg-[#07090E]/95 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2.5 font-bold text-white tracking-tight text-lg shrink-0">
            <Shield className="w-5 h-5 text-amber-400" aria-hidden="true" />
            <span>Nano Empire AI</span>
          </Link>

          <nav aria-label="Primary navigation" className="hidden md:flex items-center gap-5 text-sm text-slate-300">
            <Link href="/recall-report" className="hover:text-white transition">
              Recalls ($30)
            </Link>
            <Link href="/bidshield" className="hover:text-white transition">
              Gov RFPs ($299)
            </Link>
            <Link href="/healthshield" className="hover:text-white transition">
              Clinics ($499)
            </Link>
            <Link href="#partners" className="hover:text-white transition">
              Partners
            </Link>
            <Link
              href="/developers"
              className="inline-flex items-center gap-1.5 text-xs font-mono text-cyan-300 hover:text-cyan-200 border border-cyan-500/30 bg-cyan-500/10 rounded-full px-3 py-1 transition"
            >
              <Terminal className="w-3.5 h-3.5" aria-hidden="true" />
              Agents / MCP
            </Link>
          </nav>

          {/* Compact mobile action link */}
          <div className="flex md:hidden items-center gap-2">
            <a
              href="#offers"
              className="text-xs font-semibold bg-amber-500 text-slate-950 px-3 py-1.5 rounded-lg"
            >
              Pricing
            </a>
            <Link
              href="/developers"
              className="text-xs font-mono text-cyan-300 border border-cyan-500/30 px-2.5 py-1.5 rounded-lg"
            >
              API
            </Link>
          </div>
        </div>
      </header>

      <main id="main-content" className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-16">
        {/* Hero Section */}
        <section aria-labelledby="hero-heading" className="text-center max-w-4xl mx-auto mb-12">
          <div className="inline-flex flex-wrap items-center justify-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-medium mb-6">
            <span>46,642 US &amp; Canada Safety Recalls</span>
            <span aria-hidden="true">•</span>
            <span>853 Live Federal Tenders</span>
            <span aria-hidden="true">•</span>
            <span>44 Audited AI/MCP Repos</span>
            <span aria-hidden="true">•</span>
            <span>No Sales Calls</span>
          </div>

          <h1
            id="hero-heading"
            className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight mb-5"
          >
            Deterministic Recall Screening &amp; Federal RFP Compliance—Without Enterprise Quote Walls
          </h1>

          <p className="text-lg text-slate-300 leading-relaxed max-w-3xl mx-auto mb-7">
            Enterprise compliance vendors charge $10,000–$50,000/yr and hide behind sales demos.
            Send your SKU list, facility asset sheet, or federal solicitation PDF—get an
            audit-ready PDF and Excel report in <strong>under 24 hours</strong> for one flat card
            payment, or connect your AI agent directly over MCP.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-2 mb-6" role="navigation" aria-label="Jump by role">
            <a
              href="#recall-offer"
              className="text-xs font-medium px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 hover:border-cyan-400 text-slate-200 transition"
            >
              Importers &amp; Resellers ($30)
            </a>
            <a
              href="#bidshield-offer"
              className="text-xs font-medium px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 hover:border-amber-400 text-slate-200 transition"
            >
              GovCon Bidders ($299)
            </a>
            <a
              href="#healthshield-offer"
              className="text-xs font-medium px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 hover:border-emerald-400 text-slate-200 transition"
            >
              Clinics &amp; LTC ($499)
            </a>
            <a
              href="#agent-access"
              className="text-xs font-mono px-3 py-1.5 rounded-lg bg-slate-900 border border-cyan-500/40 hover:border-cyan-300 text-cyan-300 transition"
            >
              AI Agents (MCP)
            </a>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 mb-7">
            <a
              href="#offers"
              className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-5 py-3 rounded-xl transition text-sm"
            >
              <span>See Fixed Pricing ($30–$499)</span>
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </a>
            <a
              href="#agent-access"
              className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-cyan-300 border border-cyan-500/30 font-mono font-semibold px-5 py-3 rounded-xl transition text-sm"
            >
              <Bot className="w-4 h-4" aria-hidden="true" />
              <span>Connect an AI Agent (MCP / llms.txt)</span>
            </a>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-5 text-xs text-slate-400">
            <span className="inline-flex items-center gap-1.5">
              <Cpu className="w-4 h-4 text-cyan-400" aria-hidden="true" /> Deterministic Parsers (Zero Hallucinations)
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-amber-400" aria-hidden="true" /> 24–48h Turnaround
            </span>
            <span className="inline-flex items-center gap-1.5">
              <CreditCard className="w-4 h-4 text-emerald-400" aria-hidden="true" /> Stripe Card, Upwork Escrow &amp; Base USDC
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Lock className="w-4 h-4 text-emerald-400" aria-hidden="true" /> Zero Patient / PHI Data Required
            </span>
          </div>
        </section>

        {/* Live Free Wedge */}
        <section aria-label="Free instant product recall search" className="mb-16">
          <div className="max-w-4xl mx-auto">
            <FreeRecallSearchWidget />
          </div>
        </section>

        {/* Three Transparent Fixed-Price Offers */}
        <section id="offers" aria-labelledby="offers-heading" className="mb-20">
          <div className="text-center mb-10">
            <h2 id="offers-heading" className="text-2xl sm:text-3xl font-bold text-white mb-2">
              Three Fixed-Price Offers. Transparent Checkout. Zero Subscriptions Required.
            </h2>
            <p className="text-sm text-slate-400">
              Built for importers (pre-Jan 8, 2027 CPSC FTZ eFiling), government bidders, clinics,
              and care facilities.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Offer 1: $30 Recall Report */}
            <article id="recall-offer" className="rounded-2xl border border-slate-800 bg-slate-900/60 p-7 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-cyan-300 bg-cyan-500/10 border border-cyan-500/20 px-2.5 py-1 rounded-full">
                    <Shield className="w-3.5 h-3.5" aria-hidden="true" /> Importers, Consignment &amp; 3PLs
                  </span>
                  <span className="text-2xl font-extrabold text-white">$30</span>
                </div>

                <h3 className="text-xl font-bold text-white mb-2">
                  Signed Inventory Recall Report
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed mb-5">
                  Upload your SKU catalog, baby-gear intake list, or pallet manifest CSV. Screened
                  against 46,642 normalized CPSC, FDA, and Health Canada notices—including
                  unilateral CPSC safety warnings.
                </p>

                <ul className="space-y-2.5 text-sm text-slate-300 mb-6">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" aria-hidden="true" />
                    <span>Signed PDF + Excel/CSV hazard match certificate</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" aria-hidden="true" />
                    <span>Pre-Jan 8, 2027 CPSC FTZ eFiling recall sanity check</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" aria-hidden="true" />
                    <span>Instant Stripe checkout — no account or sales call</span>
                  </li>
                </ul>
              </div>

              <div className="space-y-2.5">
                <a
                  href="https://buy.stripe.com/6oU4gAfis2aP21Z8c0fAc0k"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold py-3 px-4 rounded-xl transition text-sm"
                >
                  <span>Order Recall Report ($30)</span>
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </a>
                <Link
                  href="/recall-report"
                  className="block text-center text-xs text-slate-400 hover:text-white transition"
                >
                  Inspect sample report &amp; SKU matching →
                </Link>
              </div>
            </article>

            {/* Offer 2: $299 BidShield RFP Matrix */}
            <article id="bidshield-offer" className="rounded-2xl border border-amber-500/40 bg-slate-900/60 p-7 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-300 bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-full">
                    <FileText className="w-3.5 h-3.5" aria-hidden="true" /> GovCon &amp; Federal Bidders
                  </span>
                  <span className="text-2xl font-extrabold text-white">$299</span>
                </div>

                <h3 className="text-xl font-bold text-white mb-2">
                  Federal RFP 19-Column Compliance Matrix
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed mb-5">
                  Deterministic clause extraction (zero LLM guesswork) flagging mandatory site
                  visits, security clearances, Indigenous set-asides, and portal bans before you
                  spend 40 hours writing.
                </p>

                <ul className="space-y-2.5 text-sm text-slate-300 mb-6">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" aria-hidden="true" />
                    <span>Every &quot;must / shall / mandatory&quot; clause page-cited</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" aria-hidden="true" />
                    <span>19-column Excel/CSV + 1-page Fatal-Gate Brief (&lt;24h)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" aria-hidden="true" />
                    <span>Zero-Risk Guarantee: 3+ mandatory catches or $0</span>
                  </li>
                </ul>
              </div>

              <div className="space-y-2.5">
                <a
                  href="/api/checkout?tier=bidshield-299"
                  className="w-full inline-flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold py-3 px-4 rounded-xl transition text-sm"
                >
                  <span>Order RFP Matrix ($299)</span>
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </a>
                <Link
                  href="/bidshield"
                  className="block text-center text-xs text-amber-300/80 hover:text-amber-200 transition"
                >
                  Browse 853 live federal tenders →
                </Link>
              </div>
            </article>

            {/* Offer 3: $499 HealthShield Facility Binder */}
            <article id="healthshield-offer" className="rounded-2xl border border-emerald-500/40 bg-slate-900/70 p-7 flex flex-col justify-between relative">
              <div className="absolute -top-3 right-6 bg-emerald-500 text-slate-950 text-[11px] font-extrabold uppercase tracking-wider px-3 py-0.5 rounded-full">
                Zero PHI • P-Card Ready
              </div>

              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-300 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full">
                    <Stethoscope className="w-3.5 h-3.5" aria-hidden="true" /> Private Clinics &amp; LTC Homes
                  </span>
                  <span className="text-2xl font-extrabold text-white">$499</span>
                </div>

                <h3 className="text-xl font-bold text-white mb-2">
                  Facility Equipment Recall Binder
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed mb-5">
                  Send your non-patient equipment sheet (beds, lifts, sterilizers, X-ray units,
                  medical fridges, kitchen gear). Receive an inspection-ready PDF &amp; Excel safety
                  binder in 24 hours.
                </p>

                <ul className="space-y-2.5 text-sm text-slate-300 mb-6">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" aria-hidden="true" />
                    <span>Class I / II / III hazard triage + remediation checklist</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" aria-hidden="true" />
                    <span>Zero resident/PHI data — no BAA or IT integration</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" aria-hidden="true" />
                    <span>Under $500 — fits discretionary corporate cards</span>
                  </li>
                </ul>
              </div>

              <div className="space-y-2.5">
                <a
                  href="/api/checkout?tier=healthshield-499"
                  className="w-full inline-flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold py-3 px-4 rounded-xl transition text-sm"
                >
                  <span>Order Facility Binder ($499)</span>
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </a>
                <Link
                  href="/healthshield"
                  className="block text-center text-xs text-emerald-300/80 hover:text-emerald-200 transition"
                >
                  View HealthShield details &amp; sample →
                </Link>
              </div>
            </article>
          </div>
        </section>

        {/* What Happens After Checkout (3-Step Clarity Bar) */}
        <section aria-labelledby="how-it-works-heading" className="rounded-2xl border border-slate-800 bg-slate-900/40 p-7 sm:p-8 mb-16">
          <h2 id="how-it-works-heading" className="text-xl font-bold text-white mb-6 text-center">
            What Happens After Checkout (3 Steps, Under 24 Hours)
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
            <div>
              <div className="text-amber-400 font-mono font-bold mb-1">01. Instant Card or Escrow Checkout</div>
              <p className="text-slate-400 leading-relaxed">
                Pay securely via Stripe or Upwork Escrow—no sales call, no seat contracts—and email
                your product CSV, facility equipment list, or solicitation PDF.
              </p>
            </div>
            <div>
              <div className="text-emerald-400 font-mono font-bold mb-1">02. Deterministic Engine + Human QA</div>
              <p className="text-slate-400 leading-relaxed">
                Our Python parsers check every item against 46,642 recall notices or extract every
                mandatory RFP clause with exact page and docket citations.
              </p>
            </div>
            <div>
              <div className="text-cyan-400 font-mono font-bold mb-1">03. Audit-Ready Delivery</div>
              <p className="text-slate-400 leading-relaxed">
                Receive your signed PDF executive brief and structured Excel/CSV spreadsheet within
                24 hours—ready for inspectors, buyers, or proposal teams.
              </p>
            </div>
          </div>
        </section>

        {/* Transparent Comparison Anchor (Beating Enterprise Quote Walls) */}
        <section aria-labelledby="compare-heading" className="mb-16">
          <div className="text-center mb-6">
            <h2 id="compare-heading" className="text-2xl font-bold text-white mb-2">
              Why Pay Enterprise Quote Walls for a 24-Hour Report?
            </h2>
            <p className="text-sm text-slate-400">
              Published pricing vs. typical annual enterprise contracts in each category.
            </p>
          </div>
          <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/40">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-xs uppercase tracking-wider text-slate-400">
                  <th className="py-3.5 px-5">Compliance / Audit Lane</th>
                  <th className="py-3.5 px-5">Enterprise Legacy / Quote-Wall</th>
                  <th className="py-3.5 px-5 text-emerald-300">Nano Empire AI</th>
                  <th className="py-3.5 px-5">Key Edge</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/70">
                {COMPARISON_ROWS.map((row) => (
                  <tr key={row.lane} className="hover:bg-slate-900/70 transition">
                    <td className="py-4 px-5 font-semibold text-white">{row.lane}</td>
                    <td className="py-4 px-5 text-slate-400">{row.enterprise}</td>
                    <td className="py-4 px-5 font-bold text-emerald-300">{row.nano}</td>
                    <td className="py-4 px-5 text-slate-300">{row.edge}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Channel Partners / White-Label Track (ExO Leveraged Assets) */}
        <section
          id="partners"
          aria-labelledby="partners-heading"
          className="rounded-2xl border border-amber-500/30 bg-gradient-to-br from-slate-900/90 to-slate-900/40 p-8 mb-16"
        >
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-300 mb-2">
                <Building2 className="w-4 h-4" aria-hidden="true" />
                <span>White-Label &amp; Channel Partners</span>
              </div>
              <h2 id="partners-heading" className="text-xl sm:text-2xl font-bold text-white mb-2">
                Customs Brokers, Bid Writers &amp; 3PL Warehouses
              </h2>
              <p className="text-sm text-slate-300 leading-relaxed">
                Manage 10–500 client accounts? White-label our recall reports, CPSC eFiling checks,
                19-column RFP matrices, or Zero-PHI facility binders at wholesale rates with 24-hour
                turnaround—no new hires required.
              </p>
            </div>
            <a
              href="mailto:rob@nanoempireai.com?subject=Nano%20Empire%20White-Label%20Partner%20Inquiry"
              className="shrink-0 inline-flex items-center gap-2 bg-white hover:bg-slate-200 text-slate-950 font-bold px-5 py-3 rounded-xl transition text-sm"
            >
              <span>Request Wholesale Sheet</span>
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </a>
          </div>
        </section>

        {/* Dual-Surface Machine & AI Agent Quick-Connect Panel */}
        <section
          id="agent-access"
          aria-labelledby="agent-heading"
          className="rounded-2xl border border-cyan-500/30 bg-slate-950/90 p-7 sm:p-8 mb-16"
          data-agent-surface="nanoempire-mcp-x402"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-mono text-cyan-300 mb-1.5">
                <Bot className="w-4 h-4" aria-hidden="true" />
                <span>Built for Autonomous Agents &amp; Developers</span>
              </div>
              <h2 id="agent-heading" className="text-xl sm:text-2xl font-bold text-white">
                Machine-Readable Discovery, MCP &amp; x402 Rails
              </h2>
            </div>
            <Link
              href="/developers"
              className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold text-cyan-300 hover:text-cyan-200 border border-cyan-500/40 px-4 py-2 rounded-lg transition self-start sm:self-auto"
            >
              <span>Open Full Protocol Console</span>
              <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 font-mono text-xs mb-5">
            {AGENT_ENDPOINTS.map((ep) => (
              <div
                key={ep.path}
                className="rounded-xl border border-slate-800 bg-slate-900/70 px-4 py-3 flex flex-col gap-1"
              >
                <div className="flex items-center gap-2">
                  <span
                    className={`px-1.5 py-0.5 rounded font-bold text-[10px] ${
                      ep.method === "GET"
                        ? "bg-emerald-500/15 text-emerald-300"
                        : "bg-cyan-500/15 text-cyan-300"
                    }`}
                  >
                    {ep.method}
                  </span>
                  {ep.href ? (
                    <a
                      href={ep.href}
                      className="text-white hover:text-cyan-300 truncate transition underline decoration-slate-700"
                    >
                      {ep.path}
                    </a>
                  ) : (
                    <code className="text-white truncate">{ep.path}</code>
                  )}
                </div>
                <span className="text-slate-400 font-sans text-xs">{ep.purpose}</span>
              </div>
            ))}
          </div>

          <div className="rounded-xl border border-slate-800 bg-[#05070B] p-4 mb-5 overflow-x-auto">
            <div className="text-[11px] font-mono text-slate-400 mb-1.5">
              Quick MCP tool discovery (JSON-RPC 2.0):
            </div>
            <pre className="text-xs font-mono text-cyan-300 whitespace-pre">
              {`curl -s -X POST https://www.nanoempireai.com/api/mcp \\
  -H "Content-Type: application/json" \\
  -d '{"jsonrpc":"2.0","id":1,"method":"tools/list"}'`}
            </pre>
          </div>

          <p className="text-xs text-slate-400">
            <strong className="text-slate-200">Public Ledger Honesty:</strong> 0 outside paying
            customers to date · 1 operator self-test settled on Base block{" "}
            <code className="text-cyan-300">51961194</code>. All endpoints listed above are live
            and inspectable right now.
          </p>
        </section>

        {/* Objection-Crushing FAQ */}
        <section aria-labelledby="faq-heading" className="max-w-4xl mx-auto mb-12">
          <h2 id="faq-heading" className="text-2xl font-bold text-white text-center mb-6">
            Common Questions
          </h2>
          <div className="space-y-3">
            {[
              {
                q: "Why pay $30 when CPSC.gov and Health Canada are free?",
                a: "Government portals only let you search one item at a time. We cross-reference your entire SKU catalog or facility asset list across 46,642 normalized CPSC, FDA, and Health Canada notices simultaneously—including unilateral safety warnings—and produce a signed PDF + Excel audit trail.",
              },
              {
                q: "Does your RFP matrix or recall scanner hallucinate like generic ChatGPT?",
                a: "No. Like VisibleThread in enterprise GovCon, our core extraction and matching run deterministic Python parsers with exact source citations, so you get repeatable, verifiable clauses and docket IDs—not invented obligations.",
              },
              {
                q: "Do clinics or care homes need a PHIPA/HIPAA BAA for HealthShield?",
                a: "No. HealthShield is strictly Zero-PHI. You only send equipment makes, models, or asset IDs (beds, lifts, sterilizers, fridges)—never patient or resident information.",
              },
              {
                q: "Can we test quality before paying?",
                a: "Yes. Use the free recall search bar above instantly, browse 853 live federal tenders on /bidshield, inspect 44 public audited repos on /skillproof, or email 5 sample SKUs/models to rob@nanoempireai.com for a free sample check.",
              },
            ].map((item) => (
              <details
                key={item.q}
                className="group rounded-xl border border-slate-800 bg-slate-900/50 p-5"
              >
                <summary className="flex items-center justify-between cursor-pointer list-none font-semibold text-white text-sm">
                  <span>{item.q}</span>
                  <ChevronDown
                    className="w-4 h-4 text-slate-400 group-open:rotate-180 transition-transform shrink-0 ml-4"
                    aria-hidden="true"
                  />
                </summary>
                <p className="mt-3 text-sm text-slate-300 leading-relaxed">{item.a}</p>
              </details>
            ))}
          </div>
        </section>
      </main>

      {/* Clean Footer */}
      <footer className="border-t border-slate-800/80 py-10 text-xs text-slate-500">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <strong className="text-slate-300">Nano Empire AI</strong> · Greely, Ontario ·{" "}
            <a href="mailto:rob@nanoempireai.com" className="hover:text-slate-300 underline">
              rob@nanoempireai.com
            </a>
          </div>
          <nav aria-label="Footer developer and legal links" className="flex flex-wrap items-center gap-4 font-mono">
            <Link href="/developers" className="text-cyan-400 hover:text-cyan-300">
              /developers
            </Link>
            <Link href="/skillproof" className="hover:text-slate-300">
              /skillproof
            </Link>
            <Link href="/bidshield" className="hover:text-slate-300">
              /bidshield
            </Link>
            <Link href="/benchmarks/bidshield-decguard-001" className="hover:text-slate-300">
              Build Log #001
            </Link>
            <Link href="/healthshield" className="hover:text-slate-300">
              /healthshield
            </Link>
            <a href="/llms.txt" className="hover:text-slate-300">
              llms.txt
            </a>
            <a href="/.well-known/agent.json" className="hover:text-slate-300">
              agent.json
            </a>
            <Link href="/privacy" className="hover:text-slate-300">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-slate-300">
              Terms
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}
