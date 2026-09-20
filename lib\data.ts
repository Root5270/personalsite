import { seedProjects } from "@/lib/seed-projects";
import { createPublicClient } from "@/lib/supabase/public";
import type { Project } from "@/lib/types";

function normalizeProject(row: Record<string, unknown>): Project {
  return {
    id: String(row.id),
    slug: String(row.slug),
    title: String(row.title),
    category: String(row.category),
    role: String(row.role),
    year: String(row.year),
    summary: String(row.summary),
    sections: (row.sections || []) as Project["sections"],
    images: (row.images || []) as Project["images"],
    tags: (row.tags || []) as string[],
    status: row.status === "draft" ? "draft" : "published",
    sort_order: Number(row.sort_order || 0),
    created_at: row.created_at as string | undefined,
    updated_at: row.updated_at as string | undefined,
  };
}

export async function getPublishedProjects(): Promise<Project[]> {
  const client = createPublicClient();
  if (!client) return seedProjects;
  const { data, error } = await client
    .from("projects")
    .select("*")
    .eq("status", "published")
    .order("sort_order");
  if (error || !data?.length) return seedProjects;
  return data.map((row) => normalizeProject(row as Record<string, unknown>));
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  const client = createPublicClient();
  if (!client) return seedProjects.find((project) => project.slug === slug) || null;
  const { data, error } = await client
    .from("projects")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();
  if (error) return null;
  return data ? normalizeProject(data as Record<string, unknown>) : null;
}
