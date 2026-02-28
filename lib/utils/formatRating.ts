import type { RatingEntry } from "@/types/game";

export function formatRating(entry: RatingEntry | undefined): string {
  if (!entry || entry.rating === null) return "—";
  return entry.rating.toString();
}

export function formatProg(prog: number | undefined): {
  symbol: string;
  direction: "up" | "down" | "flat";
} {
  if (prog === undefined || prog === 0) return { symbol: "—", direction: "flat" };
  if (prog > 0) return { symbol: `+${prog}`, direction: "up" };
  return { symbol: `${prog}`, direction: "down" };
}
