"use client";
import { useState } from "react";
import type { Platform, TimeControl } from "@/types/game";
import { Button } from "@/components/ui/Button";
import { Download } from "lucide-react";

interface ImportPanelProps {
  onImport: (opts: {
    username: string;
    platform: Platform;
    timeControl: TimeControl | "all";
    maxGames: number;
  }) => Promise<void>;
  loading: boolean;
}

const TIME_CONTROLS: { value: TimeControl | "all"; label: string }[] = [
  { value: "all", label: "All Time Controls" },
  { value: "rapid", label: "Rapid" },
  { value: "blitz", label: "Blitz" },
  { value: "bullet", label: "Bullet" },
  { value: "classical", label: "Classical" },
];

export function ImportPanel({ onImport, loading }: ImportPanelProps) {
  const [platform, setPlatform] = useState<Platform>("lichess");
  const [username, setUsername] = useState("");
  const [timeControl, setTimeControl] = useState<TimeControl | "all">("rapid");
  const [maxGames, setMaxGames] = useState(15);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!username.trim()) return;
    await onImport({ username: username.trim(), platform, timeControl, maxGames });
  }

  return (
    <div className="rounded-xl border border-[#2e2e36] bg-[#111113] p-5">
      <h2 className="text-sm font-semibold text-[#f1f1f3] mb-4">Import Games</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Platform toggle */}
        <div>
          <label className="block text-xs font-semibold text-[#7a7a8c] mb-2 uppercase tracking-wide">
            Platform
          </label>
          <div className="flex gap-2">
            {(["lichess", "chess.com"] as Platform[]).map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setPlatform(p)}
                className={`flex-1 rounded-lg border py-2.5 text-sm font-medium transition-all duration-150 ${
                  platform === p
                    ? "border-[#10B981]/40 bg-[#10B981]/10 text-[#10B981]"
                    : "border-[#2e2e36] bg-[#1a1a1f] text-[#7a7a8c] hover:text-[#94a3b8] hover:border-[#3d3d47]"
                }`}
              >
                {p === "lichess" ? "Lichess" : "Chess.com"}
              </button>
            ))}
          </div>
        </div>

        {/* Username */}
        <div>
          <label className="block text-xs font-semibold text-[#7a7a8c] mb-2 uppercase tracking-wide">
            Username
          </label>
          <input
            type="text"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder={platform === "lichess" ? "your-lichess-handle" : "your-chess.com-username"}
            className="w-full rounded-lg border border-[#2e2e36] bg-[#1a1a1f] px-3 py-2.5 text-sm text-[#f1f1f3] placeholder-[#4a4a56] focus:border-[#10B981]/50 focus:ring-1 focus:ring-[#10B981]/30 focus:outline-none transition-colors"
          />
        </div>

        {/* Time control + max games */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-[#7a7a8c] mb-2 uppercase tracking-wide">
              Time Control
            </label>
            <select
              value={timeControl}
              onChange={(e) => setTimeControl(e.target.value as TimeControl | "all")}
              className="w-full rounded-lg border border-[#2e2e36] bg-[#1a1a1f] px-3 py-2.5 text-sm text-[#f1f1f3] focus:border-[#10B981]/50 focus:ring-1 focus:ring-[#10B981]/30 focus:outline-none transition-colors appearance-none cursor-pointer"
            >
              {TIME_CONTROLS.map(({ value, label }) => (
                <option key={value} value={value} className="bg-[#1a1a1f]">
                  {label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#7a7a8c] mb-2 uppercase tracking-wide">
              Games to Import: {maxGames}
            </label>
            <input
              type="range"
              min={5}
              max={50}
              step={5}
              value={maxGames}
              onChange={(e) => setMaxGames(Number(e.target.value))}
              className="w-full mt-2 accent-[#10B981] cursor-pointer"
            />
            <div className="flex justify-between text-xs text-[#4a4a56] mt-1">
              <span>5</span>
              <span>50</span>
            </div>
          </div>
        </div>

        <Button
          type="submit"
          variant="gold"
          loading={loading}
          className="w-full"
        >
          <Download size={15} />
          {loading ? "Importing…" : "Import Games"}
        </Button>
      </form>
    </div>
  );
}
