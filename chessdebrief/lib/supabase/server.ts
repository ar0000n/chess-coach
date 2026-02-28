import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { config } from "@/config";

export async function createClient() {
  const cookieStore = await cookies();
  return createServerClient(config.supabase.url, config.supabase.anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {
          // Called from Server Component — cookies will be set by middleware
        }
      },
    },
  });
}
