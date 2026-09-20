import Link from "next/link";
import { createAdminClient } from "@/lib/supabase/admin";

export default async function AdminDashboardPage() {
  const db = createAdminClient()!;
  const [{ count: projectCount }, { count: unreadCount }] = await Promise.all([
    db.from("projects").select("*", { count: "exact", head: true }),
    db.from("messages").select("*", { count: "exact", head: true }).eq("status", "unread"),
  ]);
  return (
    <main className="admin-content">
      <div className="admin-heading"><div><p className="eyebrow">STUDIO OVERVIEW</p><h1>管理概览</h1></div><Link className="primary-button" href="/admin/projects/new">新增作品 ＋</Link></div>
      <div className="admin-stats">
        <article><span>作品总数</span><strong>{projectCount ?? 0}</strong><Link href="/admin/projects">管理作品 →</Link></article>
        <article><span>未读留言</span><strong>{unreadCount ?? 0}</strong><Link href="/admin/messages">查看留言 →</Link></article>
      </div>
      <section className="admin-guide"><h2>内容维护提示</h2><p>公开页面只展示“已发布”作品。编辑完成后可以先保存为草稿，确认图片与文字后再发布。</p></section>
    </main>
  );
}
