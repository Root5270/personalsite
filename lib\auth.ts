import "server-only";
import { redirect } from "next/navigation";
import { hasSupabaseAdminEnv } from "@/lib/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function getAdminUser() {
  if (!hasSupabaseAdminEnv()) return null;
  const client = await createSupabaseServerClient();
  if (!client) return null;
  const { data } = await client.auth.getUser();
  const email = data.user?.email?.toLowerCase();
  const adminEmail = process.env.ADMIN_EMAIL?.toLowerCase();
  return email && adminEmail && email === adminEmail ? data.user : null;
}

export async function requireAdmin() {
  if (!hasSupabaseAdminEnv()) redirect("/admin/login?setup=required");
  const user = await getAdminUser();
  if (!user) redirect("/admin/login");
  return user;
}
