import type { Weakness } from "@/types/analysis";
import { ExternalLink, Crown, Lightbulb } from "lucide-react";

interface WeaknessCardProps {
  weakness: Weakness;
}

const RANK_COLORS = [
  "border-[#10B981]/40 bg-[#10B981]/3",
  "border-[#9a9aaa]/30 bg-transparent",
  "border-[#6b6b7a]/30 bg-transparent",
];

export function WeaknessCard({ weakness }: WeaknessCardProps) {
  const borderClass = RANK_COLORS[weakness.rank - 1] ?? RANK_COLORS[2];

  return (
    <div className={`rounded-xl border ${borderClass} bg-[#111113] overflow-hidden`}>
      {/* Card header */}
      <div className="flex items-start gap-4 p-5 pb-4">
        {/* Rank badge */}
        <div
          className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm ${
            weakness.rank === 1
              ? "bg-[#10B981] text-[#0a0a0b]"
              : weakness.rank === 2
              ? "bg-[#2e2e36] text-[#94a3b8]"
              : "bg-[#1a1a1f] text-[#9a9aaa]"
          }`}
        >
          {weakness.rank === 1 ? <Crown size={14} /> : weakness.rank}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-base font-bold text-[#f1f1f3] leading-tight">
              {weakness.title}
            </h3>
            {weakness.rank === 1 && (
              <span className="flex-shrink-0 text-xs bg-[#10B981]/15 text-[#10B981] border border-[#10B981]/30 rounded-full px-2.5 py-0.5 font-semibold">
                Primary Focus
              </span>
            )}
          </div>
          <p className="mt-2 text-sm text-[#94a3b8] leading-relaxed">
            {weakness.description}
          </p>
        </div>
      </div>

      {/* Game citations */}
      <div className="px-5 pb-4">
        <p className="text-xs font-semibold text-[#6b6b7a] uppercase tracking-wider mb-2">
          Evidence
        </p>
        <div className="flex flex-wrap gap-2">
          {weakness.game_citations.map((cite) => (
            <a
              key={cite.game_number}
              href={cite.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full border border-[#2e2e36] bg-[#1a1a1f] px-3 py-1 text-xs font-medium text-[#9a9aaa] hover:border-[#10B981]/40 hover:text-[#10B981] transition-all duration-150 group"
            >
              Game {cite.game_number}
              <ExternalLink
                size={10}
                className="text-[#6b6b7a] group-hover:text-[#10B981] transition-colors"
              />
            </a>
          ))}
        </div>
      </div>

      {/* Actionable tip */}
      <div className="mx-5 mb-5 rounded-lg border border-[#10B981]/20 bg-[#10B981]/5 p-4">
        <div className="flex items-start gap-2.5">
          <Lightbulb
            size={15}
            className="flex-shrink-0 mt-0.5 text-[#10B981]"
          />
          <div>
            <p className="text-xs font-bold text-[#10B981] uppercase tracking-wide mb-1">
              Coach&apos;s Tip
            </p>
            <p className="text-sm text-[#6EE7B7] leading-relaxed">
              {weakness.actionable_tip}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
