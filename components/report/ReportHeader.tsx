import type { AnalysisReport } from "@/types/analysis";
import type { TimeControl } from "@/types/game";
import { formatRating, formatProg } from "@/lib/utils/formatRating";
import { TrendingUp, TrendingDown, Minus, Calendar, Hash } from "lucide-react";

const TC_LABELS: Record<string, string> = {
  bullet: "Bullet",
  blitz: "Blitz",
  rapid: "Rapid",
  classical: "Classical",
  daily: "Daily",
};

interface ReportHeaderProps {
  report: AnalysisReport;
}

export function ReportHeader({ report }: ReportHeaderProps) {
  const date = new Date(report.created_at).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const displayedTCs: TimeControl[] = ["bullet", "blitz", "rapid", "classical"];

  return (
    <div className="rounded-xl border border-[#2e2e36] bg-[#111113] p-6">
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-block w-2 h-2 rounded-full bg-green-400" />
            <span className="text-xs font-semibold text-green-400 uppercase tracking-wide">
              Analysis Complete
            </span>
          </div>
          <h1 className="text-2xl font-bold text-[#f1f1f3]">
            {report.username}&apos;s Debrief
          </h1>
          <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-[#9a9aaa]">
            <span className="capitalize">{report.platform}</span>
            <span className="text-[#2e2e36]">·</span>
            {report.time_control && (
              <>
                <span>{TC_LABELS[report.time_control] ?? report.time_control}</span>
                <span className="text-[#2e2e36]">·</span>
              </>
            )}
            <span className="flex items-center gap-1">
              <Hash size={12} />
              {report.games_analyzed} games
            </span>
            <span className="text-[#2e2e36]">·</span>
            <span className="flex items-center gap-1">
              <Calendar size={12} />
              {date}
            </span>
          </div>
        </div>

        {/* Ratings strip */}
        <div className="flex gap-3 flex-wrap">
          {displayedTCs.map((tc) => {
            const entry = report.ratings[tc];
            if (!entry || entry.rating === null) return null;
            const prog = formatProg(entry.prog);
            return (
              <div
                key={tc}
                className="min-w-[72px] rounded-lg bg-[#1a1a1f] border border-[#2e2e36] px-3 py-2 text-center"
              >
                <p className="text-xs text-[#6b6b7a] font-medium mb-0.5">
                  {TC_LABELS[tc]}
                </p>
                <p className="text-base font-bold text-[#f1f1f3]">
                  {formatRating(entry)}
                </p>
                <div
                  className={`flex items-center justify-center gap-0.5 text-xs font-medium mt-0.5 ${
                    prog.direction === "up"
                      ? "text-green-400"
                      : prog.direction === "down"
                      ? "text-red-400"
                      : "text-[#6b6b7a]"
                  }`}
                >
                  {prog.direction === "up" ? (
                    <TrendingUp size={10} />
                  ) : prog.direction === "down" ? (
                    <TrendingDown size={10} />
                  ) : (
                    <Minus size={10} />
                  )}
                  {prog.symbol}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
