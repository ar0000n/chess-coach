"use client";
import { useState, useRef } from "react";
import { ArrowRight, CheckCircle2, Users } from "lucide-react";

// In-memory store — swap for a real backend call later
const waitlistEmails: string[] = [];

export function EmailCapture() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = email.trim().toLowerCase();
    if (!trimmed) return;

    setLoading(true);
    setError("");

    // Simulate a network round-trip; replace with real API call later
    await new Promise((r) => setTimeout(r, 700));

    if (waitlistEmails.includes(trimmed)) {
      setError("You're already on the list!");
      setLoading(false);
      return;
    }

    waitlistEmails.push(trimmed);
    setSubmitted(true);
    setLoading(false);
  }

  return (
    <section className="w-full max-w-2xl mx-auto px-6 pb-16">
      <div className="rounded-2xl border border-[#10B981]/20 bg-[#0e1a16] p-8 relative overflow-hidden">
        {/* Subtle glow blob */}
        <div
          aria-hidden
          className="pointer-events-none absolute -top-16 left-1/2 -translate-x-1/2 w-64 h-64 rounded-full bg-[#10B981]/8 blur-[60px]"
        />

        {!submitted ? (
          <>
            {/* Header */}
            <div className="text-center mb-6 relative z-10">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#10B981]/25 bg-[#10B981]/8 px-3 py-1 text-xs font-semibold text-[#10B981] uppercase tracking-widest mb-4">
                <Users size={11} />
                Early Access
              </div>
              <h2 className="text-2xl font-bold text-[#f1f1f3] mb-2">
                Get Early Access
              </h2>
              <p className="text-sm text-[#9a9aaa] leading-relaxed max-w-sm mx-auto">
                Join 200+ players already on the waitlist. Free debrief when we launch.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="relative z-10">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1 relative">
                  <input
                    ref={inputRef}
                    type="email"
                    required
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setError("");
                    }}
                    placeholder="your@email.com"
                    className="w-full rounded-lg border border-[#2e2e36] bg-[#111113] px-4 py-3 text-sm text-[#f1f1f3] placeholder-[#4a4a56] focus:border-[#10B981]/50 focus:ring-1 focus:ring-[#10B981]/30 focus:outline-none transition-colors"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-shrink-0 inline-flex items-center justify-center gap-2 rounded-lg bg-[#0d9e6e] hover:bg-[#0f8f63] active:bg-[#0a7a53] text-[#f1f1f3] font-semibold px-5 py-3 text-sm transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <span className="w-4 h-4 border-2 border-[#f1f1f3]/40 border-t-[#f1f1f3] rounded-full animate-spin" />
                  ) : (
                    <>
                      Claim My Spot
                      <ArrowRight size={14} />
                    </>
                  )}
                </button>
              </div>

              {error && (
                <p className="mt-2 text-xs text-amber-400">{error}</p>
              )}
            </form>

            {/* Trust line */}
            <p className="relative z-10 mt-4 text-center text-xs text-[#6b6b7a]">
              No spam, ever. Unsubscribe any time.
            </p>
          </>
        ) : (
          /* Success state */
          <div className="relative z-10 text-center py-4">
            <div className="flex justify-center mb-4">
              <div className="w-14 h-14 rounded-full bg-[#10B981]/15 border border-[#10B981]/30 flex items-center justify-center">
                <CheckCircle2 size={28} className="text-[#10B981]" />
              </div>
            </div>
            <h3 className="text-xl font-bold text-[#f1f1f3] mb-2">
              You&apos;re on the list.
            </h3>
            <p className="text-sm text-[#9a9aaa] max-w-xs mx-auto leading-relaxed">
              We&apos;ll be in touch soon. In the meantime, you can try a free debrief right now.
            </p>
            <a
              href="/auth"
              className="inline-flex items-center gap-2 mt-5 rounded-lg bg-[#0d9e6e] hover:bg-[#0f8f63] text-[#f1f1f3] font-semibold px-5 py-2.5 text-sm transition-colors"
            >
              Try a Free Debrief
              <ArrowRight size={14} />
            </a>
          </div>
        )}
      </div>
    </section>
  );
}
