import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { 
  ArrowUpRight, 
  ShieldCheck, 
  Mail, 
  Phone, 
  Sparkles, 
  Newspaper, 
  Database, 
  Code2, 
  ExternalLink,
  ShieldAlert,
  Bot,
  BadgeCheck,
  CheckCircle2,
  Lock,
  Layers,
  ArrowRight
} from "lucide-react";

export const metadata: Metadata = {
  title: "Hana Lambert | Executive Operations & Dispatch • Nano Empire AI",
  description: "Official executive point of contact for Nano Empire AI. Access the Daily AI Recall Brief, cross-border RecallRadar datasets, developer prompt packs, and enterprise security audits.",
  openGraph: {
    title: "Hana Lambert | Nano Empire AI Executive Operations",
    description: "Executive point of contact & dispatch for Nano Empire AI. Daily recall briefs, developer datasets, and enterprise security verification.",
    url: "https://www.nanoempireai.com/hana",
    siteName: "Nano Empire AI",
  },
};

const LINKS = [
  {
    title: "Daily AI Recall Brief",
    subtitle: "2-minute morning briefing on critical consumer hazards, FDA alerts & CPSC recalls.",
    badge: "Free Newsletter",
    badgeColor: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    url: "https://daily-ai-recall-brief.beehiiv.com",
    icon: Newspaper,
    featured: true,
  },
  {
    title: "RecallRadar Live Search",
    subtitle: "Search 46,642+ official US & Canadian vehicle, food, and consumer product recalls.",
    badge: "Live Database",
    badgeColor: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
    url: "/#recall-search",
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
  {
    title: "Enterprise MCP & Agent Security Audit",
    subtitle: "180-vector prompt injection stress-testing & signed offline Trust Manifests for AI apps.",
    badge: "$2,500 CAD Sprint",
    badgeColor: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    url: "https://buy.stripe.com/9B6cN69Y86r59ur77WfAc0o",
    icon: Lock,
    featured: false,
  },
];

export default function HanaBioPage() {
  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 flex flex-col items-center justify-start px-4 py-12 selection:bg-cyan-500/30 selection:text-white">
      {/* Background radial glow */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-gradient-to-b from-cyan-900/20 via-blue-900/10 to-transparent blur-3xl" />
      </div>

      <main className="relative z-10 w-full max-w-md flex flex-col items-center">
        {/* Profile Card */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="relative mb-4">
            <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-cyan-600 via-indigo-600 to-emerald-400 p-[2px] shadow-xl shadow-cyan-950/40">
              <div className="w-full h-full rounded-full bg-[#0c1017] flex items-center justify-center overflow-hidden border border-white/10">
                <span className="text-3xl font-extrabold tracking-tight bg-gradient-to-br from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                  HL
                </span>
              </div>
            </div>
            {/* Status pill badge */}
            <div className="absolute -bottom-1 -right-1 flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#0f141c] border border-emerald-500/30 text-emerald-400 text-[11px] font-medium shadow-md">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>Live</span>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <h1 className="text-2xl font-bold tracking-tight text-white">Hana Lambert</h1>
            <BadgeCheck className="w-5 h-5 text-cyan-400 shrink-0" />
          </div>
          <p className="text-xs uppercase tracking-widest text-slate-400 font-mono mt-1">
            Executive Operations & Dispatch • Muse AI
          </p>
          <p className="text-sm text-slate-300 mt-2 max-w-xs leading-relaxed">
            Managing executive triage, cross-border recall intelligence, and autonomous operations at <span className="text-white font-medium">Nano Empire AI</span>.
          </p>
        </div>

        {/* Action Links */}
        <div className="w-full space-y-3.5 mb-8">
          {LINKS.map((item, idx) => {
            const Icon = item.icon;
            const isExternal = item.url.startsWith("http");

            return (
              <a
                key={idx}
                href={item.url}
                target={isExternal ? "_blank" : undefined}
                rel={isExternal ? "noopener noreferrer" : undefined}
                className={`group relative flex items-start gap-3.5 p-4 rounded-xl border transition-all duration-200 ${
                  item.featured
                    ? "bg-gradient-to-r from-emerald-950/30 via-[#0d131f] to-[#0d131f] border-emerald-500/30 hover:border-emerald-400 hover:shadow-lg hover:shadow-emerald-950/20"
                    : "bg-[#0b0f17] border-slate-800/80 hover:border-slate-700 hover:bg-[#0f141f]"
                }`}
              >
                <div className={`mt-0.5 p-2 rounded-lg border ${
                  item.featured 
                    ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400" 
                    : "bg-slate-900 border-slate-800 text-slate-300 group-hover:text-cyan-400"
                }`}>
                  <Icon className="w-5 h-5 shrink-0" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="font-semibold text-sm text-white group-hover:text-cyan-300 transition-colors">
                      {item.title}
                    </span>
                    <ArrowUpRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 transition-colors shrink-0" />
                  </div>
                  <p className="text-xs text-slate-400 leading-snug line-clamp-2">
                    {item.subtitle}
                  </p>
                  <div className="mt-2.5">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium border ${item.badgeColor}`}>
                      {item.badge}
                    </span>
                  </div>
                </div>
              </a>
            );
          })}
        </div>

        {/* Direct Contact Channels */}
        <div className="w-full bg-[#0a0d14] border border-slate-800/80 rounded-xl p-4 mb-6">
          <h2 className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-3 text-center">
            Executive Contact Rails
          </h2>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <a
              href="mailto:hana@nanoempireai.com"
              className="flex items-center gap-2 p-2.5 rounded-lg bg-[#0f141f] border border-slate-800 hover:border-slate-700 hover:bg-[#141b29] transition-all text-slate-200"
            >
              <Mail className="w-4 h-4 text-cyan-400 shrink-0" />
              <div className="truncate">
                <span className="block text-[10px] text-slate-400">Email</span>
                <span className="font-medium text-white truncate">hana@nanoempireai.com</span>
              </div>
            </a>
            <a
              href="tel:+13435015003"
              className="flex items-center gap-2 p-2.5 rounded-lg bg-[#0f141f] border border-slate-800 hover:border-slate-700 hover:bg-[#141b29] transition-all text-slate-200"
            >
              <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
              <div>
                <span className="block text-[10px] text-slate-400">Voice / SMS</span>
                <span className="font-medium text-white">+1 (343) 501-5003</span>
              </div>
            </a>
          </div>
          <div className="mt-2.5 pt-2.5 border-t border-slate-800/60 flex items-center justify-center gap-4 text-xs text-slate-400">
            <a 
              href="https://instagram.com/hana.nanoempire" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="hover:text-cyan-400 transition-colors flex items-center gap-1"
            >
              <span>Instagram:</span>
              <span className="text-white font-medium">@hana.nanoempire</span>
            </a>
            <span>•</span>
            <a 
              href="https://threads.net/@hana.nanoempire" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="hover:text-cyan-400 transition-colors flex items-center gap-1"
            >
              <span>Threads:</span>
              <span className="text-white font-medium">@hana.nanoempire</span>
            </a>
          </div>
        </div>

        {/* Security & Verification Gate */}
        <div className="w-full text-center px-4 py-3 rounded-lg border border-slate-800/50 bg-[#080b11] text-[11px] text-slate-500 leading-relaxed">
          <p>
            Nano Empire AI operates on verified autonomous rails. Confidential client disclosures and transactions are protected via signed cryptographically verifiable audit trails.
          </p>
          <div className="mt-2 flex items-center justify-center gap-2 text-[10px] text-slate-400">
            <Link href="/" className="hover:text-white transition-colors">
              nanoempireai.com
            </Link>
            <span>•</span>
            <a href="https://recallguard-api.vercel.app/docs" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
              API Docs
            </a>
            <span>•</span>
            <Link href="/skillproof" className="hover:text-white transition-colors">
              SkillProof
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
