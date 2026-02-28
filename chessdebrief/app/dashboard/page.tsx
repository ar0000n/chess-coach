"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import type { GameRecord, RatingsMap, Platform, TimeControl } from "@/types/game";
import type { ImportResult } from "@/types/game";
import type { ApiResponse } from "@/types/api";
import { ImportPanel } from "@/components/dashboard/ImportPanel";
import { GameTable } from "@/components/dashboard/GameTable";
import { RatingsCard } from "@/components/dashboard/RatingsCard";
import { AnalysisTriggerBar } from "@/components/dashboard/AnalysisTriggerBar";
import { Spinner } from "@/components/ui/Spinner";
import { FileText } from "lucide-react";

export default function DashboardPage() {
  const router = useRouter();
  const [importing, setImporting] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [games, setGames] = useState<GameRecord[]>([]);
  const [ratings, setRatings] = useState<RatingsMap | null>(null);
  const [importedPlatform, setImportedPlatform] = useState<Platform>("lichess");
  const [importedUsername, setImportedUsername] = useState("");
  const [error, setError] = useState<string | null>(null);

  async function handleImport(opts: {
    username: string;
    platform: Platform;
    timeControl: TimeControl | "all";
    maxGames: number;
  }) {
    setImporting(true);
    setError(null);
    try {
      const res = await fetch("/api/games/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(opts),
      });
      const json: ApiResponse<ImportResult> = await res.json();
      if (json.error) {
        setError(json.error.message);
        return;
      }
      setGames(json.data.games);
      setRatings(json.data.ratings);
      setImportedPlatform(opts.platform);
      setImportedUsername(opts.username);
    } catch {
      setError("Failed to import games. Please try again.");
    } finally {
      setImporting(false);
    }
  }

  async function handleAnalyze() {
    setAnalyzing(true);
    setError(null);
    try {
      const res = await fetch("/api/analysis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ game_ids: games.map((g) => g.id) }),
      });
      const json: ApiResponse<{ report_id: string }> = await res.json();
      if (json.error) {
        setError(json.error.message);
        return;
      }
      router.push(`/report/${json.data.report_id}`);
    } catch {
      setError("Failed to start analysis. Please try again.");
    } finally {
      setAnalyzing(false);
    }
  }

  return (
    <div className="min-h-screen p-6 md:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#f1f1f3]">Dashboard</h1>
        <p className="text-sm text-[#7a7a8c] mt-1">
          Import your recent games and get a personalised coaching debrief.
        </p>
      </div>

      <div className="grid gap-5 lg:grid-cols-[340px_1fr]">
        {/* Left column */}
        <div className="space-y-5">
          <ImportPanel onImport={handleImport} loading={importing} />

          {/* Reports link */}
          <div className="rounded-xl border border-[#2e2e36] bg-[#111113] p-5">
            <div className="flex items-center gap-3 mb-3">
              <FileText size={16} className="text-[#10B981]" />
              <h3 className="text-sm font-semibold text-[#f1f1f3]">Recent Reports</h3>
            </div>
            <p className="text-xs text-[#4a4a56]">
              Your analysis reports will appear here after your first debrief.
            </p>
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-5">
          {importing && (
            <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-[#2e2e36] bg-[#111113] p-12">
              <Spinner size="lg" />
              <p className="text-sm text-[#7a7a8c]">Importing games from {importedPlatform || "platform"}…</p>
            </div>
          )}

          {!importing && error && (
            <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-4">
              <p className="text-sm text-red-400">{error}</p>
            </div>
          )}

          {!importing && ratings && (
            <RatingsCard
              ratings={ratings}
              platform={importedPlatform}
              username={importedUsername}
            />
          )}

          {!importing && games.length > 0 && (
            <AnalysisTriggerBar
              gameCount={games.length}
              onAnalyze={handleAnalyze}
              loading={analyzing}
            />
          )}

          {analyzing && (
            <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-[#10B981]/20 bg-[#10B981]/5 p-12">
              <Spinner size="lg" />
              <p className="text-sm font-medium text-[#10B981]">
                Analyzing your games…
              </p>
              <p className="text-xs text-[#7a7a8c] text-center max-w-xs">
                The AI coach is reviewing your patterns, identifying weaknesses, and building your training plan.
              </p>
            </div>
          )}

          {!importing && !analyzing && games.length > 0 && (
            <GameTable games={games} />
          )}

          {!importing && !analyzing && games.length === 0 && (
            <div className="flex flex-col items-center justify-center gap-4 rounded-xl border border-[#2e2e36] border-dashed bg-[#111113] p-16 text-center">
              <div className="w-12 h-12 rounded-xl bg-[#1a1a1f] border border-[#2e2e36] flex items-center justify-center">
                <FileText size={22} className="text-[#4a4a56]" />
              </div>
              <div>
                <p className="text-sm font-semibold text-[#7a7a8c]">No games imported yet</p>
                <p className="text-xs text-[#4a4a56] mt-1">
                  Enter your username and click &ldquo;Import Games&rdquo; to get started.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
