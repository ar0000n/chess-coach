"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { X, ArrowRight, Crown } from "lucide-react";
import { MOCK_REPORT_ID } from "@/mock/analysis";

// In-memory store — swap for a real API call later
const waitlistEmails: string[] = [];

interface EarlyAccessModalProps {
  open: boolean;
  onClose: () => void;
}

export function EarlyAccessModal({ open, onClose }: EarlyAccessModalProps) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input when modal opens; lock body scroll
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      setTimeout(() => inputRef.current?.focus(), 80);
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = email.trim().toLowerCase();
    if (!trimmed) return;
    setLoading(true);
    setError("");

    // Simulate network round-trip; swap for real API call later
    await new Promise((r) => setTimeout(r, 700));

    if (!waitlistEmails.includes(trimmed)) {
      waitlistEmails.push(trimmed);
    }

    // Redirect straight to the sample debrief report
    router.push(`/report/${MOCK_REPORT_ID}`);
  }

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-headline"
    >
      {/* Dark overlay */}
      <div
        className="absolute inset-0 bg-[#0a0a0b]/80 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Card */}
      <div className="relative z-10 w-full max-w-md rounded-2xl border border-[#2e2e36] bg-[#111113] p-8 shadow-[0_0_80px_rgba(0,0,0,0.8)]">

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-lg flex items-center justify-center text-[#6b6b7a] hover:text-[#f1f1f3] hover:bg-[#1a1a1f] transition-colors"
          aria-label="Close modal"
        >
          <X size={16} />
        </button>

        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <Crown size={20} className="text-[#10B981]" />
          <span className="text-[#f1f1f3] font-bold text-lg tracking-tight">
            Chess<span className="text-[#10B981]">Debrief</span>
          </span>
        </div>

        {/* Headline */}
        <div className="text-center mb-6">
          <h2
            id="modal-headline"
            className="text-2xl font-bold text-[#f1f1f3] mb-2"
          >
            See a Full Sample Debrief
          </h2>
          <p className="text-sm text-[#9a9aaa] leading-relaxed max-w-xs mx-auto">
            Enter your email and we&apos;ll show you exactly what your debrief would
            look like — plus save your spot for early access.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            ref={inputRef}
            type="email"
            required
            value={email}
            onChange={(e) => { setEmail(e.target.value); setError(""); }}
            placeholder="your@email.com"
            className="w-full rounded-lg border border-[#2e2e36] bg-[#1a1a1f] px-4 py-3 text-sm text-[#f1f1f3] placeholder-[#4a4a56] focus:border-[#10B981]/50 focus:ring-1 focus:ring-[#10B981]/30 focus:outline-none transition-colors"
          />

          {error && (
            <p className="text-xs text-amber-400">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-[#0d9e6e] hover:bg-[#0f8f63] active:bg-[#0a7a53] text-[#f1f1f3] font-semibold px-5 py-3 text-sm transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="w-4 h-4 border-2 border-[#f1f1f3]/40 border-t-[#f1f1f3] rounded-full animate-spin" />
            ) : (
              <>
                Show Me My Sample
                <ArrowRight size={14} />
              </>
            )}
          </button>
        </form>

        <p className="mt-4 text-center text-xs text-[#6b6b7a]">
          No spam, ever. Unsubscribe any time.
        </p>
      </div>
    </div>
  );
}
