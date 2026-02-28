import { NextRequest, NextResponse } from "next/server";
import { USE_REAL_API } from "@/config";

export async function POST(req: NextRequest): Promise<NextResponse> {
  const { tier } = await req.json();

  if (!USE_REAL_API) {
    return NextResponse.json({
      data: { url: `/dashboard?mock_upgrade=${tier}` },
      error: null,
    });
  }

  // Real: create Stripe Checkout session, return session.url
  return NextResponse.json(
    { data: null, error: { message: "Real API not implemented yet" } },
    { status: 501 }
  );
}
