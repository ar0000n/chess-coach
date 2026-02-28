import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { USE_REAL_API } from "@/config";

export async function proxy(req: NextRequest) {
  if (!USE_REAL_API) {
    // Mock mode: allow all routes through
    return NextResponse.next();
  }

  // Real mode: validate Supabase session for protected routes
  const { createServerClient } = await import("@supabase/ssr");
  const { config } = await import("@/config");

  let supabaseResponse = NextResponse.next({ request: req });

  const supabase = createServerClient(
    config.supabase.url,
    config.supabase.anonKey,
    {
      cookies: {
        getAll() {
          return req.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            req.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request: req });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { session },
  } = await supabase.auth.getSession();

  const isProtected =
    req.nextUrl.pathname.startsWith("/dashboard") ||
    req.nextUrl.pathname.startsWith("/report");

  if (isProtected && !session) {
    return NextResponse.redirect(new URL("/auth", req.url));
  }

  return supabaseResponse;
}

export const config = {
  matcher: ["/dashboard/:path*", "/report/:path*"],
};
