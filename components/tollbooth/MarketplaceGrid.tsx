"use client";

import React, { useState } from "react";
import { ArrowUpRight, Copy, Check, Terminal } from "lucide-react";

type Tollbooth = {
  id: string;
  name: string;
  category: string;
  rate: string;
  asset: string;
  endpoint: string;
  status: "LIVE" | "BETA";
  description: string;
};

const TOLLBOOTHS: Tollbooth[] = [
  {
    id: "01",
    name: "WeatherTollbooth",
    category: "ORACLE_METEOROLOGY",
    rate: "0.05 USDC",
    asset: "Solana / Base",
    endpoint: "https://nano-mcp-weather-yvbxeel47a-uc.a.run.app",
    status: "LIVE",
    description: "Meteorological real-time telemetry stream. Deterministic x402 pay-per-query challenge protocol.",
  },
  {
    id: "02",
    name: "CryptoPriceOracle",
    category: "MARKET_INTELLIGENCE",
    rate: "0.01 USDC",
    asset: "Solana / Base",
    endpoint: "https://nano-mcp-cryptopriceoracle-yvbxeel47a-uc.a.run.app",
    status: "LIVE",
    description: "Sub-second aggregate cross-exchange pricing oracle engineered for autonomous high-frequency agents.",
  },
  {
    id: "03",
    name: "IPGeoLocator",
    category: "ROUTING_NETWORK",
    rate: "0.01 USDC",
    asset: "Solana / Base",
    endpoint: "https://nano-mcp-ipgeolocator-yvbxeel47a-uc.a.run.app",
    status: "LIVE",
    description: "BGP / Autonomous System Number physical geolocation resolution with anti-sybil attribution tags.",
  },
  {
    id: "04",
    name: "PublicJokeGenerator",
    category: "SYNTHETIC_CULTURE",
    rate: "0.01 USDC",
    asset: "Solana / Base",
    endpoint: "https://nano-mcp-publicjokegenerator-yvbxeel47a-uc.a.run.app",
    status: "LIVE",
    description: "Structured humorous copy generation and social-proof banter for autonomous Twitter/X bots.",
  },
];

export function MarketplaceGrid() {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copyEndpoint = (id: string, endpoint: string) => {
    navigator.clipboard.writeText(endpoint);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="w-full max-w-6xl mx-auto my-14 font-mono">
      {/* Editorial Header */}
      <div className="flex items-center gap-3 text-xs tracking-widest uppercase text-[#8C92A4] mb-3">
        <span className="text-[#FF7B00]">[03]</span>
        <span>PRODUCTION_TOLLBOOTH_REGISTRY</span>
        <span className="h-[1px] flex-1 bg-[#8C92A4]/20"></span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {TOLLBOOTHS.map((item) => (
          <div
            key={item.id}
            className="liquid-glass p-5 rounded-lg border border-[#8C92A4]/20 flex flex-col justify-between hover:border-[#FF7B00]/40 transition-all duration-300 group"
          >
            <div>
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-[#FF7B00] font-bold">[{item.id}]</span>
                  <span className="text-[#8C92A4] text-[11px] uppercase tracking-wider">{item.category}</span>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold tracking-wider text-[#A3FF00] bg-[#A3FF00]/10 border border-[#A3FF00]/30">
                  {item.status}
                </span>
              </div>

              <h3 className="text-lg font-bold text-[#F4F1EA] tracking-tight mb-2 group-hover:text-[#FF7B00] transition-colors">
                {item.name}
              </h3>
              <p className="text-xs text-[#8C92A4] leading-relaxed mb-4">
                {item.description}
              </p>
            </div>

            <div className="pt-3 border-t border-[#8C92A4]/15 space-y-2.5">
              <div className="flex justify-between items-center text-xs">
                <span className="text-[#8C92A4]">TOLL RATE:</span>
                <span className="text-[#F4F1EA] font-bold">{item.rate}</span>
              </div>

              <div className="flex items-center justify-between gap-2 p-2 bg-black/60 rounded border border-[#8C92A4]/15 text-[11px]">
                <code className="text-[#8C92A4] truncate flex-1">
                  {item.endpoint}
                </code>
                <button
                  onClick={() => copyEndpoint(item.id, item.endpoint)}
                  className="text-[#FF7B00] hover:text-white transition-colors p-1"
                  title="Copy endpoint URL"
                >
                  {copiedId === item.id ? <Check size={13} className="text-[#A3FF00]" /> : <Copy size={13} />}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
