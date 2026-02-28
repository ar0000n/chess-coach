import { ReportHeader } from "@/components/report/ReportHeader";
import { ReportSummaryBar } from "@/components/report/ReportSummaryBar";
import { WeaknessCard } from "@/components/report/WeaknessCard";
import { TrainingPlanSection } from "@/components/report/TrainingPlanSection";
import { RatingTrendChart } from "@/components/report/RatingTrendChart";
import { StickyBottomBar } from "@/components/report/StickyBottomBar";
import type { AnalysisReport } from "@/types/analysis";
import type { ApiResponse } from "@/types/api";
import { MOCK_GAMES } from "@/mock/games";
import { MOCK_RAPID_TREND } from "@/mock/ratings";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Crown, LayoutDashboard, TrendingUp, ChevronRight } from "lucide-react";

async function getReport(id: string): Promise<AnalysisReport> {
  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL ??
    (process.env.NODE_ENV === "development"
      ? "http://localhost:3000"
      : "https://chessdebrief.com");

  const res = await fetch(`${baseUrl}/api/analysis/${id}`, {
    cache: "no-store",
  });

  const json: ApiResponse<AnalysisReport> = await res.json();

  if (json.error || !json.data) {
    notFound();
  }

  return json.data;
}

export default async function ReportPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const report = await getReport(id);

  return (
    <div className="min-h-screen bg-[#0a0a0b] pb-24">
      {/* Slim top nav */}
      <header className="sticky top-0 z-40 border-b border-[#1a1a1f] bg-[#0a0a0b]/95 backdrop-blur-md">
        <div className="max-w-4xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Crown size={18} className="text-[#10B981]" />
            <span className="text-[#f1f1f3] font-bold tracking-tight text-sm">
              Chess<span className="text-[#10B981]">Debrief</span>
            </span>
          </Link>

          {/* Breadcrumb */}
          <div className="flex items-center gap-1.5 text-xs text-[#6b6b7a]">
            <Link
              href="/dashboard"
              className="flex items-center gap-1 hover:text-[#94a3b8] transition-colors"
            >
              <LayoutDashboard size={11} />
              Dashboard
            </Link>
            <ChevronRight size={11} />
            <span className="text-[#9a9aaa]">Debrief Report</span>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8 space-y-6">

        {/* ── 1. Header ── */}
        <ReportHeader report={report} />

        {/* ── 2. Session Summary ── */}
        <ReportSummaryBar report={report} games={MOCK_GAMES} />

        {/* ── 3. Weaknesses ── */}
        <section>
          <div className="mb-4">
            <p className="text-xs font-semibold uppercase tracking-widest text-[#10B981] mb-1">
              Pattern Analysis
            </p>
            <h2 className="text-xl font-bold text-[#f1f1f3]">
              Your 3 Recurring Weaknesses
            </h2>
            <p className="text-sm text-[#9a9aaa] mt-1">
              Identified across {report.games_analyzed} recent games — ranked by impact on your results.
            </p>
          </div>
          <div className="space-y-4">
            {report.weaknesses
              .sort((a, b) => a.rank - b.rank)
              .map((weakness) => (
                <WeaknessCard key={weakness.rank} weakness={weakness} />
              ))}
          </div>
        </section>

        {/* ── 4. Training Plan ── */}
        <TrainingPlanSection plan={report.training_plan} />

        {/* ── 5. Progress / Rating Trend ── */}
        <section>
          <div className="mb-4">
            <p className="text-xs font-semibold uppercase tracking-widest text-[#10B981] mb-1">
              Your Progress
            </p>
            <h2 className="text-xl font-bold text-[#f1f1f3]">
              Rapid Rating Trend
            </h2>
            <p className="text-sm text-[#9a9aaa] mt-1">
              Last 90 days · Lichess rapid games
            </p>
          </div>

          <div className="rounded-xl border border-[#2e2e36] bg-[#111113] p-5">
            {/* Current rating pill */}
            <div className="flex items-start justify-between mb-5">
              <div>
                <p className="text-xs text-[#6b6b7a] font-medium">Current Rating</p>
                <p className="text-3xl font-bold text-[#f1f1f3] leading-none mt-1">
                  1601
                  <span className="text-sm font-normal text-[#10B981] ml-2">Rapid</span>
                </p>
              </div>
              <div className="flex items-center gap-1.5 mt-1">
                <TrendingUp size={14} className="text-[#10B981]" />
                <span className="text-sm font-semibold text-[#10B981]">+113 pts this period</span>
              </div>
            </div>

            {/* Chart */}
            <RatingTrendChart data={MOCK_RAPID_TREND} height={140} />

            {/* Milestone callout */}
            <div className="mt-5 pt-4 border-t border-[#1a1a1f] grid grid-cols-3 gap-4">
              {[
                { label: "Period Start", value: "1488", sub: "Dec 1" },
                { label: "Peak", value: "1601", sub: "Feb 28" },
                { label: "Total Gain", value: "+113", sub: "pts", highlight: true },
              ].map(({ label, value, sub, highlight }) => (
                <div key={label} className="text-center">
                  <p className="text-xs text-[#6b6b7a] mb-1">{label}</p>
                  <p className={`text-lg font-bold ${highlight ? "text-[#10B981]" : "text-[#f1f1f3]"}`}>
                    {value}
                  </p>
                  <p className="text-xs text-[#6b6b7a]">{sub}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── 6. Closing note ── */}
        <div className="rounded-xl border border-[#2e2e36] bg-[#111113] p-6 text-center">
          <div className="w-10 h-10 rounded-xl bg-[#10B981]/10 border border-[#10B981]/20 flex items-center justify-center mx-auto mb-3">
            <Crown size={18} className="text-[#10B981]" />
          </div>
          <p className="text-base font-semibold text-[#f1f1f3] mb-1">
            Good work this week, {report.username}.
          </p>
          <p className="text-sm text-[#9a9aaa] max-w-sm mx-auto leading-relaxed">
            Progress is made one session at a time. Come back after your next 10–15 games
            for an updated debrief.
          </p>
        </div>
      </main>

      {/* ── 7. Sticky bottom CTA bar ── */}
      <StickyBottomBar />
    </div>
  );
}
