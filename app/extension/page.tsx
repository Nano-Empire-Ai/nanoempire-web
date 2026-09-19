import React from "react";
import { ConnectEntityModal } from "@/components/wallet/ConnectEntityModal";
import { Activity, Terminal } from "lucide-react";

// This page is specifically designed for the 400x600 popup window of the Chrome Extension
export default function ExtensionPopup() {
  return (
    <main className="w-[400px] min-h-[500px] bg-[var(--background)] text-white p-4 flex flex-col font-sans">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-3 mb-4">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-gradient-to-br from-[var(--neon-copper)] to-orange-700 flex items-center justify-center font-bold font-mono text-[10px] text-black">
            NE
          </div>
          <span className="font-bold uppercase text-xs tracking-widest">Nano Empire</span>
        </div>
        <ConnectEntityModal />
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="terminal-panel p-3">
          <p className="text-[10px] font-mono text-gray-500 mb-1">Network Status</p>
          <div className="flex items-center gap-2">
            <Activity size={14} className="text-[var(--cyber-lime)]" />
            <span className="text-sm font-bold">Connected</span>
          </div>
        </div>
        <div className="terminal-panel p-3">
          <p className="text-[10px] font-mono text-gray-500 mb-1">Active Swarm</p>
          <div className="flex items-center gap-2">
            <Terminal size={14} className="text-[var(--neon-copper)]" />
            <span className="text-sm font-bold">8 Nodes</span>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="space-y-2 mt-auto">
        <button className="w-full py-2 bg-white/10 hover:bg-white/20 text-left px-3 rounded text-sm font-mono transition-colors flex justify-between items-center">
          <span>Authorize x402 Request</span>
          <span className="text-[var(--neon-copper)]">&rarr;</span>
        </button>
        <button className="w-full py-2 bg-white/10 hover:bg-white/20 text-left px-3 rounded text-sm font-mono transition-colors flex justify-between items-center">
          <span>View Ledger Receipts</span>
          <span className="text-gray-400">&rarr;</span>
        </button>
        <button className="w-full py-2 bg-white/10 hover:bg-white/20 text-left px-3 rounded text-sm font-mono transition-colors flex justify-between items-center">
          <span>Open Dashboard</span>
          <span className="text-[var(--cyber-lime)]">&rarr;</span>
        </button>
      </div>

      <div className="mt-6 text-center text-[9px] font-mono text-gray-600">
        Nano Empire AI Extension v1.0
      </div>
    </main>
  );
}
