"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const projectSchema = z.object({
  title: z.string().trim().min(1).max(120),
  slug: z.string().trim().regex(/^[a-z0-9-]+$/),
  category: z.string().trim().max(80),
  role: z.string().trim().max(120),
  year: z.string().trim().max(30),
  summary: z.string().trim().min(1).max(500),
  tags: z.string(),
  sections: z.string(),
  images: z.string(),
  status: z.enum(["draft", "published"]),
  sort_order: z.coerce.number().int().min(0).max(10000),
});

function parseProject(formData: FormData) {
  const raw = Object.fromEntries(formData);
  const parsed = projectSchema.parse(raw);
  const sections = parsed.sections.split(/\r?\n/).map((line) => line.trim()).filter(Boolean).map((line) => {
    const [title, ...body] = line.split("｜");
    return { title: title.trim(), body: body.join("｜").trim() };
  }).filter((section) => section.title && section.body);
  const images = parsed.images.split(/\r?\n/).map((line) => line.trim()).filter(Boolean).map((line) => {
    const [src, ...alt] = line.split("｜");
    return { src: src.trim(), alt: alt.join("｜").trim() || parsed.title };
  });
  return {
    ...parsed,
    tags: parsed.tags.split(/[，,]/).map((tag) => tag.trim()).filter(Boolean),
    sections,
    images,
  };
}

function adminDb() {
  const client = createAdminClient();
  if (!client) throw new Error("Supabase 管理连接尚未配置。");
  return client;
}

export async function createProject(formData: FormData) {
  await requireAdmin();
  const payload = parseProject(formData);
  const { error } = await adminDb().from("projects").insert(payload);
  if (error) throw new Error(error.message);
  revalidatePath("/portfolio");
  revalidatePath("/admin/projects");
  redirect("/admin/projects");
}

export async function updateProject(id: string, formData: FormData) {
  await requireAdmin();
  const payload = parseProject(formData);
  const { error } = await adminDb().from("projects").update(payload).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/portfolio");
  revalidatePath(`/work/${payload.slug}`);
  revalidatePath("/admin/projects");
  redirect("/admin/projects");
}

export async function deleteProject(id: string) {
  await requireAdmin();
  const { error } = await adminDb().from("projects").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/portfolio");
  revalidatePath("/admin/projects");
}

export async function updateMessageStatus(id: string, formData: FormData) {
  await requireAdmin();
  const status = z.enum(["unread", "processing", "done", "spam"]).parse(formData.get("status"));
  const { error } = await adminDb().from("messages").update({ status }).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/messages");
}

export async function deleteMessage(id: string) {
  await requireAdmin();
  const { error } = await adminDb().from("messages").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/messages");
}

export async function signOut() {
  const client = await createSupabaseServerClient();
  await client?.auth.signOut();
  redirect("/admin/login");
}
