"use client";
import Link from "next/link";
import { ArrowRight, Zap, Lock } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function StickyBottomBar() {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-[#2e2e36] bg-[#0a0a0b]/95 backdrop-blur-md">
      <div className="max-w-4xl mx-auto px-6 py-3 flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Left: locked feature hints */}
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-[#1a1a1f] border border-[#2e2e36] flex items-center justify-center">
            <Lock size={13} className="text-[#6b6b7a]" />
          </div>
          <div>
            <p className="text-sm font-semibold text-[#f1f1f3] leading-tight">
              Unlock your full debrief
            </p>
            <p className="text-xs text-[#6b6b7a] mt-0.5">
              Opening analysis · Progress tracking · Unlimited reports
            </p>
          </div>
        </div>

        {/* Right: CTAs */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <span className="hidden sm:flex items-center gap-1.5 text-xs text-[#10B981] font-semibold">
            <Zap size={11} />
            Pro from $9/mo
          </span>
          <Link href="/auth">
            <Button variant="gold" size="sm" className="gap-1.5">
              Get Full Access
              <ArrowRight size={13} />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
