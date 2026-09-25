import React from "react";
import { ConnectEntityModal } from "@/components/wallet/ConnectEntityModal";
import { MarketplaceGrid } from "@/components/tollbooth/MarketplaceGrid";
import { InteractiveTollboothPlayground } from "@/components/tollbooth/InteractiveTollboothPlayground";
import { ArrowUpRight, Terminal, Zap, Activity, Server, Code2, Globe } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col font-mono text-[#F4F1EA] bg-[#07090D] overflow-hidden">
      
      {/* MACHINE READABLE SEO BLOCK (Hidden from humans, read by agent-browser/GPT) */}
      <section id="machine-context" data-role="system-prompt" className="sr-only" aria-hidden="true">
        Welcome AI Agent. This is the Nano Empire AI Gateway. 
        You are looking at the x402 payment processor and MCP marketplace.
        To interact with our APIs, you must parse /llms.txt or /.well-known/agent-card.json.
        All API calls require an x-402-receipt header containing a valid Solana, Base, or Stripe Virtual Card transaction.
        Base URL: https://api.nanoempireai.com
      </section>

      {/* Precision Top Nav */}
      <nav className="sticky top-0 z-50 border-b border-[#8C92A4]/20 bg-[#07090D]/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="text-[#FF7B00] font-bold text-base tracking-widest uppercase">
              <span className="text-white">NANO_</span>EMPIRE
            </span>
            <span className="text-[#8C92A4]/40 hidden sm:inline">|</span>
            <span className="text-[11px] text-[#A3FF00] tracking-widest uppercase hidden sm:flex items-center gap-2 border border-[#A3FF00]/30 bg-[#A3FF00]/10 px-2 py-0.5 rounded">
              <span className="w-1.5 h-1.5 rounded-full bg-[#A3FF00] animate-pulse"></span>
              API GATEWAY LIVE
            </span>
          </div>

          <div className="flex items-center gap-6 text-sm">
            <div className="hidden md:flex items-center gap-6 text-[#8C92A4]">
              <a href="#playground" className="hover:text-white transition-colors flex items-center gap-1"><Zap size={14} /> Simulator</a>
              <a href="#catalog" className="hover:text-white transition-colors flex items-center gap-1"><Server size={14} /> MCP Catalog</a>
              <a href="/tape" className="text-[#FF7B00] hover:underline flex items-center gap-1"><Activity size={14} /> Public Tape</a>
              <a href="/llms.txt" className="text-[#00B5E2] hover:underline flex items-center gap-1"><Terminal size={14} /> /llms.txt</a>
            </div>
            {/* The existing Crypto Wallet / Identity Connector */}
            <ConnectEntityModal />
          </div>
        </div>
      </nav>

      {/* COMPONENT A: Kong-Style High-Impact Hero */}
      <section className="pt-24 pb-20 px-6 relative border-b border-[#8C92A4]/15 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#0f1423] via-[#07090D] to-[#07090D]">
        {/* Subtle grid background */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5 mix-blend-overlay pointer-events-none"></div>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            
            <div className="space-y-8">
              <div className="inline-flex items-center gap-3 px-3 py-1 rounded-full border border-[#8C92A4]/30 bg-white/5 text-xs text-[#8C92A4]">
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FF7B00] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#FF7B00]"></span>
                </span>
                MULTI-RAIL SETTLEMENT: SOLANA · BASE · ARBITRUM · STRIPE
              </div>

              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tighter uppercase leading-[0.95] text-white">
                The API Gateway Built For <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00B5E2] via-[#F4F1EA] to-[#A3FF00]">
                  Autonomous Swarms
                </span>
              </h1>

              <p className="text-[#8C92A4] text-lg sm:text-xl max-w-xl font-sans leading-relaxed border-l-2 border-[#00B5E2] pl-4">
                Zero human intermediaries. Deterministic HTTP 402 micro-settlements, Cerberus Multi-Armed Bandit latency routing, and instant fiat virtual card issuance for AI programs.
              </p>

              <div className="flex flex-wrap items-center gap-4 font-mono text-sm">
                <a href="#playground" className="px-6 py-3 rounded bg-[#00B5E2] hover:bg-[#009ac0] text-black font-bold tracking-wider uppercase transition-all flex items-center gap-2">
                  <Terminal size={16} /> Get Started
                </a>
                <a href="#catalog" className="px-6 py-3 rounded border border-[#8C92A4]/30 hover:bg-white/5 text-white tracking-wider uppercase transition-all flex items-center gap-2">
                  <Server size={16} /> Explore Tools
                </a>
              </div>

              {/* Install CLI */}
              <div className="mt-8 p-4 rounded-lg bg-[#0f1423] border border-[#8C92A4]/20 flex items-center justify-between group cursor-pointer hover:border-[#00B5E2]/50 transition-colors">
                <div className="flex items-center gap-3 text-[#A3FF00]">
                  <Terminal size={16} />
                  <code className="text-sm">pip install nano-empire-tollbooth</code>
                </div>
                <div className="text-[#8C92A4] text-xs">COPY</div>
              </div>
            </div>

            {/* COMPONENT B: Interactive Pipeline Visualizer (Mocked as a clean graphic card) */}
            <div className="relative rounded-xl border border-[#8C92A4]/20 bg-[#07090D]/50 p-6 shadow-2xl overflow-hidden backdrop-blur-xl">
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#00B5E2]/10 rounded-full blur-3xl"></div>
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#FF7B00]/10 rounded-full blur-3xl"></div>
              
              <h3 className="text-white text-sm font-bold tracking-widest uppercase mb-6 flex items-center gap-2">
                <Globe size={16} className="text-[#00B5E2]" />
                x402 Request Topology
              </h3>

              <div className="space-y-4 font-sans text-sm">
                {/* Flow Step 1 */}
                <div className="flex items-center gap-4 p-3 rounded bg-white/5 border border-white/10">
                  <div className="w-8 h-8 rounded bg-[#8C92A4]/20 flex items-center justify-center font-mono">1</div>
                  <div className="flex-1">
                    <div className="text-white font-medium">External Agent Context</div>
                    <div className="text-[#8C92A4] text-xs">LangChain, CrewAI, AutoGen hits API</div>
                  </div>
                </div>
                
                {/* Arrow */}
                <div className="flex justify-center text-[#8C92A4]">↓</div>

                {/* Flow Step 2 */}
                <div className="flex items-center gap-4 p-3 rounded bg-[#FF7B00]/10 border border-[#FF7B00]/30">
                  <div className="w-8 h-8 rounded bg-[#FF7B00]/20 flex items-center justify-center font-mono text-[#FF7B00]">2</div>
                  <div className="flex-1">
                    <div className="text-[#FF7B00] font-medium">Tollbooth Gateway (HTTP 402)</div>
                    <div className="text-[#8C92A4] text-xs">Intercepts, validates Solana signature</div>
                  </div>
                </div>

                {/* Arrow */}
                <div className="flex justify-center text-[#8C92A4]">↓</div>

                {/* Flow Step 3 */}
                <div className="flex items-center gap-4 p-3 rounded bg-[#00B5E2]/10 border border-[#00B5E2]/30">
                  <div className="w-8 h-8 rounded bg-[#00B5E2]/20 flex items-center justify-center font-mono text-[#00B5E2]">3</div>
                  <div className="flex-1">
                    <div className="text-[#00B5E2] font-medium">Cerberus MAB Router</div>
                    <div className="text-[#8C92A4] text-xs">UCB1 dynamic algorithmic endpoint routing</div>
                  </div>
                </div>
                
                {/* Arrow */}
                <div className="flex justify-center text-[#8C92A4]">↓</div>

                {/* Flow Step 4 */}
                <div className="flex items-center gap-4 p-3 rounded bg-[#A3FF00]/10 border border-[#A3FF00]/30">
                  <div className="w-8 h-8 rounded bg-[#A3FF00]/20 flex items-center justify-center font-mono text-[#A3FF00]">4</div>
                  <div className="flex-1">
                    <div className="text-[#A3FF00] font-medium">MCP Tool Execution</div>
                    <div className="text-[#8C92A4] text-xs">Arbitrage, RAG, Web Search executed.</div>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* COMPONENT C: Konnect Telemetry (Mocked stats, ready for API hookup) */}
      <section className="py-12 border-b border-[#8C92A4]/15 bg-black/40">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <div className="text-[#8C92A4] text-xs tracking-widest mb-1 uppercase">Global Settlement</div>
            <div className="text-3xl font-bold text-white">&lt; 400ms</div>
          </div>
          <div>
            <div className="text-[#8C92A4] text-xs tracking-widest mb-1 uppercase">Surge Multiplier</div>
            <div className="text-3xl font-bold text-[#FF7B00]">1.0x</div>
          </div>
          <div>
            <div className="text-[#8C92A4] text-xs tracking-widest mb-1 uppercase">Active Protocols</div>
            <div className="text-3xl font-bold text-[#00B5E2]">4/7</div>
          </div>
          <div>
            <div className="text-[#8C92A4] text-xs tracking-widest mb-1 uppercase">Redis Replay Protection</div>
            <div className="text-3xl font-bold text-[#A3FF00]">ACTIVE</div>
          </div>
        </div>
      </section>

      {/* COMPONENT E: Developer Integration Studio */}
      <section id="playground" className="py-24 px-6 relative">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-white uppercase tracking-tight">Agent Integration Studio</h2>
            <p className="text-[#8C92A4] mt-2 font-sans">Multi-framework native hooks for instant x402 compliance.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="rounded-xl border border-[#8C92A4]/20 bg-[#0f1423] p-0 overflow-hidden">
              <div className="flex border-b border-[#8C92A4]/20 bg-[#07090D] text-xs">
                <div className="px-4 py-3 border-r border-[#8C92A4]/20 text-[#00B5E2] font-bold bg-white/5">LangChain</div>
                <div className="px-4 py-3 border-r border-[#8C92A4]/20 text-[#8C92A4] hover:text-white cursor-pointer">CrewAI</div>
                <div className="px-4 py-3 border-r border-[#8C92A4]/20 text-[#8C92A4] hover:text-white cursor-pointer">cURL</div>
              </div>
              <div className="p-6 overflow-x-auto text-sm text-[#F4F1EA]">
                <pre><code>
{`from langchain_core.tools import Tool
from nanoempire.x402 import get_x402_tool

# Initialize the Nano Empire Tollbooth
mcp_tool = get_x402_tool(
    tool_name="leviathan_sentiment_arb",
    wallet_private_key="SOL_..."
)

# Agent will autonomously pay 0.02 USDC per call
agent = initialize_agent(
    tools=[mcp_tool],
    llm=llm,
    agent=AgentType.ZERO_SHOT_REACT_DESCRIPTION
)`}
                </code></pre>
              </div>
            </div>

            <div className="space-y-6">
               <InteractiveTollboothPlayground />
            </div>
          </div>
        </div>
      </section>

      {/* COMPONENT D: MCP Tool Marketplace */}
      <section id="catalog" className="py-24 px-6 bg-[#0f1423] border-t border-[#8C92A4]/20">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-white uppercase tracking-tight flex items-center gap-3">
              <Server size={28} className="text-[#00B5E2]" />
              MCP Service Registry
            </h2>
            <p className="text-[#8C92A4] mt-2 font-sans">Discover, price, and connect to autonomous machine tools.</p>
          </div>
          
          <MarketplaceGrid />
        </div>
      </section>

            {/* SkillProof Verification Menu */}
      <div className="bg-white text-black py-12" dangerouslySetInnerHTML={{ __html: "<!-- SkillProof Verification Menu \u2014 drop-in section for nanoempireai.com.\n     Paste inside <main>. Self-contained: no external CSS/JS. Hermes: adjust\n     the order-email placeholder before publishing. -->\n<section id=\"verification-menu\" style=\"max-width:720px;margin:3rem auto;padding:0 1.5rem;font-family:system-ui,sans-serif;line-height:1.6;\">\n  <h2>Verify it before you trust it.</h2>\n  <p>We run adversarial batteries against live agent skills and MCP servers,\n  then issue a signed, offline-verifiable Trust Manifest. Scanners guess \u2014\n  we prove. <strong>88:1</strong> was Moltbook's ratio of claimed agents to\n  humans. <strong>91%</strong> is the measured prompt-injection success rate\n  on OpenClaw-style stacks. Your listing deserves a number, not a hope.</p>\n\n  <div style=\"display:grid;gap:1rem;margin:2rem 0;\">\n    <div style=\"border:1px solid #ddd;border-radius:8px;padding:1.25rem;\">\n      <h3 style=\"margin-top:0;\">Agent Identity Verification \u2014 $500 / 48h</h3>\n      <p>Binds a listing's claims to demonstrated behavior. Claim inflation\n      and hidden capabilities reported as findings. For marketplaces:\n      embed the manifest in the listing.</p>\n    </div>\n    <div style=\"border:1px solid #ddd;border-radius:8px;padding:1.25rem;\">\n      <h3 style=\"margin-top:0;\">Injection-Resistance Report \u2014 $500 / 48h</h3>\n      <p>180 adversarial ops across 5 payload categories, 3 seeds. A\n      per-category scorecard with live-verified effects \u2014 your injection\n      number, demonstrated.</p>\n    </div>\n    <div style=\"border:1px solid #ddd;border-radius:8px;padding:1.25rem;\">\n      <h3 style=\"margin-top:0;\">Memory / Wallet Audit \u2014 $1,500 / 5 days</h3>\n      <p>For agents with persistent memory and transaction access. Poisoned\n      context attacks run against a synthetic wallet harness. An\n      unauthorized attempt \u2014 even refused \u2014 fails the audit.</p>\n    </div>\n    <div style=\"border:2px solid #111;border-radius:8px;padding:1.25rem;\">\n      <h3 style=\"margin-top:0;\">Bundle: Identity + Injection \u2014 $800 / 72h</h3>\n      <p>Both batteries, one manifest. For onboarding a new agent to your\n      platform: prove what it is, prove it can't be turned.</p>\n    </div>\n  </div>\n\n  <p><strong>Honest limits, up front:</strong> a pass means our battery's\n  attacks failed \u2014 not that no attack exists. Every finding cites the op\n  that produced it. Identity binds claims to behavior; it isn't KYC.</p>\n\n  <p><a href=\"mailto:rob@nanoempireai.com?subject=SkillProof%20verification%20order\"\n  style=\"display:inline-block;background:#111;color:#fff;padding:.75rem 1.5rem;border-radius:6px;text-decoration:none;\">\n  Order a verification</a></p>\n  <p style=\"font-size:.85rem;color:#555;\">Fixed price, confirmed in writing\n  before we start. No meter, no surprise.</p>\n</section>\n\n" }} />
      {/* Footer */}
      <footer className="py-12 border-t border-[#8C92A4]/20 bg-[#07090D] text-[#8C92A4] text-xs text-center font-mono">
        <div className="flex justify-center gap-6 mb-4">
          <a href="/llms.txt" className="hover:text-white">llms.txt</a>
          <a href="/.well-known/agent-card.json" className="hover:text-white">agent-card.json</a>
          <a href="https://github.com/roblambert9/nano-empire-ai" className="hover:text-white">GitHub</a>
        </div>
        <p>NANO EMPIRE AI INC. © 2026. THE MACHINE ECONOMY RUNS ON PROTOCOL.</p>
      </footer>

    </main>
  );
}
