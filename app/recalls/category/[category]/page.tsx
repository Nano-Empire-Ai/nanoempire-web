import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, AlertTriangle, Shield, Calendar, Globe, ChevronRight } from 'lucide-react';
import { getCategories, getRecallsByCategory } from '@/lib/recall-data';

interface CategoryPageProps {
  params: Promise<{ category: string }>;
}

function slugify(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

export async function generateStaticParams() {
  const categories = getCategories();
  // Pre-generate top 30 categories by recall count
  return categories.slice(0, 30).map(c => ({ category: slugify(c.name) }));
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { category } = await params;
  const categories = getCategories();
  const cat = categories.find(c => slugify(c.name) === category);
  
  if (!cat) {
    return { title: 'Category Not Found' };
  }

  return {
    title: `${cat.name} Safety Recalls (${cat.count}) | RecallRadar`,
    description: `${cat.count} active federal safety recalls for ${cat.name} hazards. Verify your inventory instantly with our $30 compliance scan.`,
    alternates: { canonical: `/recalls/category/${category}` },
    openGraph: {
      title: `${cat.name} — ${cat.count} Active Recalls`,
      description: `Check your inventory for ${cat.name} safety recalls.`,
    },
  };
}

export default async function CategoryDetailPage({ params }: CategoryPageProps) {
  const { category } = await params;
  const categories = getCategories();
  const cat = categories.find(c => slugify(c.name) === category);

  if (!cat) {
    notFound();
  }

  const recalls = getRecallsByCategory(category);

  return (
    <main className="min-h-screen bg-[#07090D] text-[#F4F1EA] font-sans">
      {/* Top Nav */}
      <nav className="border-b border-[#8C92A4]/20 bg-[#07090D]/90 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/recalls" className="flex items-center gap-2 text-[#8C92A4] hover:text-white transition-colors text-sm font-mono">
            <ArrowLeft size={16} /> All Recalls
          </Link>
          <Link href="/recall-report" className="text-xs font-mono font-bold bg-[#00B5E2] text-black px-3 py-1.5 rounded hover:bg-[#00B5E2]/90">
            Scan Inventory ($30)
          </Link>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <header className="mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#FF4444]/30 bg-[#FF4444]/10 text-xs text-[#FF4444] font-mono mb-4">
            <AlertTriangle size={14} /> HAZARD CATEGORY INDEX
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-4 font-mono">
            {cat.name} <span className="text-[#00B5E2]">({cat.count} Active Recalls)</span>
          </h1>
          <p className="text-xl text-[#8C92A4] max-w-2xl">
            Every active federal safety recall for <strong className="text-white">{cat.name}</strong> hazards. 
            Cross-reference your SKUs instantly with our <strong className="text-white">$30 compliance scan</strong>.
          </p>
        </header>

        {/* Quick Actions */}
        <div className="flex flex-wrap gap-4 mb-10 p-6 bg-[#0f1423]/90 rounded-xl border border-[#8C92A4]/20">
          <Link href="/recall-report" className="flex items-center gap-2 bg-[#00B5E2] text-black font-bold px-5 py-3 rounded hover:bg-[#00B5E2]/90 transition-colors">
            <Shield size={18} /> Scan My Inventory for {cat.name} ($30)
          </Link>
          <Link href="/sample_inventory.csv" download className="flex items-center gap-2 border border-[#8C92A4]/40 text-[#8C92A4] px-5 py-3 rounded hover:bg-white/5 transition-colors">
            Download Sample Pallet CSV
          </Link>
        </div>

        {/* Recall Table */}
        <section className="mb-16">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <h2 className="text-2xl font-bold text-white">Active {cat.name} Recalls</h2>
            <div className="text-sm text-[#8C92A4]">
              Showing {recalls.length} recalls | <Link href="/recalls" className="text-[#00B5E2] hover:underline">View All Recalls →</Link>
            </div>
          </div>

          <div className="overflow-x-auto rounded-xl border border-[#8C92A4]/20">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[#0f1423] border-b border-[#8C92A4]/20 text-left font-mono text-xs uppercase text-[#8C92A4]">
                  <th className="p-4">Recall ID</th>
                  <th className="p-4">Title</th>
                  <th className="p-4">Severity</th>
                  <th className="p-4">Brand</th>
                  <th className="p-4">Date</th>
                  <th className="p-4">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#8C92A4]/10">
                {recalls.slice(0, 100).map((recall, idx) => (
                  <tr key={idx} className="hover:bg-[#0f1423]/50 transition-colors">
                    <td className="p-4 font-mono text-[#00B5E2]">
                      <Link href={`/recalls/${recall.RecallID}`} className="hover:underline">
                        {recall.RecallID}
                      </Link>
                    </td>
                    <td className="p-4 text-white max-w-md truncate">{recall.Title}</td>
                    <td className="p-4">
                      <span className={`px-2 py-0.5 rounded text-xs font-mono font-bold ${
                        recall.Severity === 'critical' ? 'text-[#FF4444] bg-[#FF4444]/10 border-[#FF4444]/30' :
                        recall.Severity === 'serious' ? 'text-[#FF7B00] bg-[#FF7B00]/10 border-[#FF7B00]/30' :
                        'text-[#00B5E2] bg-[#00B5E2]/10 border-[#00B5E2]/30'
                      }`}>
                        {recall.Severity}
                      </span>
                    </td>
                    <td className="p-4 text-[#8C92A4] max-w-xs truncate">{recall.Brand}</td>
                    <td className="p-4 font-mono text-[#8C92A4]">{recall.RecallDate}</td>
                    <td className="p-4">
                      <Link 
                        href={`/recalls/${recall.RecallID}`}
                        className="text-xs font-mono text-[#00B5E2] hover:underline flex items-center gap-1"
                      >
                        View Details <ChevronRight size={12} />
                      </Link>
                    </td>
                  </tr>
                ))}
                {recalls.length > 100 && (
                  <tr>
                    <td colSpan={6} className="p-4 text-center text-[#8C92A4]">
                      +{recalls.length - 100} more recalls. <Link href="/recalls" className="text-[#00B5E2] hover:underline">View full list →</Link>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* Compliance CTA */}
        <section className="bg-gradient-to-r from-[#0f1423] to-[#07090D] rounded-2xl border border-[#00B5E2]/30 p-8 text-center">
          <h3 className="text-2xl font-bold text-white mb-4">
            Products with {cat.name} Hazards in Your Inventory?
          </h3>
          <p className="text-[#8C92A4] mb-6 max-w-2xl mx-auto">
            Federal law prohibits selling recalled products. Scan your entire manifest against 46,642 federal records in seconds.
          </p>
          <Link 
            href="/recall-report"
            className="inline-flex items-center gap-2 bg-[#00B5E2] text-black font-bold px-8 py-4 rounded-lg text-lg hover:bg-[#00B5E2]/90 transition-colors"
          >
            <Shield size={20} /> Scan My Inventory Now ($30)
          </Link>
        </section>
      </div>
    </main>
  );
}