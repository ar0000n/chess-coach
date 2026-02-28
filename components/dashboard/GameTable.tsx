import type { GameRecord } from "@/types/game";
import { Badge } from "@/components/ui/Badge";
import { ExternalLink, Minus } from "lucide-react";

interface GameTableProps {
  games: GameRecord[];
}

export function GameTable({ games }: GameTableProps) {
  if (games.length === 0) return null;

  return (
    <div className="rounded-xl border border-[#2e2e36] bg-[#111113] overflow-hidden">
      <div className="px-5 py-4 border-b border-[#2e2e36]">
        <h2 className="text-sm font-semibold text-[#f1f1f3]">
          Imported Games{" "}
          <span className="ml-1 text-xs text-[#4a4a56] font-normal">({games.length})</span>
        </h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#1a1a1f]">
              <th className="px-5 py-3 text-left text-xs font-semibold text-[#4a4a56] uppercase tracking-wider">
                Result
              </th>
              <th className="px-5 py-3 text-left text-xs font-semibold text-[#4a4a56] uppercase tracking-wider">
                Opening
              </th>
              <th className="px-5 py-3 text-left text-xs font-semibold text-[#4a4a56] uppercase tracking-wider hidden md:table-cell">
                Opponent
              </th>
              <th className="px-5 py-3 text-left text-xs font-semibold text-[#4a4a56] uppercase tracking-wider hidden md:table-cell">
                Moves
              </th>
              <th className="px-5 py-3 text-left text-xs font-semibold text-[#4a4a56] uppercase tracking-wider">
                Color
              </th>
              <th className="px-5 py-3 text-right text-xs font-semibold text-[#4a4a56] uppercase tracking-wider">
                Link
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1a1a1f]">
            {games.map((game) => (
              <tr key={game.id} className="hover:bg-[#131316] transition-colors">
                <td className="px-5 py-3">
                  <Badge
                    variant={
                      game.result === "Win"
                        ? "win"
                        : game.result === "Loss"
                        ? "loss"
                        : "draw"
                    }
                  >
                    {game.result}
                  </Badge>
                </td>
                <td className="px-5 py-3">
                  <span className="text-[#f1f1f3] truncate block max-w-[200px]">
                    {game.opening}
                  </span>
                </td>
                <td className="px-5 py-3 text-[#7a7a8c] hidden md:table-cell">
                  {game.opponent}
                </td>
                <td className="px-5 py-3 text-[#7a7a8c] hidden md:table-cell">
                  {game.move_count}
                </td>
                <td className="px-5 py-3">
                  <span
                    className={`text-xs font-medium ${
                      game.color === "White" ? "text-[#f1f1f3]" : "text-[#7a7a8c]"
                    }`}
                  >
                    {game.color}
                  </span>
                </td>
                <td className="px-5 py-3 text-right">
                  <a
                    href={game.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-[#4a4a56] hover:text-[#10B981] transition-colors"
                  >
                    <ExternalLink size={13} />
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
