"use server";

import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function signIn(formData: FormData) {
  const email = String(formData.get("email") || "").trim();
  const password = String(formData.get("password") || "");
  const client = await createSupabaseServerClient();
  if (!client) redirect("/admin/login?setup=required");
  const { error } = await client.auth.signInWithPassword({ email, password });
  if (error) redirect(`/admin/login?error=${encodeURIComponent("邮箱或密码不正确")}`);
  redirect("/admin");
}
