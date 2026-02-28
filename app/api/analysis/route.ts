import { NextRequest, NextResponse } from "next/server";
import { USE_REAL_API, config } from "@/config";
import { MOCK_REPORT_ID } from "@/mock/analysis";

export async function POST(_req: NextRequest): Promise<NextResponse> {
  if (!USE_REAL_API) {
    // Simulate processing time — longer than import to feel authentic
    await new Promise((r) => setTimeout(r, config.mock.latencyMs * 2));
    return NextResponse.json({
      data: { report_id: MOCK_REPORT_ID },
      error: null,
    });
  }

  // Real: create pending report row in Supabase, enqueue background job
  return NextResponse.json(
    { data: null, error: { message: "Real API not implemented yet" } },
    { status: 501 }
  );
}
