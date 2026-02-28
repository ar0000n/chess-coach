"use client";
import { cn } from "@/lib/utils/cn";
import { type ButtonHTMLAttributes, forwardRef } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "gold" | "outline" | "ghost" | "destructive";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "gold", size = "md", loading, children, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          "inline-flex items-center justify-center gap-2 font-semibold rounded-lg transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#10B981] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0a0b] disabled:opacity-50 disabled:cursor-not-allowed",
          {
            gold: "bg-[#0d9e6e] text-[#f1f1f3] hover:bg-[#0f8f63] active:bg-[#0a7a53]",
            outline:
              "border border-[#2e2e36] text-[#f1f1f3] hover:border-[#10B981] hover:text-[#10B981] bg-transparent",
            ghost: "text-[#94a3b8] hover:text-[#f1f1f3] hover:bg-[#1a1a1f] bg-transparent",
            destructive: "bg-[#ef4444] text-white hover:bg-[#dc2626]",
          }[variant],
          {
            sm: "px-3 py-1.5 text-sm",
            md: "px-5 py-2.5 text-sm",
            lg: "px-7 py-3.5 text-base",
          }[size],
          className
        )}
        {...props}
      >
        {loading ? (
          <>
            <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
            {children}
          </>
        ) : (
          children
        )}
      </button>
    );
  }
);

Button.displayName = "Button";
export { Button };
