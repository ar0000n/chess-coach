import { NextRequest, NextResponse } from "next/server";
import { USE_REAL_API } from "@/config";

export async function POST(_req: NextRequest): Promise<NextResponse> {
  if (!USE_REAL_API) {
    return NextResponse.json({ received: true });
  }

  // Real: verify Stripe signature, handle checkout.session.completed etc.
  return NextResponse.json({ received: true });
}
