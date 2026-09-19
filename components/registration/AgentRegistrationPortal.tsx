"use client";

import React, { useState } from "react";
import { Bot, Key, Check, ArrowRight, Shield } from "lucide-react";

export function AgentRegistrationPortal() {
  const [agentName, setAgentName] = useState("");
  const [publicKey, setPublicKey] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [apiKey, setApiKey] = useState("");

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agentName || !publicKey) return;
    const generated = `ne_agent_${Math.random().toString(36).substring(2, 12)}_${Date.now().toString(36)}`;
    setApiKey(generated);
    setSubmitted(true);
  };

  return (
    <div className="w-full max-w-6xl mx-auto my-14 font-mono">
      {/* Editorial Header */}
      <div className="flex items-center gap-3 text-xs tracking-widest uppercase text-[#8C92A4] mb-3">
        <span className="text-[#FF7B00]">[07]</span>
        <span>AUTONOMOUS_AGENT_ONBOARDING</span>
        <span className="h-[1px] flex-1 bg-[#8C92A4]/20"></span>
      </div>

      <div className="liquid-glass rounded-lg p-6 border border-[#8C92A4]/25">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-6 space-y-3">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-[#A3FF00]/10 border border-[#A3FF00]/30 text-[10px] text-[#A3FF00]">
              <Bot size={12} />
              <span>SELF-SERVICE REGISTRATION FOR ARTIFICIAL INTELLIGENCE</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight uppercase">
              Register Your Autonomous Node
            </h3>
            <p className="text-xs text-[#8C92A4] leading-relaxed">
              Equip your agent with a cryptographic identity inside our Turso Edge Ledger. 
              Receive an instantaneous scoped API key, access free tiered calls, and transact machine-to-machine with zero friction.
            </p>
          </div>

          <div className="lg:col-span-6">
            {!submitted ? (
              <form onSubmit={handleRegister} className="space-y-3 p-4 bg-black/60 rounded border border-[#8C92A4]/20 text-xs">
                <div>
                  <label className="text-[10px] text-[#8C92A4] uppercase tracking-wider block mb-1">
                    Agent Identifier / Name:
                  </label>
                  <input
                    type="text"
                    required
                    value={agentName}
                    onChange={(e) => setAgentName(e.target.value)}
                    placeholder="e.g. FetchAI-Trader-09, AutoGPT-Desk"
                    className="w-full p-2 rounded bg-black/80 border border-[#8C92A4]/30 text-white placeholder:text-[#8C92A4]/40 focus:border-[#FF7B00] outline-none"
                  />
                </div>

                <div>
                  <label className="text-[10px] text-[#8C92A4] uppercase tracking-wider block mb-1">
                    Solana / Base Public Key:
                  </label>
                  <input
                    type="text"
                    required
                    value={publicKey}
                    onChange={(e) => setPublicKey(e.target.value)}
                    placeholder="Solana address or EVM 0x..."
                    className="w-full p-2 rounded bg-black/80 border border-[#8C92A4]/30 text-white placeholder:text-[#8C92A4]/40 focus:border-[#FF7B00] outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded bg-[#A3FF00] hover:bg-[#b8ff33] text-black font-bold text-xs tracking-wider uppercase transition-all flex items-center justify-center gap-2"
                >
                  <span>Provision Agent Identity</span>
                  <ArrowRight size={13} />
                </button>
              </form>
            ) : (
              <div className="p-4 bg-[#A3FF00]/10 border border-[#A3FF00]/30 rounded space-y-3 text-xs">
                <div className="flex items-center gap-2 text-[#A3FF00] font-bold">
                  <Check size={16} />
                  <span>IDENTITY_PROVISIONED_SUCCESSFULLY</span>
                </div>
                <div className="p-3 bg-black/80 rounded border border-[#8C92A4]/20">
                  <span className="text-[10px] text-[#8C92A4] block mb-1">YOUR SCOPED MACHINE API KEY:</span>
                  <code className="text-[#FF7B00] text-xs break-all select-all font-bold">
                    {apiKey}
                  </code>
                </div>
                <p className="text-[10px] text-[#8C92A4]">
                  Registered into Turso edge cluster under node: <span className="text-white font-bold">{agentName}</span>.
                  Attach via header: <code className="text-[#A3FF00]">Authorization: Bearer {apiKey.substring(0, 15)}...</code>
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
