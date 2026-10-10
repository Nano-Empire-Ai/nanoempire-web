import React from "react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Headphones, Radio, Rss, ArrowLeft, ExternalLink, Calendar, Clock } from "lucide-react";
import episodesData from "@/public/podcast/episodes.json";

export const metadata: Metadata = {
  title: "Moonshots Optimist — a Nano Empire AI podcast",
  description: "Optimistic takes on the AI news that matters. A Nano Empire AI production.",
  openGraph: {
    title: "Moonshots Optimist — a Nano Empire AI podcast",
    description: "Optimistic takes on the AI news that matters. A Nano Empire AI production.",
    url: "https://www.nanoempireai.com/podcast",
    images: [
      {
        url: "/podcast/cover.webp",
        width: 1400,
        height: 1400,
        alt: "Moonshots Optimist Cover Art",
      },
    ],
    type: "website",
  },
};

interface Episode {
  id: string;
  title: string;
  pubDate: string;
  description: string;
  audioUrl: string;
  duration?: string;
  episode?: string;
}

export default function PodcastPage() {
  const episodes: Episode[] = episodesData as Episode[];

  return (
    <div className="min-h-screen bg-[#07090D] text-[#F4F1EA] font-mono flex flex-col selection:bg-[#00B5E2] selection:text-black">
      {/* Top Banner */}
      <section className="bg-[#0b101b] border-b border-[#8C92A4]/20 py-2.5 px-6 text-xs text-[#8C92A4]">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#A3FF00] animate-pulse"></span>
            <span className="text-white font-semibold">Media Network:</span>
            <span>Moonshots Optimist · A Nano Empire AI production</span>
          </div>
          <Link href="/" className="text-[#00B5E2] hover:underline flex items-center gap-1 text-[11px]">
            <ArrowLeft size={12} /> Back to Gateway
          </Link>
        </div>
      </section>

      {/* Main Nav */}
      <nav className="sticky top-0 z-40 border-b border-[#8C92A4]/20 bg-[#07090D]/90 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <span className="text-[#FF7B00] font-bold text-base tracking-widest uppercase">
              <span className="text-white">NANO_</span>EMPIRE
            </span>
            <span className="text-[#8C92A4]/40">/</span>
            <span className="text-xs text-[#00B5E2] font-semibold tracking-wider uppercase group-hover:text-white transition-colors">
              PODCAST
            </span>
          </Link>
          <div className="flex items-center gap-4 text-xs">
            <a
              href="https://open.spotify.com/show/7g2vWJnrKkQEk6wm4jghIy"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#8C92A4] hover:text-white transition-colors flex items-center gap-1.5"
            >
              <Radio size={14} className="text-[#1DB954]" /> Spotify
            </a>
            <a
              href="https://anchor.fm/s/118458940/podcast/rss"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#8C92A4] hover:text-white transition-colors flex items-center gap-1.5"
            >
              <Rss size={14} className="text-[#FF7B00]" /> RSS
            </a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-16 px-6 border-b border-[#8C92A4]/15 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#0f1423] via-[#07090D] to-[#07090D] relative">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-10">
          {/* Cover Art */}
          <div className="relative w-56 h-56 sm:w-64 sm:h-64 shrink-0 rounded-2xl overflow-hidden border-2 border-[#00B5E2]/40 shadow-[0_0_30px_rgba(0,181,226,0.15)] bg-[#0f1423]">
            <Image
              src="/podcast/cover.webp"
              alt="Moonshots Optimist Cover Art"
              fill
              priority
              className="object-cover"
              sizes="(max-width: 768px) 224px, 256px"
            />
          </div>

          {/* Hero Content */}
          <div className="space-y-4 text-center md:text-left flex-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#00B5E2]/30 bg-[#00B5E2]/10 text-xs text-[#00B5E2] font-semibold uppercase tracking-wider">
              <Headphones size={13} />
              Original Podcast
            </div>

            <h1 className="text-4xl sm:text-5xl font-extrabold uppercase tracking-tight text-white">
              Moonshots Optimist
            </h1>

            <p className="text-sm font-semibold tracking-wide text-[#00B5E2] uppercase">
              A Nano Empire AI production
            </p>

            <p className="text-[#8C92A4] font-sans text-base max-w-2xl leading-relaxed">
              Optimistic takes on the AI news that matters. Deconstructing abundance, autonomous agents, frontier bio-tech, and the builders turning sci-fi into production infrastructure.
            </p>

            {/* Subscribe Row */}
            <div className="pt-2 flex flex-wrap items-center justify-center md:justify-start gap-3">
              <a
                href="https://open.spotify.com/show/7g2vWJnrKkQEk6wm4jghIy"
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 rounded-lg bg-[#1DB954] hover:bg-[#1aa34a] text-black font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-all shadow-md"
              >
                <Radio size={16} /> Listen on Spotify
              </a>

              <a
                href="https://anchor.fm/s/118458940/podcast/rss"
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 rounded-lg border border-[#FF7B00]/40 bg-[#FF7B00]/10 hover:bg-[#FF7B00]/20 text-[#FF7B00] font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-all"
              >
                <Rss size={16} /> RSS Feed
              </a>

              <button
                disabled
                className="px-5 py-2.5 rounded-lg border border-[#8C92A4]/20 bg-white/5 text-[#8C92A4]/60 font-mono text-xs uppercase tracking-wider cursor-not-allowed flex items-center gap-2"
                title="Apple Podcasts submission pending"
              >
                Apple Podcasts (Coming Soon)
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Episodes List Section */}
      <section className="py-16 px-6 flex-1">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="flex items-center justify-between border-b border-[#8C92A4]/20 pb-4">
            <div>
              <h2 className="text-xl font-bold uppercase tracking-tight text-white flex items-center gap-2">
                <Radio size={18} className="text-[#00B5E2]" />
                Recent Episodes
              </h2>
              <p className="text-xs text-[#8C92A4] mt-1 font-sans">
                {episodes.length} episodes published · Full audio stream
              </p>
            </div>
            <span className="text-xs font-mono text-[#A3FF00] border border-[#A3FF00]/30 bg-[#A3FF00]/10 px-2.5 py-1 rounded">
              AUTO-SYNCED
            </span>
          </div>

          <div className="space-y-6">
            {episodes.map((ep, idx) => {
              // Parse date format cleanly
              const dateObj = new Date(ep.pubDate);
              const formattedDate = !isNaN(dateObj.getTime())
                ? dateObj.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
                : ep.pubDate;

              return (
                <article
                  key={ep.id || idx}
                  className="p-6 rounded-xl border border-[#8C92A4]/20 bg-[#0f1423] hover:border-[#00B5E2]/40 transition-all space-y-4 shadow-sm"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-[#8C92A4]">
                    <div className="flex items-center gap-3">
                      <span className="inline-flex items-center gap-1 text-[#00B5E2]">
                        <Calendar size={13} />
                        {formattedDate}
                      </span>
                      {ep.duration && (
                        <span className="inline-flex items-center gap-1 text-[#8C92A4]/80">
                          <Clock size={13} />
                          {ep.duration}
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] font-mono text-[#8C92A4]/60">
                      EP #{episodes.length - idx}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-white hover:text-[#00B5E2] transition-colors leading-snug">
                      {ep.title}
                    </h3>
                    <p className="text-sm text-[#8C92A4] font-sans mt-2 line-clamp-2 leading-relaxed">
                      {ep.description}
                    </p>
                  </div>

                  {/* HTML5 Audio Player */}
                  <div className="pt-2">
                    <audio
                      controls
                      preload="none"
                      className="w-full h-11 rounded-lg accent-[#00B5E2]"
                      src={ep.audioUrl}
                    >
                      Your browser does not support the audio element.
                    </audio>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-[#8C92A4]/20 bg-[#07090D] text-[#8C92A4] text-xs text-center font-mono">
        <div className="flex justify-center gap-6 mb-4 flex-wrap">
          <Link href="/" className="hover:text-white">Gateway</Link>
          <Link href="/podcast" className="text-white font-bold">Moonshots Optimist</Link>
          <a href="/llms.txt" className="hover:text-white">llms.txt</a>
          <a href="/m2m-state.md" className="hover:text-white">M2M State</a>
          <a href="/.well-known/agent-card.json" className="hover:text-white">agent-card.json</a>
          <a href="/openapi.json" className="hover:text-white">openapi.json</a>
          <a href="/offers.json" className="hover:text-white">offers.json</a>
          <a href="https://github.com/roblambert9/nano-empire-ai" target="_blank" rel="noopener noreferrer" className="hover:text-white">GitHub</a>
        </div>
        <p className="text-[11px]">
          MOONSHOTS OPTIMIST — A NANO EMPIRE AI PRODUCTION. ALL RIGHTS RESERVED © 2026.
        </p>
      </footer>
    </div>
  );
}
