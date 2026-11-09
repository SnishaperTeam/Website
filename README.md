# SnishaperTeam

[![Vue 3](https://img.shields.io/badge/Vue-3-4FC08D?style=flat&logo=vuedotjs&logoColor=white)](https://vuejs.org/) [![TypeScript](https://img.shields.io/badge/语言-TypeScript-3178C6?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/) [![Vite](https://img.shields.io/badge/构建-Vite%208-646CFF?style=flat&logo=vite&logoColor=white)](https://vite.dev/) [![Bun](https://img.shields.io/badge/运行时-Bun-000?style=flat&logo=bun&logoColor=white)](https://bun.sh/) [![Cloudflare D1](https://img.shields.io/badge/数据库-Cloudflare%20D1-F38020?style=flat&logo=cloudflare&logoColor=white)](https://developers.cloudflare.com/d1/) [![Cloudflare Pages](https://img.shields.io/badge/部署-Cloudflare%20Pages-F38020?style=flat&logo=cloudflare&logoColor=white)](https://pages.cloudflare.com/) [![License](https://img.shields.io/badge/许可证-MIT-blue?style=flat&logo=open-source-initiative)](LICENSE) [![GitHub last commit](https://img.shields.io/github/last-commit/SnishaperTeam/Website?style=flat&logo=git&label=最后提交)](https://github.com/SnishaperTeam/Website/commits/main) [![GitHub Actions Workflow Status](https://img.shields.io/github/actions/workflow/status/SnishaperTeam/Website/weekly-deploy.yml?style=flat&logo=githubactions&label=部署流水线)](https://github.com/SnishaperTeam/Website/actions)

本仓库是 **[SnishaperTeam](https://github.com/SnishaperTeam)** 组织的官方网站与软件发布入口，站点地址为 <https://jetcpp.ccwu.cc>。

站点承载三条主线：开源项目的版本发布与下载、编程技术博客与用户创作、心理测评工具。全站采用终端窗口风格的单色设计系统，不依赖任何 UI 组件库。

本仓库是网站的唯一源码仓库：前端基于 **Vue 3 + TypeScript + Vite** 构建，后端由 **Cloudflare Pages Functions + D1** 提供（48 个服务端端点），媒体文件存储于 **Supabase Storage**，部署于 **Cloudflare Pages**。

> 组织旗下产品的源码与发布信息请参见 [SnishaperTeam](https://github.com/SnishaperTeam) 组织主页。

---

## 特性

- **软件发布与下载**：项目详情与产品落地页直接展示版本号、更新日志与分平台下载入口，版本信息运行时从 GitHub Releases 拉取，不在构建期静态嵌入。
- **边缘代理**：自建 Cloudflare Worker（`workers/release-proxy.js`）代理 GitHub Releases API，将响应裁剪为精简结构后返回前端，附带跨域与缓存策略。
- **技术博客**：内置 C++、C#、XAML 长篇教程；登录用户可在站内撰写、编辑、发布文章。写作端提供 Markdown 编辑器（工具栏、快捷键、分栏实时预览）、图片上传、主题色选色器，草稿自动保存在浏览器本地，只有发布才写入云端。
- **心理测评**：MBTI、抑郁/焦虑自评等量表工具，答题进度本地暂存，测评历史登录后云同步。
- **用户系统**：邮箱密码（PBKDF2 + JWT）与 GitHub、Google、Microsoft 三方 OAuth（PKCE + 签名状态，同邮箱已有密码账号需密码确认绑定）；个人主页管理已绑定的登录方式；账户注销时自动清理关联数据。
- **云端数据**：收藏与测评历史登录后自动云同步，未登录时使用本地存储，首次登录自动合并两份数据。
- **评论系统**：文章级评论，登录用户可发表与删除自己的评论。
- **管理后台**：`/admin` 提供统一控制台——用户封禁、文章与评论管理、公告管理、项目管理与站点统计。
- **页面内联编辑**：管理员在任意渲染完成的页面上直接修改文字（悬停高亮、点击编辑），保存后对所有访客生效，改动按结构路径存于 D1。
- **人机校验**：注册、登录与评论流程接入 Cloudflare Turnstile，服务端二次校验。
- **终端风格设计系统**：纯 CSS 自定义属性驱动，含终端窗口框架、等宽字体排版、运行时注入的噪点纹理与统一指数缓出的过渡曲线。
- **自动化运维**：三平台 CI 构建校验、周度自动部署、Supabase 实例每日两次保活、Dependabot 分组更新并在检查通过后自动合并。

---

## 快速开始

### 环境要求

| 工具 | 版本要求 | 用途 |
| --- | --- | --- |
| [Bun](https://bun.sh/) | ≥ 1.2 | 包管理、脚本执行与构建 |
| [Cloudflare](https://developers.cloudflare.com/) | 免费套餐即可 | Pages 托管、Functions、D1 数据库 |

### 克隆与安装

```bash
git clone https://github.com/SnishaperTeam/Website.git
cd Website/build/vue-app
bun install
```

### 本地开发

```bash
bun run dev
```

该命令同时启动两个进程：Vite 开发服务器（`http://localhost:5174`）与 Wrangler Pages Functions 本地实例（`http://127.0.0.1:8788`，Vite 已配置代理）。`Ctrl+C` 一起退出。

本地 Functions 依赖 `build/vue-app/.dev.vars`（已被 gitignore），主要变量：

| 变量 | 说明 |
| --- | --- |
| `JWT_SECRET` | 会话令牌签名密钥 |
| `D1_API_TOKEN` | Cloudflare API 令牌，D1 通过 REST 通道读写 |
| `TURNSTILE_SECRET` | Turnstile 服务端校验密钥 |
| `NOTICE_ADMIN_TOKEN` / `NOTICE_ADMIN_EMAIL` / `NOTICE_ADMIN_PASSWORD` | 管理后台凭据 |
| `SUPABASE_URL` / `SUPABASE_SECRET_KEY` / `SUPABASE_STORAGE_BUCKET` | 媒体上传目标 |

### 构建生产版本

```bash
bun run build
```

构建流程为：生成 RSS → Vite 构建 → 将 `dist/` 同步到仓库根目录并生成 `404.html`。可使用 `bun run preview` 本地预览。

### 可用脚本

| 命令 | 作用 |
| --- | --- |
| `bun run dev` | 同时启动前端与本地 API |
| `bun run dev:api` | 单独启动 Pages Functions 本地实例 |
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
| 语言 | TypeScript | 全量类型标注 |
| 路由 | Vue Router 5 | 23 条路由，详情页与工具页按需懒加载 |
| 构建 | Vite 8 | ESM 开发服务器，Rolldown 生产构建 |
| 图标 | Iconify | MDI 与 Simple Icons 两套集合，按需加载 |
| 渲染 | markdown-it | 博客、文档与任务列表渲染 |
| 样式 | 原生 CSS | 自定义属性驱动，叠加 Bootstrap 5.3 栅格 |
| 服务端 | Cloudflare Pages Functions | 48 个端点，覆盖鉴权、内容、评论与后台管理 |
| 数据库 | Cloudflare D1 | 通过 REST 双通道读写，启动时自动执行建表迁移 |
| 媒体存储 | Supabase Storage | 文章插图与用户头像，服务端中转上传 |
| 公告存储 | GitHub 仓库文件 | 公告以 JSON 形式提交至仓库，带版本历史 |
| 边缘计算 | Cloudflare Workers | Releases API 代理与结构裁剪 |
| 部署 | Cloudflare Pages | 全球 CDN，项目名 `jetcpppages` |
| 运行时 | Bun | 包管理、脚本执行与构建驱动 |

动画与交互逻辑封装为独立组合式函数：打字机（`useTypewriter`）、逐个淡入（`useStaggeredFade`）、噪点覆盖层（`useNoiseOverlay`）、Release 拉取（`useGithubRelease`）等。

---

## 项目结构

```
.
├── build/vue-app/                    # Vue 应用源码（构建主体）
│   ├── src/
│   │   ├── assets/                   # 设计系统与全局样式
│   │   ├── components/               # 可复用组件（编辑器、选色器、评论区等）
│   │   ├── composables/              # 组合式函数（鉴权、数据、内联编辑等）
│   │   ├── data/                     # 项目与测评数据定义
│   │   ├── router/                   # 路由配置
│   │   ├── utils/                    # 工具函数
│   │   └── views/                    # 22 个页面视图
│   ├── functions/                    # Pages Functions（48 个服务端端点）
│   ├── scripts/                      # dev、deploy、RSS 生成等脚本
│   ├── docs/                         # 项目文档（架构、设计、验收）
│   ├── public/                       # 静态资源与静态页面
│   ├── wrangler.toml                 # Pages 项目配置
│   └── vite.config.ts                # 构建配置（别名 @ → src，端口 5174）
├── functions/                        # 构建产物中的 Functions（由 deploy 脚本同步）
├── workers/
│   └── release-proxy.js              # GitHub Releases 代理 Worker
├── .github/
│   ├── dependabot.yml                # 分组依赖更新配置
│   └── workflows/                    # 四个自动化工作流
├── docs/                             # 仓库级文档（HTTPS 配置、内容规则）
├── CNAME                             # 自定义域名声明
├── _redirects                        # SPA 路由回退规则
├── wrangler.jsonc                    # Pages 构建输出目录与兼容配置
└── index.html                        # 构建产物（由 deploy.js 写入）
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
| `/blog` | BlogView | 博客列表（静态教程与用户文章合并） |
| `/blog/:slug` | BlogPostView | 文章正文与评论区 |
| `/blog/new`、`/blog/edit/:id` | PostEditorView | 文章撰写与编辑 |
| `/tests`、`/tests/:testId` | TestsView 等 | 心理测评入口与答题页 |
| `/emergency` | EmergencyView | 求助页 |
| `/auth` | AuthView | 登录、注册与第三方登录入口 |
| `/auth/oauth-bind` | BindAccountView | OAuth 与已有账号的绑定确认 |
| `/auth/oauth-callback` | OAuthCallbackView | OAuth 登录回跳 |
| `/user/:userId` | ProfileView | 用户主页（资料、绑定方式、收藏与历史） |
| `/admin` | AdminView | 管理后台 |
| `/about`、`/privacy`、`/terms` | 静态页 | 关于、隐私、条款 |
| `/:pathMatch(.*)*` | NotFoundView | 404 |

---

## 服务端 API

Functions 按模块划分于 `build/vue-app/functions/api/`，数据库通过 D1 REST 双通道访问（有 binding 时直连，否则走 Cloudflare API），建表迁移在启动时自动执行：

| 模块 | 端点前缀 | 职责 |
| --- | --- | --- |
| 鉴权 | `/api/auth/*` | 注册、登录、改密、注销、会话信息 |
| OAuth | `/api/auth/oauth/*` | GitHub / Google / Microsoft 的 PKCE 流程、绑定确认、绑定列表管理 |
| 内容 | `/api/posts/*` | 文章列表、详情、撰写、编辑、删除、点赞，支持 `?mine=1` 拉取含草稿 |
| 评论 | `/api/comments/*` | 按文章读写评论、删除自己的评论 |
| 收藏与历史 | `/api/favorites`、`/api/history` | 云同步用户收藏与测评记录 |
| 用户 | `/api/users/:id` | 公开资料查询 |
| 上传 | `/api/uploads` | 图片与头像，服务端中转至 Supabase Storage |
| 页面改写 | `/api/page-edits` | 管理员内联编辑的文本覆盖读写 |
| 管理 | `/api/admin/*` | 统计、用户封禁、文章与评论管理 |
| 公告 | `/api/notices/*` | 公告读写与管理登录（存储于 GitHub 仓库文件） |

---

## 部署

站点托管于 Cloudflare Pages，项目名 `jetcpppages`，构建输出目录由 `wrangler.jsonc` 的 `pages_build_output_dir` 指定为 `build/vue-app/dist`。

### 自动部署

仓库同时维护 GitHub 与 Gitee 两个远端，推送 GitHub `main` 分支后 Cloudflare Pages 自动构建部署。另有 `Weekly Build & Deploy` 工作流每周日 19:00（UTC）定时构建部署，支持 `workflow_dispatch` 手动触发。

### 手动部署

```bash
cd build/vue-app
bun install
bun run build
npx wrangler pages deploy dist --project-name jetcpppages
```

### 所需 Secrets

Actions Secrets（Settings → Secrets and variables → Actions）：

| Secret | 说明 |
| --- | --- |
| `CLOUDFLARE_API_TOKEN` | Cloudflare API 令牌 |
| `CLOUDFLARE_ACCOUNT_ID` | Cloudflare 账户 ID |
| `SUPABASE_URLS` | 保活任务使用的实例地址列表 |
| `SUPABASE_KEYS` | 与上一项一一对应的密钥列表 |

Pages Secrets（项目环境变量）：

| Secret | 说明 |
| --- | --- |
| `JWT_SECRET` | 会话令牌签名密钥 |
| `D1_API_TOKEN` | D1 REST 通道令牌 |
| `TURNSTILE_SECRET` | Turnstile 校验密钥 |
| `NOTICE_ADMIN_TOKEN` / `NOTICE_ADMIN_EMAIL` / `NOTICE_ADMIN_PASSWORD` | 管理后台凭据 |
| `SUPABASE_URL` / `SUPABASE_SECRET_KEY` / `SUPABASE_STORAGE_BUCKET` | 媒体上传目标 |
| `GITHUB_NOTICE_TOKEN` | 公告文件提交令牌 |

### 自定义域名

`CNAME` 文件声明 `jetcpp.ccwu.cc`。SPA 的深层路由由 `_redirects` 与自定义 404 页统一回退到 `index.html`。

---

## 持续集成

| 工作流 | 触发方式 | 职责 |
| --- | --- | --- |
| `build-and-test.yml` | `push` / `pull_request` 至 `main` | 在 Ubuntu、Windows、macOS 三平台执行构建，验证产物完整性 |
| `weekly-deploy.yml` | 每周日 19:00（UTC）、手动 | 构建并部署至 Cloudflare Pages |
| `supawake.yml` | 每日 07:40 / 20:00（UTC+8）、手动 | 定时请求 Supabase 实例，避免免费实例因空闲被暂停 |
| `dependabot-auto-merge.yml` | Dependabot PR | 等待全部检查通过后自动 squash 合并 |

Dependabot 通过 `.github/dependabot.yml` 以分组模式更新 Bun 依赖与 GitHub Actions，全部更新合并为单个 PR，开启上限 3 个。

---

## 数据库

数据层由 Cloudflare D1 承载，所有业务表在应用启动时由 `functions/_shared/schema.ts` 自动创建，无需手工迁移。

| 表 | 用途 |
| --- | --- |
| `users` | 用户账号（密码哈希为空表示 OAuth 专用账号） |
| `oauth_accounts` / `oauth_tickets` / `oauth_codes` | 三方登录绑定、待绑定票据与一次性登录码 |
| `user_posts` | 用户发布的博客文章 |
| `comments` | 文章评论 |
| `user_favorites` | 收藏记录 |
| `user_test_history` | 测评历史 |
| `projects` | 管理员维护的项目卡片 |
| `page_edits` | 页面内联编辑的文本覆盖 |

账户注销会连带清理该用户的文章、评论、收藏、历史与绑定记录。

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
- [Cloudflare](https://www.cloudflare-cn.com/) — Pages 托管、Functions、D1 数据库与 Turnstile 人机校验
- [Supabase](https://supabase.com/) — 对象存储
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
