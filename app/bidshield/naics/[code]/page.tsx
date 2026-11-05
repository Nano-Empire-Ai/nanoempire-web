import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Building, FileText, Shield, AlertTriangle, DollarSign, Calendar, ChevronRight } from 'lucide-react';

const NAICS_DATA: Record<string, { title: string; description: string; keywords: string[]; typicalClauses: string[] }> = {
  '238220': {
    title: 'HVAC & Mechanical Contractors',
    description: 'Plumbing, heating, and air-conditioning contractors bidding on federal and municipal mechanical systems tenders.',
    keywords: ['HVAC', 'mechanical', 'plumbing', 'heating', 'air-conditioning', 'ventilation'],
    typicalClauses: ['mandatory-site-visit', 'liquidated-damages', 'performance-bond', 'warranty-period', 'energy-efficiency-standards'],
  },
  '561720': {
    title: 'Janitorial & Cleaning Services',
    description: 'Janitorial, custodial, and building cleaning services for federal facilities, military bases, and municipal buildings.',
    keywords: ['janitorial', 'cleaning', 'custodial', 'facility-maintenance', 'sanitization', 'waste-removal'],
    typicalClauses: ['background-checks', 'security-clearance', 'green-cleaning-standards', 'staffing-minimums', 'quality-control-inspections'],
  },
  '236220': {
    title: 'Commercial & Institutional Building Construction',
    description: 'General contractors for federal courthouses, hospitals, schools, and military construction projects.',
    keywords: ['construction', 'commercial', 'institutional', 'federal-building', 'renovation', 'new-construction'],
    typicalClauses: ['davis-bacon-wages', 'buy-american-act', 'leed-certification', 'schedule-milestones', 'change-order-procedures'],
  },
  '541330': {
    title: 'Engineering Services',
    description: 'Civil, mechanical, electrical, and structural engineering services for federal infrastructure and defense projects.',
    keywords: ['engineering', 'civil', 'mechanical', 'electrical', 'structural', 'design-build'],
    typicalClauses: ['professional-liability-insurance', 'errors-omissions', 'technical-data-rights', 'peer-review', 'licensure-verification'],
  },
  '561210': {
    title: 'Facilities Support Services',
    description: 'Integrated facilities management, operations, and maintenance for federal campuses and military installations.',
    keywords: ['facilities-management', 'operations', 'maintenance', 'base-operations', 'integrated-services'],
    typicalClauses: ['key-personnel', 'transition-plan', 'performance-metrics', 'government-furnished-property', 'security-requirements'],
  },
  '238210': {
    title: 'Electrical Contractors',
    description: 'Electrical and wiring contractors for federal buildings, military infrastructure, and utility projects.',
    keywords: ['electrical', 'wiring', 'lighting', 'power-distribution', 'controls', 'fire-alarm'],
    typicalClauses: ['licensed-electricians', 'permits-inspections', 'arc-flash-compliance', 'energy-codes', 'temporary-power'],
  },
  '562111': {
    title: 'Solid Waste Collection',
    description: 'Solid waste, recycling, and hazardous waste collection services for federal facilities and military bases.',
    keywords: ['waste-collection', 'recycling', 'hazardous-waste', 'disposal', 'environmental-compliance'],
    typicalClauses: ['epa-compliance', 'manifest-tracking', 'container-standards', 'spill-response', 'recycling-rates'],
  },
  '541512': {
    title: 'Computer Systems Design Services',
    description: 'IT systems integration, cybersecurity, and software development for federal agencies and defense systems.',
    keywords: ['cybersecurity', 'software-development', 'systems-integration', 'cloud-migration', 'devsecops'],
    typicalClauses: ['fisma-compliance', 'fedramp', 'security-clearance', 'data-rights', 'continuous-monitoring'],
  },
};

interface NAICSPageProps {
  params: Promise<{ code: string }>;
}

export async function generateStaticParams() {
  return Object.keys(NAICS_DATA).map(code => ({ code }));
}

export async function generateMetadata({ params }: NAICSPageProps): Promise<Metadata> {
  const { code } = await params;
  const data = NAICS_DATA[code];
  
  if (!data) {
    return { title: 'NAICS Category Not Found' };
  }

  return {
    title: `NAICS ${code} — ${data.title} | BidShield Compliance Triage`,
    description: `${data.description} Instant $99 pre-bid risk audit. Identify disqualifying clauses before you bid.`,
    alternates: { canonical: `/bidshield/naics/${code}` },
    openGraph: {
      title: `BidShield — NAICS ${code} Compliance Triage`,
      description: `Pre-bid risk audit for ${data.title}. $99/$249/$499 tiers.`,
    },
  };
}

export default async function NAICSDetailPage({ params }: NAICSPageProps) {
  const { code } = await params;
  const data = NAICS_DATA[code];

  if (!data) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[#07090D] text-[#F4F1EA] font-sans">
      {/* Top Nav */}
      <nav className="border-b border-[#8C92A4]/20 bg-[#07090D]/90 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/bidshield" className="flex items-center gap-2 text-[#8C92A4] hover:text-white transition-colors text-sm font-mono">
            <ArrowLeft size={16} /> BidShield Index
          </Link>
          <Link href="/bidshield/triage" className="text-xs font-mono font-bold bg-[#00B5E2] text-black px-3 py-1.5 rounded hover:bg-[#00B5E2]/90">
            Run Triage ($99)
          </Link>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-12">
        {/* Header */}
        <header className="mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#00B5E2]/30 bg-[#00B5E2]/10 text-xs text-[#00B5E2] font-mono mb-4">
            <Building size={14} /> NAICS COMPLIANCE INTELLIGENCE
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-4 font-mono">
            NAICS {code} <span className="text-[#00B5E2]">— {data.title}</span>
          </h1>
          <p className="text-xl text-[#8C92A4] max-w-2xl mb-8">
            {data.description}
          </p>

          {/* Keywords */}
          <div className="flex flex-wrap gap-2 mb-8">
            {data.keywords.map((kw, idx) => (
              <span key={idx} className="text-xs font-mono px-2 py-1 rounded bg-white/5 text-[#8C92A4] border border-white/10">
                {kw}
              </span>
            ))}
          </div>
        </header>

        {/* Typical Disqualifying Clauses */}
        <section className="mb-12">
          <h2 className="flex items-center gap-2 text-lg font-bold text-white mb-6">
            <AlertTriangle size={20} className="text-[#FF7B00]" /> Common Disqualifying Clauses
          </h2>
          <p className="text-[#8C92A4] mb-6 max-w-2xl">
            These clause types appear frequently in NAICS {code} solicitations and are the #1 cause of non-responsive bids.
            BidShield extracts, classifies, and risk-scores every instance automatically.
          </p>
          <div className="grid gap-3">
            {data.typicalClauses.map((clause, idx) => (
              <Link
                key={idx}
                href={`/bidshield/clauses/${clause}`}
                className="flex items-center justify-between p-4 bg-[#0f1423] border border-[#8C92A4]/20 rounded-xl hover:border-[#FF7B00]/30 hover:bg-[#FF7B00]/5 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono text-[#8C92A4] w-8 text-right">{idx + 1}</span>
                  <span className="text-white font-mono">{clause.replace(/-/g, ' ')}</span>
                </div>
                <ChevronRight size={16} className="text-[#8C92A4]" />
              </Link>
            ))}
          </div>
        </section>

        {/* Risk Factors */}
        <section className="mb-12">
          <h2 className="flex items-center gap-2 text-lg font-bold text-white mb-6">
            <FileText size={20} className="text-[#00B5E2]" /> BidShield Risk Vectors for NAICS {code}
          </h2>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { icon: AlertTriangle, title: 'Mandatory Requirements', desc: 'Pass/fail clauses that cause instant disqualification if missed', color: '#FF4444' },
              { icon: Calendar, title: 'Timeline Compression', desc: 'Unrealistic mobilization or delivery schedules', color: '#FF7B00' },
              { icon: DollarSign, title: 'Cost Realism', desc: 'Pricing below government estimates triggers scrutiny', color: '#A3FF00' },
              { icon: Shield, title: 'Security & Clearance', desc: 'Personnel vetting, facility clearance, cyber requirements', color: '#00B5E2' },
              { icon: Building, title: 'Past Performance', desc: 'Relevance, recency, and scope of cited references', color: '#FF7B00' },
              { icon: FileText, title: 'Technical Compliance', desc: 'Specification adherence, standards, certifications', color: '#A3FF00' },
            ].map((item, idx) => (
              <div key={idx} className="p-5 bg-[#0f1423] border border-[#8C92A4]/20 rounded-xl border-l-4" style={{ borderLeftColor: item.color }}>
                <item.icon size={20} className="text-white mb-3" style={{ color: item.color }} />
                <h3 className="font-bold text-white mb-1">{item.title}</h3>
                <p className="text-xs text-[#8C92A4]">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Triage Tiers */}
        <section className="mb-12">
          <h2 className="text-lg font-bold text-white mb-6">Pre-Bid Triage Tiers</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { name: 'Tier 1 — Urgent Triage', price: '$99 USD', timing: '< 72 Hours', features: ['Disqualifier clause scan', 'Pass/fail matrix', 'Risk heatmap', 'Go/No-Go recommendation'], popular: false },
              { name: 'Tier 2 — Full Compliance Matrix', price: '$249 USD', timing: '5 Business Days', features: ['All Tier 1 +', 'Clause-by-clause response guide', 'Past performance mapping', 'Cost realism analysis', 'Technical compliance checklist'], popular: true },
              { name: 'Tier 3 — Multi-Doc Suite', price: '$499 USD', timing: '10 Business Days', features: ['All Tier 2 +', 'Addenda & amendment tracking', 'Subcontractor flow-down', 'Protest risk assessment', 'Debrief preparation kit'], popular: false },
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
                  Start {tier.name.split('—')[0].trim()} →
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="bg-gradient-to-r from-[#0f1423] to-[#07090D] rounded-2xl border border-[#00B5E2]/30 p-8 text-center">
          <h3 className="text-2xl font-bold text-white mb-4">
            Bidding on NAICS {code} Solicitations?
          </h3>
          <p className="text-[#8C92A4] mb-6 max-w-2xl mx-auto">
            Don't let a missed clause cost you the contract. Run BidShield triage before you submit.
          </p>
          <Link 
            href="/bidshield/triage"
            className="inline-flex items-center gap-2 bg-[#00B5E2] text-black font-bold px-8 py-4 rounded-lg text-lg hover:bg-[#00B5E2]/90 transition-colors"
          >
            <Shield size={20} /> Run Triage Now — $99 USD
          </Link>
        </section>
      </div>
    </main>
  );
}