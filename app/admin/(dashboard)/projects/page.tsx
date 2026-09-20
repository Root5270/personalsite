import Link from "next/link";
import { deleteProject } from "@/app/admin/actions";
import { createAdminClient } from "@/lib/supabase/admin";
import type { Project } from "@/lib/types";

export default async function AdminProjectsPage() {
  const { data } = await createAdminClient()!.from("projects").select("*").order("sort_order");
  const projects = (data || []) as Project[];
  return (
    <main className="admin-content">
      <div className="admin-heading"><div><p className="eyebrow">CONTENT</p><h1>作品管理</h1></div><Link className="primary-button" href="/admin/projects/new">新增作品 ＋</Link></div>
      {projects.length ? (
        <div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>作品</th><th>类型</th><th>状态</th><th>排序</th><th>操作</th></tr></thead><tbody>
          {projects.map((project) => <tr key={project.id}><td><strong>{project.title}</strong><span>/{project.slug}</span></td><td>{project.category}</td><td><span className={`status-chip ${project.status}`}>{project.status === "published" ? "已发布" : "草稿"}</span></td><td>{project.sort_order}</td><td><div className="table-actions"><Link href={`/admin/projects/${project.id}/edit`}>编辑</Link><form action={deleteProject.bind(null, project.id)}><button type="submit">删除</button></form></div></td></tr>)}
        </tbody></table></div>
      ) : <div className="empty-state"><h2>还没有数据库作品</h2><p>运行 Supabase 迁移和 seed.sql，或从这里创建第一项作品。</p><Link className="primary-button" href="/admin/projects/new">新增作品</Link></div>}
    </main>
  );
}
