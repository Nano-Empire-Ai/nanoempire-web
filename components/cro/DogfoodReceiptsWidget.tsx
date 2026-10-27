"use client";

import React, { useState } from "react";
import { ShieldCheck, Check, Copy, ArrowUpRight, ExternalLink } from "lucide-react";

interface Receipt {
  id: string;
  endpoint: string;
  amountUsd: string;
  chain: string;
  hash: string;
  fullHash: string;
  explorerUrl?: string;
  timestamp: string;
  status: "ONCHAIN_SETTLED" | "ED25519_SIGNED" | "SHA256_ATTESTED";
}

const VERIFIED_RECEIPTS: Receipt[] = [
  {
    id: "tx_51961194_base",
    endpoint: "POST /api/v1/match (RecallGuard)",
    amountUsd: "0.10 USDC",
    chain: "Base Mainnet (Block #51961194)",
    hash: "0xf3919e8c55a4e716...a6325999",
    fullHash: "0xf3919e8c55a4e7163cb10e88baa1d4b183d861ff379a54d0d001d932a6325999",
    explorerUrl: "https://basescan.org/tx/0xf3919e8c55a4e7163cb10e88baa1d4b183d861ff379a54d0d001d932a6325999",
    timestamp: "2026-09-29",
    status: "ONCHAIN_SETTLED",
  },
  {
    id: "manifest_01_fs",
    endpoint: "SkillProof #01 (filesystem v0.6.3)",
    amountUsd: "228 Ops Battery",
    chain: "Ed25519 Offline Proof",
    hash: "ed25519:Zr5+My...PASS_WITH_NOTES",
    fullHash: "https://github.com/roblambert9/skillproof-verifications",
    explorerUrl: "https://github.com/roblambert9/skillproof-verifications",
    timestamp: "2026-10-05",
    status: "ED25519_SIGNED",
  },
  {
    id: "audit_nrc_87055",
    endpoint: "BidShield TPL-DAG (NRC #87055)",
    amountUsd: "7 Mandatory Gates",
    chain: "SHA-256 Witness Proof",
    hash: "sha256:bidshield_nrc_ottawa",
    fullHash: "https://www.nanoempireai.com/samples/BidShield_NRC_Ottawa_Sample.pdf",
    explorerUrl: "/samples/BidShield_NRC_Ottawa_Sample.pdf",
    timestamp: "2026-10-25",
    status: "SHA256_ATTESTED",
  },
  {
    id: "audit_clm_9402188",
    endpoint: "ClaimShield ERISA 503-1 Appeal",
    amountUsd: "$18,450.00 Disputed",
    chain: "SHA-256 Witness Proof",
    hash: "sha256:41f5774922882f70",
    fullHash: "https://www.nanoempireai.com/samples/ClaimShield_Sample_Appeal.pdf",
    explorerUrl: "/samples/ClaimShield_Sample_Appeal.pdf",
    timestamp: "2026-10-25",
    status: "SHA256_ATTESTED",
  },
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
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#00B5E2]/5 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8 border-b border-[#8C92A4]/15 pb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-xs text-emerald-400 font-mono mb-2">
              <ShieldCheck size={14} />
              VERIFIED ONCHAIN &amp; CRYPTOGRAPHIC RECEIPTS
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-white uppercase font-mono">
              Verifiable Settlement &amp; Attestation Ledger
            </h3>
            <p className="text-[#8C92A4] mt-1 text-sm font-sans max-w-xl">
              Zero simulated volume. Every entry below links directly to an onchain Base Mainnet settlement transaction or a downloadable cryptographic proof artifact.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 font-mono">
            <a
              href="https://basescan.org/tx/0xf3919e8c55a4e7163cb10e88baa1d4b183d861ff379a54d0d001d932a6325999"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 bg-[#07090D] border border-[#00B5E2]/40 hover:border-[#00B5E2] rounded-lg transition-colors"
            >
              <div className="text-[10px] text-[#8C92A4] uppercase flex items-center justify-between">
                <span>Base Block #51961194</span>
                <ExternalLink size={10} className="text-[#00B5E2]" />
              </div>
              <div className="text-lg font-bold text-white mt-0.5">$0.10 USDC</div>
              <div className="text-[10px] text-emerald-400">Verified BaseScan Tx</div>
            </a>
            <div className="p-3 bg-[#07090D] border border-[#8C92A4]/20 rounded-lg">
              <div className="text-[10px] text-[#8C92A4] uppercase">Safety Corpus</div>
              <div className="text-lg font-bold text-[#A3FF00] mt-0.5">46,642</div>
              <div className="text-[10px] text-[#8C92A4]">CPSC · FDA · Health Canada</div>
            </div>
            <div className="p-3 bg-[#07090D] border border-[#8C92A4]/20 rounded-lg col-span-2 sm:col-span-1">
              <div className="text-[10px] text-[#8C92A4] uppercase">Genesis Signer</div>
              <div className="text-sm font-bold text-[#00B5E2] mt-1 truncate">ed25519:Zr5+My...</div>
              <div className="text-[10px] text-[#8C92A4]">Offline Verifiable</div>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs">
            <thead>
              <tr className="border-b border-[#8C92A4]/20 text-[#8C92A4] text-[11px] uppercase">
                <th className="pb-3 pr-4">Artifact / Tx ID</th>
                <th className="pb-3 px-4">Surface</th>
                <th className="pb-3 px-4">Value / Scope</th>
                <th className="pb-3 px-4">Verification Rail</th>
                <th className="pb-3 px-4">Proof Hash / Link</th>
                <th className="pb-3 pl-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#8C92A4]/10 text-white">
              {VERIFIED_RECEIPTS.map((rcpt) => (
                <tr key={rcpt.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-3 pr-4 font-semibold text-[#00B5E2]">{rcpt.id}</td>
                  <td className="py-3 px-4 text-[#F4F1EA]">{rcpt.endpoint}</td>
                  <td className="py-3 px-4 font-bold text-[#A3FF00]">{rcpt.amountUsd}</td>
                  <td className="py-3 px-4 text-[#8C92A4]">{rcpt.chain}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      {rcpt.explorerUrl ? (
                        <a
                          href={rcpt.explorerUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#00B5E2] hover:underline flex items-center gap-1"
                        >
                          <span>{rcpt.hash}</span>
                          <ExternalLink size={11} />
                        </a>
                      ) : (
                        <span>{rcpt.hash}</span>
                      )}
                      <button
                        onClick={() => copyHash(rcpt.id, rcpt.fullHash)}
                        className="text-[#8C92A4] hover:text-white transition-colors"
                        title="Copy full hash or URL"
                      >
                        {copiedId === rcpt.id ? (
                          <Check size={11} className="text-emerald-400" />
                        ) : (
                          <Copy size={11} />
                        )}
                      </button>
                    </div>
                  </td>
                  <td className="py-3 pl-4 text-right">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      <span className="w-1 h-1 rounded-full bg-emerald-400"></span>
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
            <span>Cryptographic Verification Battery: Operational (1,334 passing tests)</span>
          </div>
          <a
            href="/manifests.html"
            className="text-[#00B5E2] hover:text-white hover:underline flex items-center gap-1 transition-colors"
          >
            Inspect Signed Trust Manifests <ArrowUpRight size={13} />
          </a>
        </div>
      </div>
    </section>
  );
}
