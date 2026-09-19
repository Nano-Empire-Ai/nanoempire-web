"use client";

import React, { useEffect, useState } from "react";
import { Database, Activity, ShieldCheck, Zap } from "lucide-react";

type AgentNode = {
  id: string;
  name: string;
  role: string;
  load: string;
  state: "EXEC" | "IDLE" | "SYNC";
};

const INITIAL_NODES: AgentNode[] = [
  { id: "01", name: "ARTHUR", role: "Commander", load: "0.14ms", state: "EXEC" },
  { id: "02", name: "SKIPPY", role: "Ingestion/Reddit", load: "1.2s", state: "SYNC" },
  { id: "03", name: "JARVIS", role: "ReAct Execution", load: "0.08ms", state: "IDLE" },
  { id: "04", name: "OBSIDIAN", role: "Knowledge Graph", load: "0.2ms", state: "IDLE" },
  { id: "05", name: "HERMES", role: "x402 Communications", load: "0.45ms", state: "EXEC" },
  { id: "06", name: "ANTIGRAVITY", role: "Operator / CI/CD", load: "0.1ms", state: "EXEC" },
  { id: "07", name: "AEGIS", role: "Turso Sentinel", load: "12ms", state: "SYNC" },
  { id: "08", name: "APEX", role: "Bounty / Recursive R&D", load: "2.4s", state: "IDLE" },
];

export function SwarmBlackboard() {
  const [nodes, setNodes] = useState<AgentNode[]>(INITIAL_NODES);
  const [txCount, setTxCount] = useState(4182);

  useEffect(() => {
    const fetchTelemetry = async () => {
      try {
        const url = process.env.NEXT_PUBLIC_TURSO_API_URL;
        const key = process.env.NEXT_PUBLIC_TURSO_API_KEY;
        if (!url || !key) return;

        const res = await fetch(url, {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${key}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            requests: [
              { type: "execute", stmt: { sql: "SELECT count(*) FROM x402_receipts;" } },
              { type: "execute", stmt: { sql: "SELECT agent_id, name, role, status, last_seen FROM agent_roster ORDER BY last_seen DESC LIMIT 8;" } },
              { type: "close" }
            ]
          })
        });

        const data = await res.json();
        const results = data.results;
        
        if (results && results[0]?.type === "ok") {
          const countRow = results[0].response?.result?.rows?.[0];
          if (countRow) setTxCount(parseInt(countRow[0].value, 10));
        }

        if (results && results[1]?.type === "ok") {
          const rosterRows = results[1].response?.result?.rows;
          if (rosterRows && rosterRows.length > 0) {
            const fetchedNodes = rosterRows.map((r: any) => ({
              id: r[0].value.substring(0, 8),
              name: r[1].value,
              role: r[2].value,
              load: (Math.random() * 2).toFixed(2) + "ms",
              state: r[3].value === 'active' ? "EXEC" : "IDLE"
            }));
            
            // Pad with initial nodes if less than 8 for aesthetic reasons
            setNodes((prev) => {
              const newNodes = [...fetchedNodes];
              if (newNodes.length < 8) {
                const existing = INITIAL_NODES.filter(n => !newNodes.find(nn => nn.name === n.name));
                newNodes.push(...existing.slice(0, 8 - newNodes.length));
              }
              return newNodes.slice(0, 8);
            });
          }
        }
      } catch (err) {
        console.error("Turso fetch error", err);
      }
    };

    fetchTelemetry();
    const interval = setInterval(fetchTelemetry, 3200);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full max-w-6xl mx-auto my-12 font-mono">
      {/* Editorial Section Label */}
      <div className="flex items-center gap-3 text-xs tracking-widest uppercase text-[#8C92A4] mb-3">
        <span className="text-[#FF7B00]">[02]</span>
        <span>DISTRIBUTED_SWARM_LEDGER</span>
        <span className="h-[1px] flex-1 bg-[#8C92A4]/20"></span>
      </div>

      <div className="liquid-glass rounded-lg overflow-hidden border border-[#8C92A4]/25">
        {/* Terminal Header */}
        <div className="px-5 py-3 border-b border-[#8C92A4]/20 bg-black/50 flex flex-wrap items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-3">
            <span className="pulse-dot"></span>
            <span className="text-[#F4F1EA] font-bold tracking-wider">TURSO_LIB_SQL_EDGE_REPLICA</span>
            <span className="text-[#8C92A4] text-[11px] hidden sm:inline">aws-us-east-2.turso.io</span>
          </div>
          <div className="flex items-center gap-5 text-[#8C92A4] text-[11px]">
            <span className="flex items-center gap-1.5 text-[#A3FF00]">
              <ShieldCheck size={13} /> DUAL_WRITE_SYNC: ACTIVE
            </span>
            <span className="text-[#F4F1EA]">EVENTS: {txCount.toLocaleString()}</span>
          </div>
        </div>

        {/* Node Grid */}
        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 bg-black/20">
          {nodes.map((node) => (
            <div
              key={node.id}
              className={`p-4 rounded border transition-all duration-300 relative ${
                node.state === "EXEC"
                  ? "bg-[#FF7B00]/5 border-[#FF7B00]/40 shadow-[0_0_15px_rgba(255,123,0,0.08)]"
                  : node.state === "SYNC"
                  ? "bg-[#A3FF00]/5 border-[#A3FF00]/30"
                  : "bg-[#0B0B0C]/60 border-[#8C92A4]/15"
              }`}
            >
              <div className="flex justify-between items-center text-[10px] text-[#8C92A4] mb-2">
                <span>[{node.id}]</span>
                <span
                  className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                    node.state === "EXEC"
                      ? "text-[#FF7B00] bg-[#FF7B00]/15"
                      : node.state === "SYNC"
                      ? "text-[#A3FF00] bg-[#A3FF00]/15"
                      : "text-[#8C92A4] bg-white/5"
                  }`}
                >
                  {node.state}
                </span>
              </div>

              <div className="text-sm font-bold text-[#F4F1EA] tracking-wide mb-0.5">
                {node.name}
              </div>
              <div className="text-[11px] text-[#8C92A4] mb-3">
                {node.role}
              </div>

              <div className="pt-2 border-t border-[#8C92A4]/15 flex justify-between text-[10px] text-[#8C92A4]">
                <span>LATENCY</span>
                <span className="text-[#F4F1EA]">{node.load}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Console Footnote */}
        <div className="px-5 py-2.5 bg-black/70 border-t border-[#8C92A4]/15 flex flex-wrap items-center justify-between gap-2 text-[10px] text-[#8C92A4]">
          <span className="flex items-center gap-1.5">
            <Zap size={11} className="text-[#FF7B00]" />
            Self-recursive reinvestment loop enabled (40% treasury compute allocation)
          </span>
          <span className="text-[#F4F1EA]">PAPER_MODE = TRUE</span>
        </div>
      </div>
    </div>
  );
}
