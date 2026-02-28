import Link from "next/link";
import { Crown } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-[#1a1a1f] bg-[#0a0a0b] py-12">
      <div className="mx-auto max-w-6xl px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <Crown size={18} className="text-[#10B981]" />
            <span className="text-[#f1f1f3] font-bold">
              Chess<span className="text-[#10B981]">Debrief</span>
            </span>
          </div>
          <p className="text-sm text-[#4a4a56]">
            © 2026 ChessDebrief. Your personal post-game coach.
          </p>
          <div className="flex gap-5 text-sm text-[#4a4a56]">
            <Link href="#" className="hover:text-[#94a3b8] transition-colors">Privacy</Link>
            <Link href="#" className="hover:text-[#94a3b8] transition-colors">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
