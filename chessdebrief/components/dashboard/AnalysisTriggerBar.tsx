"use client";
import { Button } from "@/components/ui/Button";
import { Brain, ArrowRight } from "lucide-react";

interface AnalysisTriggerBarProps {
  gameCount: number;
  onAnalyze: () => void;
  loading: boolean;
}

export function AnalysisTriggerBar({ gameCount, onAnalyze, loading }: AnalysisTriggerBarProps) {
  return (
    <div className="rounded-xl border border-[#10B981]/25 bg-[#10B981]/5 p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div className="flex items-start gap-3">
        <div className="mt-0.5 flex-shrink-0 w-8 h-8 rounded-lg bg-[#10B981]/15 border border-[#10B981]/20 flex items-center justify-center">
          <Brain size={16} className="text-[#10B981]" />
        </div>
        <div>
          <p className="text-sm font-semibold text-[#f1f1f3]">
            Ready to Debrief
          </p>
          <p className="text-xs text-[#7a7a8c] mt-0.5">
            {gameCount} games imported. The AI coach will analyze your patterns and build a training plan.
          </p>
        </div>
      </div>
      <Button
        variant="gold"
        onClick={onAnalyze}
        loading={loading}
        className="flex-shrink-0 shadow-[0_0_15px_rgba(16,185,129,0.25)]"
      >
        Analyze {gameCount} Games
        <ArrowRight size={14} />
      </Button>
    </div>
  );
}
