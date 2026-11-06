import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Building, FileText, Shield, AlertTriangle, DollarSign, Calendar, ChevronRight, Search, Star } from 'lucide-react';
import { NAICS_DATA } from '@/lib/recall-data';

export const metadata: Metadata = {
  title: 'BidShield — Federal Compliance Triage by NAICS Code',
  description: 'Pre-bid risk audits for federal contractors. $99/$249/$499 tiers. Identify disqualifying clauses before you bid on CanadaBuys, SAM.gov, and Merx tenders.',
  alternates: { canonical: '/bidshield' },
};

export default function BidShieldIndexPage() {
  const naicsCodes = Object.entries(NAICS_DATA);

  return (
    <main className="min-h-screen bg-[#07090D] text-[#F4F1EA] font-sans">
      {/* Top Nav */}
      <nav className="border-b border-[#8C92A4]/20 bg-[#07090D]/90 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-[#8C92A4] hover:text-white transition-colors text-sm font-mono">
            <ArrowLeft size={16} /> Nano Empire AI
          </Link>
          <Link href="/bidshield/triage" className="text-xs font-mono font-bold bg-[#00B5E2] text-black px-3 py-1.5 rounded hover:bg-[#00B5E2]/90">
            Run Triage ($99)
          </Link>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Hero */}
        <header className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#00B5E2]/30 bg-[#00B5E2]/10 text-xs text-[#00B5E2] font-mono mb-4">
            <Building size={14} /> BIDSHIELD COMPLIANCE TRIAGE
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white mb-6 font-mono">
            Federal Bid Compliance <br/> <span className="text-[#00B5E2]">By NAICS Code</span>
          </h1>
          <p className="text-xl text-[#8C92A4] max-w-3xl mx-auto mb-8">
            Every federal solicitation contains hidden disqualifiers. BidShield extracts, classifies, and risk-scores 
            every clause automatically — so you bid with certainty, not hope.
          </p>
          
          {/* Primary CTA */}
          <Link 
            href="/bidshield/triage"
            className="inline-flex items-center gap-3 bg-[#00B5E2] text-black font-bold px-8 py-4 rounded-lg text-lg hover:bg-[#00B5E2]/90 transition-colors"
          >
            <Shield size={24} /> Run Pre-Bid Triage — $99 USD
          </Link>
        </header>

        {/* NAICS Directory */}
        <section className="mb-16">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <h2 className="text-2xl font-bold text-white">NAICS Compliance Intelligence</h2>
            <div className="flex items-center gap-2 bg-[#0f1423] border border-[#8C92A4]/20 rounded-lg px-4 py-2">
              <Search size={16} className="text-[#8C92A4]" />
              <input 
                type="text" 
                placeholder="Search NAICS codes, keywords..." 
                className="bg-transparent text-white text-sm font-mono w-64 focus:outline-none"
                id="naics-search"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6" id="naics-grid">
            {naicsCodes.map(([code, data], idx) => (
              <Link
                key={code}
                href={`/bidshield/naics/${code}`}
                className="group p-6 bg-[#0f1423] border border-[#8C92A4]/20 rounded-2xl hover:border-[#00B5E2]/30 hover:bg-[#00B5E2]/5 transition-all duration-200"
              >
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div>
                    <span className="text-xs font-mono text-[#00B5E2] font-bold">NAICS {code}</span>
                    <h3 className="text-xl font-bold text-white mt-1 group-hover:text-[#00B5E2] transition-colors">
                      {data.title}
                    </h3>
                  </div>
                  <Star size={20} className="text-[#A3FF00]/50 group-hover:text-[#A3FF00] transition-colors shrink-0" />
                </div>
                
                <p className="text-sm text-[#8C92A4] mb-4 line-clamp-2">
                  {data.description}
                </p>
                
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {data.keywords.slice(0, 4).map((kw, i) => (
                    <span key={i} className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/5 text-[#8C92A4] border border-white/10">
                      {kw}
                    </span>
                  ))}
                  {data.keywords.length > 4 && (
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/5 text-[#8C92A4] border border-white/10">
                      +{data.keywords.length - 4}
                    </span>
                  )}
                </div>
                
                <div className="border-t border-[#8C92A4]/10 pt-4">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-[#8C92A4]">{data.typicalClauses.length} common disqualifier types</span>
                    <span className="text-[#00B5E2] group-hover:translate-x-1 transition-transform flex items-center gap-1">
                      View Intelligence <ChevronRight size={12} />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* How It Works */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-white mb-8 text-center">How BidShield Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: 1, title: 'Upload Solicitation', desc: 'PDF, DOCX, or direct CanadaBuys/SAM.gov URL. We parse every clause, table, and attachment.', icon: FileText },
              { step: 2, title: 'Automated Risk Extraction', desc: 'Our kernel identifies mandatory requirements, pass/fail gates, timeline traps, and cost realism triggers.', icon: AlertTriangle },
              { step: 3, title: 'Actionable Triage Report', desc: 'Go/No-Go recommendation, clause-by-clause response guide, and risk heatmap — delivered in hours.', icon: Shield },
            ].map((item, idx) => (
              <div key={idx} className="relative p-6 bg-[#0f1423] border border-[#8C92A4]/20 rounded-2xl">
                <div className="absolute -top-3 left-6 bg-[#00B5E2] text-black font-bold text-2xl font-mono w-12 h-12 rounded-full flex items-center justify-center">
                  {item.step}
                </div>
                <div className="pt-8">
                  <item.icon size={24} className="text-[#00B5E2] mb-4" />
                  <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
                  <p className="text-[#8C92A4] text-sm">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Tiers */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-white mb-8 text-center">Triage Tiers</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { name: 'Tier 1 — Urgent Triage', price: '$99 USD', timing: '24-Hour Turnaround', features: ['Disqualifier clause scan', 'Pass/fail matrix', 'Risk heatmap', 'Go/No-Go recommendation'], cta: 'Start Urgent Triage ($99)', popular: false },
              { name: 'Tier 2 — Full Compliance Matrix', price: '$249 USD', timing: '48-Hour Turnaround', features: ['All Tier 1 +', 'Clause-by-clause response guide', 'Past performance mapping', 'Cost realism analysis', 'Technical compliance checklist'], cta: 'Start Full Matrix ($249)', popular: true },
              { name: 'Tier 3 — Multi-Doc Suite', price: '$499 USD', timing: '72-Hour Turnaround', features: ['All Tier 2 +', 'Addenda & amendment tracking', 'Subcontractor flow-down', 'Protest risk assessment', 'Debrief preparation kit'], cta: 'Start Multi-Doc ($499)', popular: false },
            ].map((tier, idx) => (
              <div key={idx} className={`rounded-2xl p-6 border flex flex-col justify-between transition-all ${tier.popular ? 'border-[#00B5E2] bg-[#0f1423] shadow-2xl shadow-[#00B5E2]/10 relative' : 'border-[#8C92A4]/20 bg-[#07090D]'}`}>
                {tier.popular && (
                  <span className="absolute -top-3 right-8 bg-[#00B5E2] text-black font-mono text-xs font-bold py-1 px-3 rounded-full uppercase tracking-wider">
                    Most Popular
                  </span>
                )}
                <div>
                  <h3 className="text-xl font-bold text-white mb-1">{tier.name}</h3>
                  <div className="flex items-baseline gap-2 mb-4">
                    <span className="text-2xl font-extrabold text-white font-mono">{tier.price}</span>
                    <span className="text-xs text-[#8C92A4] font-mono">{tier.timing}</span>
                  </div>
                  <ul className="space-y-3 text-sm text-[#F4F1EA] mb-6">
                    {tier.features.map((f, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-[#A3FF00] mt-0.5">✓</span>
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <Link
                  href="/bidshield/triage"
                  className={`w-full py-3 rounded font-bold text-center transition-colors ${tier.popular ? 'bg-[#00B5E2] text-black hover:bg-[#00B5E2]/90' : 'bg-[#00B5E2]/10 text-[#00B5E2] border border-[#00B5E2]/30 hover:bg-[#00B5E2]/20'}`}
                >
                  {tier.cta} →
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* Sample Report */}
        <section className="bg-gradient-to-r from-[#0f1423] to-[#07090D] rounded-2xl border border-[#00B5E2]/30 p-8 md:p-12">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-4 text-center">
              See What You Get
            </h2>
            <p className="text-[#8C92A4] mb-8 text-center max-w-2xl mx-auto">
              Every BidShield report includes: executive risk summary, disqualifier matrix with page/line citations, 
              clause response templates, past performance gap analysis, and a signed compliance attestation.
            </p>
            <Link 
              href="/sample-bidshield-report.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 bg-[#00B5E2] text-black font-bold px-8 py-4 rounded-lg text-lg hover:bg-[#00B5E2]/90 transition-colors"
            >
              <FileText size={24} /> Download Sample Report (PDF)
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}