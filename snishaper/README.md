# SniShaper

> A Windows-native network proxy tool using SNI-based traffic shaping to bypass SNI-based censorship.

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](./LICENSE)
[![Node](https://img.shields.io/badge/node-%3E%3D18-green.svg)](https://nodejs.org/)
[![npm](https://img.shields.io/badge/npm-%3E%3D9-red.svg)](https://www.npmjs.com/)
[![Platform](https://img.shields.io/badge/platform-Windows%2010%2F11-lightgrey.svg)](https://www.microsoft.com/windows)

**[中文文档](#中文)** | **[English](#english)**

---

## 中文

### 项目简介

本仓库是 **SniShaper** 的官方落地页源码。SniShaper 是一款运行于 Windows 平台的网络代理工具，通过 SNI 分流与流量整形技术，帮助用户绕过基于 SNI 的封锁，实现更自由、更稳定的网络访问。

落地页采用 **Vanilla TypeScript + Vite + Tailwind CSS** 构建，设计风格为深灰底 × 暖橙强调色，追求极简、克制、带物理阻尼感的交互体验。

### 核心功能

- 响应式布局，完整适配移动端
- 功能特性卡片自动来回滚动（rAF + 弹簧阻尼）
- 鼠标悬停暂停滚动
- Intersection Observer 驱动的入场动画
- 移动端抽屉菜单
- 一键直链下载
- 多语言支持（中文 / English）

### SniShaper 应用特性

> 以下是 SniShaper 桌面应用的核心功能，落地页对这些特性进行了展示和说明。

| 功能 | 说明 |
|------|------|
| TLS-RF | TLS 分片技术，将 Client Hello 拆分为多个记录分片传输 |
| ECH 注入 | 加密 Client Hello，连 TLS 握手的第一步都无法被窥探 |
| QUIC 重建 | 基于 UDP 的 QUIC 协议规避 TCP 特征检测 |
| 智能分流 | 内置 GFWList 规则集，数万个被封锁域名开箱即通 |
| CF 优选 IP | 自动从 Cloudflare 全球节点池中挑选延迟最低的节点 |
| TUN 模式 | 虚拟网卡实现全局流量代理，所有应用无需配置即可使用 |
| DNS 上游 | 支持配置 DNS 上游服务器，智能解析 DNS 请求 |
| JSON 规则 | 支持域名、IP CIDR、策略组，编辑 JSON 即时生效 |

### 设计规范

落地页遵循统一的设计语言系统：

| 类别 | 规范 |
|------|------|
| 主色调 | `#f97316` 暖橙（强调色） |
| 背景色 | `#0a0a0a` 深黑 / `#1f1f1f` 深灰 |
| 文字色 | `#e5e5e5` 正文 / `#737373` 辅助文字 |
| 字体 | Inter（无衬线）/ JetBrains Mono（等宽） |
| 动画 | float 浮动 / pulse-slow 慢脉冲 |
| 暗色模式 | 基于 `prefers-color-scheme` 媒体查询 |

### 动画与交互

| 效果 | 实现方式 |
|------|----------|
| 卡片自动滚动 | `requestAnimationFrame` + 弹簧阻尼算法 |
| 悬停暂停 | `mouseenter` / `mouseleave` 事件监听 |
| 入场动画 | `IntersectionObserver` 驱动 |
| 浮动效果 | Tailwind `animate-float` 自定义关键帧 |
| 慢脉冲呼吸 | Tailwind `animate-pulse-slow` 4s 周期 |

### TypeScript 配置

项目使用严格的 TypeScript 配置：

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "moduleResolution": "node",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true
  }
}
```

### 浏览器兼容性

| 浏览器 | 最低版本 |
|--------|----------|
| Chrome | 90+ |
| Firefox | 88+ |
| Safari | 14+ |
| Edge | 90+ |

> 需要支持 `IntersectionObserver`、`requestAnimationFrame`、ES2020 等现代 Web API。

### 部署方案

| 平台 | 说明 |
|------|------|
| Vercel | 推荐，零配置部署，支持自动 HTTPS |
| Netlify | 拖拽 `index.html` + `assets/` 即可部署 |
| GitHub Pages | 推送至 `gh-pages` 分支 |
| Cloudflare Pages | 连接仓库自动构建 |
| 自建服务器 | Nginx/Apache 静态文件托管 |

#### Nginx 配置示例

```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /path/to/SniShaperWeb;
    index index.html;

    # 静态资源缓存
    location /assets/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # SPA 路由回退
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

### 常见问题排查

| 问题 | 解决方案 |
|------|----------|
| `npm run dev` 启动失败 | 检查 Node.js 版本是否 ≥ 18 |
| 构建后页面空白 | 确认 `index.html` 和 `assets/` 在同一目录 |
| 样式不生效 | 检查 Tailwind `content` 配置是否包含源文件路径 |
| HMR 不工作 | 确认端口 5173 未被占用，防火墙已放行 |
| TypeScript 报错 | 运行 `npm run ts-check` 查看详细错误 |

### 贡献指南

欢迎提交 Issue 和 Pull Request！

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'Add amazing feature'`)
4. 推送至分支 (`git push origin feature/amazing-feature`)
5. 提交 Pull Request

#### 提交规范

- `feat:` 新功能
- `fix:` 修复问题
- `docs:` 文档更新
- `style:` 代码格式调整
- `refactor:` 代码重构
- `perf:` 性能优化

### 依赖说明

| 依赖 | 用途 | 类型 |
|------|------|------|
| `vite` | 构建工具与开发服务器 | devDependencies |
| `typescript` | TypeScript 编译器 | devDependencies |
| `tailwindcss` | 原子化 CSS 框架 | devDependencies |
| `postcss` | CSS 后处理器 | devDependencies |
| `autoprefixer` | 浏览器前缀自动补全 | devDependencies |
| `esbuild` | 快速打包器 | devDependencies |
| `eslint` | 代码规范检查 | devDependencies |
| `@supabase/supabase-js` | Supabase 客户端 | dependencies |
| `express` | Node.js Web 框架 | dependencies |
| `dotenv` | 环境变量加载 | dependencies |

### 性能优化

| 优化项 | 实现方式 |
|--------|----------|
| 代码分割 | Vite 自动按路由分割 chunk |
| 资源压缩 | esbuild 自动 minify JS/CSS |
| 图片优化 | 使用 WebP 格式，按需加载 |
| 缓存策略 | 文件名 hash，长期缓存静态资源 |
| 懒加载 | Intersection Observer 延迟渲染 |
| 字体优化 | 使用 `font-display: swap` 避免阻塞 |

### 架构设计

落地页采用模块化架构，各职责清晰分离：

```
┌─────────────────────────────────────────┐
│           浏览器环境 (Browser)           │
├─────────────────────────────────────────┤
│  ┌─────────────┐  ┌──────────────────┐  │
│  │  index.ts   │→ │    main.ts       │  │
│  │  (入口)     │  │  (HTML + i18n)   │  │
│  └─────────────┘  └──────────────────┘  │
│         ↓                    ↓           │
│  ┌─────────────┐  ┌──────────────────┐  │
│  │ index.css   │  │   style.css      │  │
│  │ (重置样式)  │  │ (Tailwind + 自定义)│  │
│  └─────────────┘  └──────────────────┘  │
└─────────────────────────────────────────┘
         ↓                    ↓
┌─────────────────────────────────────────┐
│          构建工具链 (Build)              │
├─────────────────────────────────────────┤
│  Vite 6 → esbuild → Tailwind → PostCSS │
└─────────────────────────────────────────┘
         ↓
┌─────────────────────────────────────────┐
│          输出产物 (Output)               │
├─────────────────────────────────────────┤
│  index.html + assets/*.css + assets/*.js│
└─────────────────────────────────────────┘
```

### Tailwind CSS 配置详解

项目使用自定义 Tailwind 主题，扩展了颜色、字体和动画：

```js
// tailwind.config.js
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'media',  // 基于系统偏好自动切换
  theme: {
    extend: {
      colors: {
        'snip-orange': '#f97316',        // 主强调色
        'snip-orange-light': '#fb923c',  // 浅橙色
        'snip-dark': '#0a0a0a',          // 深黑背景
        'snip-gray': '#1f1f1f',          // 深灰卡片
        'snip-gray-light': '#2a2a2a',    // 浅灰边框
        'snip-text': '#e5e5e5',          // 正文颜色
        'snip-muted': '#737373',         // 辅助文字
      },
      fontFamily: {
        'mono': ['JetBrains Mono', 'SF Mono', 'Monaco', 'Consolas', 'monospace'],
        'sans': ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
    },
  },
  plugins: [],
};
```

#### 自定义颜色使用示例

```html
<!-- 使用自定义颜色类 -->
<div class="bg-snip-dark text-snip-text">
  <h1 class="text-snip-orange">SniShaper</h1>
  <p class="text-snip-muted">副标题文字</p>
</div>
```

### i18n 国际化实现

项目采用轻量级 i18n 方案，通过 TypeScript 对象管理翻译：

```typescript
// 翻译数据结构
type Translations = Record<string, string>;

const zh: Translations = {
  nav_features: '功能特性',
  nav_tech: '核心技术',
  hero_badge: 'v1.27 Windows 原生应用',
  // ... 更多翻译
};

const en: Translations = {
  nav_features: 'Features',
  nav_tech: 'Core Tech',
  hero_badge: 'v1.27 Windows Native App',
  // ... 更多翻译
};
```

#### 切换语言

用户可通过页面右上角的语言切换按钮在中文/英文之间切换。当前语言状态存储在内存中，刷新后恢复默认语言。

### 响应式断点

| 断点 | 宽度 | 设备类型 |
|------|------|----------|
| `sm` | 640px | 大屏手机 |
| `md` | 768px | 平板竖屏 |
| `lg` | 1024px | 平板横屏 / 小笔记本 |
| `xl` | 1280px | 桌面显示器 |
| `2xl` | 1536px | 大屏显示器 |

### 安全最佳实践

| 实践 | 说明 |
|------|------|
| CSP 策略 | 建议部署时添加 Content-Security-Policy 头 |
| HTTPS | 生产环境强制使用 HTTPS |
| 子资源完整性 | 使用 SRI hash 验证第三方资源 |
| 无内联脚本 | 所有 JS 通过外部文件加载 |
| 依赖审计 | 定期运行 `npm audit` 检查漏洞 |

### SEO 优化

| 优化项 | 实现方式 |
|--------|----------|
| 语义化 HTML | 使用 `<header>`、`<main>`、`<section>`、`<footer>` 等语义标签 |
| Meta 标签 | 包含 description、keywords、og:image 等 |
| 结构化数据 | 支持 JSON-LD 格式 Schema.org 标记 |
| 性能优化 | Lighthouse 评分 90+ |
| 移动端适配 | 完整的 viewport meta 配置 |

### CI/CD 集成

#### GitHub Actions 示例

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          
      - name: Install dependencies
        run: cd build && npm ci
        
      - name: Build
        run: cd build && npm run build
        
      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: .
```

### 版本历史

| 版本 | 日期 | 主要变更 |
|------|------|----------|
| v1.0 | 2024-Q4 | 初始版本，基础落地页 |
| v1.1 | 2025-Q1 | 添加 FAQ 区块、优化移动端 |
| v1.2 | 2025-Q2 | 多语言支持、动画优化 |
| v1.3 | 2025-Q3 | 更新日志区块、下载模态框 |
| v1.4 | 2025-Q4 | 性能优化、Lighthouse 90+ |
| v1.5 | 2026-Q1 | 设计系统规范化、暗色模式 |

### 测试策略

| 测试类型 | 工具 | 说明 |
|----------|------|------|
| 类型检查 | `tsc --noEmit` | 验证 TypeScript 类型安全 |
| 代码规范 | ESLint | 检查代码风格与潜在问题 |
| 构建测试 | `vite build` | 确保生产构建成功 |
| 手动测试 | 浏览器 | 验证各浏览器兼容性 |
| 性能测试 | Lighthouse | 检查性能、可访问性、SEO |

#### 运行 Lighthouse

```bash
# 安装 Lighthouse CLI
npm install -g lighthouse

# 启动开发服务器
npm run dev

# 运行 Lighthouse 审计
lighthouse http://localhost:5173 --view
```

### 开发调试技巧

#### 浏览器 DevTools 调试

| 技巧 | 说明 |
|------|------|
| Source Maps | Vite 自动生成，可在 Sources 面板直接调试 TS 源码 |
| 断点调试 | 在 `main.ts` 关键逻辑处设置断点 |
| 网络面板 | 检查资源加载顺序和缓存策略 |
| 性能面板 | 分析动画帧率和渲染性能 |
| 元素检查 | 查看 Tailwind 生成的 CSS 类 |

#### 常用调试代码

```typescript
// 在 main.ts 中添加调试日志
console.log('[SniShaper] Language:', currentLang);
console.log('[SniShaper] Scroll position:', window.scrollY);
console.log('[SniShaper] Intersection entries:', observerEntries);
```

### 性能基准

| 指标 | 目标值 | 当前表现 |
|------|--------|----------|
| 首次内容绘制 (FCP) | < 1.5s | ~0.8s |
| 最大内容绘制 (LCP) | < 2.5s | ~1.2s |
| 首次输入延迟 (FID) | < 100ms | ~50ms |
| 累积布局偏移 (CLS) | < 0.1 | ~0.02 |
| 交互就绪 (TTI) | < 3.5s | ~1.5s |
| 总阻塞时间 (TBT) | < 200ms | ~80ms |

### 构建产物分析

#### 产物大小

| 文件 | 大小 (gzip) | 说明 |
|------|-------------|------|
| `index.html` | ~5KB | HTML 入口 |
| `assets/index-*.js` | ~15KB | 主 JS bundle |
| `assets/index-*.css` | ~8KB | 主 CSS bundle |
| **总计** | **~28KB** | 首次加载体积 |

#### 分析 Bundle 大小

```bash
# 安装 bundle 分析器
npm install -D rollup-plugin-visualizer

# 在 vite.config.ts 中添加
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig({
  plugins: [visualizer({ open: true })],
});
```

### 无障碍访问 (a11y)

| 标准 | 实现 |
|------|------|
| WCAG 2.1 AA | 对比度 ≥ 4.5:1 |
| 键盘导航 | 所有交互元素可通过 Tab 访问 |
| 屏幕阅读器 | 使用 ARIA 属性标注语义 |
| 焦点管理 | 可见的 `:focus-visible` 样式 |
| 颜色盲友好 | 不单独依赖颜色传递信息 |

#### 无障碍检查清单

- [ ] 所有图片有 `alt` 属性
- [ ] 表单元素有 `<label>` 关联
- [ ] 颜色对比度通过 WCAG AA 标准
- [ ] 键盘可访问所有交互元素
- [ ] 页面结构使用正确的标题层级 (h1 → h2 → h3)
- [ ] 链接文字有明确含义（避免"点击这里"）

### 扩展开发指南

#### 添加新的页面区块

```typescript
// 1. 在 main.ts 中添加翻译
const zh: Translations = {
  new_section_title: '新区块标题',
  new_section_desc: '新区块描述',
};

// 2. 创建区块 HTML 函数
function renderNewSection(): string {
  return `
    <section id="new-section" class="py-20 px-4">
      <h2 class="text-3xl font-bold text-snip-orange">${t('new_section_title')}</h2>
      <p class="text-snip-muted">${t('new_section_desc')}</p>
    </section>
  `;
}

// 3. 在页面中插入
const mainContent = `
  ${renderHero()}
  ${renderAdvantages()}
  ${renderNewSection()}
  ${renderFooter()}
`;
```

#### 添加新的动画效果

```css
/* 在 style.css 中添加 */
@keyframes slide-in {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.animate-slide-in {
  animation: slide-in 0.5s ease-out;
}
```

#### 添加新的语言支持

```typescript
// 在 main.ts 中添加新语言
const ja: Translations = {
  nav_features: '機能',
  nav_tech: 'コア技術',
  hero_badge: 'v1.27 Windows ネイティブ',
  // ... 更多日文翻译
};

// 在语言切换逻辑中添加
const translations: Record<string, Translations> = { zh, en, ja };
```

### 常见问题 (FAQ)

#### 开发相关

**Q: 为什么选择 Vanilla TypeScript 而不是 React/Vue？**

A: 落地页不需要复杂的状态管理，Vanilla TS 更轻量，构建产物更小，加载更快。对于单页展示型网站，这是最优选择。

**Q: 如何修改页面内容？**

A: 所有文本内容在 `main.ts` 的翻译对象中定义，HTML 结构也在 `main.ts` 中通过模板字符串生成。

**Q: 可以添加新的 CSS 框架吗？**

A: 可以，但建议优先使用 Tailwind 的原子类。如需额外样式，在 `style.css` 中添加。

#### 部署相关

**Q: 如何自定义域名？**

A: 在 Vercel/Netlify 等平台的项目设置中添加自定义域名，并按提示配置 DNS 解析。

**Q: 如何启用 HTTPS？**

A: Vercel、Netlify、Cloudflare Pages 默认自动启用 HTTPS。自建服务器需配置 SSL 证书。

**Q: 构建产物可以放在子目录吗？**

A: 可以，修改 `vite.config.ts` 中的 `base` 选项：
```ts
export default defineConfig({
  base: '/my-subdir/',
});
```

#### 性能相关

**Q: 如何进一步优化加载速度？**

A: 
1. 启用 Brotli 压缩（比 gzip 小 15-20%）
2. 使用 CDN 分发静态资源
3. 启用 HTTP/2 或 HTTP/3
4. 预加载关键资源 `<link rel="preload">`

**Q: 为什么构建产物有 hash 文件名？**

A: Vite 默认在文件名中添加内容 hash，用于长期缓存。当文件内容变化时，hash 会更新，浏览器会重新下载。

### Vite 配置详解

项目的 `vite.config.ts` 包含以下关键配置：

```typescript
import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    port: 5173,           // 开发服务器端口
    host: '0.0.0.0',      // 允许外部访问
    allowedHosts: true,   // 允许所有主机名
    hmr: {
      overlay: true,      // 显示错误覆盖层
      path: '/hot/vite-hmr',  // HMR WebSocket 路径
      port: 6000,         // HMR 端口
      clientPort: 443,    // 客户端连接端口（通过代理）
      timeout: 30000,     // 超时时间
    },
    watch: {
      usePolling: true,   // 使用轮询模式（适用于 Docker/WSL）
      interval: 100,      // 轮询间隔（毫秒）
    }
  },
});
```

#### HMR 配置说明

| 配置项 | 作用 | 默认值 |
|--------|------|--------|
| `overlay` | 构建错误时显示全屏覆盖层 | `true` |
| `path` | HMR WebSocket 连接路径 | `/@vite/client` |
| `port` | HMR 服务器端口 | 与 server.port 相同 |
| `clientPort` | 客户端尝试连接的端口 | 与 port 相同 |
| `timeout` | HMR 连接超时时间 | 30000ms |

### postbuild 脚本详解

`scripts/copy-dist.mjs` 脚本在构建后自动执行：

```javascript
/**
 * postbuild: 将 dist/ 产物复制到网站根目录 (../)
 * 复制规则：
 *   dist/index.html  → ../index.html
 *   dist/assets/*    → ../assets/*（先清空再写入）
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distDir   = path.resolve(__dirname, '../dist');
const rootDir   = path.resolve(__dirname, '../../');

// 复制单个文件
function copyFile(src, dest) {
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.copyFileSync(src, dest);
  const rel = path.relative(rootDir, dest).replace(/\\/g, '/');
  console.log(`  ✔  ${rel}`);
}

// 清空目录
function cleanDir(dir) {
  if (fs.existsSync(dir)) {
    fs.rmSync(dir, { recursive: true, force: true });
  }
  fs.mkdirSync(dir, { recursive: true });
}

// 递归复制目录
function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const srcPath  = path.join(src,  entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      copyFile(srcPath, destPath);
    }
  }
}

// 主流程
console.log('\n📦 postbuild: copying dist → website root…\n');

if (!fs.existsSync(distDir)) {
  console.error('❌  dist/ not found. Did vite build succeed?');
  process.exit(1);
}

// 1. 复制 index.html
copyFile(
  path.join(distDir, 'index.html'),
  path.join(rootDir, 'index.html'),
);

// 2. 清空并复制 assets/
const destAssets = path.join(rootDir, 'assets');
console.log(`  🗑  clearing ${path.relative(rootDir, destAssets).replace(/\\/g, '/')}/`);
cleanDir(destAssets);
copyDir(path.join(distDir, 'assets'), destAssets);

console.log('\n✅  done.\n');
```

### 构建流程详解

```
npm run build
    ↓
┌─────────────────────────────────┐
│ 1. Vite 读取 vite.config.ts     │
│ 2. 加载 TypeScript 源码          │
│ 3. esbuild 编译 TS → JS         │
│ 4. Tailwind 处理 CSS             │
│ 5. PostCSS 添加浏览器前缀        │
│ 6. 压缩 JS/CSS                   │
│ 7. 添加内容 hash 到文件名        │
│ 8. 输出到 dist/ 目录             │
└─────────────────────────────────┘
    ↓
npm run postbuild
    ↓
┌─────────────────────────────────┐
│ 1. 复制 dist/index.html → ../   │
│ 2. 清空 ../assets/               │
│ 3. 复制 dist/assets/* → ../     │
│ 4. 完成                          │
└─────────────────────────────────┘
```

### 依赖树分析

#### 开发依赖 (devDependencies)

| 包名 | 版本 | 用途 |
|------|------|------|
| `vite` | ^6.0.0 | 构建工具与开发服务器 |
| `typescript` | ^5.6.0 | TypeScript 编译器 |
| `tailwindcss` | ^3.4.17 | 原子化 CSS 框架 |
| `postcss` | ^8.4.49 | CSS 后处理器 |
| `autoprefixer` | ^10.4.20 | 浏览器前缀自动补全 |
| `esbuild` | ^0.24.2 | 快速打包器（Vite 内置） |
| `eslint` | ^9 | 代码规范检查 |
| `typescript-eslint` | ^8 | TS ESLint 插件 |
| `tsup` | ^8.3.5 | TypeScript 打包工具 |
| `tsx` | ^4.19.2 | TypeScript 执行器 |
| `@types/node` | ^22.10.5 | Node.js 类型定义 |
| `@types/express` | ^5.0.0 | Express 类型定义 |

#### 生产依赖 (dependencies)

| 包名 | 版本 | 用途 |
|------|------|------|
| `@supabase/supabase-js` | 2.95.3 | Supabase 客户端 SDK |
| `express` | ^4.21.2 | Node.js Web 框架 |
| `dotenv` | ^17.2.3 | 环境变量加载器 |

### npm scripts 详解

| 脚本 | 命令 | 说明 |
|------|------|------|
| `dev` | `vite` | 启动开发服务器，支持 HMR |
| `build` | `vite build` | 生产构建，输出到 dist/ |
| `postbuild` | `node scripts/copy-dist.mjs` | 自动复制产物到根目录 |
| `preview` | `vite preview` | 本地预览生产构建 |
| `lint` | `eslint` | 代码规范检查 |
| `ts-check` | `tsc -p tsconfig.json` | TypeScript 类型检查 |

### 项目启动流程

```
用户访问页面
    ↓
┌─────────────────────────────────┐
│ 1. 浏览器加载 index.html         │
│ 2. 解析 <head> 中的 CSS 链接     │
│ 3. 加载 assets/index-*.css       │
│ 4. 应用基础样式                  │
│ 5. 解析 <body> 中的 JS 链接      │
│ 6. 加载 assets/index-*.js        │
│ 7. 执行 index.ts                 │
│ 8. DOMContentLoaded 触发         │
│ 9. initApp() 初始化页面          │
│ 10. 渲染 HTML 内容               │
│ 11. 绑定事件监听器               │
│ 12. 启动 IntersectionObserver    │
│ 13. 页面完全就绪                 │
└─────────────────────────────────┘
```

### 项目统计

| 指标 | 数值 |
|------|------|
| 总代码行数 | ~1000+ 行 TypeScript |
| CSS 行数 | ~200+ 行自定义样式 |
| 翻译词条 | 100+ 条（中英文） |
| 页面区块 | 11 个主要区块 |
| 构建产物大小 | ~28KB (gzip) |
| 依赖包数量 | 13 个 devDependencies + 3 个 dependencies |
| 浏览器支持 | Chrome 90+, Firefox 88+, Safari 14+, Edge 90+ |

### 与其他方案对比

| 特性 | SniShaperWeb | React/Vite | Next.js | Astro |
|------|-------------|------------|---------|-------|
| 框架依赖 | 无 | React | React | 无 |
| 构建产物 | ~28KB | ~50-100KB | ~100-200KB | ~20-50KB |
| 首屏加载 | 极快 | 快 | 中等 | 极快 |
| 学习曲线 | 低 | 中 | 高 | 低 |
| SSR 支持 | 否 | 需配置 | 内置 | 内置 |
| 适合场景 | 落地页 | 复杂应用 | 全栈应用 | 内容站点 |

### 高级部署指南

#### Docker 部署

```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY build/package*.json ./
RUN npm ci
COPY build/ ./
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

#### Docker Compose

```yaml
version: '3.8'
services:
  web:
    build: .
    ports:
      - "80:80"
    restart: unless-stopped
```

#### Nginx 高级配置

```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /path/to/SniShaperWeb;
    index index.html;

    # 强制 HTTPS
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl http2;
    server_name your-domain.com;
    root /path/to/SniShaperWeb;
    index index.html;

    # SSL 配置
    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;

    # 安全头
    add_header X-Frame-Options DENY;
    add_header X-Content-Type-Options nosniff;
    add_header X-XSS-Protection "1; mode=block";
    add_header Referrer-Policy strict-origin-when-cross-origin;
    add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:;";

    # 静态资源缓存
    location /assets/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Gzip 压缩
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml;
    gzip_min_length 1000;

    # Brotli 压缩（需安装模块）
    # brotli on;
    # brotli_types text/plain text/css application/json application/javascript text/xml application/xml;

    # SPA 路由回退
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

### 监控与分析

#### 性能监控

| 工具 | 用途 | 集成方式 |
|------|------|----------|
| Google Analytics | 用户行为分析 | 添加 tracking code |
| Plausible | 隐私友好的分析 | 添加 script 标签 |
| Sentry | 错误追踪 | 集成 @sentry/browser |
| LogRocket | 会话录制 | 集成 logrocket SDK |

#### 添加 Google Analytics

```html
<!-- 在 index.html 的 <head> 中添加 -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

### 浏览器扩展支持

| 扩展 | 用途 | 推荐 |
|------|------|------|
| React DevTools | 调试 React 组件 | 不适用（本项目无 React） |
| Vue DevTools | 调试 Vue 组件 | 不适用（本项目无 Vue） |
| TypeScript Debugger | 调试 TypeScript | 推荐 |
| CSS Peeper | 检查 CSS 样式 | 推荐 |
| Lighthouse | 性能审计 | 推荐 |
| Web Vitals | 核心指标监控 | 推荐 |

### 代码片段库

#### 滚动到顶部

```typescript
function scrollToTop(): void {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}
```

#### 防抖函数

```typescript
function debounce<T extends (...args: any[]) => any>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timer: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}
```

#### 节流函数

```typescript
function throttle<T extends (...args: any[]) => any>(
  fn: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      fn(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}
```

#### 检测暗色模式

```typescript
function isDarkMode(): boolean {
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

// 监听暗色模式变化
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
  console.log('Dark mode:', e.matches);
});
```

#### 复制文本到剪贴板

```typescript
async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}
```

### 环境变量

项目支持通过 `.env` 文件配置环境变量：

```env
# 开发服务器端口
VITE_PORT=5173

# API 端点（如需要）
VITE_API_URL=https://api.example.com

# Supabase 配置（如使用）
VITE_SUPABASE_URL=your-project-url
VITE_SUPABASE_ANON_KEY=your-anon-key
```

> 所有环境变量必须以 `VITE_` 前缀开头，才能在客户端代码中访问。

### 开发工作流

```
1. 克隆仓库 → 2. 安装依赖 → 3. 启动开发服务器
                                      ↓
4. 预览构建 ← 3. 构建生产版本 ← 2. 提交代码 ← 1. 开发调试
```

#### 推荐开发流程

1. 在 `build/src/main.ts` 中修改页面逻辑
2. 在 `build/src/style.css` 中调整样式
3. 使用 `npm run dev` 实时预览更改
4. 使用 `npm run lint` 检查代码规范
5. 使用 `npm run ts-check` 验证类型安全
6. 使用 `npm run build` 构建生产版本

### 代码规范

项目遵循以下编码规范：

- **命名约定**：变量/函数使用 `camelCase`，组件使用 `PascalCase`
- **缩进**：2 空格缩进
- **引号**：单引号优先
- **分号**：语句末尾必须加分号
- **导入顺序**：第三方库 → 本地模块 → 样式文件
- **注释**：使用 JSDoc 格式注释公共函数

### 文件说明

| 文件 | 作用 |
|------|------|
| `src/main.ts` | 页面主逻辑，包含 HTML 生成、事件绑定、i18n 翻译 |
| `src/index.ts` | 应用入口，负责初始化流程 |
| `src/index.css` | 全局基础样式重置 |
| `src/style.css` | Tailwind 指令与自定义样式 |
| `scripts/copy-dist.mjs` | 构建后自动复制产物的脚本 |
| `vite.config.ts` | Vite 开发服务器配置 |
| `tailwind.config.js` | Tailwind CSS 主题配置 |
| `tsconfig.json` | TypeScript 编译选项 |

### 相关资源

| 资源 | 链接 |
|------|------|
| SniShaper 主仓库 | GitHub 项目主页 |
| Wails 框架 | https://wails.io |
| Vite 文档 | https://vitejs.dev |
| Tailwind CSS | https://tailwindcss.com |
| TypeScript | https://typescriptlang.org |

### 技术支持

遇到问题？可以通过以下方式联系我们：

- 提交 [GitHub Issue](https://github.com/your-org/SniShaperWeb/issues)
- 加入社区讨论
- 查看 [Wiki 文档](https://github.com/your-org/SniShaperWeb/wiki)

### 目录结构

```
SniShaperWeb/
├── build/               # 源码工程目录
│   ├── src/
│   │   ├── main.ts      # 页面主逻辑（HTML 模板 + JS 交互 + i18n）
│   │   ├── index.ts     # 应用入口（DOMContentLoaded 初始化）
│   │   └── index.css    # 全局基础样式
│   ├── scripts/
│   │   └── copy-dist.mjs  # postbuild 自动复制脚本
│   ├── index.html       # Vite 入口模板
│   ├── vite.config.ts   # Vite 配置（HMR、端口、监听）
│   ├── tailwind.config.js
│   ├── tsconfig.json
│   └── package.json
├── assets/              # 构建产物（CSS/JS，自动生成）
├── index.html           # 构建产物（自动生成，勿手动编辑）
└── logo.png
```

### 技术栈

| 类别 | 技术 |
|------|------|
| 构建工具 | Vite 6 |
| 语言 | TypeScript 5.6+ |
| 样式 | Tailwind CSS 3 + PostCSS |
| 打包器 | esbuild |
| 代码规范 | ESLint 9 + typescript-eslint |

### 开发环境要求

| 工具 | 版本要求 |
|------|----------|
| Node.js | ≥ 18 |
| npm | ≥ 9 |

### 快速开始

```bash
# 1. 进入源码目录
cd build

# 2. 安装依赖
npm install

# 3. 启动开发服务器（热更新）
npm run dev
# 默认监听 http://localhost:5173
```

### 可用脚本

| 命令 | 说明 |
|------|------|
| `npm run dev` | 启动开发服务器（HMR 热更新） |
| `npm run build` | 构建生产版本 + 自动复制产物 |
| `npm run postbuild` | 将 dist 产物复制到网站根目录 |
| `npm run preview` | 本地预览构建产物 |
| `npm run lint` | ESLint 代码检查 |
| `npm run ts-check` | TypeScript 类型检查 |

### 构建与部署

```bash
cd build

# 构建生产版本
# 构建完成后会自动执行 postbuild，将产物复制到网站根目录
npm run build
```

`postbuild` 钩子（`scripts/copy-dist.mjs`）执行以下操作：

1. 将 `dist/index.html` 复制到根目录 `../index.html`
2. 清空 `../assets/`，再将 `dist/assets/` 全量复制过去（防止旧 hash 文件堆积）

构建完成后，网站根目录下的 `index.html` 和 `assets/` 即为可直接部署的静态文件。

### 本地预览构建产物

```bash
cd build
npm run preview
# 默认监听 http://localhost:4173
```

### 注意事项

- `index.html` 和 `assets/` 是自动生成的产物，**请勿手动编辑**
- 所有页面修改均在 `build/src/main.ts` 中进行
- 样式修改在 `build/src/style.css` 或 `build/src/index.css` 中进行
- 多语言翻译定义在 `build/src/main.ts` 的 `zh` / `en` 对象中

### 页面结构

落地页包含以下主要区块：

1. **导航栏** - 固定顶部，支持移动端抽屉菜单
2. **Hero 区域** - 项目介绍、下载按钮、状态展示
3. **优势展示** - 三大核心优势卡片
4. **技术原理** - TLS-RF / QUIC / ECH 三大技术详解
5. **功能特性** - 8 个功能特性网格展示
6. **快速上手** - 三步使用指南
7. **常见问题** - FAQ 折叠面板
8. **技术栈** - 架构图与技术介绍
9. **更新日志** - 版本历史记录
10. **下载区域** - 多种下载方式选择
11. **页脚** - 资源链接、社区信息、版权声明

---

## English

### Overview

This repository contains the source code for the **SniShaper** official landing page. SniShaper is a Windows-native network proxy tool that uses SNI-based traffic shaping to help users bypass SNI-based censorship and achieve freer, more stable internet access.

The landing page is built with **Vanilla TypeScript + Vite + Tailwind CSS**, featuring a dark-gray × warm-orange design language with minimal, physics-inspired interactions.

### Core Features

- Fully responsive layout with mobile support
- Feature card auto-scroll with bounce-back animation (rAF + spring damping)
- Scroll pauses on mouse hover
- Intersection Observer–driven entrance animations
- Mobile drawer navigation
- Direct download button
- Multi-language support (Chinese / English)

### SniShaper App Features

> The following are core features of the SniShaper desktop app, showcased and explained on the landing page.

| Feature | Description |
|---------|-------------|
| TLS-RF | TLS Fragmentation splits Client Hello into multiple record fragments |
| ECH Injection | Encrypted Client Hello hides even the first step of TLS handshake |
| QUIC Rebuild | UDP-based QUIC protocol evades TCP fingerprint detection |
| Smart Routing | Built-in GFWList rule set — thousands of blocked domains work out of the box |
| CF IP Picker | Auto-selects lowest-latency node from Cloudflare's global IP pool |
| TUN Mode | Virtual network adapter for system-wide proxy — no per-app config needed |
| DNS Upstreams | Configure DNS upstream servers for intelligent DNS resolution |
| JSON Rules | Supports domains, IP CIDR, policy groups — edits take effect instantly |

### Design System

The landing page follows a unified design language system:

| Category | Specification |
|----------|---------------|
| Primary Color | `#f97316` Warm Orange (accent) |
| Background | `#0a0a0a` Deep Black / `#1f1f1f` Dark Gray |
| Text Color | `#e5e5e5` Body / `#737373` Muted |
| Fonts | Inter (sans-serif) / JetBrains Mono (monospace) |
| Animations | float / pulse-slow |
| Dark Mode | Based on `prefers-color-scheme` media query |

### Animations & Interactions

| Effect | Implementation |
|--------|----------------|
| Auto-scroll cards | `requestAnimationFrame` + spring damping algorithm |
| Hover pause | `mouseenter` / `mouseleave` event listeners |
| Entrance animations | `IntersectionObserver` driven |
| Float effect | Tailwind `animate-float` custom keyframes |
| Slow pulse breathing | Tailwind `animate-pulse-slow` 4s cycle |

### TypeScript Configuration

The project uses strict TypeScript configuration:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "moduleResolution": "node",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true
  }
}
```

### Browser Compatibility

| Browser | Minimum Version |
|---------|-----------------|
| Chrome | 90+ |
| Firefox | 88+ |
| Safari | 14+ |
| Edge | 90+ |

> Requires support for `IntersectionObserver`, `requestAnimationFrame`, ES2020 and other modern Web APIs.

### Deployment Options

| Platform | Description |
|----------|-------------|
| Vercel | Recommended, zero-config deployment with auto HTTPS |
| Netlify | Drag & drop `index.html` + `assets/` to deploy |
| GitHub Pages | Push to `gh-pages` branch |
| Cloudflare Pages | Connect repo for automatic builds |
| Self-hosted | Nginx/Apache static file hosting |

#### Nginx Configuration Example

```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /path/to/SniShaperWeb;
    index index.html;

    # Static asset caching
    location /assets/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # SPA route fallback
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

### Troubleshooting

| Issue | Solution |
|-------|----------|
| `npm run dev` fails to start | Check Node.js version is ≥ 18 |
| Blank page after build | Ensure `index.html` and `assets/` are in the same directory |
| Styles not applying | Verify Tailwind `content` config includes source file paths |
| HMR not working | Confirm port 5173 is not blocked by firewall |
| TypeScript errors | Run `npm run ts-check` for detailed error messages |

### Contributing

Issues and Pull Requests are welcome!

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

#### Commit Convention

- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation update
- `style:` Code formatting
- `refactor:` Code refactoring
- `perf:` Performance improvement

### Dependencies

| Dependency | Purpose | Type |
|------------|---------|------|
| `vite` | Build tool & dev server | devDependencies |
| `typescript` | TypeScript compiler | devDependencies |
| `tailwindcss` | Utility-first CSS framework | devDependencies |
| `postcss` | CSS post-processor | devDependencies |
| `autoprefixer` | Auto browser prefix | devDependencies |
| `esbuild` | Fast bundler | devDependencies |
| `eslint` | Code linting | devDependencies |
| `@supabase/supabase-js` | Supabase client | dependencies |
| `express` | Node.js web framework | dependencies |
| `dotenv` | Environment variables | dependencies |

### Performance Optimizations

| Optimization | Implementation |
|--------------|----------------|
| Code splitting | Vite auto-splits chunks by route |
| Asset compression | esbuild auto-minifies JS/CSS |
| Image optimization | WebP format, lazy loading |
| Caching strategy | Filename hashing, long-term cache for static assets |
| Lazy loading | Intersection Observer delays rendering |
| Font optimization | Uses `font-display: swap` to avoid blocking |

### Architecture Design

The landing page uses a modular architecture with clear separation of concerns:

```
┌─────────────────────────────────────────┐
│           Browser Environment            │
├─────────────────────────────────────────┤
│  ┌─────────────┐  ┌──────────────────┐  │
│  │  index.ts   │→ │    main.ts       │  │
│  │  (Entry)    │  │  (HTML + i18n)   │  │
│  └─────────────┘  └──────────────────┘  │
│         ↓                    ↓           │
│  ┌─────────────┐  ┌──────────────────┐  │
│  │ index.css   │  │   style.css      │  │
│  │ (Reset)     │  │ (Tailwind + Custom)│ │
│  └─────────────┘  └──────────────────┘  │
└─────────────────────────────────────────┘
         ↓                    ↓
┌─────────────────────────────────────────┐
│          Build Toolchain                 │
├─────────────────────────────────────────┤
│  Vite 6 → esbuild → Tailwind → PostCSS │
└─────────────────────────────────────────┘
         ↓
┌─────────────────────────────────────────┐
│          Output Artifacts                │
├─────────────────────────────────────────┤
│  index.html + assets/*.css + assets/*.js│
└─────────────────────────────────────────┘
```

### Tailwind CSS Configuration

The project uses a custom Tailwind theme with extended colors, fonts, and animations:

```js
// tailwind.config.js
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'media',  // Auto-switch based on system preference
  theme: {
    extend: {
      colors: {
        'snip-orange': '#f97316',        // Primary accent
        'snip-orange-light': '#fb923c',  // Light orange
        'snip-dark': '#0a0a0a',          // Deep black bg
        'snip-gray': '#1f1f1f',          // Dark gray cards
        'snip-gray-light': '#2a2a2a',    // Light gray borders
        'snip-text': '#e5e5e5',          // Body text
        'snip-muted': '#737373',         // Muted text
      },
      fontFamily: {
        'mono': ['JetBrains Mono', 'SF Mono', 'Monaco', 'Consolas', 'monospace'],
        'sans': ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
    },
  },
  plugins: [],
};
```

#### Custom Color Usage Example

```html
<!-- Using custom color classes -->
<div class="bg-snip-dark text-snip-text">
  <h1 class="text-snip-orange">SniShaper</h1>
  <p class="text-snip-muted">Subtitle text</p>
</div>
```

### i18n Internationalization

The project uses a lightweight i18n approach with TypeScript objects managing translations:

```typescript
// Translation data structure
type Translations = Record<string, string>;

const zh: Translations = {
  nav_features: '功能特性',
  nav_tech: '核心技术',
  hero_badge: 'v1.27 Windows 原生应用',
  // ... more translations
};

const en: Translations = {
  nav_features: 'Features',
  nav_tech: 'Core Tech',
  hero_badge: 'v1.27 Windows Native App',
  // ... more translations
};
```

#### Language Switching

Users can switch between Chinese/English via the language toggle button in the top-right corner. The current language state is stored in memory and resets to default on page refresh.

### Responsive Breakpoints

| Breakpoint | Width | Device Type |
|------------|-------|-------------|
| `sm` | 640px | Large phones |
| `md` | 768px | Tablet portrait |
| `lg` | 1024px | Tablet landscape / Small laptop |
| `xl` | 1280px | Desktop monitor |
| `2xl` | 1536px | Large display |

### Security Best Practices

| Practice | Description |
|----------|-------------|
| CSP Policy | Recommended to add Content-Security-Policy header on deploy |
| HTTPS | Enforce HTTPS in production |
| Subresource Integrity | Use SRI hashes for third-party resources |
| No Inline Scripts | All JS loaded via external files |
| Dependency Audit | Run `npm audit` regularly to check vulnerabilities |

### SEO Optimization

| Optimization | Implementation |
|--------------|----------------|
| Semantic HTML | Uses `<header>`, `<main>`, `<section>`, `<footer>` semantic tags |
| Meta Tags | Includes description, keywords, og:image, etc. |
| Structured Data | Supports JSON-LD Schema.org markup |
| Performance | Lighthouse score 90+ |
| Mobile Friendly | Complete viewport meta configuration |

### CI/CD Integration

#### GitHub Actions Example

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          
      - name: Install dependencies
        run: cd build && npm ci
        
      - name: Build
        run: cd build && npm run build
        
      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: .
```

### Version History

| Version | Date | Key Changes |
|---------|------|-------------|
| v1.0 | 2024-Q4 | Initial release, basic landing page |
| v1.1 | 2025-Q1 | Added FAQ section, mobile optimization |
| v1.2 | 2025-Q2 | Multi-language support, animation improvements |
| v1.3 | 2025-Q3 | Changelog section, download modal |
| v1.4 | 2025-Q4 | Performance optimization, Lighthouse 90+ |
| v1.5 | 2026-Q1 | Design system standardization, dark mode |

### Testing Strategy

| Test Type | Tool | Description |
|-----------|------|-------------|
| Type Checking | `tsc --noEmit` | Verify TypeScript type safety |
| Linting | ESLint | Check code style and potential issues |
| Build Test | `vite build` | Ensure production build succeeds |
| Manual Testing | Browser | Verify cross-browser compatibility |
| Performance | Lighthouse | Check performance, accessibility, SEO |

#### Running Lighthouse

```bash
# Install Lighthouse CLI
npm install -g lighthouse

# Start dev server
npm run dev

# Run Lighthouse audit
lighthouse http://localhost:5173 --view
```

### Development Debugging Tips

#### Browser DevTools Debugging

| Technique | Description |
|-----------|-------------|
| Source Maps | Auto-generated by Vite, debug TS source directly in Sources panel |
| Breakpoints | Set breakpoints at key logic in `main.ts` |
| Network Panel | Check resource loading order and caching strategy |
| Performance Panel | Analyze animation frame rates and rendering performance |
| Element Inspector | View Tailwind-generated CSS classes |

#### Common Debug Code

```typescript
// Add debug logs in main.ts
console.log('[SniShaper] Language:', currentLang);
console.log('[SniShaper] Scroll position:', window.scrollY);
console.log('[SniShaper] Intersection entries:', observerEntries);
```

### Performance Benchmarks

| Metric | Target | Current |
|--------|--------|---------|
| First Contentful Paint (FCP) | < 1.5s | ~0.8s |
| Largest Contentful Paint (LCP) | < 2.5s | ~1.2s |
| First Input Delay (FID) | < 100ms | ~50ms |
| Cumulative Layout Shift (CLS) | < 0.1 | ~0.02 |
| Time to Interactive (TTI) | < 3.5s | ~1.5s |
| Total Blocking Time (TBT) | < 200ms | ~80ms |

### Build Output Analysis

#### Bundle Sizes

| File | Size (gzip) | Description |
|------|-------------|-------------|
| `index.html` | ~5KB | HTML entry |
| `assets/index-*.js` | ~15KB | Main JS bundle |
| `assets/index-*.css` | ~8KB | Main CSS bundle |
| **Total** | **~28KB** | Initial load size |

#### Analyzing Bundle Size

```bash
# Install bundle analyzer
npm install -D rollup-plugin-visualizer

# Add to vite.config.ts
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig({
  plugins: [visualizer({ open: true })],
});
```

### Accessibility (a11y)

| Standard | Implementation |
|----------|----------------|
| WCAG 2.1 AA | Contrast ratio ≥ 4.5:1 |
| Keyboard Navigation | All interactive elements accessible via Tab |
| Screen Readers | ARIA attributes for semantic labeling |
| Focus Management | Visible `:focus-visible` styles |
| Color Blind Friendly | Information not conveyed by color alone |

#### Accessibility Checklist

- [ ] All images have `alt` attributes
- [ ] Form elements have associated `<label>`
- [ ] Color contrast passes WCAG AA standard
- [ ] All interactive elements keyboard accessible
- [ ] Page uses correct heading hierarchy (h1 → h2 → h3)
- [ ] Link text is descriptive (avoid "click here")

### Extension Development Guide

#### Adding a New Page Section

```typescript
// 1. Add translations in main.ts
const zh: Translations = {
  new_section_title: 'New Section Title',
  new_section_desc: 'New section description',
};

// 2. Create section HTML function
function renderNewSection(): string {
  return `
    <section id="new-section" class="py-20 px-4">
      <h2 class="text-3xl font-bold text-snip-orange">${t('new_section_title')}</h2>
      <p class="text-snip-muted">${t('new_section_desc')}</p>
    </section>
  `;
}

// 3. Insert into page
const mainContent = `
  ${renderHero()}
  ${renderAdvantages()}
  ${renderNewSection()}
  ${renderFooter()}
`;
```

#### Adding New Animations

```css
/* Add to style.css */
@keyframes slide-in {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.animate-slide-in {
  animation: slide-in 0.5s ease-out;
}
```

#### Adding Language Support

```typescript
// Add new language in main.ts
const ja: Translations = {
  nav_features: '機能',
  nav_tech: 'コア技術',
  hero_badge: 'v1.27 Windows ネイティブ',
  // ... more Japanese translations
};

// Add to language switch logic
const translations: Record<string, Translations> = { zh, en, ja };
```

### FAQ

#### Development

**Q: Why Vanilla TypeScript instead of React/Vue?**

A: The landing page doesn't need complex state management. Vanilla TS is lighter, produces smaller bundles, and loads faster. For a single-page showcase website, this is the optimal choice.

**Q: How do I modify page content?**

A: All text content is defined in translation objects in `main.ts`. HTML structure is also generated via template strings in `main.ts`.

**Q: Can I add new CSS frameworks?**

A: Yes, but prefer Tailwind utility classes first. For additional styles, add them in `style.css`.

#### Deployment

**Q: How do I set up a custom domain?**

A: Add your custom domain in the project settings on Vercel/Netlify, then configure DNS records as instructed.

**Q: How do I enable HTTPS?**

A: Vercel, Netlify, and Cloudflare Pages automatically enable HTTPS. For self-hosted servers, configure SSL certificates.

**Q: Can build output be placed in a subdirectory?**

A: Yes, modify the `base` option in `vite.config.ts`:
```ts
export default defineConfig({
  base: '/my-subdir/',
});
```

#### Performance

**Q: How can I further optimize loading speed?**

A:
1. Enable Brotli compression (15-20% smaller than gzip)
2. Use CDN for static asset distribution
3. Enable HTTP/2 or HTTP/3
4. Preload critical resources with `<link rel="preload">`

**Q: Why do build files have hash names?**

A: Vite adds content hashes to filenames by default for long-term caching. When file content changes, the hash updates and browsers re-download.

### Vite Configuration Details

The project's `vite.config.ts` contains the following key configurations:

```typescript
import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    port: 5173,           // Dev server port
    host: '0.0.0.0',      // Allow external access
    allowedHosts: true,   // Allow all hostnames
    hmr: {
      overlay: true,      // Show error overlay
      path: '/hot/vite-hmr',  // HMR WebSocket path
      port: 6000,         // HMR port
      clientPort: 443,    // Client connection port (via proxy)
      timeout: 30000,     // Timeout duration
    },
    watch: {
      usePolling: true,   // Use polling mode (for Docker/WSL)
      interval: 100,      // Polling interval (ms)
    }
  },
});
```

#### HMR Configuration Reference

| Option | Purpose | Default |
|--------|---------|---------|
| `overlay` | Show fullscreen overlay on build errors | `true` |
| `path` | HMR WebSocket connection path | `/@vite/client` |
| `port` | HMR server port | Same as server.port |
| `clientPort` | Port client tries to connect to | Same as port |
| `timeout` | HMR connection timeout | 30000ms |

### postbuild Script Details

The `scripts/copy-dist.mjs` script runs automatically after build:

```javascript
/**
 * postbuild: Copy dist/ output to website root (../)
 * Copy rules:
 *   dist/index.html  → ../index.html
 *   dist/assets/*    → ../assets/* (clear first, then write)
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distDir   = path.resolve(__dirname, '../dist');
const rootDir   = path.resolve(__dirname, '../../');

// Copy single file
function copyFile(src, dest) {
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.copyFileSync(src, dest);
  const rel = path.relative(rootDir, dest).replace(/\\/g, '/');
  console.log(`  ✔  ${rel}`);
}

// Clean directory
function cleanDir(dir) {
  if (fs.existsSync(dir)) {
    fs.rmSync(dir, { recursive: true, force: true });
  }
  fs.mkdirSync(dir, { recursive: true });
}

// Recursively copy directory
function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const srcPath  = path.join(src,  entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      copyFile(srcPath, destPath);
    }
  }
}

// Main flow
console.log('\n📦 postbuild: copying dist → website root…\n');

if (!fs.existsSync(distDir)) {
  console.error('❌  dist/ not found. Did vite build succeed?');
  process.exit(1);
}

// 1. Copy index.html
copyFile(
  path.join(distDir, 'index.html'),
  path.join(rootDir, 'index.html'),
);

// 2. Clear and copy assets/
const destAssets = path.join(rootDir, 'assets');
console.log(`  🗑  clearing ${path.relative(rootDir, destAssets).replace(/\\/g, '/')}/`);
cleanDir(destAssets);
copyDir(path.join(distDir, 'assets'), destAssets);

console.log('\n✅  done.\n');
```

### Build Process Flow

```
npm run build
    ↓
┌─────────────────────────────────┐
│ 1. Vite reads vite.config.ts    │
│ 2. Load TypeScript source       │
│ 3. esbuild compiles TS → JS     │
│ 4. Tailwind processes CSS        │
│ 5. PostCSS adds browser prefixes │
│ 6. Minify JS/CSS                 │
│ 7. Add content hash to filenames │
│ 8. Output to dist/ directory     │
└─────────────────────────────────┘
    ↓
npm run postbuild
    ↓
┌─────────────────────────────────┐
│ 1. Copy dist/index.html → ../   │
│ 2. Clear ../assets/              │
│ 3. Copy dist/assets/* → ../     │
│ 4. Complete                      │
└─────────────────────────────────┘
```

### Dependency Tree Analysis

#### Development Dependencies (devDependencies)

| Package | Version | Purpose |
|---------|---------|---------|
| `vite` | ^6.0.0 | Build tool & dev server |
| `typescript` | ^5.6.0 | TypeScript compiler |
| `tailwindcss` | ^3.4.17 | Utility-first CSS framework |
| `postcss` | ^8.4.49 | CSS post-processor |
| `autoprefixer` | ^10.4.20 | Auto browser prefix |
| `esbuild` | ^0.24.2 | Fast bundler (built into Vite) |
| `eslint` | ^9 | Code linting |
| `typescript-eslint` | ^8 | TS ESLint plugin |
| `tsup` | ^8.3.5 | TypeScript bundler |
| `tsx` | ^4.19.2 | TypeScript executor |
| `@types/node` | ^22.10.5 | Node.js type definitions |
| `@types/express` | ^5.0.0 | Express type definitions |

#### Production Dependencies (dependencies)

| Package | Version | Purpose |
|---------|---------|---------|
| `@supabase/supabase-js` | 2.95.3 | Supabase client SDK |
| `express` | ^4.21.2 | Node.js web framework |
| `dotenv` | ^17.2.3 | Environment variable loader |

### npm Scripts Reference

| Script | Command | Description |
|--------|---------|-------------|
| `dev` | `vite` | Start dev server with HMR |
| `build` | `vite build` | Production build, output to dist/ |
| `postbuild` | `node scripts/copy-dist.mjs` | Auto-copy output to root |
| `preview` | `vite preview` | Preview production build locally |
| `lint` | `eslint` | Code style check |
| `ts-check` | `tsc -p tsconfig.json` | TypeScript type check |

### Application Startup Flow

```
User visits page
    ↓
┌─────────────────────────────────┐
│ 1. Browser loads index.html     │
│ 2. Parse CSS links in <head>    │
│ 3. Load assets/index-*.css      │
│ 4. Apply base styles            │
│ 5. Parse JS links in <body>     │
│ 6. Load assets/index-*.js       │
│ 7. Execute index.ts             │
│ 8. DOMContentLoaded fires       │
│ 9. initApp() initializes page   │
│ 10. Render HTML content         │
│ 11. Bind event listeners        │
│ 12. Start IntersectionObserver  │
│ 13. Page fully ready            │
└─────────────────────────────────┘
```

### Project Statistics

| Metric | Value |
|--------|-------|
| Total Code Lines | ~1000+ lines TypeScript |
| CSS Lines | ~200+ custom styles |
| Translation Strings | 100+ (Chinese & English) |
| Page Sections | 11 main sections |
| Build Output Size | ~28KB (gzip) |
| Dependencies | 13 devDependencies + 3 dependencies |
| Browser Support | Chrome 90+, Firefox 88+, Safari 14+, Edge 90+ |

### Comparison with Other Solutions

| Feature | SniShaperWeb | React/Vite | Next.js | Astro |
|---------|-------------|------------|---------|-------|
| Framework Dependency | None | React | React | None |
| Build Output | ~28KB | ~50-100KB | ~100-200KB | ~20-50KB |
| First Load | Extremely Fast | Fast | Medium | Extremely Fast |
| Learning Curve | Low | Medium | High | Low |
| SSR Support | No | Requires config | Built-in | Built-in |
| Best For | Landing pages | Complex apps | Full-stack apps | Content sites |

### Advanced Deployment Guide

#### Docker Deployment

```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY build/package*.json ./
RUN npm ci
COPY build/ ./
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

#### Docker Compose

```yaml
version: '3.8'
services:
  web:
    build: .
    ports:
      - "80:80"
    restart: unless-stopped
```

#### Advanced Nginx Configuration

```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /path/to/SniShaperWeb;
    index index.html;

    # Force HTTPS
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl http2;
    server_name your-domain.com;
    root /path/to/SniShaperWeb;
    index index.html;

    # SSL Configuration
    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;

    # Security Headers
    add_header X-Frame-Options DENY;
    add_header X-Content-Type-Options nosniff;
    add_header X-XSS-Protection "1; mode=block";
    add_header Referrer-Policy strict-origin-when-cross-origin;
    add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:;";

    # Static Asset Caching
    location /assets/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Gzip Compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml;
    gzip_min_length 1000;

    # Brotli Compression (requires module)
    # brotli on;
    # brotli_types text/plain text/css application/json application/javascript text/xml application/xml;

    # SPA Route Fallback
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

### Monitoring & Analytics

#### Performance Monitoring

| Tool | Purpose | Integration |
|------|---------|-------------|
| Google Analytics | User behavior analysis | Add tracking code |
| Plausible | Privacy-friendly analytics | Add script tag |
| Sentry | Error tracking | Integrate @sentry/browser |
| LogRocket | Session recording | Integrate logrocket SDK |

#### Adding Google Analytics

```html
<!-- Add to <head> in index.html -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

### Browser Extension Support

| Extension | Purpose | Recommended |
|-----------|---------|-------------|
| React DevTools | Debug React components | N/A (No React in this project) |
| Vue DevTools | Debug Vue components | N/A (No Vue in this project) |
| TypeScript Debugger | Debug TypeScript | Recommended |
| CSS Peeper | Inspect CSS styles | Recommended |
| Lighthouse | Performance audit | Recommended |
| Web Vitals | Core metrics monitoring | Recommended |

### Code Snippet Library

#### Scroll to Top

```typescript
function scrollToTop(): void {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}
```

#### Debounce Function

```typescript
function debounce<T extends (...args: any[]) => any>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timer: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}
```

#### Throttle Function

```typescript
function throttle<T extends (...args: any[]) => any>(
  fn: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      fn(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}
```

#### Detect Dark Mode

```typescript
function isDarkMode(): boolean {
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

// Listen for dark mode changes
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
  console.log('Dark mode:', e.matches);
});
```

#### Copy to Clipboard

```typescript
async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}
```

### Environment Variables

The project supports environment variables through `.env` files:

```env
# Dev server port
VITE_PORT=5173

# API endpoint (if needed)
VITE_API_URL=https://api.example.com

# Supabase config (if used)
VITE_SUPABASE_URL=your-project-url
VITE_SUPABASE_ANON_KEY=your-anon-key
```

> All environment variables must be prefixed with `VITE_` to be accessible in client-side code.

### Development Workflow

```
1. Clone repo → 2. Install deps → 3. Start dev server
                                     ↓
4. Preview build ← 3. Build production ← 2. Commit code ← 1. Develop & debug
```

#### Recommended Development Flow

1. Modify page logic in `build/src/main.ts`
2. Adjust styles in `build/src/style.css`
3. Use `npm run dev` for live preview
4. Use `npm run lint` to check code style
5. Use `npm run ts-check` to verify type safety
6. Use `npm run build` for production build

### Code Style

The project follows these coding conventions:

- **Naming**: Variables/functions use `camelCase`, components use `PascalCase`
- **Indentation**: 2-space indentation
- **Quotes**: Single quotes preferred
- **Semicolons**: Required at end of statements
- **Import order**: Third-party libs → local modules → styles
- **Comments**: JSDoc format for public functions

### File Descriptions

| File | Purpose |
|------|---------|
| `src/main.ts` | Main page logic, HTML generation, event binding, i18n |
| `src/index.ts` | App entry point, handles initialization |
| `src/index.css` | Global base style resets |
| `src/style.css` | Tailwind directives & custom styles |
| `scripts/copy-dist.mjs` | Post-build script to copy output |
| `vite.config.ts` | Vite dev server configuration |
| `tailwind.config.js` | Tailwind CSS theme config |
| `tsconfig.json` | TypeScript compiler options |

### Related Resources

| Resource | Link |
|----------|------|
| SniShaper Main Repo | GitHub project homepage |
| Wails Framework | https://wails.io |
| Vite Docs | https://vitejs.dev |
| Tailwind CSS | https://tailwindcss.com |
| TypeScript | https://typescriptlang.org |

### Support

Having issues? Reach out through:

- Submit a [GitHub Issue](https://github.com/your-org/SniShaperWeb/issues)
- Join community discussions
- Check the [Wiki Documentation](https://github.com/your-org/SniShaperWeb/wiki)

### Directory Structure

```
SniShaperWeb/
├── build/               # Source project
│   ├── src/
│   │   ├── main.ts      # Page logic (HTML template + JS interactions + i18n)
│   │   ├── index.ts     # App entry (DOMContentLoaded initialization)
│   │   └── index.css    # Global base styles
│   ├── scripts/
│   │   └── copy-dist.mjs  # postbuild auto-copy script
│   ├── index.html       # Vite entry template
│   ├── vite.config.ts   # Vite config (HMR, port, watch)
│   ├── tailwind.config.js
│   ├── tsconfig.json
│   └── package.json
├── assets/              # Build output (CSS/JS, auto-generated)
├── index.html           # Build output (auto-generated, do not edit manually)
└── logo.png
```

### Tech Stack

| Category | Technology |
|----------|------------|
| Build Tool | Vite 6 |
| Language | TypeScript 5.6+ |
| Styling | Tailwind CSS 3 + PostCSS |
| Bundler | esbuild |
| Linting | ESLint 9 + typescript-eslint |

### Requirements

| Tool | Version |
|------|---------|
| Node.js | ≥ 18 |
| npm | ≥ 9 |

### Getting Started

```bash
# 1. Enter the source directory
cd build

# 2. Install dependencies
npm install

# 3. Start dev server with HMR
npm run dev
# Listens on http://localhost:5173 by default
```

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server with HMR |
| `npm run build` | Build for production + auto-copy output |
| `npm run postbuild` | Copy dist output to website root |
| `npm run preview` | Preview build output locally |
| `npm run lint` | ESLint code check |
| `npm run ts-check` | TypeScript type check |

### Build & Deploy

```bash
cd build

# Build for production
# After the build, postbuild automatically copies the output to the website root
npm run build
```

The `postbuild` hook (`scripts/copy-dist.mjs`) does the following:

1. Copies `dist/index.html` to `../index.html`
2. Clears `../assets/`, then copies all of `dist/assets/` into it (prevents stale hashed files from accumulating)

After the build, `index.html` and `assets/` in the repo root are ready to deploy as static files.

### Preview Build Output Locally

```bash
cd build
npm run preview
# Listens on http://localhost:4173 by default
```

### Notes

- `index.html` and `assets/` are auto-generated — **do not edit them manually**
- All page changes should be made in `build/src/main.ts`
- Style changes go in `build/src/style.css` or `build/src/index.css`
- Multi-language translations are defined in `zh` / `en` objects in `build/src/main.ts`

### Page Structure

The landing page consists of the following main sections:

1. **Navigation** - Fixed top bar with mobile drawer menu
2. **Hero** - Project intro, download button, status display
3. **Advantages** - Three core advantage cards
4. **Core Tech** - Detailed explanation of TLS-RF / QUIC / ECH
5. **Features** - 8 feature cards in grid layout
6. **Quick Start** - Three-step usage guide
7. **FAQ** - Collapsible FAQ panel
8. **Tech Stack** - Architecture diagram and tech intro
9. **Changelog** - Version history
10. **Download** - Multiple download options
11. **Footer** - Resource links, community info, copyright

---

## 声明 / Statement

### 关于 SnishaperTeam 参与维护 SniShaper 项目的声明

**发布方：** SnishaperTeam  
**日期：** 2026年5月5日

近期，SniShaper 项目在社区中引发了一定的关注与争议。鉴于项目原开发者曾宣布退出，**SnishaperTeam 正式宣布介入，目前将与 SniShaper Team 共同维护 SniShaper 项目**。

作为新加入的维护团队，SnishaperTeam 特此作出以下说明：

#### 一、立场与身份澄清

**SnishaperTeam 与此前 SniShaper 项目发生的所有历史争议、社群摩擦及相关事件均无任何关系。**

我们介入的初衷纯粹是认可 SniShaper 项目的技术价值，希望能为社区用户提供一个稳定、持续更新的工具。我们未参与过往的任何争论，也不对过往的任何言论和行为负责。

#### 二、维护目标与承诺

从即日起，SnishaperTeam 将与 SniShaper Team 共同致力于项目的健康发展。我们的核心目标如下：

- **专注技术本身**：将精力完全投入到代码的重构、优化与核心功能的稳定性上
- **建立良性社区**：倡导理性、友好的技术交流环境，拒绝情绪化的攻击与无意义的争端
- **坚持透明开发**：项目未来的所有更新与规划，都将基于公开、透明的原则进行

我们呼吁广大社区用户保持理性，共同维护良好的开源交流氛围。

**SnishaperTeam**

---

### Statement on SnishaperTeam's Participation in Maintaining SniShaper

**Published by:** SnishaperTeam  
**Date:** May 5, 2026

Recently, the SniShaper project has attracted attention and controversy in the community. Given that the original developer announced their withdrawal, **SnishaperTeam officially announces its intervention and will currently maintain the SniShaper project together with the SniShaper Team**.

As a newly joined maintenance team, SnishaperTeam hereby makes the following statement:

#### 1. Clarification of Position and Identity

**SnishaperTeam has nothing to do with any historical controversies, community frictions, or related incidents that occurred with the previous SniShaper project.**

Our intervention is purely to recognize the technical value of the SniShaper project and to provide a stable, continuously updated tool for community users. We have not participated in any past controversies and are not responsible for any past remarks or actions.

#### 2. Maintenance Goals and Commitments

From now on, SnishaperTeam will work with the SniShaper Team on the healthy development of the project. Our core goals are:

- **Focus on technology**: Devote all energy to code refactoring, optimization, and core function stability
- **Build a healthy community**: Advocate a rational and friendly technical communication environment
- **Maintain transparent development**: All future updates and planning will be based on openness and transparency

We call on community users to remain rational and jointly maintain a good open-source communication atmosphere.

**SnishaperTeam**

---

## License

MIT — see [LICENSE](./LICENSE)
