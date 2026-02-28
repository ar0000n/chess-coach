import type { RatingsMap, TimeControl } from "@/types/game";
import { formatRating, formatProg } from "@/lib/utils/formatRating";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

const DISPLAYED_TCS: TimeControl[] = ["bullet", "blitz", "rapid", "classical"];
const TC_LABELS: Record<TimeControl, string> = {
  bullet: "Bullet",
  blitz: "Blitz",
  rapid: "Rapid",
  classical: "Classical",
  daily: "Daily",
};

interface RatingsCardProps {
  ratings: RatingsMap;
  platform: "lichess" | "chess.com";
  username: string;
}

export function RatingsCard({ ratings, platform, username }: RatingsCardProps) {
  return (
    <div className="rounded-xl border border-[#2e2e36] bg-[#111113] p-5">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-[#f1f1f3]">{username}</p>
          <p className="text-xs text-[#4a4a56] mt-0.5 capitalize">{platform}</p>
        </div>
        <span className="rounded-full border border-[#2e2e36] bg-[#1a1a1f] px-2.5 py-1 text-xs text-[#7a7a8c]">
          Ratings
        </span>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {DISPLAYED_TCS.map((tc) => {
          const entry = ratings[tc];
          if (!entry) return null;
          const prog = formatProg(entry.prog);
          const hasRating = entry.rating !== null;
          return (
            <div key={tc} className="rounded-lg bg-[#1a1a1f] border border-[#2e2e36] p-3">
              <p className="text-xs text-[#4a4a56] font-medium mb-1">{TC_LABELS[tc]}</p>
              <p className={`text-xl font-bold ${hasRating ? "text-[#f1f1f3]" : "text-[#4a4a56]"}`}>
                {formatRating(entry)}
              </p>
              {hasRating && (
                <div
                  className={`mt-1 flex items-center gap-1 text-xs font-medium ${
                    prog.direction === "up"
                      ? "text-green-400"
                      : prog.direction === "down"
                      ? "text-red-400"
                      : "text-[#4a4a56]"
                  }`}
                >
                  {prog.direction === "up" ? (
                    <TrendingUp size={11} />
                  ) : prog.direction === "down" ? (
                    <TrendingDown size={11} />
                  ) : (
                    <Minus size={11} />
                  )}
                  {prog.symbol}
                </div>
              )}
              {hasRating && (
                <p className="text-xs text-[#4a4a56] mt-0.5">{entry.games} games</p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
