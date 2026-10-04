"use client";

import React, { useState } from "react";
import { Terminal, Copy, Check, Code2 } from "lucide-react";

export function QuickstartSnippet() {
  const [tab, setTab] = useState<"python" | "curl">("python");
  const [copied, setCopied] = useState(false);

  const pythonSnippet = `import nanoempire as ne
client = ne.Client(api_key="demo_paper_key")
dag = client.vision.parse("flowchart TD; AgentA-->AgentB")
print(f"Verified DAG: {dag.id} | x402 Price: {dag.price_usd} USDC")`;

  const curlSnippet = `curl -X POST https://nanoempireai.com/api/v1/parse \\
  -H "X-API-Key: demo_paper_key" \\
  -H "Content-Type: application/json" \\
  -d '{"diagram": "graph TD; A-->B"}'`;

  const currentSnippet = tab === "python" ? pythonSnippet : curlSnippet;

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
              onClick={() => setTab("python")}
              className={`px-2.5 py-1 rounded text-xs transition-colors ${
                tab === "python" ? "bg-[#00B5E2]/20 text-[#00B5E2] font-bold" : "text-[#8C92A4] hover:text-white"
              }`}
            >
              Python SDK
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
