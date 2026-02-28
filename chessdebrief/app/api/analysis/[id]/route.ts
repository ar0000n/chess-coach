import { NextRequest, NextResponse } from "next/server";
import { USE_REAL_API, config } from "@/config";
import { MOCK_ANALYSIS_REPORT } from "@/mock/analysis";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  const { id } = await params;

  if (!USE_REAL_API) {
    await new Promise((r) => setTimeout(r, config.mock.latencyMs));
    // Always return the mock report regardless of id
    return NextResponse.json({ data: { ...MOCK_ANALYSIS_REPORT, id }, error: null });
  }

  // Real: SELECT from analysis_reports WHERE id = id AND user_id = session.user.id
  return NextResponse.json(
    { data: null, error: { message: "Real API not implemented yet" } },
    { status: 501 }
  );
}
