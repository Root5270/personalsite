# Alina Li 作品集 2.0

基于 Next.js 16、React 19、Vercel 与 Supabase 的全栈个人作品集。旧版原生 Node 网站仍保留在相邻的 `alina-portfolio` 目录，便于回退与对照。

GitHub 仓库暂时保留旧版 `dist` 静态文件，确保迁移到 Vercel 期间原 GitHub Pages 链接仍可访问。Vercel 上线并验证稳定后，可以再移除 `dist`。

## 已完成

- 响应式视觉入口页与作品集主页
- 数据驱动的动态作品详情 `/work/[slug]`
- `GET /api/projects` 与 `GET /api/projects/[slug]`
- 联系表单与 `POST /api/contact`
- Supabase Auth 管理员登录
- 作品新增、编辑、排序、草稿/发布、删除
- 留言查看、状态更新与删除
- 未配置 Supabase 时使用内置项目数据展示前台
- Supabase 数据表、RLS 策略和初始作品数据

## 本地运行

要求 Node.js 22 或以上版本。

```bash
pnpm install
pnpm dev
```

访问：

- 视觉首页：`http://localhost:3000`
- 作品集：`http://localhost:3000/portfolio`
- 管理后台：`http://localhost:3000/admin/login`

## 连接 Supabase

1. 在 Supabase 创建项目。
2. 打开 SQL Editor，依次执行：
   - `supabase/migrations/001_initial_schema.sql`
   - `supabase/seed.sql`
3. 在 Authentication 中创建管理员用户，邮箱必须与 `ADMIN_EMAIL` 一致。
4. 复制 `.env.example` 为 `.env.local` 并填写：

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_xxx
SUPABASE_SERVICE_ROLE_KEY=your-server-only-key
ADMIN_EMAIL=your-admin@example.com
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

`SUPABASE_SERVICE_ROLE_KEY` 只能放在 Vercel 环境变量或本机 `.env.local`，不能提交到 GitHub，也不能使用 `NEXT_PUBLIC_` 前缀。

## 部署到 Vercel

1. 将本目录内容推送到 GitHub 仓库根目录。
2. 在 Vercel 导入该仓库，Framework Preset 选择 Next.js。
3. 在 Project Settings → Environment Variables 添加 `.env.example` 中的五个变量。
4. 将 `NEXT_PUBLIC_SITE_URL` 改为 Vercel 分配的 HTTPS 域名。
5. 重新部署。

Vercel 会自动运行 `next build`，不需要额外的 `vercel.json`。

## 内容格式

后台的“内容章节”每行格式为：

```text
章节标题｜章节正文
```

图片每行格式为：

```text
/assets/example.jpg｜图片说明
```

当前图片位于 `public/assets`。后续如果需要直接在后台上传图片，可以再接入 Supabase Storage。

## 安全说明

- 前台只能读取 `published` 项目。
- 留言表不向浏览器直接开放读写权限，提交由服务端 Route Handler 校验后写入。
- 后台每个写操作都会重新验证 Supabase 用户和 `ADMIN_EMAIL`。
- Service Role 密钥仅在服务器端使用。
