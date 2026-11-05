import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, AlertTriangle, Building, Globe, Shield, Calendar, Star, ExternalLink } from 'lucide-react';
import { getRetailers, getCategories, getSeverityCounts, getSourceCounts, loadRecalls } from '@/lib/recall-data';

export const metadata: Metadata = {
  title: 'Federal Safety Recall Index — 46,642 Active Recalls | RecallRadar',
  description: 'Browse 46,642 active federal safety recalls by retailer, hazard category, and severity. Instant $30 inventory compliance scans.',
  alternates: { canonical: '/recalls' },
};

export default function RecallsIndexPage() {
  const retailers = getRetailers();
  const categories = getCategories();
  const severityCounts = getSeverityCounts();
  const sourceCounts = getSourceCounts();
  const totalRecalls = loadRecalls().length;

  const topRetailers = retailers.slice(0, 10);
  const topCategories = categories.slice(0, 10);

  return (
    <main className="min-h-screen bg-[#07090D] text-[#F4F1EA] font-sans">
      {/* Top Nav */}
      <nav className="border-b border-[#8C92A4]/20 bg-[#07090D]/90 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-[#8C92A4] hover:text-white transition-colors text-sm font-mono">
            <ArrowLeft size={16} /> Nano Empire AI
          </Link>
          <Link href="/recall-report" className="text-xs font-mono font-bold bg-[#00B5E2] text-black px-3 py-1.5 rounded hover:bg-[#00B5E2]/90">
            Scan Inventory ($30)
          </Link>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Hero */}
        <header className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#FF4444]/30 bg-[#FF4444]/10 text-xs text-[#FF4444] font-mono mb-4">
            <AlertTriangle size={14} /> FEDERAL SAFETY RECALL INDEX · 2026
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white mb-6 font-mono">
            46,642 Active Safety Recalls
          </h1>
          <p className="text-xl text-[#8C92A4] max-w-3xl mx-auto mb-8">
            Official CPSC, FDA, Health Canada, and Transport Canada enforcement actions. 
            Cross-reference your inventory in seconds with our <strong className="text-white">$30 instant scan</strong>.
          </p>
          
          {/* Stats Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto mb-8">
            <div className="bg-[#0f1423] border border-[#8C92A4]/20 rounded-xl p-6 text-center">
              <div className="text-3xl font-extrabold font-mono text-[#A3FF00]">{totalRecalls.toLocaleString()}</div>
              <div className="text-xs text-[#8C92A4] font-mono">Total Active Recalls</div>
            </div>
            <div className="bg-[#0f1423] border border-[#8C92A4]/20 rounded-xl p-6 text-center">
              <div className="text-3xl font-extrabold font-mono text-[#00B5E2]">{Object.keys(sourceCounts).length}</div>
              <div className="text-xs text-[#8C92A4] font-mono">Federal Sources</div>
            </div>
            <div className="bg-[#0f1423] border border-[#8C92A4]/20 rounded-xl p-6 text-center">
              <div className="text-3xl font-extrabold font-mono text-[#FF7B00]">{retailers.length}</div>
              <div className="text-xs text-[#8C92A4] font-mono">Tracked Brands</div>
            </div>
            <div className="bg-[#0f1423] border border-[#8C92A4]/20 rounded-xl p-6 text-center">
              <div className="text-3xl font-extrabold font-mono text-[#FF4444]">{categories.length}</div>
              <div className="text-xs text-[#8C92A4] font-mono">Hazard Categories</div>
            </div>
          </div>

          {/* Primary CTA */}
          <Link 
            href="/recall-report"
            className="inline-flex items-center gap-3 bg-[#00B5E2] text-black font-bold px-8 py-4 rounded-lg text-lg hover:bg-[#00B5E2]/90 transition-colors"
          >
            <Shield size={24} /> Scan My Inventory Now ($30 USD)
          </Link>
        </header>

        {/* Browse by Section */}
        <section className="mb-16">
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {/* Browse by Retailer */}
            <div className="bg-[#0f1423] border border-[#8C92A4]/20 rounded-2xl p-6">
              <div className="flex items-center gap-2 text-white font-bold mb-4">
                <Building size={20} className="text-[#00B5E2]" />
                <h2 className="text-xl">Browse by Brand / Retailer</h2>
              </div>
              <p className="text-[#8C92A4] text-sm mb-6">{retailers.length} brands with active federal recalls</p>
              
              <div className="grid gap-2 mb-6">
                {topRetailers.map((retailer, idx) => (
                  <Link 
                    key={idx}
                    href={`/recalls/retailer/${retailer.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}
                    className="flex items-center justify-between p-3 bg-black/40 border border-white/5 rounded-lg hover:border-[#00B5E2]/30 hover:bg-[#00B5E2]/5 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-mono text-[#8C92A4] w-8 text-right">{idx + 1}</span>
                      <span className="text-white font-medium">{retailer.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono text-[#A3FF00] bg-[#A3FF00]/10 px-2 py-0.5 rounded">
                        {retailer.count} recalls
                      </span>
                      <ExternalLink size={14} className="text-[#8C92A4]" />
                    </div>
                  </Link>
                ))}
              </div>
              
              <Link 
                href="#all-retailers"
                className="text-xs font-mono text-[#00B5E2] hover:underline flex items-center gap-1"
              >
                View All {retailers.length} Brands →
              </Link>
            </div>

            {/* Browse by Hazard Category */}
            <div className="bg-[#0f1423] border border-[#8C92A4]/20 rounded-2xl p-6">
              <div className="flex items-center gap-2 text-white font-bold mb-4">
                <AlertTriangle size={20} className="text-[#FF7B00]" />
                <h2 className="text-xl">Browse by Hazard Category</h2>
              </div>
              <p className="text-[#8C92A4] text-sm mb-6">{categories.length} distinct hazard types</p>
              
              <div className="grid gap-2 mb-6">
                {topCategories.map((cat, idx) => (
                  <Link 
                    key={idx}
                    href={`/recalls/category/${cat.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}
                    className="flex items-center justify-between p-3 bg-black/40 border border-white/5 rounded-lg hover:border-[#FF7B00]/30 hover:bg-[#FF7B00]/5 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-mono text-[#8C92A4] w-8 text-right">{idx + 1}</span>
                      <span className="text-white font-medium">{cat.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono text-[#FF7B00] bg-[#FF7B00]/10 px-2 py-0.5 rounded">
                        {cat.count} recalls
                      </span>
                      <ExternalLink size={14} className="text-[#8C92A4]" />
                    </div>
                  </Link>
                ))}
              </div>
              
              <Link 
                href="#all-categories"
                className="text-xs font-mono text-[#00B5E2] hover:underline flex items-center gap-1"
              >
                View All {categories.length} Categories →
              </Link>
            </div>
          </div>

          {/* Severity Breakdown */}
          <div className="bg-[#0f1423] border border-[#8C92A4]/20 rounded-2xl p-6">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Star size={20} className="text-[#FF7B00]" /> Recalls by Severity
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.entries(severityCounts).map(([severity, count]) => (
                <div key={severity} className={`p-4 rounded-xl border ${severity === 'critical' ? 'border-[#FF4444]/30 bg-[#FF4444]/5' : severity === 'serious' ? 'border-[#FF7B00]/30 bg-[#FF7B00]/5' : 'border-[#00B5E2]/30 bg-[#00B5E2]/5'}`}>
                  <div className="text-3xl font-extrabold font-mono text-white">{count.toLocaleString()}</div>
                  <div className="text-xs font-mono uppercase tracking-wider text-[#8C92A4]">{severity}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Source Breakdown */}
        <section className="mb-16">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <Globe size={20} className="text-[#00B5E2]" /> Federal Data Sources
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(sourceCounts).map(([source, count]) => (
              <Link 
                key={source}
                href="#"
                className="p-4 rounded-xl border border-[#8C92A4]/20 bg-[#0f1423] hover:border-[#00B5E2]/30 transition-colors text-center"
              >
                <div className="text-2xl font-extrabold font-mono text-[#00B5E2]">{count.toLocaleString()}</div>
                <div className="text-xs font-mono text-[#8C92A4] mt-1">{source.replace('health-canada-', 'HC ').replace('consumer-product-safety', 'Consumer Safety').replace('medical-devices', 'Medical Devices').replace('cfia', 'CFIA')}</div>
              </Link>
            ))}
          </div>
        </section>

        {/* Compliance CTA */}
        <section className="bg-gradient-to-r from-[#0f1423] to-[#07090D] rounded-2xl border border-[#00B5E2]/30 p-8 md:p-12 text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4">
            Reselling Inventory? <br/> <span className="text-[#00B5E2]">Don't Risk Federal Violations.</span>
          </h2>
          <p className="text-[#8C92A4] mb-8 max-w-2xl mx-auto text-lg">
            Under 15 U.S.C. § 2068 and Canada Consumer Product Safety Act, it is unlawful to sell, distribute, or import recalled products. 
            One scan protects your business, your customers, and your liability exposure.
          </p>
          <Link 
            href="/recall-report"
            className="inline-flex items-center gap-3 bg-[#00B5E2] text-black font-bold px-10 py-5 rounded-lg text-xl hover:bg-[#00B5E2]/90 transition-colors"
          >
            <Shield size={28} /> Scan My Inventory Now — $30 USD
          </Link>
        </section>

        {/* Technical Footer */}
        <section className="mt-16 pt-8 border-t border-[#8C92A4]/20">
          <div className="grid md:grid-cols-3 gap-8 text-sm">
            <div>
              <h3 className="text-xs font-mono uppercase tracking-wider text-[#00B5E2] mb-3">Data Integrity</h3>
              <ul className="space-y-2 text-[#8C92A4]">
                <li>46,642 records from official federal APIs</li>
                <li>Daily automated sync at 08:00 ET</li>
                <li>SHA-256 verified source integrity</li>
                <li>Machine-readable JSON + CSV exports</li>
              </ul>
            </div>
            <div>
              <h3 className="text-xs font-mono uppercase tracking-wider text-[#00B5E2] mb-3">Coverage</h3>
              <ul className="space-y-2 text-[#8C92A4]">
                <li>CPSC (US Consumer Product Safety)</li>
                <li>FDA (US Food & Drug)</li>
                <li>Health Canada (Consumer, CFIA, Medical, TC)</li>
                <li>Cross-border unified schema</li>
              </ul>
            </div>
            <div>
              <h3 className="text-xs font-mono uppercase tracking-wider text-[#00B5E2] mb-3">Legal Basis</h3>
              <ul className="space-y-2 text-[#8C92A4]">
                <li>15 U.S.C. § 2068 (US)</li>
                <li>CCPSA (Canada)</li>
                <li>Prohibits sale/distribution of recalled goods</li>
                <li>Liability protection via compliance scan</li>
              </ul>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}