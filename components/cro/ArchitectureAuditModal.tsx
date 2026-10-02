"use client";

import React, { useState } from "react";
import { ShieldAlert, CheckCircle2, ArrowRight, Download, Send, AlertTriangle, FileText, Sparkles } from "lucide-react";

interface AuditAnswers {
  runtime: string;
  payments: string;
  memory: string;
  defense: string;
  email: string;
}

export function ArchitectureAuditModal() {
  const [step, setStep] = useState(1);
  const [answers, setAnswers] = useState<AuditAnswers>({
    runtime: "langgraph",
    payments: "crypto",
    memory: "redis",
    defense: "none",
    email: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  const calculateScore = () => {
    let score = 50;
    if (answers.runtime === "langgraph" || answers.runtime === "fastapi") score += 15;
    if (answers.payments === "paper") score += 20;
    else if (answers.payments === "crypto") score -= 10;
    if (answers.memory === "redis") score += 10;
    if (answers.defense === "genesis") score += 25;
    else if (answers.defense === "none") score -= 20;
    return Math.max(30, Math.min(98, score));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsCompleted(true);
    }, 600);
  };

  const score = calculateScore();

  return (
    <section id="architecture-audit" className="py-20 px-6 max-w-7xl mx-auto border-b border-[#8C92A4]/15">
      <div className="bg-gradient-to-br from-[#0f1423] via-[#07090D] to-[#0f1423] border border-[#8C92A4]/25 rounded-2xl p-8 sm:p-12 shadow-2xl relative">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#00B5E2]/30 bg-[#00B5E2]/10 text-xs text-[#00B5E2] font-mono mb-3">
              <ShieldAlert size={14} />
              TECHNICAL LEAD MAGNET · 100% FREE
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white uppercase font-mono">
              Free Agent Architecture & Trust Audit
            </h2>
            <p className="text-[#8C92A4] mt-2 text-sm sm:text-base font-sans">
              Evaluate your agent swarm for prompt injection vulnerability, double-spend leakage, and unverified tool execution. Receive an instant cryptographic readiness scorecard.
            </p>
          </div>

          {!isCompleted ? (
            <div className="bg-[#07090D] border border-[#8C92A4]/20 rounded-xl p-6 sm:p-8">
              {/* Step indicator */}
              <div className="flex items-center justify-between mb-8 border-b border-[#8C92A4]/15 pb-4 text-xs font-mono text-[#8C92A4]">
                <span className="text-[#00B5E2] font-bold">STEP {step} OF 4</span>
                <span>{step === 1 ? "Agent Runtime" : step === 2 ? "Payment Rails" : step === 3 ? "Memory Storage" : "Adversarial Defenses"}</span>
              </div>

              {step === 1 && (
                <div className="space-y-4">
                  <label className="block text-sm font-mono text-white font-semibold">
                    1. What is your primary agent runtime framework?
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[
                      { id: "langgraph", label: "LangGraph / StateGraph", desc: "Compiled cyclic graphs" },
                      { id: "fastapi", label: "FastAPI / Custom Python", desc: "Native async API gateway" },
                      { id: "crewai", label: "CrewAI / AutoGen", desc: "Multi-role team swarms" },
                      { id: "other", label: "Other / Raw LLM Loops", desc: "Unstructured while-true loops" },
                    ].map((opt) => (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => {
                          setAnswers({ ...answers, runtime: opt.id });
                          setStep(2);
                        }}
                        className={`p-4 rounded-lg text-left border font-mono transition-all ${
                          answers.runtime === opt.id
                            ? "border-[#00B5E2] bg-[#00B5E2]/10 text-white"
                            : "border-[#8C92A4]/20 hover:border-[#8C92A4]/40 text-[#8C92A4]"
                        }`}
                      >
                        <div className="text-sm font-bold text-white">{opt.label}</div>
                        <div className="text-xs text-[#8C92A4] mt-1">{opt.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-4">
                  <label className="block text-sm font-mono text-white font-semibold">
                    2. How does your system authorize and settle transactions?
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[
                      { id: "paper", label: "Gated Paper Mode", desc: "Strict verification, no live wallet exposure" },
                      { id: "crypto", label: "Direct Web3 Wallet Keys", desc: "Agent signs directly with hot private key" },
                      { id: "stripe", label: "Standard Stripe / Fiat API", desc: "Backend card authorization" },
                      { id: "none", label: "No Transactions Allowed", desc: "Read-only informational agent" },
                    ].map((opt) => (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => {
                          setAnswers({ ...answers, payments: opt.id });
                          setStep(3);
                        }}
                        className={`p-4 rounded-lg text-left border font-mono transition-all ${
                          answers.payments === opt.id
                            ? "border-[#00B5E2] bg-[#00B5E2]/10 text-white"
                            : "border-[#8C92A4]/20 hover:border-[#8C92A4]/40 text-[#8C92A4]"
                        }`}
                      >
                        <div className="text-sm font-bold text-white">{opt.label}</div>
                        <div className="text-xs text-[#8C92A4] mt-1">{opt.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-4">
                  <label className="block text-sm font-mono text-white font-semibold">
                    3. How is agent state and memory persisted?
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[
                      { id: "redis", label: "Redis Streams / In-Memory", desc: "High throughput pub/sub & netting" },
                      { id: "sqlite", label: "SQLite + Litestream S3", desc: "Continuous zero-downtime replication" },
                      { id: "vector", label: "Vector DB (Chroma / Pinecone)", desc: "Semantic retrieval without cryptographic logs" },
                      { id: "ram", label: "Ephemeral Memory Only", desc: "State lost on container restart" },
                    ].map((opt) => (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => {
                          setAnswers({ ...answers, memory: opt.id });
                          setStep(4);
                        }}
                        className={`p-4 rounded-lg text-left border font-mono transition-all ${
                          answers.memory === opt.id
                            ? "border-[#00B5E2] bg-[#00B5E2]/10 text-white"
                            : "border-[#8C92A4]/20 hover:border-[#8C92A4]/40 text-[#8C92A4]"
                        }`}
                      >
                        <div className="text-sm font-bold text-white">{opt.label}</div>
                        <div className="text-xs text-[#8C92A4] mt-1">{opt.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {step === 4 && (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-mono text-white font-semibold mb-3">
                      4. What adversarial defenses protect your agents?
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                      {[
                        { id: "genesis", label: "Genesis Signed Attestations", desc: "Ed25519 hash-chained verification" },
                        { id: "regex", label: "Prompt Filters & Regex", desc: "Basic string pattern matching" },
                        { id: "guardrails", label: "Guardrail Frameworks", desc: "NeMo / Llama-Guard heuristic models" },
                        { id: "none", label: "No Dedicated Defense", desc: "Vulnerable to indirect prompt injection" },
                      ].map((opt) => (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => setAnswers({ ...answers, defense: opt.id })}
                          className={`p-4 rounded-lg text-left border font-mono transition-all ${
                            answers.defense === opt.id
                              ? "border-[#00B5E2] bg-[#00B5E2]/10 text-white"
                              : "border-[#8C92A4]/20 hover:border-[#8C92A4]/40 text-[#8C92A4]"
                          }`}
                        >
                          <div className="text-sm font-bold text-white">{opt.label}</div>
                          <div className="text-xs text-[#8C92A4] mt-1">{opt.desc}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-[#8C92A4]/15">
                    <label className="block text-xs font-mono text-[#8C92A4] uppercase mb-2">
                      Enter work email to receive full 180-Point Vulnerability Report:
                    </label>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <input
                        type="email"
                        required
                        value={answers.email}
                        onChange={(e) => setAnswers({ ...answers, email: e.target.value })}
                        placeholder="engineer@company.com"
                        className="flex-1 bg-[#0f1423] border border-[#8C92A4]/30 rounded-lg px-4 py-3 text-sm text-white font-mono outline-none focus:border-[#00B5E2]"
                      />
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="px-6 py-3 rounded-lg bg-[#00B5E2] hover:bg-[#009ac0] text-black font-mono font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                      >
                        <Send size={14} />
                        {isSubmitting ? "Generating..." : "Generate Audit Report"}
                      </button>
                    </div>
                  </div>
                </form>
              )}
            </div>
          ) : (
            <div className="bg-[#07090D] border border-emerald-500/30 rounded-xl p-8 text-center space-y-6">
              <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-400">
                <CheckCircle2 size={32} />
              </div>

              <div>
                <h3 className="text-2xl font-bold font-mono text-white">Preliminary Security Score: {score}/100</h3>
                <p className="text-[#8C92A4] text-sm mt-1">
                  Full adversarial penetration scorecard dispatched to <span className="text-white font-mono">{answers.email || "your inbox"}</span>.
                </p>
              </div>

              <div className="p-4 bg-[#0f1423] rounded-lg border border-[#8C92A4]/20 max-w-md mx-auto text-left font-mono text-xs space-y-2">
                <div className="text-[#A3FF00] font-bold">KEY FINDINGS:</div>
                <div className="text-[#F4F1EA]">· Payment Rail Risk: {answers.payments === "crypto" ? "CRITICAL (Hot key exposed)" : "GUARDED"}</div>
                <div className="text-[#F4F1EA]">· Injection Resistance: {answers.defense === "genesis" ? "VERIFIED (Ed25519 Gated)" : "ELEVATED RISK"}</div>
                <div className="text-[#8C92A4]">· Recommendation: Integrate Nano Empire x402 Tollbooth for replay safety.</div>
              </div>

              <button
                onClick={() => { setIsCompleted(false); setStep(1); }}
                className="text-xs font-mono text-[#00B5E2] hover:underline"
              >
                Run another architecture assessment
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
