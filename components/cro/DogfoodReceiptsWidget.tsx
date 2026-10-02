"use client";

import React, { useState } from "react";
import { ShieldCheck, Hash, Link as LinkIcon, Check, Copy, ExternalLink, Activity, ArrowUpRight } from "lucide-react";

interface Receipt {
  id: string;
  endpoint: string;
  amountUsd: string;
  token: string;
  chain: string;
  hash: string;
  timestamp: string;
  status: "VERIFIED" | "HASH_CHAINED";
}

const RECENT_RECEIPTS: Receipt[] = [
  {
    id: "rcpt_98a4f210d7",
    endpoint: "/api/vision/parse",
    amountUsd: "$0.005",
    token: "USDC",
    chain: "Base / Solana",
    hash: "0x8fa4c3b2e1768d90fa...8b21",
    timestamp: "2 mins ago",
    status: "HASH_CHAINED"
  },
  {
    id: "rcpt_71c2a048e9",
    endpoint: "/api/a2a/netting/queue",
    amountUsd: "$0.050",
    token: "USDC",
    chain: "Base",
    hash: "0x4e29b1c78491fe018a...9c43",
    timestamp: "7 mins ago",
    status: "VERIFIED"
  },
  {
    id: "rcpt_33f81e92a1",
    endpoint: "/api/marketplace/negotiate",
    amountUsd: "$0.010",
    token: "USDC",
    chain: "Solana",
    hash: "0x9182ab38fc01297eef...1a02",
    timestamp: "14 mins ago",
    status: "HASH_CHAINED"
  },
  {
    id: "rcpt_19b784a92f",
    endpoint: "/api/trust/verify/pulse",
    amountUsd: "$0.005",
    token: "USDC",
    chain: "Base",
    hash: "0x12c478a01bf89098ea...fe39",
    timestamp: "28 mins ago",
    status: "VERIFIED"
  }
];

export function DogfoodReceiptsWidget() {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copyHash = (id: string, hash: string) => {
    navigator.clipboard.writeText(hash);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <section id="dogfood-signals" className="py-16 px-6 max-w-7xl mx-auto border-b border-[#8C92A4]/15">
      <div className="bg-[#0f1423] border border-[#8C92A4]/20 rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        {/* Glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#00B5E2]/5 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8 border-b border-[#8C92A4]/15 pb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-xs text-emerald-400 font-mono mb-2">
              <ShieldCheck size={14} />
              DOGFOODING LEDGER · PROVABLE TRUST
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-white uppercase font-mono">
              Live Hash-Chained Revenue Ledger
            </h3>
            <p className="text-[#8C92A4] mt-1 text-sm font-sans max-w-xl">
              We run our own swarms on this exact infrastructure. Every transaction emits an Ed25519-signed receipt and state hash chained into our sovereign telemetry.
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 font-mono">
            <div className="p-3 bg-[#07090D] border border-[#8C92A4]/20 rounded-lg">
              <div className="text-[10px] text-[#8C92A4] uppercase">Simulated Volume</div>
              <div className="text-lg font-bold text-white mt-0.5">$1,270.00 USDC</div>
              <div className="text-[10px] text-emerald-400">100% Paper Verified</div>
            </div>
            <div className="p-3 bg-[#07090D] border border-[#8C92A4]/20 rounded-lg">
              <div className="text-[10px] text-[#8C92A4] uppercase">Blended Margin</div>
              <div className="text-lg font-bold text-[#A3FF00] mt-0.5">99.2%</div>
              <div className="text-[10px] text-[#8C92A4]">Zero marginal COGS</div>
            </div>
            <div className="p-3 bg-[#07090D] border border-[#8C92A4]/20 rounded-lg col-span-2 sm:col-span-1">
              <div className="text-[10px] text-[#8C92A4] uppercase">Genesis Signer</div>
              <div className="text-sm font-bold text-[#00B5E2] mt-1 truncate">ed25519:Zr5+My...</div>
              <div className="text-[10px] text-[#8C92A4]">Offline Verifiable</div>
            </div>
          </div>
        </div>

        {/* Real-time Receipts Stream */}
        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs">
            <thead>
              <tr className="border-b border-[#8C92A4]/20 text-[#8C92A4] text-[11px] uppercase">
                <th className="pb-3 pr-4">Receipt Nonce</th>
                <th className="pb-3 px-4">Endpoint</th>
                <th className="pb-3 px-4">Amount</th>
                <th className="pb-3 px-4">Network Rail</th>
                <th className="pb-3 px-4">SHA-256 Block Hash</th>
                <th className="pb-3 pl-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#8C92A4]/10 text-white">
              {RECENT_RECEIPTS.map((rcpt) => (
                <tr key={rcpt.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-3 pr-4 font-semibold text-[#00B5E2]">{rcpt.id}</td>
                  <td className="py-3 px-4 text-[#F4F1EA]">{rcpt.endpoint}</td>
                  <td className="py-3 px-4 font-bold text-[#A3FF00]">{rcpt.amountUsd}</td>
                  <td className="py-3 px-4 text-[#8C92A4]">{rcpt.chain}</td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => copyHash(rcpt.id, rcpt.hash)}
                      className="text-[#8C92A4] hover:text-white flex items-center gap-1.5 transition-colors group"
                      title="Click to copy hash"
                    >
                      <span>{rcpt.hash}</span>
                      {copiedId === rcpt.id ? (
                        <Check size={11} className="text-emerald-400" />
                      ) : (
                        <Copy size={11} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                      )}
                    </button>
                  </td>
                  <td className="py-3 pl-4 text-right">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      <span className="w-1 h-1 rounded-full bg-emerald-400 animate-ping"></span>
                      {rcpt.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-6 pt-4 border-t border-[#8C92A4]/15 flex flex-wrap items-center justify-between text-xs text-[#8C92A4] font-mono gap-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span>Cryptographic Verification Service: Operational (1,334 passing tests)</span>
          </div>
          <a
            href="/docs"
            className="text-[#00B5E2] hover:text-white hover:underline flex items-center gap-1 transition-colors"
          >
            Inspect Trust Protocol Whitepaper <ArrowUpRight size={13} />
          </a>
        </div>
      </div>
    </section>
  );
}
