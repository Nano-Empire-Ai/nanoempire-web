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
} from "lucide-react";

const STRUCTURED_DATA_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Nano Empire AI — Product Recall Screening & Government RFP Compliance",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  url: "https://www.nanoempireai.com",
  description:
    "Automated US & Canadian product recall screening across 46,642 CPSC, FDA, and Health Canada records, inspection-ready facility equipment recall binders, and 19-column federal RFP compliance matrices.",
  offers: [
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
      name: "HealthShield Facility Equipment Recall Binder",
      price: "499.00",
      priceCurrency: "USD",
      url: "https://www.nanoempireai.com/api/checkout?tier=healthshield-499",
    },
  ],
};

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#07090E] text-slate-100 font-sans selection:bg-amber-500/20 selection:text-amber-300">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(STRUCTURED_DATA_JSON_LD) }}
      />

      {/* Clean Navigation */}
      <header className="sticky top-0 z-40 border-b border-slate-800/80 bg-[#07090E]/90 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 font-bold text-white tracking-tight text-lg">
            <Shield className="w-5 h-5 text-amber-400" />
            <span>Nano Empire AI</span>
          </Link>

          <nav className="hidden md:flex items-center gap-6 text-sm text-slate-300">
            <Link href="/recall-report" className="hover:text-white transition">
              Recall Check ($30)
            </Link>
            <Link href="/healthshield" className="hover:text-white transition">
              Facility Binders ($499)
            </Link>
            <Link href="/bidshield" className="hover:text-white transition">
              RFP Compliance ($299)
            </Link>
            <Link
              href="/developers"
              className="inline-flex items-center gap-1.5 text-xs font-mono text-slate-400 hover:text-cyan-300 border border-slate-800 rounded-full px-3 py-1 transition"
            >
              <Terminal className="w-3.5 h-3.5" />
              Developers / API
            </Link>
          </nav>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        {/* Hero Section */}
        <section className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-medium mb-6">
            <span>46,642 US &amp; Canadian Safety Recalls</span>
            <span>•</span>
            <span>853 Live Federal Tenders</span>
            <span>•</span>
            <span>&lt;24h Turnaround</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight mb-5">
            Automated Product Recall Screening &amp; Government RFP Compliance
          </h1>

          <p className="text-lg text-slate-300 leading-relaxed mb-8">
            Upload an inventory list, facility asset sheet, or government solicitation PDF. Get an
            audit-ready PDF and Excel compliance report in minutes—not days.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-slate-400">
            <span className="inline-flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-amber-400" /> &lt;24h Express Delivery
            </span>
            <span className="inline-flex items-center gap-1.5">
              <CreditCard className="w-4 h-4 text-emerald-400" /> Corporate Card &amp; Upwork Escrow
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Lock className="w-4 h-4 text-cyan-400" /> Zero Patient / PHI Data Required
            </span>
          </div>
        </section>

        {/* Live Free Tool Front Door */}
        <section className="mb-16">
          <div className="max-w-4xl mx-auto">
            <FreeRecallSearchWidget />
          </div>
        </section>

        {/* Three Clear Human Offers */}
        <section id="offers" className="mb-20">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
              Three Clear Services. Fixed Pricing. Zero Subscriptions Required.
            </h2>
            <p className="text-sm text-slate-400">
              Built for importers, care-home administrators, clinics, resellers, and government contractors.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Offer 1: $30 Recall Report */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-7 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-cyan-300 bg-cyan-500/10 border border-cyan-500/20 px-2.5 py-1 rounded-full">
                    <Shield className="w-3.5 h-3.5" /> Importers &amp; Resellers
                  </span>
                  <span className="text-2xl font-extrabold text-white">$30</span>
                </div>

                <h3 className="text-xl font-bold text-white mb-2">
                  Signed Inventory Recall Report
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed mb-5">
                  Upload your product catalog or pallet manifest CSV. We cross-reference every SKU
                  against 46,642 normalized CPSC, FDA, and Health Canada recall notices.
                </p>

                <ul className="space-y-2.5 text-sm text-slate-300 mb-6">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>Signed PDF + Excel/CSV hazard match report</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>Includes unilateral CPSC safety warnings</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>Instant Stripe checkout — no account needed</span>
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
                  <ArrowRight className="w-4 h-4" />
                </a>
                <Link
                  href="/recall-report"
                  className="block text-center text-xs text-slate-400 hover:text-white transition"
                >
                  Learn more or test a catalog →
                </Link>
              </div>
            </div>

            {/* Offer 2: $499 HealthShield Facility Binder */}
            <div className="rounded-2xl border-2 border-emerald-500/50 bg-slate-900/80 p-7 flex flex-col justify-between relative shadow-xl shadow-emerald-500/5">
              <div className="absolute -top-3 right-6 bg-emerald-500 text-slate-950 text-[11px] font-extrabold uppercase tracking-wider px-3 py-0.5 rounded-full">
                Zero PHI • Inspection Ready
              </div>

              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-300 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full">
                    <Stethoscope className="w-3.5 h-3.5" /> LTC Homes &amp; Clinics
                  </span>
                  <span className="text-2xl font-extrabold text-white">$499</span>
                </div>

                <h3 className="text-xl font-bold text-white mb-2">
                  Facility Equipment Recall Binder
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed mb-5">
                  Send your non-patient equipment list (beds, ceiling lifts, wheelchairs, medical
                  fridges, kitchen gear). Receive an inspection-ready PDF &amp; Excel safety clearance
                  binder in 24 hours.
                </p>

                <ul className="space-y-2.5 text-sm text-slate-300 mb-6">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>Class I / II / III hazard triage + action plan</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>Zero resident/PHI data &amp; zero IT setup</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>Under $500 — corporate P-card friendly</span>
                  </li>
                </ul>
              </div>

              <div className="space-y-2.5">
                <a
                  href="/api/checkout?tier=healthshield-499"
                  className="w-full inline-flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold py-3 px-4 rounded-xl transition text-sm"
                >
                  <span>Order Facility Binder ($499)</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
                <Link
                  href="/healthshield"
                  className="block text-center text-xs text-emerald-300/80 hover:text-emerald-200 transition"
                >
                  View HealthShield details &amp; sample →
                </Link>
              </div>
            </div>

            {/* Offer 3: $299 BidShield RFP Matrix */}
            <div className="rounded-2xl border border-amber-500/40 bg-slate-900/60 p-7 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-300 bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-full">
                    <FileText className="w-3.5 h-3.5" /> Gov Contractors
                  </span>
                  <span className="text-2xl font-extrabold text-white">$299</span>
                </div>

                <h3 className="text-xl font-bold text-white mb-2">
                  Federal RFP 19-Column Matrix
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed mb-5">
                  Avoid instant non-responsive disqualification on mandatory site visits, security
                  clearances, Indigenous set-asides, or portal submission bans.
                </p>

                <ul className="space-y-2.5 text-sm text-slate-300 mb-6">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <span>Every &quot;must / shall / mandatory&quot; clause mapped</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <span>19-column Excel/CSV + 1-page Fatal-Gate Brief</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
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
                  <ArrowRight className="w-4 h-4" />
                </a>
                <Link
                  href="/bidshield"
                  className="block text-center text-xs text-amber-300/80 hover:text-amber-200 transition"
                >
                  Browse 853 live federal tenders →
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Simple How It Works */}
        <section className="rounded-2xl border border-slate-800 bg-slate-900/40 p-8 mb-16">
          <h2 className="text-xl font-bold text-white mb-6 text-center">
            How It Works (3 Steps, Under 24 Hours)
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
            <div>
              <div className="text-amber-400 font-mono font-bold mb-1">01. Send Your File or Link</div>
              <p className="text-slate-400 leading-relaxed">
                Checkout with corporate card or Upwork Escrow and send your product CSV, facility
                equipment list, or solicitation PDF.
              </p>
            </div>
            <div>
              <div className="text-emerald-400 font-mono font-bold mb-1">02. Automated Screening + QA</div>
              <p className="text-slate-400 leading-relaxed">
                Our deterministic parser cross-checks every item against 46,642 official US/Canada
                recall notices or extracts every mandatory bid requirement.
              </p>
            </div>
            <div>
              <div className="text-cyan-400 font-mono font-bold mb-1">03. Audit-Ready Delivery</div>
              <p className="text-slate-400 leading-relaxed">
                Receive your clean Excel/CSV spreadsheet and signed PDF executive brief within 24
                hours—ready for inspectors, buyers, or proposal teams.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Clean Footer with Developers / Machine Gateway Link */}
      <footer className="border-t border-slate-800/80 py-10 text-xs text-slate-500">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <strong className="text-slate-300">Nano Empire AI</strong> · Greely, Ontario ·{" "}
            <a href="mailto:rob@nanoempireai.com" className="hover:text-slate-300 underline">
              rob@nanoempireai.com
            </a>
          </div>
          <div className="flex flex-wrap items-center gap-4 font-mono">
            <Link href="/developers" className="text-cyan-400 hover:text-cyan-300">
              Developers (MCP / x402 / API)
            </Link>
            <Link href="/skillproof" className="hover:text-slate-300">
              SkillProof Index
            </Link>
            <Link href="/case-studies" className="hover:text-slate-300">
              Benchmarks
            </Link>
            <a href="/llms.txt" className="hover:text-slate-300">
              llms.txt
            </a>
            <a href="/m2m-state.md" className="hover:text-slate-300">
              m2m-state.md
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
