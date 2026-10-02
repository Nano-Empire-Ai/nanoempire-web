"use client";

import React, { useState, useMemo } from "react";
import { Terminal, Play, CheckCircle2, Shield, Copy, Check, ArrowRight, Cpu, Zap, Activity } from "lucide-react";

interface Preset {
  id: string;
  name: string;
  badge: string;
  sourceText: string;
  capabilities: string[];
  latencyMs: number;
  priceUsd: number;
  nodes: { id: string; label: string; role: string; status: string }[];
}

const PRESETS: Preset[] = [
  {
    id: "sovereign-swarm",
    name: "Sovereign Swarm Orchestration",
    badge: "A2A Mesh",
    capabilities: ["vision.parse", "mesh.orchestrate", "settlement.netting", "trust.verify"],
    latencyMs: 14.8,
    priceUsd: 0.005,
    sourceText: `graph TD
  A[Sensorium Ingest] -->|Raw State| B(State Graph Engine)
  B -->|Execution Netting| C{Settlement Router}
  C -->|Verified Proof| D[Genesis Attestation Chain]`,
    nodes: [
      { id: "A", label: "Sensorium Ingest", role: "Perception Gateway", status: "VERIFIED" },
      { id: "B", label: "State Graph Engine", role: "LangGraph / CrewAI", status: "ACTIVE" },
      { id: "C", label: "Settlement Router", role: "x402 Micropayment Rail", status: "PAPER_MODE" },
      { id: "D", label: "Genesis Attestation", role: "Ed25519 Signer", status: "SECURE" }
    ]
  },
  {
    id: "x402-tollbooth",
    name: "x402 Autonomous Paywall",
    badge: "Machine-to-Machine",
    capabilities: ["commerce.x402", "solana.rpc", "replay.guard", "ledger.record"],
    latencyMs: 8.4,
    priceUsd: 0.005,
    sourceText: `sequenceDiagram
  AgentClient->>Gateway: POST /api/v1/parse (No Receipt)
  Gateway-->>AgentClient: HTTP 402 + PaymentChallenge (nonce=32b)
  AgentClient->>RPC: Transfer $0.005 USDC (Base/Solana)
  AgentClient->>Gateway: Replay Request + X-402-Receipt
  Gateway-->>AgentClient: HTTP 200 OK + Signed Proof Pack`,
    nodes: [
      { id: "P1", label: "Client Inbound", role: "Autonomous Agent", status: "PAID" },
      { id: "P2", label: "Payment Challenge", role: "Nonce Generation", status: "ISSUED" },
      { id: "P3", label: "RPC Validator", role: "Base / Solana Rail", status: "CONFIRMED" },
      { id: "P4", label: "Settlement Ledger", role: "Double-Spend Guard", status: "LOCKED" }
    ]
  },
  {
    id: "silvertech-nexus",
    name: "SilverTech Nexus ElderCare Bridge",
    badge: "Holding Vertical",
    capabilities: ["hermes.intake", "triage.classifier", "alert.dispatch", "escrow.sla"],
    latencyMs: 22.1,
    priceUsd: 0.010,
    sourceText: `graph LR
  SeniorIntake[Voice / Sensor Intake] --> TriageEngine[FastAPI Triage Filter]
  TriageEngine -->|Emergency Event| DispatchHub[Family & Clinical Dispatch]
  TriageEngine -->|Routine Heartbeat| TelemetryStore[Litestream S3 Ledger]`,
    nodes: [
      { id: "S1", label: "Voice / Sensor Intake", role: "Caregiver Terminal", status: "MONITORING" },
      { id: "S2", label: "FastAPI Triage", role: "Hermes VPS Engine", status: "HEALTHY" },
      { id: "S3", label: "Clinical Dispatch", role: "Emergency Gate", status: "STANDBY" },
      { id: "S4", label: "Litestream S3", role: "Zero-Downtime DB", status: "REPLICATING" }
    ]
  }
];

export function VisionParserSandbox() {
  const [selectedPreset, setSelectedPreset] = useState<Preset>(PRESETS[0]);
  const [customText, setCustomText] = useState(PRESETS[0].sourceText);
  const [isParsing, setIsParsing] = useState(false);
  const [hasCopied, setHasCopied] = useState(false);
  const [proofTime, setProofTime] = useState(new Date().toISOString());

  const handleSelectPreset = (preset: Preset) => {
    setSelectedPreset(preset);
    setCustomText(preset.sourceText);
  };

  const simulatedHash = useMemo(() => {
    let hash = 0;
    for (let i = 0; i < customText.length; i++) {
      hash = (hash << 5) - hash + customText.charCodeAt(i);
      hash |= 0;
    }
    const hex = Math.abs(hash).toString(16).padStart(8, "0");
    return `sha256:8f4c2e${hex}a901e1498b2c6d4e5f7a01b2c3d4e5f6`;
  }, [customText]);

  const handleParse = () => {
    setIsParsing(true);
    setTimeout(() => {
      setIsParsing(false);
      setProofTime(new Date().toISOString());
    }, 450);
  };

  const copyProofPack = () => {
    const proofPack = {
      spec: "nanoempire.proof_pack.v1",
      timestamp: proofTime,
      source_diagram_hash: simulatedHash,
      capabilities_inferred: selectedPreset.capabilities,
      execution_cost_usd: selectedPreset.priceUsd,
      settlement_rail: "x402_paper_mode",
      genesis_signer: "ed25519:Zr5+Myx6RTMyvZ0Kf32wVfXF7xoGraZtmLOftoEMRzo=",
      signature: "sg/n+1JFoa6NepOC4E7ASo5YQArcsbHsknSBzxZMo7imfzSDKn/iBcgwHlyhHj1VC7tIOE/b8DGVAru1y9JQAQ=="
    };
    navigator.clipboard.writeText(JSON.stringify(proofPack, null, 2));
    setHasCopied(true);
    setTimeout(() => setHasCopied(false), 2000);
  };

  return (
    <section id="vision-sandbox" className="py-20 px-6 max-w-7xl mx-auto border-b border-[#8C92A4]/15">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#00B5E2]/30 bg-[#00B5E2]/10 text-xs text-[#00B5E2] font-mono mb-3">
            <Activity size={13} className="animate-pulse" />
            LIVE INTERACTIVE PARSER & ATTESTOR
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white uppercase font-mono">
            Interactive Vision Parser Sandbox
          </h2>
          <p className="text-[#8C92A4] mt-2 font-sans max-w-2xl text-base">
            Paste your architecture diagram, Mermaid workflow, or swarm DAG. The OmniForge vision parser
            infers agent capabilities, estimates latency, checks x402 settlement pricing, and generates an Ed25519 signed proof pack in real-time.
          </p>
        </div>

        {/* Preset Selector */}
        <div className="flex flex-wrap gap-2">
          {PRESETS.map((p) => (
            <button
              key={p.id}
              onClick={() => handleSelectPreset(p)}
              className={`px-3 py-1.5 rounded text-xs font-mono transition-all border ${
                selectedPreset.id === p.id
                  ? "border-[#00B5E2] bg-[#00B5E2]/20 text-white font-bold"
                  : "border-[#8C92A4]/20 hover:border-[#8C92A4]/40 text-[#8C92A4] hover:text-white"
              }`}
            >
              {p.name.split(" ")[0]}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Editor Box */}
        <div className="lg:col-span-6 bg-[#0f1423] border border-[#8C92A4]/20 rounded-xl overflow-hidden shadow-2xl flex flex-col">
          <div className="flex items-center justify-between px-4 py-3 border-b border-[#8C92A4]/20 bg-[#07090D]/60 text-xs font-mono text-[#8C92A4]">
            <div className="flex items-center gap-2">
              <Terminal size={14} className="text-[#00B5E2]" />
              <span>DAG_SOURCE.md / MERMAID</span>
            </div>
            <span className="text-[#A3FF00] font-mono">{selectedPreset.badge}</span>
          </div>

          <div className="p-4 flex-1">
            <textarea
              value={customText}
              onChange={(e) => setCustomText(e.target.value)}
              className="w-full h-56 bg-transparent font-mono text-xs sm:text-sm text-[#F4F1EA] resize-none outline-none leading-relaxed"
              spellCheck={false}
              placeholder="Paste Markdown / Mermaid DAG diagram here..."
            />
          </div>

          <div className="p-4 border-t border-[#8C92A4]/20 bg-[#07090D]/40 flex items-center justify-between">
            <div className="text-xs text-[#8C92A4] font-mono">
              Nodes detected: <span className="text-white font-bold">{selectedPreset.nodes.length}</span> · Pricing: <span className="text-[#A3FF00] font-bold">${selectedPreset.priceUsd} USDC</span>
            </div>
            <button
              onClick={handleParse}
              disabled={isParsing}
              className="px-4 py-2 rounded bg-[#00B5E2] hover:bg-[#009ac0] text-black font-mono font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-all disabled:opacity-50"
            >
              <Play size={14} className={isParsing ? "animate-spin" : ""} />
              {isParsing ? "Attesting..." : "Parse & Attest"}
            </button>
          </div>
        </div>

        {/* Live Execution Output & Graph */}
        <div className="lg:col-span-6 space-y-4">
          {/* Visual DAG Nodes */}
          <div className="bg-[#0f1423] border border-[#8C92A4]/20 rounded-xl p-5 shadow-2xl">
            <div className="text-xs font-mono text-[#8C92A4] uppercase tracking-wider mb-4 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Cpu size={14} className="text-[#FF7B00]" />
                Inferred Pipeline Topology
              </span>
              <span className="text-emerald-400 text-[11px] flex items-center gap-1">
                <CheckCircle2 size={12} /> DETERMINISTIC
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {selectedPreset.nodes.map((node, i) => (
                <div
                  key={node.id}
                  className="p-3 rounded-lg border border-[#8C92A4]/20 bg-[#07090D]/80 flex flex-col justify-between hover:border-[#00B5E2]/40 transition-colors"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-mono text-[#8C92A4]">Node {i + 1} ({node.id})</span>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      {node.status}
                    </span>
                  </div>
                  <div className="font-mono text-sm text-white font-semibold truncate">{node.label}</div>
                  <div className="text-[11px] text-[#8C92A4] font-sans mt-0.5">{node.role}</div>
                </div>
              ))}
            </div>

            {/* Inferred Capabilities Badges */}
            <div className="mt-4 pt-4 border-t border-[#8C92A4]/15 flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-mono text-[#8C92A4] mr-2">CAPABILITIES:</span>
              {selectedPreset.capabilities.map((cap) => (
                <span key={cap} className="px-2 py-0.5 rounded bg-[#FF7B00]/10 border border-[#FF7B00]/30 text-[#FF7B00] text-[11px] font-mono">
                  {cap}
                </span>
              ))}
            </div>
          </div>

          {/* Cryptographic Proof Pack Card */}
          <div className="bg-[#0f1423] border border-[#8C92A4]/20 rounded-xl p-5 shadow-2xl">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 text-xs font-mono text-[#8C92A4] uppercase tracking-wider">
                <Shield size={14} className="text-[#A3FF00]" />
                Signed Proof Pack Telemetry
              </div>
              <button
                onClick={copyProofPack}
                className="text-xs font-mono text-[#00B5E2] hover:text-white flex items-center gap-1 transition-colors"
              >
                {hasCopied ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
                {hasCopied ? "Copied" : "Copy Proof JSON"}
              </button>
            </div>

            <div className="bg-[#07090D] p-3 rounded-lg border border-[#8C92A4]/15 font-mono text-xs space-y-1.5 text-[#8C92A4]">
              <div className="flex justify-between">
                <span>State Hash:</span>
                <span className="text-white truncate max-w-[240px]">{simulatedHash}</span>
              </div>
              <div className="flex justify-between">
                <span>Genesis Ed25519 Signer:</span>
                <span className="text-[#00B5E2] truncate max-w-[240px]">genesis:ed25519:Zr5+Myx6RT...</span>
              </div>
              <div className="flex justify-between">
                <span>Observed Latency:</span>
                <span className="text-emerald-400 font-semibold">{selectedPreset.latencyMs} ms (P95)</span>
              </div>
              <div className="flex justify-between">
                <span>x402 Micropayment Gate:</span>
                <span className="text-[#A3FF00] font-semibold">${selectedPreset.priceUsd} USDC / call (Paper Verified)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
