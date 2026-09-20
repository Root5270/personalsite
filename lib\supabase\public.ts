import { createClient } from "@supabase/supabase-js";
import { hasSupabasePublicEnv } from "@/lib/env";

export function createPublicClient() {
  if (!hasSupabasePublicEnv()) return null;
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    { auth: { persistSession: false } },
  );
}
