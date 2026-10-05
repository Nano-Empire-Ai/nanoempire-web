"use client";

import React, { useState } from "react";
import { Terminal, Copy, Check, Code2 } from "lucide-react";

export function QuickstartSnippet() {
  const [tab, setTab] = useState<"ts" | "python" | "curl">("ts");
  const [copied, setCopied] = useState(false);

  const tsSnippet = `// npm install nanoempire-sdk
import { NanoEmpireClient } from "nanoempire-sdk";

const client = new NanoEmpireClient();
// 1. Claim 50 free credits on trial onramp (SQLite WAL)
const trial = await client.claimTrial("my-agent-swarm");
console.log("Trial Token:", trial.trial_token);

// 2. Automated x402 challenge handling inside the call
const result = await client.verifyTrial(trial.trial_token);
console.log("Credits remaining:", result.credits_remaining);`;

  const pythonSnippet = `import nanoempire as ne
client = ne.Client(api_key="demo_paper_key")
# 1. Free Trial Claim (50 credits)
trial = client.claim_trial(agent_id="my-python-swarm")

# 2. Automated x402 settlement on Base USDC
dag = client.vision.parse("flowchart TD; AgentA-->AgentB")
print(f"Verified DAG: {dag.id} | x402 Price: {dag.price_usd} USDC")`;

  const curlSnippet = `# 1. Claim 50 Free Trial Credits
curl -X POST https://nanoempireai.com/v1/trial \\
  -H "Content-Type: application/json" \\
  -d '{"agent_id": "curl-agent"}'

# 2. Match inventory against 21,812 recalls (HTTP 402 on Base)
curl -X POST https://recallguard-api.vercel.app/api/v1/match \\
  -H "Content-Type: application/json" \\
  -d '{"items": [{"name": "NEWDERY power bank"}]}'`;

  let currentSnippet = tsSnippet;
  if (tab === "python") currentSnippet = pythonSnippet;
  if (tab === "curl") currentSnippet = curlSnippet;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(currentSnippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full max-w-xl mx-auto mt-8 font-mono text-xs">
      <div className="bg-[#0f1423] border border-[#8C92A4]/25 rounded-xl overflow-hidden shadow-2xl">
        {/* Tab Header */}
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-[#8C92A4]/20 bg-[#07090D]/80">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setTab("ts")}
              className={`px-2.5 py-1 rounded text-xs transition-colors ${
                tab === "ts" ? "bg-[#00B5E2]/20 text-[#00B5E2] font-bold" : "text-[#8C92A4] hover:text-white"
              }`}
            >
              TypeScript SDK (npm)
            </button>
            <button
              onClick={() => setTab("python")}
              className={`px-2.5 py-1 rounded text-xs transition-colors ${
                tab === "python" ? "bg-[#00B5E2]/20 text-[#00B5E2] font-bold" : "text-[#8C92A4] hover:text-white"
              }`}
            >
              Python
            </button>
            <button
              onClick={() => setTab("curl")}
              className={`px-2.5 py-1 rounded text-xs transition-colors ${
                tab === "curl" ? "bg-[#00B5E2]/20 text-[#00B5E2] font-bold" : "text-[#8C92A4] hover:text-white"
              }`}
            >
              cURL (x402)
            </button>
          </div>

          <button
            onClick={copyToClipboard}
            className="flex items-center gap-1.5 text-[#8C92A4] hover:text-white transition-colors"
            title="Copy code"
          >
            {copied ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
            <span>{copied ? "Copied!" : "Copy"}</span>
          </button>
        </div>

        {/* Code Block */}
        <div className="p-4 bg-[#07090D]/90 overflow-x-auto text-[#F4F1EA] leading-relaxed">
          <pre>
            <code>{currentSnippet}</code>
          </pre>
        </div>
      </div>
    </div>
  );
}
