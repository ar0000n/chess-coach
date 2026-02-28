"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Crown, Mail, Lock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { ChessBoardPattern } from "@/components/layout/ChessBoardPattern";

export default function AuthPage() {
  const router = useRouter();
  const [tab, setTab] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    // Mock mode: skip Supabase, go straight to dashboard
    await new Promise((r) => setTimeout(r, 800));
    router.push("/dashboard");
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center px-4 py-16">
      <ChessBoardPattern />

      {/* Glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[400px] rounded-full bg-[#10B981]/4 blur-[100px]"
      />

      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <Link href="/" className="flex items-center justify-center gap-2 mb-8 group">
          <Crown size={22} className="text-[#10B981]" />
          <span className="text-[#f1f1f3] font-bold text-xl tracking-tight">
            Chess<span className="text-[#10B981]">Debrief</span>
          </span>
        </Link>

        {/* Card */}
        <div className="rounded-2xl border border-[#2e2e36] bg-[#111113] p-8 shadow-[0_0_60px_rgba(0,0,0,0.5)]">
          <h1 className="text-xl font-bold text-[#f1f1f3] mb-1">
            {tab === "signin" ? "Welcome back" : "Create your account"}
          </h1>
          <p className="text-sm text-[#7a7a8c] mb-6">
            {tab === "signin"
              ? "Sign in to access your debriefs and game analysis."
              : "Start with one free debrief. No credit card required."}
          </p>

          {/* Tab toggle */}
          <div className="flex rounded-lg bg-[#1a1a1f] p-1 mb-6">
            {(["signin", "signup"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`flex-1 rounded-md py-2 text-sm font-medium transition-all duration-150 ${
                  tab === t
                    ? "bg-[#2e2e36] text-[#f1f1f3] shadow-sm"
                    : "text-[#7a7a8c] hover:text-[#94a3b8]"
                }`}
              >
                {t === "signin" ? "Sign In" : "Sign Up"}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-xs font-semibold text-[#7a7a8c] mb-1.5 uppercase tracking-wide">
                Email
              </label>
              <div className="relative">
                <Mail
                  size={15}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-[#4a4a56]"
                />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="player@example.com"
                  className="w-full rounded-lg border border-[#2e2e36] bg-[#1a1a1f] pl-9 pr-4 py-2.5 text-sm text-[#f1f1f3] placeholder-[#4a4a56] focus:border-[#10B981]/50 focus:ring-1 focus:ring-[#10B981]/30 focus:outline-none transition-colors"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold text-[#7a7a8c] mb-1.5 uppercase tracking-wide">
                Password
              </label>
              <div className="relative">
                <Lock
                  size={15}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-[#4a4a56]"
                />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-lg border border-[#2e2e36] bg-[#1a1a1f] pl-9 pr-4 py-2.5 text-sm text-[#f1f1f3] placeholder-[#4a4a56] focus:border-[#10B981]/50 focus:ring-1 focus:ring-[#10B981]/30 focus:outline-none transition-colors"
                />
              </div>
            </div>

            <Button
              type="submit"
              variant="gold"
              size="lg"
              loading={loading}
              className="w-full mt-2"
            >
              {tab === "signin" ? "Sign In" : "Create Account"}
              <ArrowRight size={15} />
            </Button>
          </form>

          {/* Divider */}
          <div className="my-5 flex items-center gap-3">
            <div className="flex-1 h-px bg-[#2e2e36]" />
            <span className="text-xs text-[#4a4a56]">or</span>
            <div className="flex-1 h-px bg-[#2e2e36]" />
          </div>

          {/* Google OAuth (decorative in mock mode) */}
          <Button
            variant="outline"
            size="lg"
            className="w-full"
            onClick={handleSubmit}
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </Button>
        </div>

        <p className="mt-6 text-center text-xs text-[#4a4a56]">
          By continuing, you agree to ChessDebrief&apos;s{" "}
          <Link href="#" className="text-[#7a7a8c] hover:text-[#94a3b8] underline">
            Terms
          </Link>{" "}
          and{" "}
          <Link href="#" className="text-[#7a7a8c] hover:text-[#94a3b8] underline">
            Privacy Policy
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
