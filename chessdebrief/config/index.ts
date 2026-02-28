// ─────────────────────────────────────────────────────────────────────────────
// Global feature flags.
// Set USE_REAL_API = false to run entirely on hardcoded mock data —
// no external network calls, no API keys needed.
// ─────────────────────────────────────────────────────────────────────────────

export const USE_REAL_API = false as const;

export const config = {
  anthropic: {
    apiKey: process.env.ANTHROPIC_API_KEY ?? "",
    model: "claude-haiku-4-5-20251001",
    maxTokens: 2048,
  },
  supabase: {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "",
    serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY ?? "",
  },
  stripe: {
    publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? "",
    secretKey: process.env.STRIPE_SECRET_KEY ?? "",
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET ?? "",
    priceIdPro: process.env.STRIPE_PRICE_ID_PRO ?? "price_mock_pro",
    priceIdElite: process.env.STRIPE_PRICE_ID_ELITE ?? "price_mock_elite",
  },
  mock: {
    // Simulated network delay so loading states are visible in the UI
    latencyMs: 900,
    userId: "mock-user-00000000-0000-0000-0000-000000000001",
    userEmail: "player@chessdebrief.dev",
    userName: "ChessPlayer42",
  },
} as const;
