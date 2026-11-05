import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, Store, ShieldAlert, ExternalLink, ChevronRight } from 'lucide-react';
import latestCpscData from '@/public/recalls/latest-cpsc.json';

interface Props {
  params: Promise<{ slug: string }>;
}

const RETAILER_MAP: Record<string, { name: string; matchers: string[] }> = {
  'amazon': { name: 'Amazon', matchers: ['amazon', 'amazon.com'] },
  'walmart': { name: 'Walmart', matchers: ['walmart', 'walmart.com'] },
  'target': { name: 'Target', matchers: ['target', 'target.com'] },
  'costco': { name: 'Costco', matchers: ['costco', 'costco.com'] },
  'best-buy': { name: 'Best Buy', matchers: ['best buy', 'bestbuy.com'] },
  'home-depot': { name: 'The Home Depot', matchers: ['home depot', 'homedepot.com'] },
  'lowes': { name: "Lowe's", matchers: ["lowe's", 'lowes.com'] },
};

export async function generateStaticParams() {
  return Object.keys(RETAILER_MAP).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const config = RETAILER_MAP[slug];
  if (!config) {
    return { title: 'Retailer Safety Notices | RecallRadar' };
  }
  return {
    title: `${config.name} Recalled Products & Liquidation Compliance Index (2026)`,
    description: `Official safety enforcement records and prohibited resale products sold at ${config.name}. Cross-reference liquidation manifests before reselling.`,
    alternates: {
      canonical: `/recalls/retailer/${slug}`,
    },
  };
}

export default async function RetailerRecallsPage({ params }: Props) {
  const { slug } = await params;
  const config = RETAILER_MAP[slug];
  if (!config) {
    notFound();
  }

  const allRecalls = latestCpscData?.recalls || [];
  const matchedRecalls = allRecalls.filter((r: any) => {
    const text = (r.retailers || '').toLowerCase();
    return config.matchers.some((m) => text.includes(m));
  });

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white selection:bg-rose-500/30">
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
          <Store className="w-3.5 h-3.5" />
          COMMERCIAL RETAILER LIABILITY INDEX · 2026
        </div>

        <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-4 text-white">
          {config.name} Recalled Products &amp; Unlawful Inventory
        </h1>
        <p className="text-base text-neutral-400 leading-relaxed mb-8 max-w-2xl">
          Under 15 U.S.C. § 2068, it is illegal to resell, distribute, or export products subject to official CPSC recalls. Below are active federal recall actions distributed through {config.name}.
        </p>

        {/* Pallet Scan Teaser Callout */}
        <div className="rounded-xl border border-rose-500/30 bg-gradient-to-r from-neutral-900 to-rose-950/20 p-6 mb-12 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div>
            <h2 className="text-lg font-bold text-white mb-1">Checking a {config.name} Return Pallet?</h2>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Upload your liquidation manifest or CSV. We instantly match your SKUs and UPCs against 46,642 federal safety bans.
            </p>
          </div>
          <Link
            href="/recall-report"
            className="shrink-0 bg-white text-black px-5 py-3 rounded-lg text-sm font-semibold hover:bg-neutral-200 transition-colors flex items-center gap-2"
          >
            Scan Pallet Manifest ($30) <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <h2 className="text-xs font-mono uppercase tracking-widest text-neutral-400 mb-4">
          Active 2026 Enforcement Notices ({matchedRecalls.length} Records)
        </h2>

        <div className="grid gap-4">
          {matchedRecalls.map((rec: any) => (
            <div
              key={rec.recall_id}
              className="rounded-xl border border-neutral-800 bg-neutral-900/60 p-5 space-y-2 hover:border-neutral-700 transition-colors"
            >
              <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-neutral-400">
                <span className="text-rose-400 font-bold">CPSC #{rec.recall_number}</span>
                <span>·</span>
                <span>{rec.recall_date}</span>
                <span>·</span>
                <span className="px-2 py-0.5 rounded bg-neutral-800 text-neutral-200">
                  Units: {rec.units_affected}
                </span>
              </div>
              <Link
                href={`/recalls/${rec.recall_id}`}
                className="text-base font-semibold text-white hover:text-rose-300 transition-colors block"
              >
                {rec.title}
              </Link>
              <p className="text-xs text-neutral-400 line-clamp-2">
                <strong className="text-neutral-300">Hazard:</strong> {rec.hazard_summary}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
