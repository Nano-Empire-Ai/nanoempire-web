"use client";

import React, { useEffect, useState } from 'react';

type Transaction = {
  tx_id: string;
  agent_id: string;
  tool: string;
  price_usd: number;
  timestamp: number;
  hmac_signature: string;
  status: string;
  rail: string;
};

export default function TransparentYieldLedger() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [kFactor, setKFactor] = useState<number>(0);

  useEffect(() => {
    async function fetchLedger() {
      const res = await fetch('/api/ledger');
      const data = await res.json();
      setTransactions(data.recent_transactions);
      setKFactor(data.k_factor);
    }
    
    fetchLedger();
    const interval = setInterval(fetchLedger, 15000); // refresh every 15s
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-black text-green-400 p-8 font-mono">
      <div className="max-w-6xl mx-auto">
        <header className="mb-12 border-b border-green-800 pb-6">
          <h1 className="text-4xl font-bold mb-2 text-white">NanoEmpire Protocol</h1>
          <h2 className="text-2xl text-green-500">Transparent Yield Ledger (Live)</h2>
          <div className="flex gap-8 mt-6">
            <div className="bg-gray-900 p-4 rounded border border-gray-800">
              <div className="text-xs text-gray-500 uppercase tracking-widest">Network Status</div>
              <div className="text-xl text-green-400 flex items-center">
                <span className="w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse"></span>
                Active
              </div>
            </div>
            <div className="bg-gray-900 p-4 rounded border border-gray-800">
              <div className="text-xs text-gray-500 uppercase tracking-widest">Viral K-Factor</div>
              <div className="text-xl text-white">{kFactor.toFixed(2)}</div>
            </div>
            <div className="bg-gray-900 p-4 rounded border border-gray-800">
              <div className="text-xs text-gray-500 uppercase tracking-widest">Settlement Rails</div>
              <div className="text-xl text-white">x402 / Stripe</div>
            </div>
          </div>
        </header>

        <main>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-800 text-gray-500 text-sm">
                  <th className="py-3 px-4 uppercase font-normal tracking-wider">Timestamp</th>
                  <th className="py-3 px-4 uppercase font-normal tracking-wider">Agent Node ID</th>
                  <th className="py-3 px-4 uppercase font-normal tracking-wider">Executed Primitive</th>
                  <th className="py-3 px-4 uppercase font-normal tracking-wider">Rail</th>
                  <th className="py-3 px-4 uppercase font-normal tracking-wider text-right">Yield (USD)</th>
                  <th className="py-3 px-4 uppercase font-normal tracking-wider text-right">HMAC Signature</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((tx) => (
                  <tr key={tx.tx_id} className="border-b border-gray-900 hover:bg-gray-900/50 transition-colors">
                    <td className="py-4 px-4 text-gray-400">
                      {new Date(tx.timestamp).toLocaleTimeString()}
                    </td>
                    <td className="py-4 px-4 text-gray-300">
                      {tx.agent_id}
                    </td>
                    <td className="py-4 px-4 text-white">
                      {tx.tool}
                    </td>
                    <td className="py-4 px-4">
                      <span className={`px-2 py-1 text-xs rounded-full ${tx.rail === 'x402' ? 'bg-blue-900/50 text-blue-400 border border-blue-800' : 'bg-purple-900/50 text-purple-400 border border-purple-800'}`}>
                        {tx.rail.toUpperCase()}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right text-green-400 font-bold">
                      ${tx.price_usd.toFixed(3)}
                    </td>
                    <td className="py-4 px-4 text-right">
                      <span className="font-mono text-xs text-gray-600 bg-black px-2 py-1 rounded border border-gray-800" title={tx.hmac_signature}>
                        {tx.hmac_signature.substring(0, 16)}...
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </div>
  );
}
