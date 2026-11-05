import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ShieldAlert, AlertTriangle, ArrowLeft, CheckCircle, ExternalLink, ShieldCheck } from 'lucide-react';
import latestCpscData from '@/public/recalls/latest-cpsc.json';

interface Props {
  params: Promise<{ recallId: string }>;
}

export async function generateStaticParams() {
  const recalls = latestCpscData?.recalls || [];
  return recalls.map((r: any) => ({
    recallId: String(r.recall_id || r.recall_number),
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { recallId } = await params;
  const recalls = latestCpscData?.recalls || [];
  const recall = recalls.find(
    (r: any) => String(r.recall_id) === recallId || String(r.recall_number) === recallId
  );

  if (!recall) {
    return {
      title: 'Recall Notice Not Found | RecallRadar',
    };
  }

  return {
    title: `CPSC #${recall.recall_number}: ${recall.product_name} Recall Compliance Dossier`,
    description: `Official safety enforcement notice for ${recall.product_name}. Hazard: ${recall.hazard_summary}. Check liquidation manifests against federal bans.`,
    alternates: {
      canonical: `/recalls/${recall.recall_id}`,
    },
  };
}

export default async function RecallDetailPage({ params }: Props) {
  const { recallId } = await params;
  const recalls = latestCpscData?.recalls || [];
  const recall = recalls.find(
    (r: any) => String(r.recall_id) === recallId || String(r.recall_number) === recallId
  );

  if (!recall) {
    notFound();
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SpecialAnnouncement',
    name: recall.title,
    text: recall.hazard_summary,
    datePosted: recall.recall_date,
    url: recall.cpsc_url,
    category: 'https://schema.org/GovernmentService',
    spatialCoverage: 'United States & Canada',
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white selection:bg-rose-500/30">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      <div className="max-w-4xl mx-auto px-6 py-16">
        <div className="mb-8">
          <Link
            href="/recall-report"
            className="inline-flex items-center gap-2 text-xs font-mono text-neutral-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Compliance Scanner
          </Link>
        </div>

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 text-rose-400 text-xs font-mono font-medium mb-6 border border-rose-500/20">
          <ShieldAlert className="w-3.5 h-3.5" />
          OFFICIAL SAFETY ENFORCEMENT NOTICE · 15 U.S.C. § 2068
        </div>

        <div className="flex flex-wrap items-center gap-3 text-sm font-mono text-neutral-400 mb-4">
          <span className="text-rose-400 font-bold">CPSC #{recall.recall_number}</span>
          <span>·</span>
          <span>Recall Date: {recall.recall_date}</span>
          <span>·</span>
          <span className="px-2.5 py-0.5 rounded bg-neutral-800 text-neutral-200">
            Units: {recall.units_affected}
          </span>
        </div>

        <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-6 text-white">
          {recall.title}
        </h1>

        <div className="grid md:grid-cols-3 gap-6 my-10">
          <div className="md:col-span-2 space-y-6">
            <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
              <h2 className="text-xs uppercase tracking-wider text-neutral-400 font-semibold mb-3 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-400" /> Hazard &amp; Danger Profile
              </h2>
              <p className="text-neutral-200 text-base leading-relaxed mb-4">
                {recall.hazard_summary}
              </p>
              <div className="border-t border-neutral-800 pt-3">
                <span className="text-xs text-neutral-400 block font-mono">Reported Injuries / Incidents:</span>
                <span className="text-sm text-rose-300 font-medium">
                  {recall.injuries_reported || 'None reported'}
                </span>
              </div>
            </div>

            <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
              <h2 className="text-xs uppercase tracking-wider text-neutral-400 font-semibold mb-3">
                Commercial Distribution &amp; Retailers
              </h2>
              <p className="text-neutral-300 text-sm mb-4">
                {recall.retailers}
              </p>
              {recall.remedy && (
                <div className="border-t border-neutral-800 pt-3">
                  <span className="text-xs text-neutral-400 block font-mono">Official Remedy:</span>
                  <p className="text-sm text-neutral-200 mt-1">{recall.remedy}</p>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-6">
            {/* Conversion Module: $30 Scan */}
            <div className="bg-gradient-to-b from-neutral-900 to-neutral-950 border border-rose-500/30 rounded-xl p-6 flex flex-col justify-between shadow-xl">
              <div>
                <ShieldCheck className="w-8 h-8 text-rose-400 mb-3" />
                <h3 className="text-lg font-bold text-white mb-2">Reselling or Liquidating Inventory?</h3>
                <p className="text-xs text-neutral-400 mb-4 leading-relaxed">
                  Selling recalled units violates federal law. Run your manifest through our 46,642-record safety matcher before listing.
                </p>
                <div className="text-2xl font-bold font-mono text-white mb-4">
                  $30 <span className="text-xs text-neutral-500 font-normal">USD / scan</span>
                </div>
              </div>

              <Link
                href="/recall-report"
                className="w-full bg-rose-500 hover:bg-rose-600 text-white py-3 rounded-lg text-sm font-semibold transition-colors flex items-center justify-center gap-2 text-center"
              >
                Upload Manifest CSV →
              </Link>
            </div>

            <div className="bg-neutral-900/60 border border-neutral-800 rounded-xl p-5 text-xs text-neutral-400 space-y-3">
              <span className="text-neutral-200 font-bold block font-mono uppercase">Official Sources</span>
              <a
                href={recall.cpsc_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-rose-400 hover:underline flex items-center justify-between gap-1"
              >
                <span>CPSC Official Bulletin</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
              <Link
                href="/recalls/latest-cpsc.json"
                className="text-neutral-400 hover:underline flex items-center justify-between gap-1"
              >
                <span>Machine JSON Entry</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
