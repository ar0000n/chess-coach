"use client";
import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { ArrowRight, Zap, ChevronDown } from "lucide-react";
import { EarlyAccessModal } from "./EarlyAccessModal";

export function HeroSection() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <section className="relative flex min-h-screen flex-col items-center justify-center px-6 pt-24 pb-16 text-center overflow-hidden">
        {/* Radial glow behind headline */}
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-1/3 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full bg-[#10B981]/5 blur-[120px]"
        />

        {/* Eyebrow */}
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#10B981]/25 bg-[#10B981]/8 px-4 py-1.5 text-xs font-semibold text-[#10B981] uppercase tracking-widest">
          <Zap size={12} />
          AI-powered post-game coaching
        </div>

        {/* Headline */}
        <h1 className="max-w-3xl text-5xl md:text-6xl lg:text-7xl font-bold leading-tight tracking-tight text-[#f1f1f3]">
          Know Exactly{" "}
          <span className="text-gradient-emerald">Why You&apos;re Losing</span>
        </h1>

        {/* Subheadline */}
        <p className="mt-6 max-w-xl text-lg text-[#9a9aaa] leading-relaxed">
          Import your recent games. Get a structured debrief from an AI coach that identifies
          your 3 recurring weaknesses and builds a personalised week of training — just like
          working with a real coach.
        </p>

        {/* Platform badges */}
        <div className="mt-6 flex items-center gap-3">
          <span className="flex items-center gap-1.5 rounded-full bg-[#1a1a1f] border border-[#2e2e36] px-3 py-1 text-xs font-medium text-[#94a3b8]">
            <span className="w-2 h-2 rounded-full bg-[#10B981]" />
            Lichess
          </span>
          <span className="flex items-center gap-1.5 rounded-full bg-[#1a1a1f] border border-[#2e2e36] px-3 py-1 text-xs font-medium text-[#94a3b8]">
            <span className="w-2 h-2 rounded-full bg-[#10B981]" />
            Chess.com
          </span>
        </div>

        {/* CTAs */}
        <div className="mt-10 flex flex-col sm:flex-row items-center gap-4">
          <Button
            variant="gold"
            size="lg"
            className="gap-2"
            onClick={() => setModalOpen(true)}
          >
            Get My Free Debrief
            <ArrowRight size={16} />
          </Button>
          <Link href="#features">
            <Button variant="outline" size="lg">
              See How It Works
            </Button>
          </Link>
        </div>

        <p className="mt-5 text-xs text-[#6b6b7a]">
          No credit card needed — 1 free debrief per month.
        </p>

        {/* Social proof */}
        <div className="mt-3 flex items-center gap-2">
          <div className="flex -space-x-2">
            {["bg-[#2d6a4f]", "bg-[#1b4332]", "bg-[#40916c]", "bg-[#52b788]"].map((bg, i) => (
              <div
                key={i}
                className={`w-6 h-6 rounded-full ${bg} border-2 border-[#0a0a0b] flex items-center justify-center text-[8px] font-bold text-white`}
              >
                {["A", "M", "J", "R"][i]}
              </div>
            ))}
          </div>
          <p className="text-xs text-[#9a9aaa]">
            Joined by{" "}
            <span className="text-[#10B981] font-semibold">200+ chess players</span>{" "}
            this week
          </p>
        </div>

        {/* ── Sample debrief card ── */}
        <div className="mt-16 w-full max-w-2xl">
          <div className="rounded-2xl border border-[#2e2e36] bg-[#111113] p-6 text-left shadow-[0_0_60px_rgba(0,0,0,0.6)]">

            {/* Card header */}
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="text-xs text-[#6b6b7a] font-medium uppercase tracking-wider">Sample Debrief</p>
                <p className="text-sm font-semibold text-[#f1f1f3] mt-0.5">ChessPlayer42 · Rapid · 15 games</p>
              </div>
              <span className="rounded-full bg-green-500/15 border border-green-500/20 px-2.5 py-1 text-xs font-semibold text-green-400">
                Complete
              </span>
            </div>

            {/* ── Finding 1 — fully visible ── */}
            <div className="rounded-lg border border-[#10B981]/25 bg-[#1a1a1f] p-4">
              <div className="flex items-start gap-3">
                <span className="flex-shrink-0 mt-0.5 w-6 h-6 rounded-full bg-[#10B981]/15 border border-[#10B981]/30 text-[#10B981] text-xs font-bold flex items-center justify-center">
                  1
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-semibold text-[#f1f1f3]">Chronic Back-Rank Vulnerability</p>
                    <span className="rounded px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide bg-red-500/15 text-red-400 border border-red-500/20">
                      High
                    </span>
                  </div>
                  <p className="text-xs text-[#6b6b7a] mt-0.5 mb-2">Games 3, 7, 14</p>
                  <p className="text-xs text-[#9a9aaa] leading-relaxed">
                    In 3 of your last 15 games, your opponent delivered checkmate or won decisive material because your back rank was undefended. You consistently prioritize active piece play without creating a luft square. This is costing you roughly 1 win per every 5 rapid games.
                  </p>
                </div>
              </div>
            </div>

            {/* ── Findings 2 & 3 + blur/fade overlay — clickable ── */}
            <div
              className="relative mt-3 cursor-pointer group"
              onClick={() => setModalOpen(true)}
              role="button"
              aria-label="See full sample debrief"
              tabIndex={0}
              onKeyDown={(e) => e.key === "Enter" && setModalOpen(true)}
            >
              {/* Findings 2 & 3 — rendered but faded */}
              <div className="space-y-3 select-none">
                {/* Finding 2 */}
                <div className="rounded-lg border border-[#2e2e36] bg-[#1a1a1f] p-4">
                  <div className="flex items-start gap-3">
                    <span className="flex-shrink-0 mt-0.5 w-6 h-6 rounded-full bg-[#10B981]/10 border border-[#10B981]/20 text-[#10B981] text-xs font-bold flex items-center justify-center">
                      2
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-sm font-semibold text-[#f1f1f3]">Premature Queenside Pawn Advances</p>
                        <span className="rounded px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide bg-yellow-500/15 text-yellow-400 border border-yellow-500/20">
                          Medium
                        </span>
                      </div>
                      <p className="text-xs text-[#6b6b7a] mt-0.5 mb-2">Games 2, 9, 17</p>
                      <p className="text-xs text-[#9a9aaa] leading-relaxed">
                        You&apos;re pushing a5 or b5 before your kingside is fully castled and secure. This hands your opponent a ready-made attack plan and creates long-term pawn weaknesses.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Finding 3 */}
                <div className="rounded-lg border border-[#2e2e36] bg-[#1a1a1f] p-4">
                  <div className="flex items-start gap-3">
                    <span className="flex-shrink-0 mt-0.5 w-6 h-6 rounded-full bg-[#10B981]/10 border border-[#10B981]/20 text-[#34D399] text-xs font-bold flex items-center justify-center">
                      3
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-sm font-semibold text-[#f1f1f3]">Rook Endgame Conversion</p>
                        <span className="rounded px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide bg-yellow-500/15 text-yellow-400 border border-yellow-500/20">
                          Medium
                        </span>
                      </div>
                      <p className="text-xs text-[#6b6b7a] mt-0.5 mb-2">Games 5, 11, 19</p>
                      <p className="text-xs text-[#9a9aaa] leading-relaxed">
                        You reach winning rook endgames but convert only 40% of them. You&apos;re not activating your rook early enough and tend to play passively when you have the advantage.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/*
                Gradient overlay — starts transparent after finding 1,
                fades to near-opaque by the end of finding 3.
                Subtle enough to feel like natural continuation, not a hard gate.
              */}
              <div className="absolute inset-0 rounded-lg pointer-events-none"
                style={{
                  background: "linear-gradient(to bottom, rgba(17,17,19,0) 0%, rgba(17,17,19,0.55) 35%, rgba(17,17,19,0.88) 70%, rgba(17,17,19,0.97) 100%)"
                }}
              />

              {/* Reveal prompt — centred in the lower half of the blurred zone */}
              <div className="absolute bottom-6 inset-x-0 flex flex-col items-center gap-2 pointer-events-none">
                <div className="flex items-center gap-2 rounded-full border border-[#10B981]/30 bg-[#111113]/90 backdrop-blur-sm px-4 py-2 shadow-lg group-hover:border-[#10B981]/60 group-hover:bg-[#0e1a16]/95 transition-all duration-200">
                  <ChevronDown size={13} className="text-[#10B981] group-hover:translate-y-0.5 transition-transform duration-200" />
                  <span className="text-xs font-semibold text-[#f1f1f3]">See your full debrief</span>
                </div>
              </div>
            </div>

            {/* Weekly plan strip */}
            <div className="mt-5 pt-4 border-t border-[#2e2e36]">
              <p className="text-xs text-[#6b6b7a] font-medium uppercase tracking-wider mb-2">This Week&apos;s Plan</p>
              <div className="flex gap-2 flex-wrap">
                {["Mon: Back Rank", "Tue: Rook Endgame", "Wed: Hanging Piece"].map((d) => (
                  <span key={d} className="rounded bg-[#232329] border border-[#2e2e36] px-2.5 py-1 text-xs text-[#9a9aaa]">
                    {d}
                  </span>
                ))}
                <span className="rounded bg-[#232329] border border-[#2e2e36] px-2.5 py-1 text-xs text-[#6b6b7a]">
                  +2 more…
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <EarlyAccessModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
}
