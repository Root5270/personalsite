import Link from "next/link";
import { hasSupabaseAdminEnv } from "@/lib/env";
import { signIn } from "./actions";

export default async function AdminLoginPage({ searchParams }: { searchParams: Promise<{ error?: string; setup?: string }> }) {
  const query = await searchParams;
  const configured = hasSupabaseAdminEnv();
  return (
    <main className="login-page">
      <Link className="site-logo" href="/portfolio">Alina Li<span>®</span></Link>
      <section className="login-card">
        <p className="eyebrow">PRIVATE STUDIO</p>
        <h1>作品管理后台</h1>
        <p>仅限管理员登录。登录后可维护作品内容和处理访客留言。</p>
        {!configured ? (
          <div className="setup-notice">
            <strong>需要先连接 Supabase</strong>
            <p>复制 <code>.env.example</code> 为 <code>.env.local</code>，填入项目地址、公开密钥、服务端密钥和管理员邮箱。</p>
          </div>
        ) : (
          <form action={signIn} className="admin-form">
            <label>管理员邮箱<input name="email" type="email" required autoComplete="email" /></label>
            <label>密码<input name="password" type="password" required autoComplete="current-password" /></label>
            {query.error && <p className="form-error" role="alert">{query.error}</p>}
            <button className="primary-button" type="submit">登录后台 ↗</button>
          </form>
        )}
        <Link className="text-link" href="/portfolio">返回作品集 ←</Link>
      </section>
    </main>
  );
}
