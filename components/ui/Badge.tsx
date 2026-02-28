import { cn } from "@/lib/utils/cn";

interface BadgeProps {
  variant?: "win" | "loss" | "draw" | "gold" | "neutral" | "rank";
  children: React.ReactNode;
  className?: string;
}

export function Badge({ variant = "neutral", children, className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-semibold",
        {
          win: "bg-green-500/15 text-green-400 border border-green-500/20",
          loss: "bg-red-500/15 text-red-400 border border-red-500/20",
          draw: "bg-slate-500/15 text-slate-400 border border-slate-500/20",
          gold: "bg-[#10B981]/15 text-[#10B981] border border-[#10B981]/30",
          neutral: "bg-[#2e2e36] text-[#94a3b8] border border-[#3d3d47]",
          rank: "bg-[#10B981] text-[#0a0a0b] font-bold",
        }[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
