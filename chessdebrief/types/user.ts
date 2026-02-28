import type { Platform } from "./game";

export type SubscriptionTier = "free" | "pro" | "elite";
export type SubscriptionStatus = "active" | "canceled" | "past_due" | "trialing";

export interface UserProfile {
  id: string;
  email: string;
  display_name?: string;
  lichess_username?: string;
  chess_com_username?: string;
  preferred_platform?: Platform;
  created_at: string;
}

export interface Subscription {
  id: string;
  user_id: string;
  stripe_customer_id: string;
  stripe_subscription_id: string;
  tier: SubscriptionTier;
  status: SubscriptionStatus;
  current_period_end: string;
  reports_used_this_month: number;
  reports_limit: number;
}
