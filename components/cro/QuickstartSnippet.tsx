"use client";

import React, { useState } from "react";
import { Terminal, Copy, Check, Code2 } from "lucide-react";

export function QuickstartSnippet() {
  const [tab, setTab] = useState<"ts" | "python" | "curl">("ts");
  const [copied, setCopied] = useState(false);

  const tsSnippet = `// Direct x402 Fetch Example (RecallGuard Match)
const res = await fetch("https://recallguard-api.vercel.app/api/v1/match", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ items: [{ name: "Fisher-Price cradle", brand: "Mattel" }] })
});

// Expect HTTP 402 with challenge details:
// accepts: [{ scheme: "exact", network: "base", maxAmountRequired: "100000" }]
console.log("Status:", res.status);`;

  const pythonSnippet = `# Direct x402 Request via requests / httpx
import requests

res = requests.post(
    "https://recallguard-api.vercel.app/api/v1/match",
    json={"items": [{"name": "Fisher-Price cradle", "brand": "Mattel"}]}
)
# Returns HTTP 402 until payment authorization header is provided
print(res.status_code, res.json())`;

  const curlSnippet = `# 1. Query free health endpoint (21,812 records)
curl -s https://recallguard-api.vercel.app/api/v1/health

# 2. Match inventory items (returns HTTP 402 challenge on Base)
curl -si -X POST https://recallguard-api.vercel.app/api/v1/match \\
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
