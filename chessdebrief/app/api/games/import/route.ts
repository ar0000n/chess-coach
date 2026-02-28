import { NextRequest, NextResponse } from "next/server";
import { USE_REAL_API, config } from "@/config";
import { MOCK_GAMES } from "@/mock/games";
import { MOCK_RATINGS } from "@/mock/ratings";
import type { ImportResult } from "@/types/game";

export async function POST(_req: NextRequest): Promise<NextResponse> {
  if (!USE_REAL_API) {
    await new Promise((r) => setTimeout(r, config.mock.latencyMs));
    const result: ImportResult = {
      imported_count: MOCK_GAMES.length,
      games: MOCK_GAMES,
      ratings: MOCK_RATINGS,
    };
    return NextResponse.json({ data: result, error: null });
  }

  // Real implementation: fetch from Lichess/Chess.com, upsert into Supabase
  return NextResponse.json(
    { data: null, error: { message: "Real API not implemented yet" } },
    { status: 501 }
  );
}
