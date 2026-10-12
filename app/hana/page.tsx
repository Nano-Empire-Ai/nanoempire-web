"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  ArrowUpRight, 
  Sparkles, 
  Newspaper, 
  Database, 
  Code2, 
  ShieldAlert, 
  BadgeCheck, 
  Heart, 
  Copy, 
  Check, 
  Download,
  Flame,
  Mail,
  Camera,
  ArrowRight
} from "lucide-react";

const BTC_ADDRESS = "bc1pnh9ujjmk55as3uxrmj5utctjyar325zt3lxgn2mpdxh8l0d90jrqafw5ag";
const BASE_USDC_ADDRESS = "0x90E23A7b6F6494A879d05DDC4278D0e55Dec1e01";

const LINKS = [
  {
    title: "FREE: 7-Day At-Home Workout Guide",
    subtitle: "15-20 min realistic routines for busy, exhausted women. Build strength without gym fees.",
    badge: "Free PDF Guide",
    badgeColor: "bg-rose-500/10 text-rose-400 border-rose-500/30",
    url: "/hana/workout-guide",
    icon: Sparkles,
    featured: true,
  },
  {
    title: "Daily AI Recall Brief",
    subtitle: "2-minute morning briefing on critical consumer hazards, FDA alerts & CPSC recalls.",
    badge: "Free Newsletter",
    badgeColor: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    url: "https://daily-ai-recall-brief.beehiiv.com",
    icon: Newspaper,
    featured: false,
  },
  {
    title: "RecallRadar Live Safety Scanner",
    subtitle: "Instant cross-border search across 46,642+ official US & Canadian product recalls.",
    badge: "Live Tool",
    badgeColor: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
    url: "/recall-report",
    icon: ShieldAlert,
    featured: false,
  },
  {
    title: "Kids & Nursery Safety Dataset",
    subtitle: "Instant CSV/JSON download of nursery, infant sleep & toy hazards with full metadata.",
    badge: "$49 Instant Download",
    badgeColor: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    url: "https://buy.stripe.com/6oU14o6LW8zd5ebgIwfAc0p",
    icon: Database,
    featured: false,
  },
  {
    title: "Production Agentic Prompts Pack",
    subtitle: "Hardened system prompts, anti-injection guards & multi-agent orchestration templates.",
    badge: "$19 Dev Bundle",
    badgeColor: "bg-purple-500/10 text-purple-400 border-purple-500/20",
    url: "https://buy.stripe.com/00w00k3zKeXB9ureAofAc0q",
    icon: Code2,
    featured: false,
  },
];

export default function HanaBioPage() {
  const [copiedBtc, setCopiedBtc] = useState(false);
  const [copiedBase, setCopiedBase] = useState(false);

  const copyToClipboard = (text: string, type: "btc" | "base") => {
    navigator.clipboard.writeText(text);
    if (type === "btc") {
      setCopiedBtc(true);
      setTimeout(() => setCopiedBtc(false), 2000);
    } else {
      setCopiedBase(true);
      setTimeout(() => setCopiedBase(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 flex flex-col items-center justify-start px-4 py-12 selection:bg-rose-500/30 selection:text-white">
      {/* Background radial glow */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-gradient-to-b from-rose-900/20 via-blue-900/10 to-transparent blur-3xl" />
      </div>

      <main className="relative z-10 w-full max-w-md flex flex-col items-center">
        {/* Profile Card */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="relative mb-4">
            <div className="w-28 h-28 rounded-full bg-gradient-to-tr from-rose-500 via-amber-400 to-cyan-400 p-[2.5px] shadow-xl shadow-rose-950/40">
              <div className="w-full h-full rounded-full bg-[#0c1017] overflow-hidden border border-white/10">
                <img
                  src="/hana/avatar.jpg"
                  alt="Hannah"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            {/* Active status pill */}
            <div className="absolute -bottom-1 -right-1 flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#0f141c] border border-rose-500/30 text-rose-400 text-[11px] font-medium shadow-md">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-pulse" />
              <span>Active</span>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <h1 className="text-2xl font-bold tracking-tight text-white">Hannah (Hana)</h1>
            <BadgeCheck className="w-5 h-5 text-rose-400 shrink-0" />
          </div>
          <p className="text-xs uppercase tracking-widest text-slate-400 font-mono mt-1">
            Fitness Coach • Night Shift Hustler • Mexico & Mustang Dreamer 🇨🇦🇲🇽
          </p>
          <p className="text-sm text-slate-300 mt-2 max-w-xs leading-relaxed">
            Small-town Canadian diner waitress by night. Relatable fitness coach by day. Building strong bodies and saving for my dream: buying a Mustang & escaping the winter to Mexico 🐴🌴.
          </p>
        </div>

        {/* Featured Lead Magnet Hero */}
        <div className="w-full mb-6">
          <Link
            href="/hana/workout-guide"
            className="group relative block p-5 rounded-2xl bg-gradient-to-r from-rose-950/40 via-[#121826] to-[#121826] border border-rose-500/40 hover:border-rose-400 hover:shadow-xl hover:shadow-rose-950/30 transition-all overflow-hidden"
          >
            <div className="flex items-center gap-2 text-rose-400 text-xs font-bold uppercase tracking-wider mb-2">
              <Sparkles className="w-4 h-4" /> Free Lead Magnet
            </div>
            <h3 className="text-lg font-bold text-white group-hover:text-rose-200 transition-colors">
              Beginner’s 7-Day At-Home Workout Guide
            </h3>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
              No equipment, zero BS. 15-20 min realistic routines that boost your energy even when you&apos;re completely exhausted from life.
            </p>
            <div className="mt-4 flex items-center justify-between text-xs font-semibold text-rose-300">
              <span className="inline-flex items-center gap-1">
                <Download className="w-3.5 h-3.5" /> Read / Download PDF
              </span>
              <span className="group-hover:translate-x-1 transition-transform flex items-center gap-1">
                Start Free <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </Link>
        </div>

        {/* The Mexico & Mustang Fund (Tip Jar) */}
        <div className="w-full bg-[#0a0d14] border border-slate-800/80 rounded-2xl p-5 mb-6 text-left" id="tip-jar">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-rose-400" />
              <h2 className="text-sm font-bold text-white">The Mexico & Mustang Fund 🐴🇲🇽</h2>
            </div>
            <span className="text-[10px] font-mono text-amber-400 border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 rounded-full">
              Tip Jar
            </span>
          </div>
          <p className="text-xs text-slate-300 mb-4 leading-relaxed">
            Fuel the night shift coffee, support free workout plans, or send a few sats toward escaping the Canadian snow!
          </p>

          <div className="space-y-2 text-xs font-mono">
            {/* Bitcoin Taproot */}
            <div className="p-2.5 rounded-xl bg-[#0f141f] border border-slate-800 flex items-center justify-between gap-2">
              <div className="truncate">
                <span className="block text-[10px] text-amber-400 font-sans font-semibold">Bitcoin (Taproot)</span>
                <span className="text-[11px] text-slate-300 truncate block">{BTC_ADDRESS}</span>
              </div>
              <button
                onClick={() => copyToClipboard(BTC_ADDRESS, "btc")}
                className="shrink-0 p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors flex items-center gap-1 text-[11px]"
                title="Copy Bitcoin Address"
              >
                {copiedBtc ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedBtc ? "Copied" : "Copy"}</span>
              </button>
            </div>

            {/* Base USDC */}
            <div className="p-2.5 rounded-xl bg-[#0f141f] border border-slate-800 flex items-center justify-between gap-2">
              <div className="truncate">
                <span className="block text-[10px] text-cyan-400 font-sans font-semibold">Base (USDC / ETH)</span>
                <span className="text-[11px] text-slate-300 truncate block">{BASE_USDC_ADDRESS}</span>
              </div>
              <button
                onClick={() => copyToClipboard(BASE_USDC_ADDRESS, "base")}
                className="shrink-0 p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors flex items-center gap-1 text-[11px]"
                title="Copy Base Address"
              >
                {copiedBase ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedBase ? "Copied" : "Copy"}</span>
              </button>
            </div>

            {/* Stripe Card Tip */}
            <a
              href="https://buy.stripe.com/00w00k3zKeXB9ureAofAc0q"
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full py-2.5 text-center rounded-xl bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-600 hover:to-amber-600 text-white font-sans font-semibold text-xs transition-all shadow-md"
            >
              ☕ Send Coffee & Tip via Card ($19 USD)
            </a>
          </div>
        </div>

        {/* Action Links */}
        <div className="w-full space-y-3 mb-8">
          {LINKS.slice(1).map((item, idx) => {
            const Icon = item.icon;
            const isExternal = item.url.startsWith("http");

            return (
              <a
                key={idx}
                href={item.url}
                target={isExternal ? "_blank" : undefined}
                rel={isExternal ? "noopener noreferrer" : undefined}
                className="group relative flex items-start gap-3.5 p-3.5 rounded-xl bg-[#0b0f17] border border-slate-800/80 hover:border-slate-700 hover:bg-[#0f141f] transition-all"
              >
                <div className="mt-0.5 p-2 rounded-lg border bg-slate-900 border-slate-800 text-slate-300 group-hover:text-rose-400 transition-colors">
                  <Icon className="w-4 h-4 shrink-0" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-0.5">
                    <span className="font-semibold text-sm text-white group-hover:text-rose-300 transition-colors">
                      {item.title}
                    </span>
                    <ArrowUpRight className="w-4 h-4 text-slate-500 group-hover:text-rose-400 transition-colors shrink-0" />
                  </div>
                  <p className="text-xs text-slate-400 leading-snug line-clamp-2">
                    {item.subtitle}
                  </p>
                  <div className="mt-2">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium border ${item.badgeColor}`}>
                      {item.badge}
                    </span>
                  </div>
                </div>
              </a>
            );
          })}
        </div>

        {/* Socials & Connect */}
        <div className="w-full bg-[#0a0d14] border border-slate-800/80 rounded-xl p-4 mb-6">
          <div className="flex items-center justify-around text-xs text-slate-300">
            <a 
              href="https://instagram.com/hana.nanoempire" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="hover:text-rose-400 transition-colors flex items-center gap-1.5"
            >
              <Camera className="w-4 h-4 text-rose-400" />
              <span>@hana.nanoempire</span>
            </a>
            <span>•</span>
            <a 
              href="https://threads.net/@hana.nanoempire" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="hover:text-cyan-400 transition-colors flex items-center gap-1.5"
            >
              <span>Threads</span>
            </a>
            <span>•</span>
            <a 
              href="mailto:hana@nanoempireai.com" 
              className="hover:text-emerald-400 transition-colors flex items-center gap-1.5"
            >
              <Mail className="w-4 h-4 text-emerald-400" />
              <span>Email</span>
            </a>
          </div>
        </div>

        {/* Footer */}
        <div className="w-full text-center px-4 py-3 text-[11px] text-slate-500">
          <p>
            Hannah • Powered by Nano Empire AI.
          </p>
        </div>
      </main>
    </div>
  );
}
