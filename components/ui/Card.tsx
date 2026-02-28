import { cn } from "@/lib/utils/cn";
import type { HTMLAttributes } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  glow?: boolean;
}

export function Card({ className, glow, children, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-xl border border-[#2e2e36] bg-[#111113] p-5",
        glow && "border-[#10B981]/30 shadow-[0_0_20px_rgba(212,175,55,0.12)]",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
