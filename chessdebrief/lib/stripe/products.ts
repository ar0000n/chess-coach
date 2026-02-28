import { config } from "@/config";

export const PLANS = [
  {
    tier: "free" as const,
    name: "Free",
    price: 0,
    reportsPerMonth: 1,
    priceId: null,
    features: [
      "1 debrief per month",
      "15-game import limit",
      "Full report view",
      "Lichess & Chess.com",
    ],
  },
  {
    tier: "pro" as const,
    name: "Pro",
    price: 9,
    reportsPerMonth: 5,
    priceId: config.stripe.priceIdPro,
    features: [
      "5 debriefs per month",
      "50-game import limit",
      "Full report view",
      "Email delivery",
      "Lichess & Chess.com",
    ],
  },
  {
    tier: "elite" as const,
    name: "Elite",
    price: 24,
    reportsPerMonth: -1,
    priceId: config.stripe.priceIdElite,
    features: [
      "Unlimited debriefs",
      "50-game import limit",
      "Priority processing",
      "Trend tracking",
      "Email delivery",
    ],
  },
] as const;
