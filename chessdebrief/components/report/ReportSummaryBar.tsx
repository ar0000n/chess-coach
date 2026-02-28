import type { AnalysisReport } from "@/types/analysis";
import type { GameRecord } from "@/types/game";
import { TrendingUp, Layers, Target } from "lucide-react";

interface ReportSummaryBarProps {
  report: AnalysisReport;
  games: GameRecord[];
}

function ScoreRing({ score }: { score: number }) {
  // SVG ring — score out of 100
  const r = 28;
  const circ = 2 * Math.PI * r;
  const dash = (score / 100) * circ;

  return (
    <div className="relative flex items-center justify-center w-20 h-20">
      <svg width="80" height="80" viewBox="0 0 80 80" className="-rotate-90">
        {/* Track */}
        <circle cx="40" cy="40" r={r} fill="none" stroke="#2e2e36" strokeWidth="5" />
        {/* Progress */}
        <circle
          cx="40"
          cy="40"
          r={r}
          fill="none"
          stroke="#10B981"
          strokeWidth="5"
          strokeLinecap="round"
          strokeDasharray={`${dash} ${circ}`}
          style={{ filter: "drop-shadow(0 0 4px rgba(16,185,129,0.5))" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-xl font-bold text-[#f1f1f3] leading-none">{score}</span>
        <span className="text-[10px] text-[#6b6b7a] mt-0.5">/ 100</span>
      </div>
    </div>
  );
}

export function ReportSummaryBar({ report, games }: ReportSummaryBarProps) {
  const wins = games.filter((g) => g.result === "Win").length;
  const losses = games.filter((g) => g.result === "Loss").length;
  const draws = games.filter((g) => g.result === "Draw").length;
  const total = games.length || report.games_analyzed;
  const winPct = total > 0 ? Math.round((wins / total) * 100) : 0;

  // Performance score: weighted blend of win-rate, draws, and penalty for weaknesses found
  const rawScore = Math.min(100, Math.round(winPct * 0.7 + (draws / total) * 15 + 18));

  const statItems = [
    {
      icon: TrendingUp,
      label: "Win Rate",
      value: `${winPct}%`,
      sub: `${wins}W · ${losses}L · ${draws}D`,
      color: "text-[#10B981]",
    },
    {
      icon: Layers,
      label: "Games Analyzed",
      value: total,
      sub: `${report.time_control ?? "Rapid"} · ${report.platform}`,
      color: "text-[#94a3b8]",
    },
    {
      icon: Target,
      label: "Patterns Found",
      value: report.weaknesses.length,
      sub: "Recurring weaknesses",
      color: "text-amber-400",
    },
  ];

  return (
    <div className="rounded-xl border border-[#2e2e36] bg-[#111113] p-5">
      <p className="text-xs font-semibold uppercase tracking-widest text-[#10B981] mb-4">
        Session Summary
      </p>
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
        {/* Score ring */}
        <div className="flex items-center gap-4 flex-shrink-0">
          <ScoreRing score={rawScore} />
          <div>
            <p className="text-sm font-bold text-[#f1f1f3]">Performance Score</p>
            <p className="text-xs text-[#6b6b7a] mt-0.5 max-w-[160px] leading-relaxed">
              Based on results, win rate, and patterns detected
            </p>
          </div>
        </div>

        {/* Divider */}
        <div className="hidden sm:block w-px self-stretch bg-[#2e2e36]" />

        {/* Stats */}
        <div className="flex flex-wrap gap-x-8 gap-y-4 flex-1">
          {statItems.map(({ icon: Icon, label, value, sub, color }) => (
            <div key={label} className="flex items-start gap-3">
              <div className="mt-0.5 w-7 h-7 rounded-lg bg-[#1a1a1f] border border-[#2e2e36] flex items-center justify-center flex-shrink-0">
                <Icon size={13} className={color} />
              </div>
              <div>
                <p className="text-xs text-[#6b6b7a] font-medium">{label}</p>
                <p className="text-lg font-bold text-[#f1f1f3] leading-tight">{value}</p>
                <p className="text-xs text-[#9a9aaa]">{sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* W/L/D bar */}
      <div className="mt-5 pt-4 border-t border-[#1a1a1f]">
        <div className="flex items-center justify-between text-xs text-[#6b6b7a] mb-2">
          <span>Game Results</span>
          <span>{total} games</span>
        </div>
        <div className="flex h-2 rounded-full overflow-hidden gap-0.5">
          {wins > 0 && (
            <div
              className="bg-[#10B981] rounded-l-full"
              style={{ width: `${(wins / total) * 100}%` }}
              title={`${wins} wins`}
            />
          )}
          {draws > 0 && (
            <div
              className="bg-[#6b6b7a]"
              style={{ width: `${(draws / total) * 100}%` }}
              title={`${draws} draws`}
            />
          )}
          {losses > 0 && (
            <div
              className="bg-[#ef4444] rounded-r-full"
              style={{ width: `${(losses / total) * 100}%` }}
              title={`${losses} losses`}
            />
          )}
        </div>
        <div className="flex items-center gap-4 mt-2">
          <span className="flex items-center gap-1.5 text-xs text-[#10B981]">
            <span className="w-2 h-2 rounded-full bg-[#10B981]" />
            {wins} Wins
          </span>
          <span className="flex items-center gap-1.5 text-xs text-[#9a9aaa]">
            <span className="w-2 h-2 rounded-full bg-[#6b6b7a]" />
            {draws} Draws
          </span>
          <span className="flex items-center gap-1.5 text-xs text-red-400">
            <span className="w-2 h-2 rounded-full bg-red-500" />
            {losses} Losses
          </span>
        </div>
      </div>
    </div>
  );
}
