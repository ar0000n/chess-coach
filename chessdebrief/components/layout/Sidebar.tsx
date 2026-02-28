"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Crown, LayoutDashboard, FileText, Settings, LogOut } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { config } from "@/config";

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Reports", href: "/dashboard/reports", icon: FileText },
  { label: "Settings", href: "/dashboard/settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 h-screen w-60 border-r border-[#1a1a1f] bg-[#0a0a0b] flex flex-col">
      {/* Logo */}
      <div className="flex h-16 items-center gap-2 px-5 border-b border-[#1a1a1f]">
        <Crown size={20} className="text-[#10B981]" />
        <span className="text-[#f1f1f3] font-bold tracking-tight">
          Chess<span className="text-[#10B981]">Debrief</span>
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1">
        {navItems.map(({ label, href, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-150",
                active
                  ? "bg-[#10B981]/10 text-[#10B981] border border-[#10B981]/20"
                  : "text-[#94a3b8] hover:text-[#f1f1f3] hover:bg-[#1a1a1f]"
              )}
            >
              <Icon size={16} />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* User section */}
      <div className="p-3 border-t border-[#1a1a1f] space-y-1">
        <div className="px-3 py-2.5 rounded-lg bg-[#111113]">
          <p className="text-xs text-[#4a4a56] font-medium">Signed in as</p>
          <p className="text-sm text-[#f1f1f3] font-medium truncate mt-0.5">
            {config.mock.userEmail}
          </p>
          <span className="inline-block mt-1.5 text-xs bg-[#10B981]/15 text-[#10B981] border border-[#10B981]/20 rounded px-1.5 py-0.5 font-semibold">
            Free Plan
          </span>
        </div>
        <Link
          href="/auth"
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-[#4a4a56] hover:text-[#94a3b8] hover:bg-[#1a1a1f] transition-colors"
        >
          <LogOut size={16} />
          Sign Out
        </Link>
      </div>
    </aside>
  );
}
