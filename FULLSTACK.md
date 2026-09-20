# 完整网站运行与 GitHub 上传说明

## 启动

安装 Node.js 22 或以上版本（本机验证为 Node 24），在项目根目录运行：

```sh
npm start
```

打开 http://127.0.0.1:4174 。无需安装第三方依赖。`npm run dev` 可监听后端修改，前端修改后刷新页面。必须启动 Node 服务；双击 HTML 或原来的 4173 静态服务不能运行后端接口。

Windows 也可以双击 `start-local.cmd`。如果终端找不到 npm，可以直接运行 `node --env-file-if-exists=.env server/index.mjs`；查看留言用 `node --env-file-if-exists=.env server/inbox.mjs`；测试用 `node --test tests/server.test.mjs`。

## 功能

- 两级页面、响应式导航、移动菜单、锚点、返回顶部、邮件和电话链接。
- 四张作品卡片点击或键盘激活可打开详情；从后端读取设计过程与完整图片。
- 原生详情弹窗支持 Escape、焦点约束、关闭后焦点返回与失败重试。
- 联系表单有校验、提交中、成功、失败与超时状态，后端确认保存后才清空。
- 留言按独立 JSON 文件保存，重启后仍在；无公开留言读取接口。
- 服务端校验、来源检查、蜜罐反垃圾、请求体上限和基础限流。
- 自动测试、GitHub Actions、Dockerfile、环境示例与 Git 忽略规则。

## 文件结构

```text
dist/                  前端 HTML、CSS、JS 与作品素材
  reference-theme.css  参考图风格的配色和排版
  interactions.js      菜单、详情弹窗、联系表单
server/
  index.mjs            启动入口
  app.mjs              HTTP、API、静态文件与校验
  projects.mjs         项目内容数据，修改此文件即可更新详情
  inbox.mjs            私有留言查看命令
tests/                 集成测试
.github/workflows/     GitHub 自动测试
.env.example           环境配置示例
Dockerfile             容器运行
data/                  收到留言后自动创建，不提交 Git
```

## 查看留言

```sh
npm run inbox
```

仅在拥有服务器访问权限的终端显示留言。当前不会自动发送邮件通知；网站中的“发送邮件”是独立 mailto 入口。留言文件含称呼、邮箱、内容、时间、编号，位于 `DATA_DIR`。请在服务器侧定期查看、备份和清理。

存储适合单实例的小型个人网站。部署需要持久化磁盘，否则临时容器重新部署可能丢失数据。多实例共享收件箱需要迁移到数据库。限流为连接 IP 每十分钟五次，服务重启后重置；代理后的访客可能合并计算，生产部署宜在可信代理处配置访客限流。

## 配置

复制 `.env.example` 为 `.env`，按需编辑：

| 变量 | 默认 | 作用 |
| --- | --- | --- |
| HOST | 127.0.0.1 | 本机监听；部署时可设 0.0.0.0 |
| PORT | 4174 | HTTP 端口 |
| PUBLIC_ORIGIN | 留空 | 上线后填实际 HTTPS 域名，不带末尾斜线 |
| DATA_DIR | ./data | 私有持久化目录，相对路径以项目根目录为基准 |

`.env`、留言与运行日志已从 Git 中排除。

## 上传 GitHub

解压 ZIP，把项目内容放在仓库根目录，让 `package.json` 位于根目录。使用 GitHub 的 Upload files 上传解压后的内容，不要只上传 ZIP；需包含 `.github`、`.gitignore`、`.env.example` 等点开头文件。

也可以在项目文件夹中执行：

```sh
git init
git add .
git commit -m "Add full-stack portfolio"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPOSITORY.git
git push -u origin main
```

将地址换成自己的空仓库；已有仓库不重复初始化或覆盖远程。

上传仓库不等于后端已上线。GitHub Pages 不运行 Node 后端。完整网站需部署在可运行 Node 且具有持久化磁盘的主机上，启动命令 `npm start`，不需要安装依赖或构建。公开访问应配置 HTTPS 反向代理和 `PUBLIC_ORIGIN`。

## Docker（可选）

```sh
docker build -t alina-portfolio .
docker run -d --name alina-portfolio -p 4174:4174 -v alina-messages:/app/data alina-portfolio
```

此命令使用持久化命名卷。公开部署时加入 `-e PUBLIC_ORIGIN=https://你的域名` 并配置 HTTPS。不要上传真实留言、环境密钥或服务器备份。

## API 与测试

| API | 功能 |
| --- | --- |
| GET /api/health | 健康检查 |
| GET /api/projects | 全部项目 |
| GET /api/projects/:id | 项目详情：luma、meet、drift、space |
| POST /api/contact | JSON：name、email、message、consent: true、website: "" |

联系接口状态码：201 保存成功、400 格式有误、422 校验失败、403 来源不符、413 内容过大、415 类型不符、429 限流、500 保存失败。

运行 `npm test`。测试使用临时目录，不污染真实收件箱，覆盖项目与图片、私有文件隔离、验证与来源、持久化、大小上限及限流。Docker 镜像未在本机验证构建。

## 内容维护

项目卡片摘要编辑 `dist/portfolio.html`，详情编辑 `server/projects.mjs`；图片位于 `dist/assets`。项目事实基于原作品集与简历，验证计划不表述为已实现成绩。项目没有假演示链接或虚构业绩。作品和个人资料归原权利人所有，未附加开源许可证。当前未发布网站，也未创建 GitHub 仓库。
