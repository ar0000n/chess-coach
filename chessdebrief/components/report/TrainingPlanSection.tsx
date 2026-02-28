import type { TrainingPlan } from "@/types/analysis";
import { ExternalLink, Youtube, BookOpen, Target, Swords } from "lucide-react";

interface TrainingPlanSectionProps {
  plan: TrainingPlan;
}

const DAY_COLORS = [
  "text-blue-400",
  "text-purple-400",
  "text-green-400",
  "text-orange-400",
  "text-rose-400",
];

export function TrainingPlanSection({ plan }: TrainingPlanSectionProps) {
  return (
    <div className="space-y-4">
      {/* Section header */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-[#10B981] mb-1">
          Your Training Plan
        </p>
        <h2 className="text-xl font-bold text-[#f1f1f3]">This Week&apos;s Programme</h2>
      </div>

      {/* Primary Focus */}
      <div className="rounded-xl border border-[#2e2e36] bg-[#111113] p-5">
        <div className="flex items-center gap-2 mb-3">
          <Swords size={16} className="text-[#10B981]" />
          <h3 className="text-sm font-bold text-[#f1f1f3]">Primary Focus Area</h3>
        </div>
        <p className="text-sm text-[#94a3b8] leading-relaxed">{plan.primary_focus}</p>
      </div>

      {/* Daily Puzzles */}
      <div className="rounded-xl border border-[#2e2e36] bg-[#111113] overflow-hidden">
        <div className="px-5 py-4 border-b border-[#1a1a1f]">
          <h3 className="text-sm font-bold text-[#f1f1f3]">Daily Puzzle Practice</h3>
          <p className="text-xs text-[#6b6b7a] mt-0.5">
            Each session links directly to the Lichess puzzle trainer.
          </p>
        </div>
        <div className="divide-y divide-[#1a1a1f]">
          {plan.daily_puzzles.map((puzzle, idx) => (
            <div key={puzzle.day} className="px-5 py-4 flex flex-col md:flex-row md:items-start gap-3">
              <div className="flex-shrink-0 flex items-center gap-3 md:w-40">
                <span className={`text-xs font-bold uppercase tracking-wider ${DAY_COLORS[idx]}`}>
                  {puzzle.day}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <a
                    href={puzzle.theme_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#10B981] hover:text-[#34D399] transition-colors"
                  >
                    {puzzle.theme_name}
                    <ExternalLink size={11} />
                  </a>
                </div>
                <p className="mt-1 text-xs text-[#9a9aaa] leading-relaxed">
                  {puzzle.coaching_note}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Concept to Study + Opening Adjustment */}
      <div className="grid md:grid-cols-2 gap-4">
        {/* Concept to Study */}
        <div className="rounded-xl border border-[#2e2e36] bg-[#111113] p-5">
          <div className="flex items-center gap-2 mb-3">
            <BookOpen size={16} className="text-[#10B981]" />
            <h3 className="text-sm font-bold text-[#f1f1f3]">Concept to Study</h3>
          </div>
          <p className="text-sm font-semibold text-[#f1f1f3] mb-2">{plan.concept_topic}</p>
          <a
            href={`https://www.youtube.com/results?search_query=${encodeURIComponent(plan.concept_youtube_search)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-xs text-[#9a9aaa] hover:text-[#10B981] transition-colors border border-[#2e2e36] hover:border-[#10B981]/30 rounded-lg px-3 py-1.5 mt-1"
          >
            <Youtube size={13} className="text-red-400" />
            Search on YouTube
            <ExternalLink size={10} />
          </a>
        </div>

        {/* Opening Adjustment */}
        <div className="rounded-xl border border-[#2e2e36] bg-[#111113] p-5">
          <div className="flex items-center gap-2 mb-3">
            <svg className="w-4 h-4 text-[#10B981]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 18V5l12-2v13"/>
              <circle cx="6" cy="18" r="3"/>
              <circle cx="18" cy="16" r="3"/>
            </svg>
            <h3 className="text-sm font-bold text-[#f1f1f3]">Opening Adjustment</h3>
          </div>
          <p className="text-sm text-[#94a3b8] leading-relaxed">{plan.opening_adjustment}</p>
        </div>
      </div>

      {/* Weekly Goal */}
      <div className="rounded-xl border border-[#10B981]/25 bg-[#10B981]/5 p-5">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 mt-0.5 w-8 h-8 rounded-lg bg-[#10B981]/15 border border-[#10B981]/25 flex items-center justify-center">
            <Target size={16} className="text-[#10B981]" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-[#10B981] mb-1.5">Measurable Goal This Week</h3>
            <p className="text-sm text-[#6EE7B7] leading-relaxed">{plan.weekly_goal}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
