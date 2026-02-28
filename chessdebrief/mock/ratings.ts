import type { RatingsMap } from "@/types/game";

export const MOCK_RATINGS: RatingsMap = {
  bullet: { rating: 1342, games: 203, prog: -18 },
  blitz: { rating: 1487, games: 891, prog: 12 },
  rapid: { rating: 1601, games: 234, prog: 5 },
  classical: { rating: null, games: 0, prog: 0 },
};

// Rapid rating history over the last 90 days (for trend chart)
export const MOCK_RAPID_TREND: { date: string; rating: number }[] = [
  { date: "2025-12-01", rating: 1488 },
  { date: "2025-12-10", rating: 1511 },
  { date: "2025-12-18", rating: 1497 },
  { date: "2025-12-26", rating: 1523 },
  { date: "2026-01-04", rating: 1508 },
  { date: "2026-01-12", rating: 1534 },
  { date: "2026-01-20", rating: 1519 },
  { date: "2026-01-28", rating: 1547 },
  { date: "2026-02-05", rating: 1562 },
  { date: "2026-02-12", rating: 1578 },
  { date: "2026-02-18", rating: 1590 },
  { date: "2026-02-24", rating: 1596 },
  { date: "2026-02-28", rating: 1601 },
];
