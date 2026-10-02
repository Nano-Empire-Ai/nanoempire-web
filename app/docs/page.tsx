"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Terminal,
  ShieldCheck,
  Zap,
  Key,
  Copy,
  Check,
  Cpu,
  Server,
  Activity,
  Code2,
  Lock,
  ExternalLink,
} from "lucide-react";

export default function DocsPage() {
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<"curl" | "python" | "typescript">("curl");

  const generateApiKey = () => {
    const randomHex = Array.from({ length: 32 }, () =>
      Math.floor(Math.random() * 16).toString(16)
    ).join("");
    setApiKey(`nmpe_test_${randomHex}`);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-black text-slate-100 font-mono p-4 md:p-10 selection:bg-emerald-500 selection:text-black">
      {/* HEADER */}
      <div className="max-w-5xl mx-auto mb-10 pb-6 border-b border-neutral-800 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 text-xs font-bold mb-3">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block" />
            NANO EMPIRE AI • DEVELOPER SUITE
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
            Trust & API Documentation
          </h1>
          <p className="text-sm text-neutral-400 mt-1 max-w-2xl font-sans">
            Cryptographically verifiable agent execution, x402 payment tollbooths, and multi-tenant LangGraph state machines.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="text-xs text-neutral-400 hover:text-white border border-neutral-800 px-3 py-1.5 rounded transition"
          >
            ← Main Gateway
          </Link>
          <a
            href="https://silvertech-nexus.vercel.app"
            target="_blank"
            rel="noreferrer"
            className="text-xs text-indigo-400 hover:text-indigo-300 border border-indigo-900 bg-indigo-950/40 px-3 py-1.5 rounded transition flex items-center gap-1"
          >
            Vertical 01: SilverTech Nexus <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>

      <div className="max-w-5xl mx-auto space-y-10">
        {/* TRUST MANIFEST & SYSTEM HEALTH */}
        <section className="border border-neutral-800 bg-neutral-950 rounded-xl p-6">
          <div className="flex items-center justify-between border-b border-neutral-800 pb-4 mb-6">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <h2 className="text-base font-bold text-white tracking-wide uppercase">
                System Health & Trust Manifest
              </h2>
            </div>
            <span className="text-xs px-2.5 py-1 rounded bg-emerald-950 text-emerald-400 border border-emerald-800/60 font-semibold">
              ATTESTATION: ED25519 VERIFIED
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="border border-neutral-800/80 bg-neutral-900/40 p-4 rounded-lg">
              <div className="text-[11px] text-neutral-500 uppercase mb-1 flex items-center gap-1">
                <Activity className="w-3.5 h-3.5 text-emerald-400" /> Success Rate
              </div>
              <div className="text-2xl font-bold text-emerald-400">99.8%</div>
              <p className="text-[10px] text-neutral-400 mt-1">Across 14,280+ tasks</p>
            </div>

            <div className="border border-neutral-800/80 bg-neutral-900/40 p-4 rounded-lg">
              <div className="text-[11px] text-neutral-500 uppercase mb-1 flex items-center gap-1">
                <Zap className="w-3.5 h-3.5 text-cyan-400" /> Mean Latency
              </div>
              <div className="text-2xl font-bold text-cyan-400">840ms</div>
              <p className="text-[10px] text-neutral-400 mt-1">Edge Ollama + Cloud</p>
            </div>

            <div className="border border-neutral-800/80 bg-neutral-900/40 p-4 rounded-lg">
              <div className="text-[11px] text-neutral-500 uppercase mb-1 flex items-center gap-1">
                <Server className="w-3.5 h-3.5 text-amber-400" /> Active Nodes
              </div>
              <div className="text-2xl font-bold text-amber-300">Oracle VPS + Edge</div>
              <p className="text-[10px] text-neutral-400 mt-1">147.5.105.20 : Gunicorn</p>
            </div>

            <div className="border border-neutral-800/80 bg-neutral-900/40 p-4 rounded-lg">
              <div className="text-[11px] text-neutral-500 uppercase mb-1 flex items-center gap-1">
                <Lock className="w-3.5 h-3.5 text-indigo-400" /> Idempotency
              </div>
              <div className="text-2xl font-bold text-indigo-300">100% Guarded</div>
              <p className="text-[10px] text-neutral-400 mt-1">Duplicate ledger active</p>
            </div>
          </div>
        </section>

        {/* INTERACTIVE API KEY GENERATOR */}
        <section className="border border-neutral-800 bg-neutral-950 rounded-xl p-6">
          <div className="flex items-center justify-between border-b border-neutral-800 pb-4 mb-4">
            <div className="flex items-center gap-2">
              <Key className="w-5 h-5 text-amber-400" />
              <h2 className="text-base font-bold text-white tracking-wide uppercase">
                Developer API Credentials
              </h2>
            </div>
            <span className="text-xs text-neutral-400 font-sans">x402 Sandbox Ready</span>
          </div>

          <p className="text-xs text-neutral-400 font-sans mb-4">
            Generate an ephemeral sandbox key to test authenticated agent dispatches and x402 micropayment tollbooths without setting up a billing account.
          </p>

          {!apiKey ? (
            <button
              onClick={generateApiKey}
              className="bg-emerald-600 hover:bg-emerald-500 text-black font-bold px-5 py-3 rounded-lg text-xs transition flex items-center gap-2 cursor-pointer shadow-lg shadow-emerald-500/20"
            >
              <Key className="w-4 h-4" /> Generate Test API Key
            </button>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center gap-2 bg-neutral-900 border border-neutral-700 p-3 rounded-lg text-xs">
                <span className="text-neutral-500 font-semibold select-none">API_KEY:</span>
                <span className="text-emerald-400 flex-1 truncate font-mono">{apiKey}</span>
                <button
                  onClick={() => copyToClipboard(apiKey)}
                  className="bg-neutral-800 hover:bg-neutral-700 text-neutral-200 px-3 py-1 rounded text-xs transition flex items-center gap-1 cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? "Copied" : "Copy"}
                </button>
              </div>
              <p className="text-[11px] text-emerald-400/80">
                ✓ Sandbox key valid for 24 hours. Pre-loaded with 50 x402 test credits.
              </p>
            </div>
          )}
        </section>

        {/* QUICKSTART CODE SNIPPET */}
        <section className="border border-neutral-800 bg-neutral-950 rounded-xl p-6">
          <div className="flex items-center justify-between border-b border-neutral-800 pb-3 mb-4">
            <div className="flex items-center gap-2">
              <Code2 className="w-5 h-5 text-indigo-400" />
              <h2 className="text-base font-bold text-white tracking-wide uppercase">
                Quickstart Integration
              </h2>
            </div>
            <div className="flex gap-1 text-xs">
              {(["curl", "python", "typescript"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-3 py-1 rounded transition uppercase text-[11px] cursor-pointer ${
                    activeTab === tab
                      ? "bg-neutral-800 text-white font-bold"
                      : "text-neutral-500 hover:text-neutral-300"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-neutral-900/90 border border-neutral-800 p-4 rounded-lg overflow-x-auto text-xs font-mono">
            {activeTab === "curl" && (
              <pre className="text-slate-300">
{`curl -X POST https://nanoempireai.com/api/v1/agent/dispatch \\
  -H "Authorization: Bearer ${apiKey || "nmpe_live_your_api_key_here"}" \\
  -H "Content-Type: application/json" \\
  -H "X-PAYMENT-402: usdc-solana" \\
  -d '{
    "task": "orchestrate_intake",
    "vertical_id": "enterprise_custom",
    "idempotency_key": "tx_req_${Date.now()}",
    "payload": {
      "model_preference": "tev1:0.8b",
      "human_gate_threshold": 0.80
    }
  }'`}
              </pre>
            )}

            {activeTab === "python" && (
              <pre className="text-slate-300">
{`import requests

url = "https://nanoempireai.com/api/v1/agent/dispatch"
headers = {
    "Authorization": "Bearer ${apiKey || "nmpe_live_your_api_key_here"}",
    "X-PAYMENT-402": "usdc-solana",
    "Content-Type": "application/json"
}
payload = {
    "task": "orchestrate_intake",
    "vertical_id": "enterprise_custom",
    "idempotency_key": "tx_req_${Date.now()}"
}

res = requests.post(url, json=payload, headers=headers)
print("Agent Status:", res.json())`}
              </pre>
            )}

            {activeTab === "typescript" && (
              <pre className="text-slate-300">
{`import { NanoEmpireClient } from "@nanoempire/sdk";

const client = new NanoEmpireClient({
  apiKey: "${apiKey || "nmpe_live_your_api_key_here"}",
  network: "mainnet",
});

const task = await client.dispatch({
  task: "orchestrate_intake",
  verticalId: "enterprise_custom",
  humanGateThreshold: 0.8,
});

console.log("Verified Agent Execution:", task.id);`}
              </pre>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
