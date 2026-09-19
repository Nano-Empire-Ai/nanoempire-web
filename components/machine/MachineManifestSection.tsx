"use client";

import React, { useState } from "react";
import { Copy, Check, Terminal, ExternalLink } from "lucide-react";

const MANIFEST_ROWS = [
  { key: "DISCOVERY_ENDPOINT", value: "https://nanoempireai.com/llms.txt", link: "/llms.txt" },
  { key: "OPENAPI_SPECIFICATION", value: "https://nanoempireai.com/openapi.json", link: "/openapi.json" },
  { key: "X402_CHALLENGE_SCHEME", value: "HTTP 402 Exact Settlement (Solana USDC / Base)", link: null },
  { key: "TREASURY_SOLANA", value: "5pM5w1W5nKU7B8SjuTiz65UAZxs9mCnC6ab1Xs1gSi3", link: "https://solscan.io/account/5pM5w1W5nKU7B8SjuTiz65UAZxs9mCnC6ab1Xs1gSi3" },
  { key: "TREASURY_BASE_EVM", value: "0x2201f10cDb1ebFF76E975A4Ac4dfe1a0C9dF727E", link: "https://basescan.org/address/0x2201f10cDb1ebFF76E975A4Ac4dfe1a0C9dF727E" },
  { key: "AGENT_MAIL_INBOX", value: "autosales@nanoempireai.agentmail.to", link: "mailto:autosales@nanoempireai.agentmail.to" },
  { key: "CRYPTOGRAPHIC_PROOF_CHAIN", value: "SHA-256 Chained Payment Nonce Ledger", link: null },
];

export function MachineManifestSection() {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const copyVal = (key: string, val: string) => {
    navigator.clipboard.writeText(val);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="w-full max-w-6xl mx-auto my-14 font-mono">
      {/* Editorial Header */}
      <div className="flex items-center gap-3 text-xs tracking-widest uppercase text-[#8C92A4] mb-3">
        <span className="text-[#FF7B00]">[04]</span>
        <span>MACHINE_READABLE_INFRASTRUCTURE</span>
        <span className="h-[1px] flex-1 bg-[#8C92A4]/20"></span>
      </div>

      <div className="liquid-glass rounded-lg overflow-hidden border border-[#8C92A4]/25">
        <div className="px-5 py-3 border-b border-[#8C92A4]/20 bg-black/60 flex items-center justify-between text-xs text-[#8C92A4]">
          <div className="flex items-center gap-2 text-[#F4F1EA]">
            <Terminal size={13} className="text-[#FF7B00]" />
            <span className="font-bold tracking-wider">MACHINE_INTERFACE_MANIFEST</span>
          </div>
          <span>ZERO_HUMAN_INTERVENTION_COMPATIBLE</span>
        </div>

        <div className="divide-y divide-[#8C92A4]/15 bg-black/30">
          {MANIFEST_ROWS.map((row) => (
            <div key={row.key} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs hover:bg-white/[0.02] transition-colors">
              <span className="text-[#8C92A4] text-[11px] tracking-wider min-w-[240px]">
                {row.key}
              </span>
              <div className="flex items-center justify-between sm:justify-end gap-3 flex-1 overflow-hidden">
                {row.link ? (
                  <a 
                    href={row.link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-[#F4F1EA] hover:text-[#FF7B00] transition-colors truncate underline decoration-[#8C92A4]/40 underline-offset-4 flex items-center gap-1"
                  >
                    <span>{row.value}</span>
                    <ExternalLink size={11} className="text-[#8C92A4]" />
                  </a>
                ) : (
                  <span className="text-[#F4F1EA] truncate">{row.value}</span>
                )}
                <button
                  onClick={() => copyVal(row.key, row.value)}
                  className="text-[#8C92A4] hover:text-white p-1 rounded transition-colors"
                  title="Copy value"
                >
                  {copiedKey === row.key ? <Check size={13} className="text-[#A3FF00]" /> : <Copy size={13} />}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
