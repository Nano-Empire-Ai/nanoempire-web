"use client";

import React, { useState, useEffect } from "react";
import { Wallet, Cpu, X, ArrowUpRight, Check, ShieldCheck, Download, Globe } from "lucide-react";

declare global {
  interface Window {
    solana?: any;
    ethereum?: any;
  }
}

export function ConnectEntityModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"human" | "agent" | "extension">("human");
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [walletType, setWalletType] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "connecting" | "connected">("idle");
  const [copied, setCopied] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Check if wallet is already connected
  useEffect(() => {
    let mounted = true;
    if (typeof window !== "undefined") {
      if (window.solana?.isConnected && window.solana.publicKey && mounted) {
        setWalletAddress(window.solana.publicKey.toString());
        setWalletType("Solana (Phantom)");
        setStatus("connected");
      }
    }
    return () => { mounted = false; };
  }, []);

  const connectPhantom = async () => {
    setErrorMsg(null);
    setStatus("connecting");
    try {
      if (typeof window !== "undefined" && window.solana?.isPhantom) {
        const resp = await window.solana.connect();
        const pubkey = resp.publicKey.toString();
        setWalletAddress(pubkey);
        setWalletType("Solana (Phantom)");
        setStatus("connected");
        setTimeout(() => setIsOpen(false), 1200);
      } else {
        setErrorMsg("Phantom wallet not detected. Install from phantom.app");
        window.open("https://phantom.app/", "_blank");
        setStatus("idle");
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Connection rejected by user.");
      setStatus("idle");
    }
  };

  const connectEVM = async () => {
    setErrorMsg(null);
    setStatus("connecting");
    try {
      if (typeof window !== "undefined" && window.ethereum) {
        const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
        if (accounts && accounts.length > 0) {
          setWalletAddress(accounts[0]);
          setWalletType("Base / EVM");
          setStatus("connected");
          setTimeout(() => setIsOpen(false), 1200);
        }
      } else {
        setErrorMsg("Web3 wallet (MetaMask/Coinbase) not detected.");
        window.open("https://metamask.io/", "_blank");
        setStatus("idle");
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Connection rejected by user.");
      setStatus("idle");
    }
  };

  const copyCurl = () => {
    navigator.clipboard.writeText("curl -s https://nanoempireai.com/llms.txt");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const disconnect = () => {
    setWalletAddress(null);
    setWalletType(null);
    setStatus("idle");
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="px-3.5 py-1.5 liquid-glass rounded font-mono text-xs tracking-wider text-[#F4F1EA] hover:text-[#FF7B00] transition-colors flex items-center gap-2 border border-[#8C92A4]/25"
      >
        <span className="pulse-dot"></span>
        <span>
          {status === "connected" && walletAddress 
            ? `${walletType}: ${walletAddress.slice(0, 4)}...${walletAddress.slice(-4)}`
            : "CONNECT_WALLET"}
        </span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4 font-mono">
          <div className="liquid-glass w-full max-w-lg rounded-lg overflow-hidden border border-[#8C92A4]/30 shadow-2xl">
            {/* Header bar */}
            <div className="px-5 py-3 border-b border-[#8C92A4]/20 flex items-center justify-between bg-black/50">
              <div className="flex items-center gap-2 text-xs text-[#8C92A4]">
                <span className="text-[#FF7B00]">[0x00]</span>
                <span>AUTHENTICATION_&_EXTENSION</span>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-[#8C92A4] hover:text-white">
                <X size={16} />
              </button>
            </div>
            
            <div className="p-6">
              {/* Tab selector */}
              <div className="grid grid-cols-3 gap-2 p-1 bg-black/60 rounded border border-[#8C92A4]/20 mb-6 text-xs">
                <button 
                  className={`py-2 px-2 rounded flex items-center justify-center gap-1.5 transition-all text-center ${
                    activeTab === "human" 
                      ? "bg-[#1A1E26] text-[#F4F1EA] border border-[#8C92A4]/30 font-bold" 
                      : "text-[#8C92A4] hover:text-white"
                  }`}
                  onClick={() => setActiveTab("human")}
                >
                  <Wallet size={13} className="text-[#FF7B00]" />
                  WALLETS
                </button>
                <button 
                  className={`py-2 px-2 rounded flex items-center justify-center gap-1.5 transition-all text-center ${
                    activeTab === "agent" 
                      ? "bg-[#1A1E26] text-[#A3FF00] border border-[#A3FF00]/30 font-bold" 
                      : "text-[#8C92A4] hover:text-[#A3FF00]"
                  }`}
                  onClick={() => setActiveTab("agent")}
                >
                  <Cpu size={13} className="text-[#A3FF00]" />
                  x402 NODE
                </button>
                <button 
                  className={`py-2 px-2 rounded flex items-center justify-center gap-1.5 transition-all text-center ${
                    activeTab === "extension" 
                      ? "bg-[#1A1E26] text-[#FF7B00] border border-[#FF7B00]/30 font-bold" 
                      : "text-[#8C92A4] hover:text-[#FF7B00]"
                  }`}
                  onClick={() => setActiveTab("extension")}
                >
                  <Globe size={13} className="text-[#FF7B00]" />
                  EXTENSION
                </button>
              </div>

              {/* Status or Error Banner */}
              {errorMsg && (
                <div className="mb-4 p-2.5 bg-red-500/10 border border-red-500/30 rounded text-red-400 text-xs">
                  {errorMsg}
                </div>
              )}

              {/* Connected State */}
              {status === "connected" && walletAddress && (
                <div className="mb-4 p-3 bg-[#A3FF00]/10 border border-[#A3FF00]/30 rounded space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-[#A3FF00] font-bold flex items-center gap-1">
                      <ShieldCheck size={14} /> {walletType} Connected
                    </span>
                    <button onClick={disconnect} className="text-red-400 hover:underline text-[10px]">
                      Disconnect
                    </button>
                  </div>
                  <div className="text-[11px] text-white break-all font-mono">
                    {walletAddress}
                  </div>
                </div>
              )}

              {/* Human Crypto Wallets */}
              {activeTab === "human" && (
                <div className="space-y-3 text-xs">
                  <p className="text-[#8C92A4] text-[11px] leading-relaxed">
                    Connect browser wallet to fund prepaid machine credits or sign settlement challenges:
                  </p>
                  
                  <button 
                    onClick={connectPhantom} 
                    className="w-full liquid-glass hover:bg-[#1A1E26] p-3.5 rounded flex items-center justify-between border border-[#8C92A4]/20 transition-all text-left group"
                  >
                    <div className="flex flex-col">
                      <span className="text-[#F4F1EA] font-bold text-sm group-hover:text-[#FF7B00] transition-colors">Phantom (Solana)</span>
                      <span className="text-[#8C92A4] text-[10px]">Instant sub-400ms USDC & SOL micro-settlement</span>
                    </div>
                    <ArrowUpRight size={16} className="text-[#FF7B00]" />
                  </button>

                  <button 
                    onClick={connectEVM} 
                    className="w-full liquid-glass hover:bg-[#1A1E26] p-3.5 rounded flex items-center justify-between border border-[#8C92A4]/20 transition-all text-left group"
                  >
                    <div className="flex flex-col">
                      <span className="text-[#F4F1EA] font-bold text-sm group-hover:text-[#A3FF00] transition-colors">MetaMask / Coinbase (Base)</span>
                      <span className="text-[#8C92A4] text-[10px]">EVM Chain ID 8453 (Coinbase AgentKit native)</span>
                    </div>
                    <ArrowUpRight size={16} className="text-[#A3FF00]" />
                  </button>
                </div>
              )}

              {/* Machine Token Handshake */}
              {activeTab === "agent" && (
                <div className="space-y-4 text-xs">
                  <p className="text-[#8C92A4] text-[11px] leading-relaxed">
                    Autonomous agents transact via x402 headers without human approval:
                  </p>

                  <div className="p-3 bg-black/80 rounded border border-[#8C92A4]/20 space-y-2">
                    <div className="flex justify-between items-center text-[10px] text-[#8C92A4]">
                      <span>MANIFEST RECONNAISSANCE</span>
                      <button onClick={copyCurl} className="text-[#FF7B00] hover:underline flex items-center gap-1">
                        {copied ? <Check size={11} /> : null}
                        {copied ? "COPIED" : "COPY CURL"}
                      </button>
                    </div>
                    <code className="block text-[11px] text-[#A3FF00] overflow-x-auto pb-1">
                      curl -s https://nanoempireai.com/llms.txt
                    </code>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase text-[#8C92A4] tracking-wider">Bearer / x402 Challenge Nonce</label>
                    <input 
                      type="text" 
                      placeholder="x402-nonce:sha256-d8a2... / prepaid-key" 
                      className="w-full p-2.5 rounded bg-black/60 border border-[#8C92A4]/30 text-white placeholder:text-[#8C92A4]/50 focus:border-[#FF7B00] outline-none text-xs"
                    />
                  </div>
                </div>
              )}

              {/* Chrome Extension Download Tab */}
              {activeTab === "extension" && (
                <div className="space-y-4 text-xs">
                  <div className="p-3.5 liquid-glass rounded border border-[#FF7B00]/30 space-y-2">
                    <div className="flex items-center gap-2 text-[#FF7B00] font-bold text-sm">
                      <Globe size={16} />
                      Nano Empire Chrome Extension v1.0
                    </div>
                    <p className="text-[11px] text-[#8C92A4] leading-relaxed">
                      Monitor live GPU rates ($2.78 H100 tape), inspect machine receipts, and authorize x402 micropayments directly from your browser.
                    </p>
                  </div>

                  <div className="space-y-2 text-[11px] text-[#8C92A4]">
                    <div className="font-bold text-white">How to Install in 30 Seconds:</div>
                    <ol className="list-decimal list-inside space-y-1 pl-1">
                      <li>Download the packaged zip below.</li>
                      <li>Unzip to a local folder.</li>
                      <li>Open <code className="text-[#A3FF00]">chrome://extensions</code> in Chrome.</li>
                      <li>Enable <b>Developer mode</b> (top-right toggle).</li>
                      <li>Click <b>Load unpacked</b> and select the folder.</li>
                    </ol>
                  </div>

                  <a 
                    href="/nano-empire-extension.zip"
                    download="nano-empire-extension.zip"
                    className="w-full py-3 rounded bg-[#FF7B00] hover:bg-[#ff8e24] text-black font-bold text-xs tracking-wider uppercase transition-all flex items-center justify-center gap-2"
                  >
                    <Download size={14} />
                    Download Chrome Extension (.ZIP)
                  </a>
                </div>
              )}

              {status === "connecting" && (
                <div className="mt-4 p-2 bg-[#FF7B00]/10 border border-[#FF7B00]/30 rounded text-center text-xs font-mono text-[#FF7B00] animate-pulse">
                  NEGOTIATING_LEDGER_HANDSHAKE...
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
