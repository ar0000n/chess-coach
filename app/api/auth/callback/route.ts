import { NextRequest, NextResponse } from "next/server";
import { USE_REAL_API } from "@/config";

export async function GET(req: NextRequest): Promise<NextResponse> {
  if (!USE_REAL_API) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  // Real: exchange code for session via Supabase
  const { searchParams, origin } = new URL(req.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/dashboard";

  if (code) {
    const { createClient } = await import("@/lib/supabase/server");
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(`${origin}/auth?error=callback_failed`);
}
