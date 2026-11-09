'use client';

import { useState, useMemo, useCallback } from 'react';
import Link from 'next/link';
import { Search, Clock, AlertOctagon, FileText, ChevronRight, ShieldAlert, Zap } from 'lucide-react';

export interface TenderSummary {
  solicitation_id: string;
  tender_number?: string;
  title: string;
  buyer: string;
  jurisdiction: string;
  category: string;
  naics_code: string;
  contract_midpoint_usd: number;
  combined_jev_exposure_usd: number;
  closes_at_iso: string;
  status: string;
  mandatory_gates: string[];
  missing_annex_count: number;
  urgent_under_72h?: boolean;
  hours_remaining_at_harvest?: number;
}

interface Props {
  initialTenders: TenderSummary[];
  totalCount?: number;
  premierCount?: number;
}

export default function TenderFeed({ initialTenders, totalCount, premierCount = 16 }: Props) {
  const [tenders, setTenders] = useState<TenderSummary[]>(initialTenders);
  const [fullLoaded, setFullLoaded] = useState(false);
  const [loadingFull, setLoadingFull] = useState(false);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'urgent' | 'fatal' | 'premier'>('all');
  const [visibleCount, setVisibleCount] = useState(16);

  const ensureFullCorpus = useCallback(async () => {
    if (fullLoaded || loadingFull) return;
    setLoadingFull(true);
    try {
      const res = await fetch('/bidshield/tenders.json');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data?.tenders)) {
          setTenders(data.tenders);
          setFullLoaded(true);
        }
      }
    } catch {
      // Keep initial SSR slice if network fails
    } finally {
      setLoadingFull(false);
    }
  }, [fullLoaded, loadingFull]);

  const filtered = useMemo(() => {
    let list = tenders;

    if (filter === 'premier') {
      list = list.slice(0, premierCount);
    } else if (filter === 'urgent') {
      list = list.filter((t) => t.urgent_under_72h || (t.hours_remaining_at_harvest && t.hours_remaining_at_harvest <= 72));
    } else if (filter === 'fatal') {
      list = list.filter((t) => t.status === 'HALT_REVIEW_FATAL_GATES' || (t.mandatory_gates && t.mandatory_gates.length > 0));
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (t) =>
          (t.title && t.title.toLowerCase().includes(q)) ||
          (t.solicitation_id && t.solicitation_id.toLowerCase().includes(q)) ||
          (t.buyer && t.buyer.toLowerCase().includes(q)) ||
          (t.category && t.category.toLowerCase().includes(q)) ||
          (t.naics_code && t.naics_code.includes(q))
      );
    }

    return list;
  }, [tenders, search, filter, premierCount]);

  const displayed = filtered.slice(0, visibleCount);
  const displayTotal = fullLoaded ? tenders.length : totalCount || tenders.length;

  return (
    <div>
      {/* Search and Filters Bar */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onFocus={() => {
              void ensureFullCorpus();
            }}
            onChange={(e) => {
              void ensureFullCorpus();
              setSearch(e.target.value);
              setVisibleCount(16);
            }}
            placeholder="Search 880+ tenders by ID, keyword, buyer, or NAICS (e.g. NRC-87055, HVAC)..."
            className="w-full pl-10 pr-4 py-2.5 bg-black/50 border border-slate-800 rounded-xl text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-amber-500/50"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
          <button
            onClick={() => {
              setFilter('all');
              setVisibleCount(16);
            }}
            className={`px-3 py-1.5 rounded-lg border transition ${
              filter === 'all'
                ? 'bg-white/10 text-white border-white/30'
                : 'bg-black/30 text-slate-400 border-slate-800 hover:text-white'
            }`}
          >
            All Tenders ({displayTotal})
          </button>
          <button
            onClick={() => {
              void ensureFullCorpus();
              setFilter('urgent');
              setVisibleCount(16);
            }}
            className={`px-3 py-1.5 rounded-lg border flex items-center gap-1.5 transition ${
              filter === 'urgent'
                ? 'bg-rose-500/20 text-rose-300 border-rose-500/50'
                : 'bg-black/30 text-slate-400 border-slate-800 hover:text-rose-300'
            }`}
          >
            <Zap className="w-3.5 h-3.5 text-rose-400" />
            Closing &lt; 72h
          </button>
          <button
            onClick={() => {
              void ensureFullCorpus();
              setFilter('fatal');
              setVisibleCount(16);
            }}
            className={`px-3 py-1.5 rounded-lg border flex items-center gap-1.5 transition ${
              filter === 'fatal'
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/50'
                : 'bg-black/30 text-slate-400 border-slate-800 hover:text-amber-300'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
            Fatal Disqualifiers
          </button>
          <button
            onClick={() => {
              setFilter('premier');
              setVisibleCount(16);
            }}
            className={`px-3 py-1.5 rounded-lg border transition ${
              filter === 'premier'
                ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50'
                : 'bg-black/30 text-slate-400 border-slate-800 hover:text-cyan-300'
            }`}
          >
            Featured ({premierCount})
          </button>
        </div>
      </div>

      {/* Grid of Solicitations */}
      {displayed.length === 0 ? (
        <div className="text-center py-12 border border-dashed border-slate-800 rounded-2xl p-8">
          <p className="text-sm font-mono text-slate-400">
            {loadingFull ? 'Loading full 882-tender corpus...' : 'No solicitations match your search filter.'}
          </p>
          <button
            onClick={() => {
              setSearch('');
              setFilter('all');
            }}
            className="mt-3 text-xs font-mono text-cyan-400 hover:underline"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {displayed.map((t) => (
            <Link
              key={t.solicitation_id}
              href={`/bidshield/tender/${t.solicitation_id}`}
              className="group p-6 bg-[#0f1423] border border-slate-800 rounded-2xl hover:border-amber-500/40 hover:bg-slate-900/60 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between text-xs font-mono mb-3">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-bold">
                      {t.solicitation_id}
                    </span>
                    {t.urgent_under_72h && (
                      <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-400 border border-rose-500/30 text-[10px] font-bold animate-pulse">
                        &lt; 72H CLOSING
                      </span>
                    )}
                  </div>
                  <span className="text-amber-400 flex items-center gap-1 font-semibold text-[11px]">
                    <Clock size={12} /> {t.category}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-amber-300 transition-colors line-clamp-2">
                  {t.title}
                </h3>

                <p className="text-xs text-slate-400 mb-4 font-mono line-clamp-1">
                  {t.buyer} — {t.jurisdiction}
                </p>

                <div className="grid grid-cols-2 gap-3 mb-4 p-3 bg-black/40 rounded-xl border border-white/5 text-xs font-mono">
                  <div>
                    <span className="text-slate-500 block text-[10px]">CONTRACT MIDPOINT</span>
                    <span className="text-white font-bold">
                      ${((t.contract_midpoint_usd || 2500000) / 1000000).toFixed(1)}M USD
                    </span>
                  </div>
                  <div>
                    <span className="text-rose-400 block text-[10px]">JEV EXPOSURE RISK</span>
                    <span className="text-rose-400 font-bold">
                      ${(t.combined_jev_exposure_usd || 15000).toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="space-y-1.5 mb-4">
                  <div className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
                    <AlertOctagon size={12} className="text-rose-400" />
                    <span>{(t.mandatory_gates || []).length} fatal pre-bid disqualifiers identified</span>
                  </div>
                  <div className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
                    <FileText size={12} className="text-cyan-400" />
                    <span>{t.missing_annex_count || 3} missing referenced schedules</span>
                  </div>
                </div>
              </div>

              <div className="border-t border-slate-800 pt-4 flex items-center justify-between text-xs font-mono">
                <span className="text-emerald-400 font-semibold">19-Column Matrix Available</span>
                <span className="text-slate-300 group-hover:text-amber-300 group-hover:translate-x-1 transition-all flex items-center gap-1">
                  Inspect Triage <ChevronRight size={14} />
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Show More Pagination Button */}
      {(filtered.length > visibleCount || (!fullLoaded && displayTotal > visibleCount)) && (
        <div className="mt-8 text-center">
          <button
            onClick={() => {
              void ensureFullCorpus();
              setVisibleCount((prev) => prev + 16);
            }}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-slate-800 bg-slate-900/60 hover:bg-slate-800 text-xs font-mono text-slate-200 hover:text-white transition"
          >
            {loadingFull
              ? 'Loading Full Corpus...'
              : `Show Next 16 Solicitations (${Math.max(0, (filter === 'all' && !search ? displayTotal : filtered.length) - visibleCount)} remaining)`}
          </button>
        </div>
      )}
    </div>
  );
}
