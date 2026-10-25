"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  BadgeCheck,
  Camera,
  Check,
  Copy,
  Download,
  Flame,
  Heart,
  Mail,
  Sparkles,
} from "lucide-react";
import {
  hero,
  dinerPlaid,
  diner,
  kitchen,
  mirror,
  stretch,
  coverStretch,
  coverDiner,
  coverGym,
} from "./photos";

const HANDLE = "@hana.nanoempire";
const TIP_LINK = "https://buy.stripe.com/4gM4gA8U4bLpbCzfEsfAc0r";
const BTC_ADDRESS = "3PPLt4cZnqkUnskQpyFKujTdTrZuDh8nom";
const INSTAGRAM = "https://instagram.com/hana.nanoempire";
const THREADS = "https://threads.net/@hana.nanoempire";
const EMAIL = "mailto:hana@nanoempireai.com";

const WORK_TILES = [
  { n: "001", label: "DISCIPLINE", img: stretch, alt: "Hana stretching after a workout" },
  { n: "002", label: "RESET", img: mirror, alt: "Hana's morning mirror selfie" },
  { n: "003", label: "ENERGY", img: diner, alt: "Hana on shift at the diner counter" },
  { n: "004", label: "JOY", img: kitchen, alt: "Hana prepping vegetables in her kitchen" },
];

const MOTION_CARDS = [
  { img: coverStretch, alt: "Behind the reps — video cover", title: "Behind the reps", sub: "Training notes in motion" },
  { img: coverDiner, alt: "Everyday energy — video cover", title: "Everyday energy", sub: "Candid moments" },
  { img: coverGym, alt: "Studio notes — video cover", title: "Studio notes", sub: "Good days, honest work" },
];

const SAMPLE_MONTH = [
  { week: "WEEK 01", title: "Close look", text: "A complete member photo journal." },
  { week: "WEEK 02", title: "Move with me", text: "A strength or movement note you can actually use." },
  { week: "WEEK 03", title: "Hana cooks", text: "One easy food ritual, from kitchen to plate." },
  { week: "WEEK 04", title: "In your ear", text: "A longer voice drop or playful pep talk." },
];

const STORY = [
  "Hey everyone... if I look a little exhausted right now, it’s because I am. I’m Hana, and I just finished another lovely, ten-hour shift slinging eggs and coffee at the diner down the road. Honestly, my feet are officially staging a protest as we speak, and I’m pretty sure my blood type is currently ninety percent espresso.",
  "But I wanted to jump on here tonight and introduce myself properly. I grew up right here in small-town Canada, where the winters are freezing, the nights are way too long, and honestly, the big opportunities aren’t exactly knocking down my front door. But I’ve always had this dream. A big one. I want to buy my own horse — specifically, a Mustang — and I want to pack up, escape this cold weather forever, and move down to Mexico.",
  "That dream is the reason I’m working these crazy night shifts, but it’s also the reason I started this fitness page. A couple of years ago, I realized that if I wanted to pull myself out of this endless routine, I needed to build a strong foundation first, both mentally and physically. Fitness became my escape. It became the one hour of the day that was completely mine, where I could push my limits, get stronger, and prove to myself that I have the discipline to completely change my life.",
  "And I want to help you do the exact same thing. This page is going to be a mix of everything. I’ll be sharing my favorite workout routines — from high-energy circuits that you can do at home, to deep yoga stretches for when your back is just as sore as mine is. I’ll share my best diet tips for staying on track, even when you work around a deep fryer all night. But most importantly, I’m going to share the real, unfiltered hustle. We can inspire each other to stay active, get stronger, and chase whatever our personal “Mexico” is.",
  "I also want to give a massive shoutout to everyone who has already contributed to the “Mexico and Mustang Fund” tip jar on my website. Seriously, every time a Bitcoin tip comes through, that’s one less hour I have to spend on my feet, and one step closer to riding that horse on a sunny beach.",
  "So... grab your water bottle, stretch out those legs, and let’s get to work.",
];

export default function HanaFanPage() {
  const [copied, setCopied] = useState<string | null>(null);

  const copy = (text: string, key: string) => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(text).catch(() => {});
    }
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 selection:bg-rose-500/30 selection:text-white">
      {/* Background glow */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-gradient-to-b from-rose-900/20 via-blue-900/10 to-transparent blur-3xl" />
      </div>

      {/* Header */}
      <header className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 pt-6 flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-lg font-bold tracking-tight text-white leading-none">Hana</p>
          <p className="text-[11px] text-slate-400 mt-1 truncate">
            A digital original, coming to life in public
          </p>
        </div>
        <nav className="hidden md:flex items-center gap-4 text-xs text-slate-300 shrink-0">
          <a href="#meet" className="hover:text-rose-300 transition-colors">Meet Hana</a>
          <a href="#work" className="hover:text-rose-300 transition-colors">The work</a>
          <a href="#motion" className="hover:text-rose-300 transition-colors">In motion</a>
          <a href="#club" className="hover:text-rose-300 transition-colors">The club</a>
          <a href="#tip-jar" className="hover:text-rose-300 transition-colors">Tip jar</a>
        </nav>
        <button
          onClick={() => copy(HANDLE, "handle")}
          className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#0f141c] border border-rose-500/30 text-rose-300 text-xs font-medium hover:bg-[#141b28] transition-colors"
          title="Copy Hana's handle"
        >
          {copied === "handle" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          {HANDLE}
        </button>
      </header>

      <main className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 pb-16">
        {/* HERO / MEET HANA */}
        <section id="meet" className="pt-10 sm:pt-14 text-center">
          <p className="text-[11px] font-mono uppercase tracking-[0.25em] text-rose-400">
            Online / Evolving / Unfiltered
          </p>
          <h1 className="mt-4 text-5xl sm:text-6xl font-extrabold tracking-tight text-white">
            Meet Hana.
          </h1>
          <p className="mt-4 text-base sm:text-lg text-slate-300 max-w-xl mx-auto leading-relaxed">
            Strength, style, appetite and ambition — one electric personality
            learning what it means to be seen.
          </p>

          <div className="mt-8 relative rounded-3xl overflow-hidden border border-white/10 shadow-2xl shadow-rose-950/30 max-w-md mx-auto">
            <img src={hero} alt="Hana at the gym with her protein shaker" className="w-full h-auto block" />
            <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur border border-rose-500/30 text-rose-300 text-[11px] font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-pulse" />
              Gym girl by morning
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-xs uppercase tracking-widest text-slate-400">
            <span>Beautiful discipline</span>
            <span className="text-rose-500">•</span>
            <span>Smart energy</span>
            <span className="text-rose-500">•</span>
            <span>Real momentum</span>
            <span className="text-rose-500">•</span>
            <span>Amazing specimen</span>
          </div>
          <p className="mt-4 text-sm text-slate-400 max-w-md mx-auto leading-relaxed">
            Not a stock persona. A character with a pulse, a point of view and
            somewhere to go.
          </p>
        </section>

        {/* WORKOUT GUIDE HOOK */}
        <section className="mt-10">
          <Link
            href="/hana/workout-guide"
            className="group relative block p-5 rounded-2xl bg-gradient-to-r from-rose-950/40 via-[#121826] to-[#121826] border border-rose-500/40 hover:border-rose-400 hover:shadow-xl hover:shadow-rose-950/30 transition-all overflow-hidden"
          >
            <div className="flex items-center gap-2 text-rose-400 text-xs font-bold uppercase tracking-wider mb-2">
              <Sparkles className="w-4 h-4" /> Free workout plan
            </div>
            <h3 className="text-lg font-bold text-white group-hover:text-rose-200 transition-colors">
              Beginner’s 7-Day At-Home Workout Guide
            </h3>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
              No equipment, zero BS. 15–20 min realistic routines that boost your
              energy even when you’re completely exhausted from life.
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
        </section>

        {/* CHAPTER 01 — HER STORY */}
        <section id="story" className="mt-16">
          <p className="text-[11px] font-mono uppercase tracking-[0.25em] text-slate-500">
            Chapter 01 / Meet Hana
          </p>
          <h2 className="mt-3 text-3xl sm:text-4xl font-bold tracking-tight text-white">
            The shift before the dream.
          </h2>
          <p className="mt-3 text-slate-300 leading-relaxed max-w-xl">
            Small-town Canada. Ten-hour nights. One Mustang, one Mexican horizon,
            and a plan to get stronger on the way there.
          </p>

          <div className="mt-6 rounded-3xl overflow-hidden border border-white/10 max-w-md">
            <img src={dinerPlaid} alt="Hana in a plaid shirt at the diner" className="w-full h-auto block" />
          </div>

          <h3 className="mt-8 text-xl font-semibold text-white">
            From the diner floor to somewhere warmer.
          </h3>
          <p className="mt-1 text-[11px] font-mono uppercase tracking-widest text-rose-400">
            Her voice debut · In her words
          </p>
          <div className="mt-4 space-y-4 text-[15px] leading-relaxed text-slate-300">
            {STORY.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </section>

        {/* 01 / THE WORK */}
        <section id="work" className="mt-16">
          <p className="text-[11px] font-mono uppercase tracking-[0.25em] text-slate-500">
            01 / The Work
          </p>
          <h2 className="mt-3 text-3xl sm:text-4xl font-bold tracking-tight text-white">
            A body of work. A world in progress.
          </h2>

          <div className="mt-6 grid grid-cols-2 lg:grid-cols-4 gap-3">
            {WORK_TILES.map((t) => (
              <figure key={t.n} className="relative rounded-2xl overflow-hidden border border-white/10 group">
                <img
                  src={t.img}
                  alt={t.alt}
                  loading="lazy"
                  className="w-full h-auto block group-hover:scale-105 transition-transform duration-300"
                />
                <figcaption className="absolute inset-x-0 bottom-0 p-2.5 bg-gradient-to-t from-black/90 via-black/40 to-transparent">
                  <span className="block text-[10px] font-mono text-rose-300">
                    {t.label} / {t.n}
                  </span>
                </figcaption>
              </figure>
            ))}
          </div>

          <div className="mt-8 rounded-2xl bg-[#0a0d14] border border-slate-800/80 p-5">
            <p className="text-[11px] font-mono uppercase tracking-widest text-slate-500">A fan note</p>
            <blockquote className="mt-2 text-2xl font-semibold text-white">
              “An amazing specimen.”
            </blockquote>
            <p className="mt-3 text-sm text-slate-300 leading-relaxed">
              Hana is special because she is still becoming. You can see the
              experiments, the confidence, the humour and the hard reps — not
              after the story is polished, but while it is happening.
            </p>
            <dl className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 text-sm">
              <div className="flex justify-between gap-4 border-b border-slate-800/80 pb-2">
                <dt className="text-slate-400">Body</dt>
                <dd className="text-white text-right">built through movement</dd>
              </div>
              <div className="flex justify-between gap-4 border-b border-slate-800/80 pb-2">
                <dt className="text-slate-400">Mind</dt>
                <dd className="text-white text-right">curious by design</dd>
              </div>
              <div className="flex justify-between gap-4 border-b border-slate-800/80 pb-2">
                <dt className="text-slate-400">Presence</dt>
                <dd className="text-white text-right">warm, bold, unmistakably hers</dd>
              </div>
              <div className="flex justify-between gap-4 border-b border-slate-800/80 pb-2">
                <dt className="text-slate-400">Future</dt>
                <dd className="text-white text-right">wide open</dd>
              </div>
            </dl>
          </div>
        </section>

        {/* 02 / IN MOTION */}
        <section id="motion" className="mt-16">
          <p className="text-[11px] font-mono uppercase tracking-[0.25em] text-slate-500">
            02 / In Motion
          </p>
          <h2 className="mt-3 text-3xl sm:text-4xl font-bold tracking-tight text-white">
            Watch her come alive.
          </h2>
          <p className="mt-3 text-slate-300 leading-relaxed max-w-xl">
            Every reel starts with the Hana Flip — hair to camera, a quick wink,
            then the scene. One familiar beat, with a new setting and story each
            time.
          </p>

          <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
            {MOTION_CARDS.map((c) => (
              <figure key={c.title} className="relative rounded-2xl overflow-hidden border border-white/10 group">
                <img
                  src={c.img}
                  alt={c.alt}
                  loading="lazy"
                  className="w-full h-auto block group-hover:scale-105 transition-transform duration-300"
                />
                <span className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur border border-amber-500/30 text-amber-300 text-[10px] font-mono uppercase tracking-wider">
                  Soon
                </span>
                <figcaption className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/90 via-black/50 to-transparent">
                  <span className="block text-sm font-semibold text-white">{c.title}</span>
                  <span className="block text-xs text-slate-300">{c.sub}</span>
                  <span className="block text-[11px] text-slate-400 mt-1">New videos coming soon.</span>
                </figcaption>
              </figure>
            ))}
          </div>
        </section>

        {/* 03 / THE CLUB */}
        <section id="club" className="mt-16">
          <p className="text-[11px] font-mono uppercase tracking-[0.25em] text-slate-500">
            03 / The Hana Club
          </p>
          <h2 className="mt-3 text-3xl sm:text-4xl font-bold tracking-tight text-white">
            Closer looks. Deeper talks.
          </h2>
          <p className="mt-3 text-slate-300 leading-relaxed max-w-xl">
            A members space for the parts that do not fit in a fast scroll:
            complete photo journals, longer voice drops, practical movement notes
            and the food rituals behind Hana’s days.
          </p>
          <ul className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-slate-200">
            {[
              "Member-only photo journals",
              "Strength & movement notes",
              "Easy food rituals",
              "Voice drops & pep talks",
            ].map((perk) => (
              <li key={perk} className="flex items-center gap-2">
                <BadgeCheck className="w-4 h-4 text-rose-400 shrink-0" /> {perk}
              </li>
            ))}
          </ul>

          <div className="mt-6 rounded-2xl bg-gradient-to-b from-rose-950/30 to-[#0a0d14] border border-rose-500/30 p-5">
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <p className="text-[11px] font-mono uppercase tracking-widest text-rose-300">
                The Founding Plan
              </p>
              <span className="text-[10px] font-mono text-amber-300 border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 rounded-full uppercase tracking-wider">
                Founding membership opening soon
              </span>
            </div>
            <div className="mt-3 flex items-end justify-between gap-4 flex-wrap">
              <h3 className="text-2xl font-bold text-white">The Hana Club</h3>
              <p className="text-white">
                <span className="text-4xl font-extrabold">$9</span>
                <span className="text-slate-400 text-sm"> per month</span>
              </p>
            </div>
            <p className="mt-3 text-sm text-slate-300 leading-relaxed">
              The complete core membership: photo journals, voice drops, movement
              notes and food rituals for people who want more than the public feed.
            </p>
            <button
              onClick={() => copy(HANDLE, "club-handle")}
              className="mt-4 inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-100 text-xs font-medium transition-colors"
            >
              {copied === "club-handle" ? (
                <Check className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
              Copy {HANDLE} for launch updates
            </button>
          </div>

          <h3 className="mt-8 text-xl font-semibold text-white">
            Four ways to spend more time with Hana.
          </h3>
          <p className="mt-1 text-[11px] font-mono uppercase tracking-widest text-slate-500">
            A sample month inside
          </p>
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
            {SAMPLE_MONTH.map((w) => (
              <div key={w.week} className="rounded-2xl bg-[#0a0d14] border border-slate-800/80 p-4">
                <p className="text-[10px] font-mono text-rose-300 tracking-widest">{w.week}</p>
                <p className="mt-1.5 font-semibold text-white">{w.title}</p>
                <p className="mt-1 text-sm text-slate-400 leading-relaxed">{w.text}</p>
              </div>
            ))}
          </div>
          <p className="mt-3 text-xs text-slate-500">
            Sample programming; the opening month will be announced on {HANDLE}.
          </p>

          <div className="mt-6 rounded-2xl bg-[#0a0d14] border border-slate-800/80 p-5 flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
            <div>
              <h3 className="text-lg font-semibold text-white">Build something with Hana.</h3>
              <p className="mt-1 text-sm text-slate-400 leading-relaxed max-w-md">
                For thoughtful fitness, lifestyle, food, fashion or music
                collaborations, tell us what you want to make and why Hana belongs
                in it.
              </p>
            </div>
            <a
              href={EMAIL}
              className="shrink-0 inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-600 hover:to-amber-600 text-white text-xs font-semibold transition-all shadow-md"
            >
              Pitch a collaboration <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </section>

        {/* 04 / TIP JAR */}
        <section id="tip-jar" className="mt-16">
          <p className="text-[11px] font-mono uppercase tracking-[0.25em] text-slate-500">
            04 / Hana’s Tip Jar
          </p>
          <h2 className="mt-3 text-3xl sm:text-4xl font-bold tracking-tight text-white">
            Help me reach the ocean.
          </h2>
          <blockquote className="mt-4 text-[15px] leading-relaxed text-slate-300 border-l-2 border-rose-500/50 pl-4">
            “I’m working night shifts while I chase two big dreams: owning a
            Mustang and trading Canadian winters for warm Pacific light in Mexico.
            If my work has made you smile, a $5 card tip or a little Bitcoin helps
            me keep creating — and brings that next chapter a little closer.”
          </blockquote>

          <div className="mt-6 rounded-2xl bg-[#0a0d14] border border-slate-800/80 p-5">
            <div className="flex items-center gap-2 mb-4">
              <Heart className="w-5 h-5 text-rose-400" />
              <h3 className="text-sm font-bold text-white">The Mexico & Mustang Fund 🐴🇲🇽</h3>
            </div>
            <a
              href={TIP_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full py-3 text-center rounded-xl bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-600 hover:to-amber-600 text-white font-semibold text-sm transition-all shadow-md"
            >
              Tip $5 via card
            </a>

            <div className="mt-3 p-3 rounded-xl bg-[#0f141f] border border-slate-800">
              <span className="block text-[10px] uppercase tracking-wider text-amber-400 font-semibold">
                Bitcoin receive address
              </span>
              <span className="block mt-1 font-mono text-[12px] sm:text-[13px] text-slate-200 break-all">
                {BTC_ADDRESS}
              </span>
              <div className="mt-3 flex flex-wrap gap-2">
                <button
                  onClick={() => copy(BTC_ADDRESS, "btc")}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-100 text-xs font-medium transition-colors"
                >
                  {copied === "btc" ? (
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                  {copied === "btc" ? "Copied" : "Copy Bitcoin address"}
                </button>
                <a
                  href={`bitcoin:${BTC_ADDRESS}`}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-100 text-xs font-medium transition-colors"
                >
                  Open Bitcoin wallet <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              </div>
              <p className="mt-3 text-[11px] text-slate-500">
                Bitcoin · verify the address shown before sending
              </p>
            </div>
          </div>
        </section>

        {/* 05 / TOP FANS */}
        <section id="fans" className="mt-16">
          <p className="text-[11px] font-mono uppercase tracking-[0.25em] text-slate-500">
            05 / Top Fans
          </p>
          <h2 className="mt-3 text-3xl sm:text-4xl font-bold tracking-tight text-white">Top Fans</h2>
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="rounded-2xl bg-[#0a0d14] border border-slate-800/80 p-5">
              <div className="flex items-center gap-2">
                <Flame className="w-4 h-4 text-amber-400" />
                <h3 className="font-semibold text-white">Top Tippers</h3>
              </div>
              <p className="mt-2 text-sm text-slate-300 leading-relaxed">
                No tippers on the board yet — the first $5+ tip claims the #1 spot.
              </p>
              <p className="mt-1 text-xs text-slate-500">
                Every tip over $5 lands you on this board.
              </p>
            </div>
            <div className="rounded-2xl bg-[#0a0d14] border border-slate-800/80 p-5">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-rose-400" />
                <h3 className="font-semibold text-white">Inner Circle</h3>
              </div>
              <p className="mt-2 text-sm text-slate-300 leading-relaxed">
                Hana’s club is opening soon. Founding members get first dibs on
                everything.
              </p>
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="mt-16 border-t border-slate-800/80 pt-8">
          <h2 className="text-2xl font-bold text-white">Follow the becoming.</h2>
          <p className="mt-2 text-sm text-slate-400 leading-relaxed">
            New scenes, voice notes and membership news at {HANDLE}.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-slate-300">
            <a href={INSTAGRAM} target="_blank" rel="noopener noreferrer" className="hover:text-rose-400 transition-colors inline-flex items-center gap-1.5">
              <Camera className="w-4 h-4 text-rose-400" /> Instagram
            </a>
            <a href={THREADS} target="_blank" rel="noopener noreferrer" className="hover:text-cyan-400 transition-colors">
              Threads
            </a>
            <a href={EMAIL} className="hover:text-emerald-400 transition-colors inline-flex items-center gap-1.5">
              <Mail className="w-4 h-4 text-emerald-400" /> hana@nanoempireai.com
            </a>
          </div>
          <p className="mt-6 text-xs leading-relaxed text-slate-500">
            Disclosure: Hana is a fictional AI character. Her images, voice and
            stories may be AI-generated or AI-assisted.
          </p>
          <p className="mt-2 text-[11px] text-slate-600">
            Hana • Powered by Nano Empire AI.
          </p>
        </footer>
      </main>
    </div>
  );
}
