import { createProject } from "@/app/admin/actions";
import { ProjectForm } from "@/components/project-form";

export default function NewProjectPage() {
  return <main className="admin-content"><div className="admin-heading"><div><p className="eyebrow">NEW PROJECT</p><h1>新增作品</h1></div></div><ProjectForm action={createProject} /></main>;
}
