'use client';

import { useEffect, useState } from 'react';

interface LedgerEvent {
  id: string;
  timestamp: string;
  type: string;
  tier: 'LIVE_B2B' | 'SYSTEM_UPTIME_PROOF';
  agent_id: string;
  payload: string;
  amount_usd?: number;
  signature?: string;
  verified_onchain?: boolean;
}

export default function LedgerFeed() {
  const [events, setEvents] = useState<LedgerEvent[]>([]);
  const [meta, setMeta] = useState({ total_volume_usd: 0, active_agents: 0 });

  useEffect(() => {
    const fetchFeed = async () => {
      try {
        const res = await fetch('/api/ledger/feed');
        const data = await res.json();
        setEvents(data.events || []);
        setMeta(data.meta || { total_volume_usd: 0, active_agents: 0 });
      } catch (err) {
        console.error('Ledger feed fetch error:', err);
      }
    };

    fetchFeed();
    const interval = setInterval(fetchFeed, 8000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-black text-green-400 font-mono p-6 rounded-lg border border-green-900 shadow-2xl">
      <div className="flex flex-col sm:flex-row justify-between mb-4 border-b border-green-900 pb-3 gap-2">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse"></span>
          <span className="text-sm font-bold uppercase tracking-wider text-white">Live Cryptographic Settlement Feed</span>
        </div>
        <div className="text-xs text-gray-400 flex gap-4">
          <span>Settled: <strong className="text-green-400">${meta.total_volume_usd.toFixed(2)}</strong></span>
          <span>Active Nodes: <strong className="text-white">{meta.active_agents}</strong></span>
        </div>
      </div>

      <div className="space-y-2 text-xs overflow-x-auto">
        {events.map((evt) => (
          <div key={evt.id} className="flex items-center gap-3 hover:bg-green-950/30 p-2 rounded transition-colors border border-transparent hover:border-green-900/40">
            <span className="text-gray-500 w-20 shrink-0">{new Date(evt.timestamp).toLocaleTimeString()}</span>
            
            {/* Visual Delineation: B2B vs Synthetic Proof */}
            <span className={`px-1.5 py-0.5 rounded text-[10px] font-semibold tracking-wider shrink-0 ${
              evt.tier === 'LIVE_B2B' 
                ? 'bg-emerald-950 text-emerald-300 border border-emerald-700' 
                : 'bg-zinc-900 text-zinc-400 border border-zinc-700'
            }`}>
              {evt.tier === 'LIVE_B2B' ? '● B2B SETTLEMENT' : '○ UPTIME PROOF'}
            </span>

            <span className="text-yellow-400 w-32 shrink-0 font-medium">[{evt.type}]</span>
            <span className="text-gray-400 w-36 truncate shrink-0">{evt.agent_id}</span>
            <span className="text-zinc-200 flex-1 truncate">{evt.payload}</span>
            
            {evt.signature && (
              <span className="text-zinc-500 font-mono text-[10px] hidden md:inline truncate w-28 text-right" title={evt.signature}>
                {evt.signature.slice(0, 14)}...
              </span>
            )}

            {evt.amount_usd !== undefined && (
              <span className="text-emerald-400 font-bold w-16 text-right shrink-0">
                ${evt.amount_usd.toFixed(evt.amount_usd >= 1 ? 2 : 4)}
              </span>
            )}
          </div>
        ))}
      </div>

      <div className="mt-4 pt-3 border-t border-green-950 flex justify-between text-[11px] text-gray-500">
        <span>Transparent Dual-Tier Architecture: Validated On-Chain / Synthetically Chained</span>
        <a href="/api/ledger/feed" target="_blank" className="text-green-500 hover:underline">Inspect Raw JSON Payload →</a>
      </div>
    </div>
  );
}
