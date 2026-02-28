export type Platform = "lichess" | "chess.com";
export type TimeControl = "bullet" | "blitz" | "rapid" | "classical" | "daily";
export type GameResult = "Win" | "Loss" | "Draw";
export type PieceColor = "White" | "Black";

export interface GameRecord {
  id: string;
  user_id: string;
  platform: Platform;
  platform_game_id: string;
  url: string;
  color: PieceColor;
  result: GameResult;
  opening: string;
  time_control: string;
  time_control_category: TimeControl;
  move_count: number;
  moves: string;
  opponent: string;
  played_at: string;
  created_at: string;
}

export interface RatingEntry {
  rating: number | null;
  games: number;
  prog: number;
}

export type RatingsMap = Partial<Record<TimeControl, RatingEntry>>;

export interface ImportRequest {
  username: string;
  platform: Platform;
  time_control?: TimeControl;
  max_games: number;
}

export interface ImportResult {
  imported_count: number;
  games: GameRecord[];
  ratings: RatingsMap;
}
