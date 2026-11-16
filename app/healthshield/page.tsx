import { Metadata } from 'next';
import Link from 'next/link';
import { Shield, AlertTriangle, Clock, DollarSign, FileText, CheckCircle2, XCircle, ExternalLink, Download, AlertOctagon, Stethoscope, Building2, Pill, Microscope, Truck, Zap, Lock, ChevronRight, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
  title: 'HealthShield — Healthcare Compliance Automation | Equipment Recall Binders & RFP Matrices',
  description: 'Automated MOHLTC inspection-ready equipment recall binders ($499) and healthcare RFP compliance matrices ($499–$1,500). Zero PHI, 24h delivery, corporate card friendly.',
  alternates: { canonical: '/healthshield' },
  openGraph: {
    title: 'HealthShield — Healthcare Compliance Automation',
    description: 'Turn 40 hours of manual compliance prep into 2-hour audits. Equipment recall binders + RFP matrices for LTC, hospitals, and healthcare vendors.',
    url: 'https://www.nanoempireai.com/healthshield',
    type: 'website',
  },
};

const OFFERS = [
  {
    id: 'recall-binder',
    name: 'Equipment Recall & Safety Clearance Binder',
    tagline: 'MOHLTC inspection-ready in 24h',
    price: 499,
    priceLabel: 'Flat per facility',
    icon: Stethoscope,
    description: 'Send us your equipment list (beds, lifts, fridges, kitchen gear — zero PHI). We cross-reference 46,642 Health Canada/FDA/CPSC recalls and deliver a signed, inspection-ready PDF + Excel binder with fatal gates highlighted and action plan.',
    features: [
      '46,642 recall records (Health Canada, FDA, CPSC)',
      'Class I/II/III hazard classification',
      'JEV (Judgment Exposure Value) per finding',
      'Signed PDF + Excel + Action Plan template',
      'Ed25519 cryptographic signature',
      'Zero PHI — equipment data only',
      'Corporate card friendly (<$500)',
      '24-hour delivery',
    ],
    cta: 'Order Recall Binder ($499)',
    tier: 'healthshield-499',
    color: 'border-emerald-500/30 bg-emerald-500/10',
    badge: 'MOST POPULAR',
  },
  {
    id: 'rfp-matrix',
    name: 'Healthcare RFP Compliance Matrix',
    tagline: '19-column fatal-gate triage <24h',
    price: 499,
    priceLabel: 'Starting at $499/tender',
    icon: FileText,
    description: 'Bidding on a CanadaBuys healthcare/rehab tender? We parse the full solicitation for every must/shall/required clause, map 19 compliance columns, flag fatal disqualifiers, and deliver a signed matrix + 1-page Fatal-Gate Brief.',
    features: [
      '19-column compliance matrix (Req ID → Evidence)',
      'Deontic parsing: MUST/SHALL/MANDATORY/REQUIRED',
      'Fatal gate detection (Site Visit, Security, IFR, Annexes)',
      'JEV (Judgment Exposure Value) per requirement',
      '1-page Fatal-Gate Brief (signed PDF)',
      'Gap remediation checklist + evidence tracker',
      'Healthcare-specific categories (med device, pharma, rehab, nursing)',
      'Corporate card or Upwork Escrow',
    ],
    cta: 'Order RFP Matrix ($499+)',
    tier: 'healthshield-rfp-499',
    color: 'border-blue-500/30 bg-blue-500/10',
    badge: 'FOR VENDORS',
  },
] as const;

const TRUST_SIGNALS = [
  { icon: Shield, label: 'Zero PHI', desc: 'Equipment data only — no resident/patient info' },
  { icon: Clock, label: '<24h Delivery', desc: 'Signed PDF + Excel in your inbox tomorrow' },
  { icon: Lock, label: 'Ed25519 Signed', desc: 'Cryptographic proof of binder integrity' },
  { icon: DollarSign, label: 'Corporate Card OK', desc: 'Under $500 — P-card friendly, no procurement cycle' },
];

const TARGET_AUDIENCES = [
  { icon: Building2, title: 'LTC & Retirement Homes', desc: 'OMNI, Extendicare, Sienna, Revera, independents — MOHLTC inspection prep' },
  { icon: Microscope, title: 'Hospitals & Health Networks', desc: 'TOH, Royal Ottawa, LHINs — equipment recall monitoring for procurement' },
  { icon: Pill, title: 'Healthcare Vendors', desc: 'Medline, McKesson, Arjo, specialists — RFP response automation for CanadaBuys tenders' },
  { icon: Truck, title: 'Rehab & Vocational Providers', desc: 'ESDC, VAC, Indigenous Services tenders — fatal-gate triage before bid' },
];

const LIVE_TENDERS = [
  { id: 'cb-493-92890724', title: 'Preventive Maintenance of Medical Refrigerators & Freezers', buyer: 'Correctional Service of Canada (CSC)', closes: 'Nov 17', jev: '$12K', category: 'Medical Equipment' },
  { id: 'cb-629-72290055', title: 'Simulation-Based Nursing Education Services (SIMS), Ontario Region', buyer: 'Correctional Service of Canada (CSC)', closes: 'Nov 17', jev: '$12K', category: 'Nursing Education' },
  { id: 'cb-663-27454740', title: 'Dental Services - Warkworth Institution', buyer: 'Correctional Service of Canada (CSC)', closes: 'Nov 17', jev: '$12K', category: 'Clinical Dental' },
  { id: 'cb-286-83658428', title: 'Provision / Coordination of Vocational Rehabilitation Services', buyer: 'Employment and Social Development Canada (ESDC)', closes: 'Dec 15', jev: '$6K', category: 'Vocational Rehab' },
  { id: 'cb-6365-49996412', title: 'Community Residential Facilities', buyer: 'Correctional Service of Canada (CSC)', closes: 'Dec 31', jev: '$8K', category: 'Residential Care' },
];

export default function HealthShieldPage() {
  return (
    <main className="min-h-screen bg-[#07090D] text-[#F4F1EA] font-sans">
      {/* Navigation */}
      <nav className="border-b border-[#8C92A4]/20 bg-[#07090D]/90 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-[#8C92A4] hover:text-white transition-colors text-sm font-mono">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
            Back to Nano Empire
          </Link>
          <span className="text-xs font-mono uppercase tracking-widest text-[#FF7B00] border border-[#FF7B00]/30 bg-[#FF7B00]/10 px-2 py-0.5 rounded">
            HEALTHSHIELD — HEALTHCARE COMPLIANCE
          </span>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative max-w-7xl mx-auto px-6 py-24">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-transparent to-blue-500/10 rounded-3xl blur-3xl" />
        <div className="relative max-w-4xl mx-auto text-center">
          <span className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 rounded-full mb-6">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            LIVE — ACCEPTING ORDERS
          </span>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white mb-6 leading-tight">
            Healthcare Compliance
            <br />
            <span className="text-emerald-400">Automated.</span>
          </h1>
          <p className="text-xl text-[#8C92A4] max-w-2xl mx-auto mb-10 leading-relaxed">
            Turn 40 hours of manual MOHLTC inspection prep & RFP compliance into 2-hour audits.
            Equipment recall binders + fatal-gate RFP matrices. Zero PHI. 24h delivery. Corporate card friendly.
          </p>
          <div className="flex flex-wrap gap-4 justify-center items-center mb-12">
            <Link href="#offers">
              <Button variant="default" className="text-lg px-10 py-5" size="lg">
                View Offers & Order
              </Button>
            </Link>
            <Link href="/bidshield" className="text-emerald-400 hover:text-emerald-300 font-mono text-sm flex items-center gap-1">
              Construction/Janitorial RFPs? <span>→ BidShield</span>
            </Link>
          </div>
          
          {/* Trust Signals */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
            {TRUST_SIGNALS.map((signal, i) => (
              <div key={i} className="text-left p-4 rounded-xl border border-[#8C92A4]/20 bg-[#0f1423]/60">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                    <signal.icon size={20} />
                  </div>
                  <span className="text-xs font-mono uppercase tracking-wider text-emerald-400">{signal.label}</span>
                </div>
                <p className="text-xs text-[#8C92A4]">{signal.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Offers */}
      <section id="offers" className="max-w-7xl mx-auto px-6 py-16">
        <header className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white mb-4">
            Two Zero-PHI Offers. Corporate Card Friendly.
          </h2>
          <p className="text-xl text-[#8C92A4] max-w-2xl mx-auto">
            No PHIPA reviews. No IT integration. Under $500 discretionary spend.
          </p>
        </header>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {OFFERS.map((offer) => (
            <article key={offer.id} className={`relative rounded-2xl p-8 ${offer.color} border transition-all hover:border-emerald-500/50`}>
              {offer.badge && (
                <span className="absolute -top-3 left-6 text-xs font-mono font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded">
                  {offer.badge}
                </span>
              )}
              <div className="flex items-start gap-4 mb-6">
                <div className="w-14 h-14 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400 flex-shrink-0">
                  <offer.icon size={28} />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white mb-1">{offer.name}</h3>
                  <p className="text-emerald-400 font-mono text-sm">{offer.tagline}</p>
                </div>
              </div>
              
              <p className="text-[#8C92A4] mb-6 leading-relaxed">{offer.description}</p>
              
              <div className="space-y-3 mb-8">
                {offer.features.map((feature, i) => (
                  <div key={i} className="flex items-center gap-3 text-sm text-[#8C92A4]">
                    <CheckCircle2 size={16} className="text-emerald-400 flex-shrink-0" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
              
              <div className="flex items-center justify-between pt-6 border-t border-[#8C92A4]/20">
                <div>
                  <span className="text-3xl font-extrabold text-white">${offer.price}</span>
                  <span className="text-[#8C92A4] font-mono text-sm ml-2">{offer.priceLabel}</span>
                </div>
                <Link href={`/api/checkout?mode=payment&tier=${offer.tier}&origin=healthshield`}>
                  <Button variant="default" className="w-full md:w-auto px-8 py-3" size="lg">
                    {offer.cta}
                    <ChevronRight size={18} className="ml-2" />
                  </Button>
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Target Audiences */}
      <section className="max-w-7xl mx-auto px-6 py-16 border-y border-[#8C92A4]/10">
        <header className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white mb-4">
            Built for Healthcare Operators & Vendors
          </h2>
          <p className="text-xl text-[#8C92A4] max-w-2xl mx-auto">
            You know the regulations. We automate the paperwork.
          </p>
        </header>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {TARGET_AUDIENCES.map((audience, i) => (
            <div key={i} className="p-6 rounded-2xl border border-[#8C92A4]/20 bg-[#0f1423]/60 hover:border-emerald-500/30 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400 mb-4">
                <audience.icon size={24} />
              </div>
              <h4 className="text-lg font-bold text-white mb-2">{audience.title}</h4>
              <p className="text-sm text-[#8C92A4]">{audience.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Live Tenders */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <header className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white mb-4">
            Live Healthcare Tenders We Can Triaged Today
          </h2>
          <p className="text-xl text-[#8C92A4] max-w-2xl mx-auto">
            From CanadaBuys — fatal gates identified, JEV quantified, ready for matrix order.
          </p>
        </header>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#8C92A4]/20">
                <th className="text-left py-3 px-4 font-mono text-xs uppercase tracking-wider text-[#8C92A4]">Tender ID</th>
                <th className="text-left py-3 px-4 font-mono text-xs uppercase tracking-wider text-[#8C92A4]">Title</th>
                <th className="text-left py-3 px-4 font-mono text-xs uppercase tracking-wider text-[#8C92A4]">Buyer</th>
                <th className="text-center py-3 px-4 font-mono text-xs uppercase tracking-wider text-[#8C92A4]">Closes</th>
                <th className="text-center py-3 px-4 font-mono text-xs uppercase tracking-wider text-[#8C92A4]">JEV Exposure</th>
                <th className="text-center py-3 px-4 font-mono text-xs uppercase tracking-wider text-[#8C92A4]">Category</th>
                <th className="text-center py-3 px-4"></th>
              </tr>
            </thead>
            <tbody>
              {LIVE_TENDERS.map((tender, i) => (
                <tr key={i} className="border-b border-[#8C92A4]/10 hover:bg-[#0f1423]/60">
                  <td className="py-3 px-4 font-mono text-emerald-400">{tender.id}</td>
                  <td className="py-3 px-4 text-white max-w-xs truncate">{tender.title}</td>
                  <td className="py-3 px-4 text-[#8C92A4]">{tender.buyer}</td>
                  <td className="py-3 px-4 text-center text-[#FF7B00] font-mono">{tender.closes}</td>
                  <td className="py-3 px-4 text-center text-emerald-400 font-bold">${tender.jev}</td>
                  <td className="py-3 px-4 text-center text-[#8C92A4]">{tender.category}</td>
                  <td className="py-3 px-4 text-center">
                    <Link href={`/api/checkout?mode=payment&tier=healthshield-rfp-499&tender=${tender.id}`} className="text-xs font-mono text-emerald-400 hover:text-emerald-300 underline">
                      Order Matrix
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* How It Works */}
      <section className="max-w-7xl mx-auto px-6 py-16 border-y border-[#8C92A4]/10">
        <header className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white mb-4">
            How It Works
          </h2>
          <p className="text-xl text-[#8C92A4] max-w-2xl mx-auto">
            Three steps. Zero PHI. 24-hour turnaround.
          </p>
        </header>
        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {[
            { step: '01', icon: Upload, title: 'Send Asset List / Tender ID', desc: 'Email us your equipment spreadsheet (model numbers only) or forward the tender solicitation ID. Zero PHI required.' },
            { step: '02', icon: Zap, title: 'We Run Automated Analysis', desc: '46,642 recall records cross-referenced OR full deontic parse of tender. Fatal gates flagged, JEV calculated, matrix built.' },
            { step: '03', icon: Download, title: 'Receive Signed Deliverables', desc: 'PDF binder + Excel matrix + action plan — all Ed25519 signed. Pay $499 via corporate card. Ready for inspection/bid.' },
          ].map((step, i) => (
            <div key={i} className="text-center p-6">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                <step.icon size={28} />
              </div>
              <p className="text-xs font-mono uppercase tracking-wider text-emerald-400 mb-2">{step.step}</p>
              <h4 className="text-lg font-bold text-white mb-2">{step.title}</h4>
              <p className="text-sm text-[#8C92A4]">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Founder Note */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="max-w-3xl mx-auto text-center p-8 rounded-2xl border border-emerald-500/30 bg-gradient-to-br from-emerald-500/10 to-blue-500/10">
          <p className="text-lg text-[#8C92A4] mb-6 italic">
            "I spent 8+ years on the floor at OMNI Health Care and 2 years at the Royal Ottawa & Ottawa Hospital dealing with MOHLTC inspections, Resident Councils, and equipment compliance. Over the last year I built the tool I wish existed then."
          </p>
          <p className="text-white font-semibold">— Rob Lambert, Founder</p>
          <p className="text-sm text-[#8C92A4] mt-2">Former OMNI Health Care (2008–2017) • Royal Ottawa / TOH (2016–2018) • OPS Program Operations (2017–Present)</p>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="max-w-7xl mx-auto px-6 py-16 text-center">
        <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white mb-6">
          Ready to Cut Compliance Prep from 40 Hours to 2?
          </h2>
        <p className="text-xl text-[#8C92A4] max-w-2xl mx-auto mb-10">
          Free pilot for your first facility/tender this week. Reply to the email or click below.
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <Link href="#offers">
            <Button variant="default" className="text-lg px-10 py-5" size="lg">
              Order Now — $499
            </Button>
          </Link>
          <Link href="mailto:healthshield@nanoempireai.com?subject=HealthShield%20Pilot%20Inquiry" className="text-emerald-400 hover:text-emerald-300 font-mono flex items-center gap-2 px-8 py-5 border border-emerald-500/30 rounded-lg">
            Email Us Instead
            <ExternalLink size={16} />
          </Link>
        </div>
      </section>
    </main>
  );
}