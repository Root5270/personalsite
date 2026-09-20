import { notFound } from "next/navigation";
import { updateProject } from "@/app/admin/actions";
import { ProjectForm } from "@/components/project-form";
import { createAdminClient } from "@/lib/supabase/admin";
import type { Project } from "@/lib/types";

export default async function EditProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const id = (await params).id;
  const { data } = await createAdminClient()!.from("projects").select("*").eq("id", id).maybeSingle();
  if (!data) notFound();
  return <main className="admin-content"><div className="admin-heading"><div><p className="eyebrow">EDIT PROJECT</p><h1>编辑作品</h1></div></div><ProjectForm project={data as Project} action={updateProject.bind(null, id)} /></main>;
}
