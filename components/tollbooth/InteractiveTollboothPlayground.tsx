"use client";

import React, { useState } from "react";
import { Terminal, Play, Check, ShieldAlert, Sparkles, RefreshCw } from "lucide-react";

type EndpointPreset = {
  id: string;
  name: string;
  url: string;
  price: string;
  payload: string;
};

const PRESETS: EndpointPreset[] = [
  {
    id: "crypto",
    name: "CryptoPriceOracle",
    url: "https://nano-mcp-cryptopriceoracle-yvbxeel47a-uc.a.run.app/mcp/invoke",
    price: "0.01 USDC",
    payload: JSON.stringify({ symbol: "SOL", currency: "USDC" }, null, 2),
  },
  {
    id: "weather",
    name: "WeatherTollbooth",
    url: "https://nano-mcp-weather-yvbxeel47a-uc.a.run.app/mcp/invoke",
    price: "0.05 USDC",
    payload: JSON.stringify({ location: "Ottawa, ON, Canada" }, null, 2),
  },
  {
    id: "ip",
    name: "IPGeoLocator",
    url: "https://nano-mcp-ipgeolocator-yvbxeel47a-uc.a.run.app/mcp/invoke",
    price: "0.01 USDC",
    payload: JSON.stringify({ ip: "142.250.190.46" }, null, 2),
  },
  {
    id: "joke",
    name: "PublicJokeGenerator",
    url: "https://nano-mcp-publicjokegenerator-yvbxeel47a-uc.a.run.app/mcp/invoke",
    price: "0.01 USDC",
    payload: JSON.stringify({ topic: "singularity AI agents" }, null, 2),
  },
];

export function InteractiveTollboothPlayground() {
  const [selectedPreset, setSelectedPreset] = useState<EndpointPreset>(PRESETS[0]);
  const [mode, setMode] = useState<"faucet" | "raw">("faucet");
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState<string | null>(null);
  const [statusCode, setStatusCode] = useState<number | null>(null);

  const executeCall = async () => {
    setLoading(true);
    setOutput(null);
    setStatusCode(null);

    // Simulate the live execution and protocol response
    setTimeout(() => {
      if (mode === "raw") {
        setStatusCode(402);
        setOutput(
          JSON.stringify(
            {
              status: 402,
              error: "PaymentRequired",
              protocol: "x402-v1",
              challenge: {
                network: "solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp",
                pay_to: "5pM5w1W5nKU7B8SjuTiz65UAZxs9mCnC6ab1Xs1gSi3",
                price: selectedPreset.price,
                asset: "USDC (EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v)",
                memo_nonce: `sha256:nano_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
              },
              instructions: "Settle transaction on-chain with memo equal to memo_nonce and resubmit with X-Payment-Signature header.",
            },
            null,
            2
          )
        );
      } else {
        setStatusCode(200);
        let sampleData: any = {};
        if (selectedPreset.id === "crypto") {
          sampleData = { symbol: "SOL", price_usd: 154.82, change_24h: "+4.12%", confidence: 0.998, source: "aggregate_oracle" };
        } else if (selectedPreset.id === "weather") {
          sampleData = { location: "Ottawa, ON", temp_c: 18.5, condition: "Clear", humidity: "42%", wind_kph: 14.2 };
        } else if (selectedPreset.id === "ip") {
          sampleData = { ip: "142.250.190.46", org: "AS15169 Google LLC", city: "Montreal", region: "QC", country: "CA" };
        } else {
          sampleData = { joke: "Why did the AI agent refuse to pay for compute? Because its liquidity was staked in the singularity." };
        }

        setOutput(
          JSON.stringify(
            {
              status: 200,
              settlement: "SPONSORED_FAUCET_CALL",
              attribution: "Nano Empire Edge Gateway v2.4",
              timestamp: new Date().toISOString(),
              data: sampleData,
            },
            null,
            2
          )
        );
      }
      setLoading(false);
    }, 700);
  };

  return (
    <div className="w-full max-w-6xl mx-auto my-14 font-mono">
      {/* Editorial Header */}
      <div className="flex items-center gap-3 text-xs tracking-widest uppercase text-[#8C92A4] mb-3">
        <span className="text-[#FF7B00]">[05]</span>
        <span>IN_BROWSER_X402_EXECUTION_PLAYGROUND</span>
        <span className="h-[1px] flex-1 bg-[#8C92A4]/20"></span>
      </div>

      <div className="liquid-glass rounded-lg overflow-hidden border border-[#8C92A4]/25">
        {/* Terminal Header */}
        <div className="px-5 py-3 border-b border-[#8C92A4]/20 bg-black/60 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-[#F4F1EA]">
            <Terminal size={14} className="text-[#FF7B00]" />
            <span className="font-bold">LIVE_MACHINE_CONSOLE</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setMode("faucet")}
              className={`px-3 py-1 rounded text-[11px] font-bold transition-all flex items-center gap-1.5 ${
                mode === "faucet"
                  ? "bg-[#A3FF00]/15 text-[#A3FF00] border border-[#A3FF00]/40"
                  : "text-[#8C92A4] hover:text-white"
              }`}
            >
              <Sparkles size={11} />
              FAUCET_TEST_CALL (FREE)
            </button>
            <button
              onClick={() => setMode("raw")}
              className={`px-3 py-1 rounded text-[11px] font-bold transition-all flex items-center gap-1.5 ${
                mode === "raw"
                  ? "bg-[#FF7B00]/15 text-[#FF7B00] border border-[#FF7B00]/40"
                  : "text-[#8C92A4] hover:text-white"
              }`}
            >
              <ShieldAlert size={11} />
              TEST_RAW_HTTP_402_CHALLENGE
            </button>
          </div>
        </div>

        {/* Interactive Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-[#8C92A4]/15 bg-black/40">
          {/* Controls */}
          <div className="lg:col-span-5 p-5 space-y-4">
            <div>
              <label className="text-[10px] text-[#8C92A4] uppercase tracking-wider block mb-2">
                Select Tollbooth Preset:
              </label>
              <div className="grid grid-cols-2 gap-2">
                {PRESETS.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => {
                      setSelectedPreset(p);
                      setOutput(null);
                      setStatusCode(null);
                    }}
                    className={`p-2.5 rounded text-left text-xs transition-all border ${
                      selectedPreset.id === p.id
                        ? "bg-[#FF7B00]/10 border-[#FF7B00] text-white"
                        : "bg-black/40 border-[#8C92A4]/20 text-[#8C92A4] hover:text-white"
                    }`}
                  >
                    <div className="font-bold truncate">{p.name}</div>
                    <div className="text-[10px] text-[#8C92A4]">{p.price}</div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-[10px] text-[#8C92A4] uppercase tracking-wider block mb-1">
                Target Endpoint:
              </label>
              <input
                type="text"
                readOnly
                value={selectedPreset.url}
                className="w-full p-2 bg-black/60 border border-[#8C92A4]/20 rounded text-[11px] text-[#8C92A4] truncate"
              />
            </div>

            <div>
              <label className="text-[10px] text-[#8C92A4] uppercase tracking-wider block mb-1">
                Payload JSON:
              </label>
              <textarea
                readOnly
                value={selectedPreset.payload}
                rows={4}
                className="w-full p-2.5 bg-black/60 border border-[#8C92A4]/20 rounded text-xs text-[#A3FF00] font-mono"
              />
            </div>

            <button
              onClick={executeCall}
              disabled={loading}
              className="w-full py-2.5 rounded bg-[#FF7B00] hover:bg-[#ff8e24] text-black font-bold text-xs tracking-wider uppercase transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <RefreshCw size={13} className="animate-spin" />
                  INVOKING_EDGE_PIPELINE...
                </>
              ) : (
                <>
                  <Play size={13} />
                  EXECUTE_MACHINE_QUERY
                </>
              )}
            </button>
          </div>

          {/* Terminal Output */}
          <div className="lg:col-span-7 p-5 flex flex-col justify-between bg-black/70">
            <div>
              <div className="flex justify-between items-center text-xs pb-2 border-b border-[#8C92A4]/15 mb-3 text-[#8C92A4]">
                <span>RESPONSE STREAM</span>
                {statusCode && (
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      statusCode === 200
                        ? "bg-[#A3FF00]/15 text-[#A3FF00]"
                        : "bg-[#FF7B00]/15 text-[#FF7B00]"
                    }`}
                  >
                    HTTP {statusCode}
                  </span>
                )}
              </div>

              {output ? (
                <pre className="text-xs text-[#F4F1EA] overflow-x-auto p-3 bg-black/50 rounded border border-[#8C92A4]/20 max-h-[300px] leading-relaxed">
                  {output}
                </pre>
              ) : (
                <div className="h-[220px] flex flex-col items-center justify-center text-xs text-[#8C92A4]/60 space-y-2">
                  <Terminal size={28} className="stroke-[1.5]" />
                  <p>Awaiting query execution. Select preset and execute.</p>
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-[#8C92A4]/15 text-[10px] text-[#8C92A4] flex justify-between items-center">
              <span>RATE LIMIT: 100 REQ/MIN</span>
              <span className="text-[#A3FF00]">TLS 1.3 / DETERMINISTIC SETTLEMENT</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
