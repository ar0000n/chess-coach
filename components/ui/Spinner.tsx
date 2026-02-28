import { cn } from "@/lib/utils/cn";

interface SpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function Spinner({ size = "md", className }: SpinnerProps) {
  return (
    <span
      className={cn(
        "inline-block rounded-full border-2 border-[#2e2e36] border-t-[#10B981] animate-spin",
        {
          sm: "w-4 h-4",
          md: "w-6 h-6",
          lg: "w-8 h-8",
        }[size],
        className
      )}
    />
  );
}
