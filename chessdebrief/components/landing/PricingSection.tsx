"use client";
import Link from "next/link";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { PLANS } from "@/lib/stripe/products";

export function PricingSection() {
  return (
    <section id="pricing" className="py-24 px-6">
      <div className="mx-auto max-w-5xl">
        <div className="text-center mb-14">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#10B981] mb-3">
            Pricing
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-[#f1f1f3]">
            Start free. Upgrade when you&apos;re ready.
          </h2>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {PLANS.map((plan) => {
            const isPro = plan.tier === "pro";
            return (
              <div
                key={plan.tier}
                className={
                  isPro
                    ? "relative rounded-xl border border-[#10B981]/40 bg-[#111113] p-6 shadow-[0_0_30px_rgba(212,175,55,0.12)]"
                    : "rounded-xl border border-[#2e2e36] bg-[#111113] p-6"
                }
              >
                {isPro && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-[#10B981] px-3 py-0.5 text-xs font-bold text-[#0a0a0b]">
                    Most Popular
                  </div>
                )}

                <div className="mb-5">
                  <h3 className="text-base font-semibold text-[#f1f1f3]">{plan.name}</h3>
                  <div className="mt-2 flex items-baseline gap-1">
                    <span className="text-3xl font-bold text-[#f1f1f3]">
                      {plan.price === 0 ? "Free" : `$${plan.price}`}
                    </span>
                    {plan.price > 0 && (
                      <span className="text-sm text-[#4a4a56]">/month</span>
                    )}
                  </div>
                </div>

                <ul className="mb-6 space-y-2.5">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-sm text-[#94a3b8]">
                      <Check size={14} className="mt-0.5 flex-shrink-0 text-[#10B981]" />
                      {f}
                    </li>
                  ))}
                </ul>

                <Link href="/auth">
                  <Button
                    variant={isPro ? "gold" : "outline"}
                    className="w-full"
                    size="md"
                  >
                    {plan.price === 0 ? "Get Started Free" : `Upgrade to ${plan.name}`}
                  </Button>
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
