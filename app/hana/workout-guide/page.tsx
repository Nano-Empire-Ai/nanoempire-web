"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, Download, Sparkles, Heart, Flame, Shield, ArrowRight } from "lucide-react";

const WORKOUT_DAYS = [
  {
    day: "Day 1",
    title: "Full-Body Foundation",
    duration: "18 mins",
    focus: "Strength & Metabolism Kickstart",
    moves: [
      { name: "Bodyweight Air Squats", sets: "3 sets × 10-12 reps", tip: "Keep chest proud, drive through heels." },
      { name: "Incline Push-Ups (Wall or Countertop)", sets: "3 sets × 8-10 reps", tip: "Core tight, elbows at 45 degrees." },
      { name: "Glute Bridges", sets: "3 sets × 12 reps", tip: "Hold a 2-second squeeze at the very top." },
      { name: "Forearm Plank Hold", sets: "3 sets × 20-30 secs", tip: "Breathe steady; don't let lower back sag." },
    ],
    hannahNote: "Drink a tall glass of ice water before starting. 90% of the time, feeling 'too tired to move' is actually just mild dehydration!"
  },
  {
    day: "Day 2",
    title: "Core, Posture & Spine Alignment",
    duration: "15 mins",
    focus: "Lower Back Relief & Toned Midsection",
    moves: [
      { name: "Deadbugs", sets: "3 sets × 8 each side", tip: "Lower back glued to the floor the entire time." },
      { name: "Bird-Dogs", sets: "3 sets × 8 each side", tip: "Reach fingers forward and heels back with control." },
      { name: "Standing Side Bends", sets: "3 sets × 12 reps each side", tip: "Feel the gentle stretch along your waist." },
      { name: "Cat-Cow Stretch Flow", sets: "2 mins continuous flow", tip: "Inhale arch, exhale round. Pure relief." },
    ],
    hannahNote: "Standing on your feet all day at work wrecks your lower back. These 4 moves literally save my spine after a grueling 10-hour shift."
  },
  {
    day: "Day 3",
    title: "Active Recovery & Sore Feet Relief",
    duration: "15 mins",
    focus: "Circulation & Joint Restoration",
    moves: [
      { name: "Brisk Outdoor Walk or Gentle Stroll", sets: "10-15 mins", tip: "Listen to your favorite playlist or podcast." },
      { name: "Standing Wall Calf Stretch", sets: "2 mins each side", tip: "Ease the tension from hours on your feet." },
      { name: "Tennis Ball Foot Arch Roll", sets: "2 mins per foot", tip: "Seated or standing, roll from heel to toes." },
      { name: "Legs-Up-The-Wall Pose", sets: "5 mins deep breathing", tip: "Drains fluid from swollen ankles and calms the nervous system." },
    ],
    hannahNote: "Never skip recovery days! Giving your muscles love is what prevents burnout and keeps your metabolism humming."
  },
  {
    day: "Day 4",
    title: "Lower Body Sculpt & Leg Power",
    duration: "20 mins",
    focus: "Glutes, Quads & Hamstrings",
    moves: [
      { name: "Alternating Reverse Lunges", sets: "3 sets × 8 each leg", tip: "Step back smoothly, front knee tracking over ankle." },
      { name: "Sumo Squats (Wide Stance)", sets: "3 sets × 10 reps", tip: "Toes pointed out 45 degrees, feel inner thighs." },
      { name: "Donkey Kicks", sets: "3 sets × 12 each leg", tip: "Flex your foot and stamp the ceiling." },
      { name: "Wall Sit Hold", sets: "3 sets × 30 secs", tip: "Keep knees at 90 degrees and breathe through the burn!" },
    ],
    hannahNote: "Strong legs mean you carry yourself with unstoppable confidence. Plus, leg muscles burn fuel all day long."
  },
  {
    day: "Day 5",
    title: "Upper Body Sculpt & Shoulder Tone",
    duration: "18 mins",
    focus: "Posture, Arms & Back",
    moves: [
      { name: "Doorway or Towel Isometric Rows", sets: "3 sets × 10 reps", tip: "Squeeze your shoulder blades together." },
      { name: "Arm Circles & Overhead Reach", sets: "3 sets × 15 forward / 15 backward", tip: "Small controlled circles to tone deltoids." },
      { name: "Countertop Push-Ups", sets: "3 sets × 10-12 reps", tip: "Slightly deeper range than wall push-ups." },
      { name: "Child's Pose to Cobra Stretch", sets: "3 mins relaxing flow", tip: "Open up your chest and shoulders." },
    ],
    hannahNote: "Say goodbye to rounded desk shoulders. Good posture instantly makes you look taller, leaner, and more energized."
  },
  {
    day: "Day 6",
    title: "Sweet & Sweaty 15-Min HIIT Burn",
    duration: "15 mins",
    focus: "Endurance, Mood Boost & Fat Burn",
    moves: [
      { name: "Low-Impact Jumping Jacks", sets: "40s work, 20s rest", tip: "Step side-to-side or full jump if joints feel good." },
      { name: "High Knees Marching in Place", sets: "40s work, 20s rest", tip: "Drive knees up to hip height, pump your arms." },
      { name: "Air Squat with Overhead Press", sets: "40s work, 20s rest", tip: "Squat down, explode up reaching for the sky." },
      { name: "Boxer Bounce / Side-to-Side Shuffle", sets: "40s work, 20s rest", tip: "Stay light on your toes and smile!" },
    ],
    hannahNote: "Repeat the circuit 3 times! Turn on your highest-energy hype song and sweat out all the weekly stress. You've got this!"
  },
  {
    day: "Day 7",
    title: "Sunday Reset & Mindset Fuel",
    duration: "10 mins",
    focus: "Mental Clarity & Weekly Planning",
    moves: [
      { name: "Full-Body Gentle Stretching", sets: "10 mins", tip: "Hamstrings, hips, neck, and shoulders." },
      { name: "Hydration Check-in", sets: "Daily habit", tip: "Aim for 2 to 2.5 liters of clean water today." },
      { name: "Weekly Meal Prep Ritual", sets: "30 mins", tip: "Boil eggs, roast veggies, prep simple protein." },
      { name: "Dream Journaling", sets: "5 mins", tip: "Write down 1 thing you're fighting for this week." },
    ],
    hannahNote: "My dream is buying my Mustang and escaping Canada's freezing winter to a sunny Mexican beach 🇲🇽🐴. What’s yours? Keep fighting for it!"
  }
];

export default function WorkoutGuidePage() {
  const [subscribed, setSubscribed] = useState(false);
  return (
    <div className="min-h-screen bg-[#07090E] text-slate-100 selection:bg-rose-500/30 selection:text-white">
      {/* Top Banner Nav */}
      <nav className="border-b border-slate-800/80 bg-[#07090E]/90 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/hana" className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm font-medium">
            <ArrowLeft className="w-4 h-4" /> Back to Hannah's Portal
          </Link>
          <span className="text-xs font-mono uppercase tracking-wider text-rose-400 border border-rose-500/30 bg-rose-500/10 px-2.5 py-1 rounded-full flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" /> FREE 7-DAY GUIDE
          </span>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-4 py-12">
        {/* Author Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 bg-[#0D121D] border border-slate-800 p-4 rounded-2xl">
          <div className="flex items-center gap-4">
            <div className="relative">
              <img 
                src="/hana/diner.png" 
                alt="Hannah" 
                className="w-16 h-16 rounded-full object-cover object-top border-2 border-rose-400/40 shadow-lg"
              />
              <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-[#0D121D]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="text-lg font-bold text-white">Hannah</h1>
                <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium">Verified Coach</span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5 max-w-sm">
                Small-town Canadian waitress by night • Fitness coach by day • Mexico & Mustang Dreamer 🇨🇦🇲🇽
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 self-start sm:self-auto bg-[#07090e] p-1.5 rounded-xl border border-slate-800/80">
            <img 
              src="/hana/gym.jpg" 
              alt="Hannah Fitness Coach" 
              className="w-10 h-10 rounded-lg object-cover"
            />
            <div className="text-[11px] pr-2">
              <span className="block font-semibold text-slate-200">100% At-Home</span>
              <span className="text-rose-400 font-mono">No Gym Needed</span>
            </div>
          </div>
        </div>

        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white mb-4">
            Beginner’s 7-Day <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 via-orange-300 to-amber-300">
              At-Home Workout Guide
            </span>
          </h1>
          <p className="text-base text-slate-300 max-w-xl mx-auto leading-relaxed">
            15 to 20-minute realistic bodyweight workouts for busy, tired women who want to build real strength, tone up, and feel amazing without expensive gym memberships.
          </p>

          {/* Email Capture — inline Beehiiv signup (above the download) */}
          <div className="mt-8 max-w-xl mx-auto bg-gradient-to-br from-rose-950/40 via-[#0E131F] to-[#0A0E17] border border-rose-500/25 rounded-2xl p-6 text-left relative overflow-hidden">
            <div className="flex items-center gap-2 text-rose-400 text-xs font-bold uppercase tracking-wider mb-2">
              <Sparkles className="w-4 h-4" /> Join my email list
            </div>
            <h2 className="text-xl font-bold text-white mb-2">Get my daily brief 💌</h2>
            <p className="text-sm text-slate-300 leading-relaxed mb-4">
              Loved the guide? Drop your email and I&apos;ll send you my Daily AI Recall Brief every morning — 5 quick bullets on product recalls and safety, so you and your family stay in the know. No spam, ever. Unsubscribe anytime.
            </p>
            {subscribed ? (
              <p className="text-sm font-semibold text-emerald-400">You&apos;re in! 🎉 Watch your inbox tomorrow morning.</p>
            ) : (
              <form
                action="https://magic.beehiiv.com/v1/0260eb70-fc32-4063-85e8-99d5c86bb2b2?index"
                method="post"
                target="beehiiv-hidden-frame"
                onSubmit={() => setSubscribed(true)}
                className="flex flex-col sm:flex-row gap-2"
              >
                <input
                  type="email"
                  name="signup[email]"
                  required
                  placeholder="you@example.com"
                  aria-label="Email address"
                  className="flex-1 px-4 py-2.5 rounded-xl bg-[#07090E] border border-slate-700 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-rose-400"
                />
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-400 text-white font-semibold text-sm transition-all"
                >
                  Count me in
                </button>
              </form>
            )}
            <iframe name="beehiiv-hidden-frame" title="signup" className="hidden" aria-hidden="true" />
            <p className="text-xs text-slate-500 mt-3">
              Already grabbed this guide? Pop your email in anyway — the daily brief keeps you in the loop. 💕
            </p>
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <button 
              onClick={() => window.print()}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-black font-semibold text-sm hover:bg-slate-200 transition-all shadow-lg"
            >
              <Download className="w-4 h-4" /> Print / Save as PDF
            </button>
            <Link 
              href="/hana"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 font-semibold text-sm transition-all"
            >
              <Heart className="w-4 h-4 text-rose-400" /> Mexico & Mustang Tip Jar
            </Link>
          </div>
        </div>

        {/* Note from Hannah */}
        <div className="mb-12 bg-gradient-to-br from-rose-950/30 via-[#0E131F] to-[#0A0E17] border border-rose-500/20 rounded-2xl p-6 relative overflow-hidden">
          <div className="flex items-center gap-2 text-rose-400 text-xs font-bold uppercase tracking-wider mb-2">
            <Flame className="w-4 h-4" /> A Quick Note Before You Start
          </div>
          <p className="text-sm text-slate-200 leading-relaxed italic mb-3">
            &quot;Hey friend! I waitress grueling night shifts at a small diner here in freezing Canada. When I finish a 10-hour shift, my feet throb and all I want to do is collapse into bed. I know what it feels like to have zero energy. But movement is medicine: it gives you energy back! You don&apos;t need to be perfect; you just need to show up for 15 minutes today. We’re in this together!&quot;
          </p>
          <div className="text-xs font-semibold text-rose-300 text-right">— Hannah 💕</div>
        </div>

        {/* 7-Day Daily Breakdown */}
        <div className="space-y-6 mb-16">
          {WORKOUT_DAYS.map((w, idx) => (
            <div key={idx} className="bg-[#0B0F17] border border-slate-800 rounded-2xl p-6 hover:border-slate-700 transition-all">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 mb-4 border-b border-slate-800/80">
                <div>
                  <span className="text-xs font-mono font-bold text-rose-400 uppercase tracking-widest">{w.day}</span>
                  <h2 className="text-xl font-bold text-white mt-0.5">{w.title}</h2>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 font-mono">{w.duration}</span>
                  <span className="text-xs px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20 font-medium">{w.focus}</span>
                </div>
              </div>

              {/* Moves List */}
              <div className="space-y-3 mb-5">
                {w.moves.map((m, mIdx) => (
                  <div key={mIdx} className="flex items-start gap-3 p-3 rounded-xl bg-[#0F141F] border border-slate-800/60">
                    <CheckCircle2 className="w-4 h-4 text-rose-400 mt-0.5 shrink-0" />
                    <div className="flex-1 text-xs">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-semibold text-slate-100">{m.name}</span>
                        <span className="font-mono text-slate-400 text-[11px]">{m.sets}</span>
                      </div>
                      <p className="text-slate-400 mt-1 leading-normal">{m.tip}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Hannah's Daily Tip */}
              <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-200 leading-relaxed">
                <span className="font-bold text-rose-300">Hannah&apos;s Pro Tip:</span> {w.hannahNote}
              </div>
            </div>
          ))}
        </div>

        {/* Support the Dream CTA */}
        <div className="bg-[#0B0F17] border border-slate-800 rounded-2xl p-8 text-center">
          <div className="w-12 h-12 bg-rose-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-rose-500/20">
            <Heart className="w-6 h-6 text-rose-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Love the workouts?</h2>
          <p className="text-sm text-slate-300 max-w-md mx-auto mb-6">
            Join our community, grab our daily recall and health updates, or toss a few satoshis into Hannah&apos;s Mustang & Mexico fund!
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link 
              href="/hana"
              className="px-6 py-3 rounded-xl bg-white text-black font-semibold text-sm hover:bg-slate-200 transition-all flex items-center gap-2"
            >
              Hannah&apos;s Official Link Hub <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
