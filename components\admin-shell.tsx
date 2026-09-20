import Link from "next/link";
import { signOut } from "@/app/admin/actions";

export function AdminShell({ children, email }: { children: React.ReactNode; email?: string }) {
  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <Link className="site-logo" href="/portfolio">Alina Li<span>®</span></Link>
        <nav>
          <Link href="/admin">概览</Link>
          <Link href="/admin/projects">作品管理</Link>
          <Link href="/admin/messages">留言管理</Link>
          <Link href="/portfolio" target="_blank">查看网站 ↗</Link>
        </nav>
        <div className="admin-account"><span>{email}</span><form action={signOut}><button type="submit">退出登录</button></form></div>
      </aside>
      <div className="admin-main">{children}</div>
    </div>
  );
}
