import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Shield, AlertTriangle, Clock, DollarSign, FileText, CheckCircle2, XCircle, ExternalLink, Download, AlertOctagon } from 'lucide-react';
import tendersData from '@/public/bidshield/tenders.json';

interface TenderPageProps {
  params: Promise<{ solicitationId: string }>;
}

export async function generateStaticParams() {
  const tenders = tendersData?.tenders || [];
  return tenders.map((t: any) => ({
    solicitationId: t.solicitation_id,
  }));
}

export async function generateMetadata({ params }: TenderPageProps): Promise<Metadata> {
  const { solicitationId } = await params;
  const tenders = tendersData?.tenders || [];
  const tender = tenders.find(
    (t: any) => t.solicitation_id.toLowerCase() === solicitationId.toLowerCase()
  );

  if (!tender) {
    return {
      title: 'Solicitation Not Found | BidShield',
    };
  }

  return {
    title: `${tender.solicitation_id} — Fatal Pre-Bid Disqualifiers & Mandatory Compliance Matrix | BidShield`,
    description: `Pre-bid compliance triage for ${tender.title} (${tender.solicitation_id}). Identifies fatal disqualifier gates, ${tender.missing_annex_count} missing annexes, and $${tender.combined_jev_exposure_usd.toLocaleString()} Judgment Exposure (JEV). Order complete 19-column matrix on Upwork.`,
    alternates: {
      canonical: `/bidshield/tender/${tender.solicitation_id}`,
    },
    openGraph: {
      title: `${tender.solicitation_id}: Fatal Pre-Bid Compliance Triage`,
      description: `Contract Value: $${(tender.contract_midpoint_usd / 1000000).toFixed(1)}M | JEV Exposure: $${tender.combined_jev_exposure_usd.toLocaleString()} | ${tender.missing_annex_count} Missing Annexes Detected.`,
      url: `https://www.nanoempireai.com/bidshield/tender/${tender.solicitation_id}`,
      type: 'website',
    },
  };
}

export default async function TenderDetailPage({ params }: TenderPageProps) {
  const { solicitationId } = await params;
  const tenders = tendersData?.tenders || [];
  const tender = tenders.find(
    (t: any) => t.solicitation_id.toLowerCase() === solicitationId.toLowerCase()
  );

  if (!tender) {
    notFound();
  }

  const closeDate = new Date(tender.closes_at_iso);
  const now = new Date();
  const diffHours = Math.max(0, Math.round((closeDate.getTime() - now.getTime()) / (1000 * 60 * 60)));
  const diffDays = Math.ceil(diffHours / 24);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'GovernmentService',
    name: `BidShield Pre-Bid Compliance Matrix: ${tender.solicitation_id}`,
    serviceType: 'Government Procurement Compliance Triage',
    provider: {
      '@type': 'Organization',
      name: 'Nano Empire AI - BidShield',
      url: 'https://www.nanoempireai.com/bidshield',
    },
    description: tender.evaluation_summary,
    offers: {
      '@type': 'AggregateOffer',
      priceCurrency: 'USD',
      lowPrice: '149',
      highPrice: '499',
      offerCount: '3',
      offers: [
        {
          '@type': 'Offer',
          name: 'Starter Compliance Matrix',
          price: '149',
          priceCurrency: 'USD',
          url: tender.upwork_catalog_url,
        },
        {
          '@type': 'Offer',
          name: 'Standard Stop/Go Compliance Pilot',
          price: '299',
          priceCurrency: 'USD',
          url: tender.upwork_catalog_url,
        },
        {
          '@type': 'Offer',
          name: 'Advanced 19-Column Full Disqualification Matrix',
          price: '499',
          priceCurrency: 'USD',
          url: tender.upwork_catalog_url,
        },
      ],
    },
  };

  return (
    <div className="min-h-screen bg-[#07090E] text-slate-100 selection:bg-amber-500/20 selection:text-amber-300">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Top Banner / Ticking Clock */}
      <div className="border-b border-amber-500/20 bg-amber-950/20 px-4 py-2.5 text-center text-xs text-amber-300 font-mono flex items-center justify-center gap-2">
        <Clock className="w-3.5 h-3.5 animate-pulse text-amber-400" />
        <span>
          SOLICITATION CLOSING WINDOW: <strong>{diffDays} DAYS REMAINING</strong> ({diffHours} HOURS) — DEADLINE: {closeDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
        </span>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Navigation */}
        <div className="flex items-center justify-between mb-8">
          <Link
            href="/bidshield"
            className="inline-flex items-center text-sm font-mono text-slate-400 hover:text-white transition"
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to BidShield Intelligence
          </Link>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              Active Triage Feed
            </span>
          </div>
        </div>

        {/* Header Section */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 sm:p-8 backdrop-blur mb-8">
          <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-slate-400 mb-3">
            <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300">{tender.jurisdiction}</span>
            <span>•</span>
            <span className="text-amber-400 font-semibold">{tender.category}</span>
            <span>•</span>
            <Link href={`/bidshield/naics/${tender.naics_code}`} className="text-cyan-400 hover:underline">
              NAICS {tender.naics_code}
            </Link>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white mb-4">
            {tender.title}
          </h1>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-slate-300 font-mono border-t border-slate-800/80 pt-4">
            <div>
              <span className="text-slate-500">Solicitation:</span> <strong className="text-white">{tender.solicitation_id}</strong>
            </div>
            <div>
              <span className="text-slate-500">Tender Ref:</span> <span className="text-slate-300">{tender.tender_number}</span>
            </div>
            <div>
              <span className="text-slate-500">Issuing Buyer:</span> <span className="text-slate-200">{tender.buyer}</span>
            </div>
          </div>
        </div>

        {/* Financial Exposure & Decision Risk Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-5">
            <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-2">
              <span>ESTIMATED CONTRACT MIDPOINT</span>
              <DollarSign className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold font-mono text-white">
              ${(tender.contract_midpoint_usd / 1000000).toFixed(1)}M
            </div>
            <p className="text-xs text-slate-500 mt-2">
              Based on multi-year option periods and facility square-footage baselines.
            </p>
          </div>

          <div className="rounded-xl border border-rose-500/30 bg-rose-950/10 p-5">
            <div className="flex items-center justify-between text-xs font-mono text-rose-300 mb-2">
              <span>JUDGMENT EXPOSURE (JEV)</span>
              <AlertTriangle className="w-4 h-4 text-rose-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold font-mono text-rose-400">
              ${tender.combined_jev_exposure_usd.toLocaleString()}
            </div>
            <p className="text-xs text-rose-300/80 mt-2">
              Unhedged risk exposure if non-compliant submission causes disqualification.
            </p>
          </div>

          <div className="rounded-xl border border-amber-500/30 bg-amber-950/10 p-5">
            <div className="flex items-center justify-between text-xs font-mono text-amber-300 mb-2">
              <span>MISSING REFERENCED ANNEXES</span>
              <AlertOctagon className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold font-mono text-amber-400">
              {tender.missing_annex_count} Schedules
            </div>
            <p className="text-xs text-amber-300/80 mt-2">
              Referenced in notice criteria but omitted from initial public tender download.
            </p>
          </div>
        </div>

        {/* Main Content Two-Column */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Left Column: Fatal Gates & Annexes */}
          <div className="lg:col-span-2 space-y-6">
            {/* Section 1: Fatal Disqualifiers */}
            <div className="rounded-2xl border border-rose-500/20 bg-slate-900/60 p-6">
              <div className="flex items-center gap-2 mb-4">
                <AlertOctagon className="w-5 h-5 text-rose-400 shrink-0" />
                <h2 className="text-lg font-bold text-white font-mono uppercase tracking-wide">
                  Fatal Pre-Bid Disqualifiers Identified
                </h2>
              </div>
              <p className="text-xs text-slate-400 mb-4 font-mono">
                Mandatory clauses with zero post-closing cure periods. Non-compliance results in immediate technical rejection.
              </p>
              <div className="space-y-3">
                {tender.mandatory_gates.map((gate: string, idx: number) => (
                  <div
                    key={idx}
                    className="flex items-start gap-3 rounded-lg border border-rose-500/20 bg-rose-950/20 p-3.5 text-xs text-slate-200"
                  >
                    <XCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                    <span className="leading-relaxed font-sans">{gate}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Section 2: Missing Annexes */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
              <div className="flex items-center gap-2 mb-4">
                <FileText className="w-5 h-5 text-cyan-400 shrink-0" />
                <h2 className="text-lg font-bold text-white font-mono uppercase tracking-wide">
                  Missing Schedules &amp; Deontic Obligations ({tender.missing_annex_count})
                </h2>
              </div>
              <p className="text-xs text-slate-400 mb-4 font-mono">
                BidShield identified {tender.missing_annex_count} separate schedules and compliance cross-references required to price and submit:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {tender.missing_annexes.map((annex: string, idx: number) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 rounded-lg border border-slate-800/80 bg-slate-950/60 px-3 py-2 text-slate-300 font-mono"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                    <span className="truncate">{annex}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Section 3: Evaluation Summary */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 text-xs text-slate-300 space-y-3 font-sans leading-relaxed">
              <h3 className="font-bold font-mono text-white text-sm uppercase">BidShield Pre-Action Risk Analysis</h3>
              <p>{tender.evaluation_summary}</p>
              <p className="text-slate-400">
                Firms planning to submit must independently verify mandatory site attendance dates and obtain client-signed clearances before committing pricing models.
              </p>
            </div>
          </div>

          {/* Right Column: Upwork Escrow Order Card */}
          <div className="space-y-6">
            <div className="rounded-2xl border-2 border-emerald-500/40 bg-slate-900/90 p-6 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-emerald-500 text-slate-950 text-[10px] font-mono font-extrabold uppercase px-3 py-1 rounded-bl-lg">
                Escrow Protected
              </div>

              <div className="flex items-center gap-2 text-emerald-400 text-xs font-mono font-semibold mb-2">
                <Shield className="w-4 h-4" />
                <span>UPWORK VERIFIED CATALOG SERVICE</span>
              </div>

              <h3 className="text-xl font-bold text-white mb-2">
                Order 19-Column Compliance Matrix
              </h3>

              <p className="text-xs text-slate-300 mb-6 leading-relaxed">
                Receive an audit-grade, line-by-line decomposition of every mandatory requirement, submittal format, and fatal hurdle for {tender.solicitation_id}.
              </p>

              <div className="space-y-3 mb-6 border-y border-slate-800 py-4 text-xs font-mono text-slate-300">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Every &quot;shall/must&quot; clause tagged &amp; indexed</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Pre-bid fatal gate stop/go recommendation</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>3-day guaranteed turnaround via Upwork Escrow</span>
                </div>
              </div>

              <div className="mb-4">
                <div className="text-[11px] font-mono text-slate-400 mb-1">CATALOG TIERS</div>
                <div className="text-lg font-mono font-extrabold text-white">
                  $149 <span className="text-xs font-normal text-slate-400">Starter</span> · $299 <span className="text-xs font-normal text-slate-400">Standard</span> · $499 <span className="text-xs font-normal text-slate-400">Full</span>
                </div>
              </div>

              <a
                href={tender.upwork_catalog_url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold font-mono py-3 px-4 rounded-xl transition text-sm shadow-lg shadow-emerald-500/20"
              >
                <span>Order via Upwork Catalog</span>
                <ExternalLink className="w-4 h-4" />
              </a>

              <p className="text-[10px] text-center text-slate-500 font-mono mt-3">
                Funds held safely in Upwork escrow until delivery is reviewed and approved.
              </p>
            </div>

            {/* Sample PDF Teardown Box */}
            <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-5 text-xs">
              <h4 className="font-bold font-mono text-white mb-2 flex items-center gap-2">
                <Download className="w-4 h-4 text-cyan-400" />
                <span>Sample Report Preview</span>
              </h4>
              <p className="text-slate-400 mb-3 leading-relaxed">
                Inspect a real BidShield live tender audit report before ordering your own solicitation matrix.
              </p>
              <a
                href={tender.sample_pdf_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-cyan-400 hover:text-cyan-300 font-mono text-xs font-semibold"
              >
                View Sample Teardown PDF (8.6 KB) →
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
