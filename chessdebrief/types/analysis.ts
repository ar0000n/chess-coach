import type { Platform, RatingsMap, TimeControl } from "./game";

export interface GameCitation {
  game_number: number;
  url: string;
  game_id?: string;
}

export interface Weakness {
  rank: number;
  title: string;
  description: string;
  game_citations: GameCitation[];
  actionable_tip: string;
}

export interface PuzzleDay {
  day: "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday";
  theme_name: string;
  theme_slug: string;
  theme_url: string;
  coaching_note: string;
}

export interface TrainingPlan {
  primary_focus: string;
  daily_puzzles: PuzzleDay[];
  concept_topic: string;
  concept_youtube_search: string;
  opening_adjustment: string;
  weekly_goal: string;
}

export type AnalysisStatus = "pending" | "processing" | "complete" | "failed";

export interface AnalysisReport {
  id: string;
  user_id: string;
  platform: Platform;
  username: string;
  time_control?: TimeControl;
  ratings: RatingsMap;
  games_analyzed: number;
  weaknesses: Weakness[];
  training_plan: TrainingPlan;
  status: AnalysisStatus;
  created_at: string;
  updated_at: string;
}
