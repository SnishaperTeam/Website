# JetCPP

[![Vue 3](https://img.shields.io/badge/Vue-3-4FC08D?style=flat&logo=vuedotjs&logoColor=white)](https://vuejs.org/) [![TypeScript](https://img.shields.io/badge/语言-TypeScript-3178C6?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/) [![Vite](https://img.shields.io/badge/构建-Vite%208-646CFF?style=flat&logo=vite&logoColor=white)](https://vite.dev/) [![Bun](https://img.shields.io/badge/运行时-Bun-000?style=flat&logo=bun&logoColor=white)](https://bun.sh/) [![Supabase](https://img.shields.io/badge/后端-Supabase-3FCF8E?style=flat&logo=supabase&logoColor=white)](https://supabase.com/) [![Cloudflare Pages](https://img.shields.io/badge/部署-Cloudflare%20Pages-F38020?style=flat&logo=cloudflare&logoColor=white)](https://pages.cloudflare.com/) [![License](https://img.shields.io/badge/许可证-MIT-blue?style=flat&logo=open-source-initiative)](LICENSE) [![GitHub last commit](https://img.shields.io/github/last-commit/SnishaperTeam/Website?style=flat&logo=git&label=最后提交)](https://github.com/SnishaperTeam/Website/commits/main) [![GitHub Actions Workflow Status](https://img.shields.io/github/actions/workflow/status/SnishaperTeam/Website/weekly-deploy.yml?style=flat&logo=githubactions&label=部署流水线)](https://github.com/SnishaperTeam/Website/actions)

**JetCPP** 是 **SnishaperTeam** 组织的官方网站与软件发布入口，站点地址为 <https://jetcpp.ccwu.cc>。

站点承载三条主线：开源项目的版本发布与下载、编程技术博客、用户内容系统。全站采用终端窗口风格的单色设计系统，不依赖任何 UI 组件库。

本仓库是网站的唯一源码仓库，前端基于 **Vue 3 + TypeScript + Vite** 构建，后端能力由 **Supabase** 提供，部署于 **Cloudflare Pages**。

> 组织旗下产品的源码与发布信息请参见 [SnishaperTeam](https://github.com/SnishaperTeam) 组织主页。

---

## 特性

- **软件发布与下载**：项目详情与产品落地页直接展示版本号、更新日志与分平台下载入口，版本信息运行时从 GitHub Releases 拉取，不在构建期静态嵌入。
- **边缘代理**：自建 Cloudflare Worker（`workers/release-proxy.js`）代理 GitHub Releases API，将响应裁剪为精简结构后再返回前端，附带跨域与缓存策略。
- **技术博客**：内置 C++、C#、XAML 三篇长篇教程；登录用户可在站内撰写、编辑、发布文章，列表按分类与标签聚合。
- **用户内容系统**：基于 Supabase Auth，支持邮箱密码与 Google、GitHub、Microsoft 三方 OAuth；提供独立用户主页、收藏与内容管理。
- **行级安全**：所有业务表启用 RLS 策略，用户只能读写自身数据；账户注销由 Edge Function 完成数据清理并校验调用方身份。
- **人机校验**：注册、登录与评论流程接入 Cloudflare Turnstile，服务端由 Edge Function 二次校验。
- **终端风格设计系统**：纯 CSS 自定义属性驱动，含终端窗口框架、等宽字体排版、运行时注入的噪点纹理与统一指数缓出的过渡曲线。
- **自动构建与部署**：三平台 CI 构建校验，周度自动部署至 Cloudflare Pages，Supabase 实例定时保活。

---

## 快速开始

### 环境要求

| 工具 | 版本要求 | 用途 |
| --- | --- | --- |
| [Bun](https://bun.sh/) | ≥ 1.2 | 包管理、脚本执行与构建 |
| [Supabase](https://supabase.com/) | 免费实例即可 | 数据库、鉴权、对象存储 |

### 克隆与安装

```bash
git clone https://github.com/SnishaperTeam/Website.git
cd Website/build/vue-app
bun install
```

### 环境变量

将 `build/vue-app/.env.example` 复制为 `.env.local` 并填写：

```env
# Supabase 项目配置（必填）
VITE_SUPABASE_URL=https://<project-ref>.supabase.co
VITE_SUPABASE_ANON_KEY=<anon-key>

# 管理员邮箱（用于后台权限判定）
VITE_ADMIN_EMAIL=admin@example.com

# Cloudflare Turnstile（可选）
VITE_TURNSTILE_SITEKEY=<turnstile-sitekey>

# 站点地址（用于 OAuth 回调重定向）
VITE_SITE_URL=https://jetcpp.ccwu.cc
```

`VITE_SUPABASE_URL` 与 `VITE_SUPABASE_ANON_KEY` 为必填项，取值见 Supabase 控制台的 API 设置页。`.env.local` 已被 `.gitignore` 忽略，不会进入版本库。

### 启动开发服务器

```bash
bun run dev
```

开发服务器默认监听 `http://localhost:5174`，支持热更新。

### 构建生产版本

```bash
bun run build
```

构建流程为：生成 RSS → Vite 构建 → 将 `dist/` 同步到仓库根目录。可使用 `bun run preview` 本地预览。

### 可用脚本

| 命令 | 作用 |
| --- | --- |
| `bun run dev` | 启动开发服务器 |
| `bun run build` | 生成 RSS → Vite 构建 → 同步产物到仓库根 |
| `bun run preview` | 本地预览构建结果 |
| `bun run generate-rss` | 单独生成 `feed.xml` |
| `bun run add-project` | 交互式新增项目页 |
| `bun run add-blog` | 交互式新增博客文章 |

---

## 技术栈

| 层次 | 技术 | 说明 |
| --- | --- | --- |
| 框架 | Vue 3 | Composition API + `<script setup>` |
| 语言 | TypeScript | 全量类型标注，含接口与工具函数 |
| 路由 | Vue Router 4 | 20 余条路由，详情页与工具页按需懒加载 |
| 构建 | Vite 8 | ESM 开发服务器，Rolldown 生产构建 |
| 图标 | Iconify | MDI 与 Simple Icons 两套集合，按需加载 |
| 渲染 | markdown-it | 博客与文档内容渲染 |
| 样式 | 原生 CSS | 自定义属性驱动，叠加 Bootstrap 5.3 栅格 |
| 后端 | Supabase | Auth、PostgreSQL、Storage、Edge Functions |
| 边缘计算 | Cloudflare Workers | Releases API 代理与结构裁剪 |
| 部署 | Cloudflare Pages | 全球 CDN，项目名 `jetcpppages` |
| 运行时 | Bun | 包管理、脚本执行与构建驱动 |

动画与交互逻辑封装为独立组合式函数：打字机（`useTypewriter`）、视差倾斜（`useParallaxTilt`）、逐个淡入（`useStaggeredFade`）、噪点覆盖层（`useNoiseOverlay`）、Release 拉取（`useGithubRelease`）。

---

## 项目结构

```
.
├── build/vue-app/                # Vue 应用源码（构建主体）
│   ├── src/
│   │   ├── assets/               # 设计系统与全局样式
│   │   ├── components/           # 可复用组件
│   │   ├── composables/          # 组合式函数
│   │   ├── data/                 # 项目数据定义
│   │   ├── router/               # 路由配置
│   │   ├── supabase/             # Supabase 客户端单例
│   │   └── views/                # 页面视图
│   ├── scripts/
│   │   ├── deploy.js             # 将 dist 同步到仓库根目录
│   │   └── generate-rss.js       # 生成 feed.xml
│   ├── public/                   # 静态资源与静态页面
│   ├── supabase/                 # 数据库迁移与 Edge Functions
│   ├── docs/                     # 项目文档（架构、设计、验收）
│   ├── wrangler.toml             # Pages 项目配置
│   └── vite.config.ts            # 构建配置（别名 @ → src，端口 5174）
├── functions/
│   └── turnstile.ts              # Turnstile 服务端校验
├── workers/
│   └── release-proxy.js          # GitHub Releases 代理 Worker
├── .github/workflows/            # 三个自动化工作流
├── CNAME                         # 自定义域名声明
├── _redirects                    # SPA 路由回退规则
├── wrangler.jsonc                # Pages 构建输出目录与兼容配置
├── index.html                    # 构建产物（由 deploy.js 写入）
├── assets/ blog/ project/ fonts/ # 构建产物（由 deploy.js 写入）
└── *.sql                         # 数据库初始化脚本
```

源码集中在 `build/vue-app/`，仓库根目录存放构建产物。执行 `bun run build` 时，`scripts/deploy.js` 会把 `dist/` 的内容同步到仓库根，因此根目录的 `index.html`、`assets/` 等文件均为生成物，不应手工编辑。

---

## 路由表

| 路径 | 页面 | 说明 |
| --- | --- | --- |
| `/` | HomeView | 首页，含实时 GitHub 数据面板 |
| `/projects` | ProjectsView | 项目列表与分类筛选 |
| `/project/:slug` | ProjectDetailView | 通用项目详情 |
| `/snishaper` | SniShaperView | SniShaper 产品落地页 |
| `/lumine` | LumineView | Lumine 产品落地页 |
| `/blog` | BlogView | 博客列表与标签筛选 |
| `/blog/:slug` | BlogPostView | 文章正文 |
| `/blog/new`、`/blog/edit/:id` | PostEditorView | 文章撰写与编辑 |
| `/auth`、`/auth/callback`、`/reset-password` | 鉴权页 | 登录、OAuth 回调、密码重置 |
| `/user/:userId` | ProfileView | 用户主页 |
| `/admin` | AdminView | 管理后台 |
| `/about`、`/privacy`、`/terms` | 静态页 | 关于、隐私、条款 |
| `/:pathMatch(.*)*` | NotFoundView | 404 |

---

## 部署

站点托管于 Cloudflare Pages，项目名 `jetcpppages`，构建输出目录由 `wrangler.jsonc` 的 `pages_build_output_dir` 指定为 `build/vue-app/dist`。

### 自动部署

`Weekly Build & Deploy` 工作流每周日 19:00（UTC）自动执行，流程为：安装依赖 → 注入环境变量 → `bun run build` → 校验产物 → 部署。

```bash
npx wrangler@latest pages deploy build/vue-app/dist \
  --project-name=jetcpppages \
  --branch=main
```

该工作流亦支持通过 `workflow_dispatch` 手动触发。

### 手动部署

```bash
cd build/vue-app
bun install
bun run build
npx wrangler pages deploy dist --project-name jetcpppages
```

### 所需 Secrets

在仓库的 Settings → Secrets and variables → Actions 中配置：

| Secret | 说明 |
| --- | --- |
| `VITE_SUPABASE_URL` | Supabase 项目地址 |
| `VITE_SUPABASE_ANON_KEY` | Supabase 匿名密钥 |
| `VITE_ADMIN_EMAIL` | 管理员邮箱 |
| `CLOUDFLARE_API_TOKEN` | Cloudflare API 令牌 |
| `CLOUDFLARE_ACCOUNT_ID` | Cloudflare 账户 ID |
| `SUPABASE_URLS` | 保活任务使用的实例地址列表 |
| `SUPABASE_KEYS` | 与上一项一一对应的密钥列表 |

### 自定义域名

`CNAME` 文件声明 `jetcpp.ccwu.cc` 与 `www.jetcpp.ccwu.cc`。SPA 的深层路由由 `_redirects` 统一回退到 `index.html`。

---

## 持续集成

| 工作流 | 触发方式 | 职责 |
| --- | --- | --- |
| `build-and-test.yml` | `push` / `pull_request` 至 `main` | 在 Ubuntu、Windows、macOS 三平台执行构建，验证产物完整性并上传归档 |
| `weekly-deploy.yml` | 每周日 19:00（UTC）、手动 | 构建并部署至 Cloudflare Pages |
| `supawake.yml` | 每日 23:30（UTC）、手动 | 定时请求 Supabase 实例，避免免费实例因空闲被暂停 |

---

## 数据库

数据层由 Supabase PostgreSQL 承载，所有业务表启用 RLS（行级安全），用户只能读写自身数据。

| 表 | 用途 |
| --- | --- |
| `profiles` | 用户资料（昵称、头像、简介） |
| `user_posts` | 用户发布的博客文章 |
| `user_favorites` | 收藏记录 |
| `comments` | 文章评论 |
| `tags` | 标签聚合 |
| `login_attempts` | 登录尝试记录（安全审计） |
| `user_login_logs` | 登录日志（安全审计） |
| `health` | 保活探针 |

Storage 使用 `avatars` 桶存放用户头像。Edge Function `delete-user` 负责账户注销时的数据清理，并在函数内校验调用方身份。

数据库变更以迁移文件形式维护于 `build/vue-app/supabase/migrations/`，仓库根目录的初始化脚本用于全新环境的建表与授权。

---

## 设计系统

全站设计变量集中定义在 `build/vue-app/src/assets/base.css`，不使用任何 UI 组件库。

```css
--color-bg: #0a0a0a;                  /* 主背景 */
--color-bg-soft: #111;                /* 次级背景 */
--color-text: #e0e0e0;                /* 主文字 */
--color-text-secondary: #888;         /* 次要文字 */
--color-border: rgba(255,255,255,.1); /* 描边 */
--radius-sm: 2px;                     /* 小圆角 */
--radius-md: 4px;                     /* 中圆角 */
--ease-out-expo: cubic-bezier(.16,1,.3,1);  /* 统一缓动 */
```

视觉语言由三部分构成：终端窗口框架（`.term-window` / `.term-bar` / `.term-body`）、等宽字体排版与 `$` 命令提示符、覆盖全站的噪点纹理（由 `useNoiseOverlay` 在运行时注入）。过渡曲线统一使用指数缓出，页面切换采用位移加淡入。

---

## 致谢

本站点的基础设施与工具支持来自以下项目与平台：

- [DNSHE](https://my.dnshe.com/go.php?code=pPuY9hh0Iw) — 域名服务
- [Cloudflare](https://www.cloudflare-cn.com/) — Pages 托管、Workers 边缘计算与 Turnstile 人机校验
- [Supabase](https://supabase.com/) — 数据库、鉴权与对象存储
- [Vue](https://vuejs.org/) / [Vite](https://vite.dev/) — 前端框架与构建工具
- [Bun](https://bun.sh/) — 包管理器与运行时
- [Iconify](https://iconify.design/) — 图标集合

---

## 项目活跃度与贡献者

### 活跃度徽章

[![GitHub contributors](https://img.shields.io/github/contributors/SnishaperTeam/Website?style=flat&label=总贡献者)](https://github.com/SnishaperTeam/Website/graphs/contributors)
[![GitHub commit activity](https://img.shields.io/github/commit-activity/m/SnishaperTeam/Website?style=flat&label=月均提交)](https://github.com/SnishaperTeam/Website/graphs/contributors)
[![GitHub last commit](https://img.shields.io/github/last-commit/SnishaperTeam/Website?style=flat&label=最近提交)](https://github.com/SnishaperTeam/Website/commits/main)

### 贡献者图谱

<div align="center">
<a href="https://github.com/SnishaperTeam/Website/graphs/contributors" target="_blank">
<img src="https://contrib.rocks/image?repo=SnishaperTeam/Website" alt="Contributors" />
</a>
</div>

---

## 许可

[MIT License](LICENSE)。

**维护者**：[SnishaperTeam](https://github.com/SnishaperTeam)
