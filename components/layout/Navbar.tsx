"use client";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Crown } from "lucide-react";

export function Navbar() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-[#1a1a1f] bg-[#0a0a0b]/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2 group">
          <Crown
            size={22}
            className="text-[#10B981] group-hover:scale-110 transition-transform"
          />
          <span className="text-[#f1f1f3] font-bold text-lg tracking-tight">
            Chess<span className="text-[#10B981]">Debrief</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-sm text-[#94a3b8]">
          <Link href="#features" className="hover:text-[#f1f1f3] transition-colors">
            Features
          </Link>
          <Link href="#pricing" className="hover:text-[#f1f1f3] transition-colors">
            Pricing
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <Link href="/auth">
            <Button variant="ghost" size="sm">
              Sign In
            </Button>
          </Link>
          <Link href="/auth">
            <Button variant="gold" size="sm">
              Get Started
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
