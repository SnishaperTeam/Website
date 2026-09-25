# SnishaperTeam网站开发Wiki

## 目录
1. [项目结构](#项目结构)
2. [修改现有网页](#修改现有网页)
3. [添加新页面](#添加新页面)
4. [添加新项目](#添加新项目)
5. [添加导航栏菜单项](#添加导航栏菜单项)
6. [路由配置](#路由配置)
7. [样式和布局](#样式和布局)
8. [构建和部署](#构建和部署)

## 项目结构

```
D:\WEB\SnishaperTeamWebsite\build\vue-app\
├── src\
│   ├── App.vue              # 主应用组件（包含导航栏、页脚）
│   ├── main.ts              # 应用入口
│   ├── router\              # 路由配置
│   │   └── index.ts
│   ├── views\               # 页面视图
│   │   ├── HomeView.vue     # 首页
│   │   ├── AboutView.vue    # 关于页面
│   │   ├── BlogView.vue     # 博客列表页
│   │   ├── ProjectsView.vue # 项目列表页
│   │   ├── RedirectView.vue # 文海拾贝页
│   │   ├── blog\            # 博客文章
│   │   │   ├── CPPView.vue
│   │   │   └── JetbrainsView.vue
│   │   └── project\         # 项目详情页
│   │       ├── EnglishListenView.vue
│   │       ├── GithubCloneView.vue
│   │       ├── goodminecraft.vue
│   │       ├── JetbrainsCrackView.vue
│   │       └── minecrafttools.vue
│   ├── components\          # 可复用组件
│   │   ├── HelloWorld.vue
│   │   ├── TheWelcome.vue
│   │   ├── WelcomeItem.vue
│   │   └── icons\           # 图标组件
│   └── assets\              # 静态资源
│       ├── main.css         # 主样式
│       ├── base.css         # 基础样式
│       ├── animations.css   # 动画样式
│       └── logo.svg         # Logo
├── public\                  # 公共资源
│   ├── favicon.ico
│   ├── fonts.ttf
│   ├── language-switcher.js
│   └── logo.png
└── package.json             # 项目配置
```

## 修改现有网页

### 1. 修改页面内容
编辑对应的Vue文件（位于 `src/views/` 或子目录）：

```vue
<!-- 示例：修改首页 src/views/HomeView.vue -->
<template>
  <div class="home">
    <!-- 修改这里的内容 -->
    <h1>欢迎来到SnishaperTeam Studio</h1>
    <p>这里是修改后的内容...</p>
  </div>
</template>
```

### 2. 修改样式
- **全局样式**：编辑 `src/assets/main.css` 或 `src/assets/base.css`
- **组件样式**：在Vue文件的 `<style>` 部分修改
- **Bootstrap样式**：使用Bootstrap的CSS类（项目已集成Bootstrap 5）

### 3. 修改导航栏
编辑 `src/App.vue` 中的导航栏部分（第23-79行）：
```vue
<nav class="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm sticky-top">
  <!-- 导航栏内容 -->
</nav>
```

## 添加新页面

### 步骤1：创建Vue组件文件
在 `src/views/` 目录下创建新的 `.vue` 文件：

```vue
<!-- src/views/NewPage.vue -->
<template>
  <div class="new-page">
    <h1>新页面标题</h1>
    <div class="content">
      <!-- 页面内容 -->
    </div>
  </div>
</template>

<script setup lang="ts">
// 组件逻辑（可选）
</script>

<style scoped>
/* 页面特定样式 */
.new-page {
  padding: 2rem;
}
</style>
```

### 步骤2：配置路由
编辑 `src/router/index.ts`：

```typescript
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // ... 现有路由
    {
      path: '/new-page',          // 访问路径
      name: 'NewPage',            // 路由名称
      component: () => import('@/views/NewPage.vue')  // 懒加载组件
    }
  ]
})

export default router
```

### 步骤3：添加导航链接（可选）
在 `src/App.vue` 的导航栏中添加链接：
```vue
<li class="nav-item">
  <RouterLink to="/new-page" class="nav-link">新页面</RouterLink>
</li>
```

## 添加新项目

### 步骤1：创建项目详情页
在 `src/views/project/` 目录下创建项目文件：

```vue
<!-- src/views/project/NewProjectView.vue -->
<template>
  <div class="project-detail">
    <header class="mb-4">
      <h1 class="display-4 fw-bold">新项目名称</h1>
      <p class="lead text-muted">项目简短描述</p>
    </header>
    
    <div class="row">
      <div class="col-md-8">
        <section class="mb-5">
          <h2>项目介绍</h2>
          <p>详细的项目介绍内容...</p>
        </section>
        
        <section class="mb-5">
          <h2>功能特性</h2>
          <ul>
            <li>功能1</li>
            <li>功能2</li>
            <li>功能3</li>
          </ul>
        </section>
      </div>
      
      <div class="col-md-4">
        <div class="card">
          <div class="card-body">
            <h5 class="card-title">项目信息</h5>
            <ul class="list-unstyled">
              <li><strong>技术栈：</strong>Vue 3, TypeScript</li>
              <li><strong>状态：</strong>开发中</li>
              <li><strong>GitHub：</strong><a href="#">链接</a></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// 项目逻辑
</script>

<style scoped>
.project-detail {
  padding: 2rem 0;
}
</style>
```

### 步骤2：配置项目路由
在 `src/router/index.ts` 中添加路由：
```typescript
{
  path: '/projects/new-project',
  name: 'NewProject',
  component: () => import('@/views/project/NewProjectView.vue')
}
```

### 步骤3：在项目列表页添加链接
编辑 `src/views/ProjectsView.vue`，在项目列表中添加新项目卡片。

## 添加导航栏菜单项

### 步骤1：编辑导航栏
在 `src/App.vue` 的导航栏 `<ul class="navbar-nav me-auto">` 中添加：

```vue
<li class="nav-item">
  <RouterLink to="/your-path" class="nav-link">菜单名称</RouterLink>
</li>
```

### 步骤2：添加下拉菜单（可选）
```vue
<li class="nav-item dropdown">
  <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown">
    下拉菜单
  </a>
  <ul class="dropdown-menu">
    <li><RouterLink to="/item1" class="dropdown-item">项目1</RouterLink></li>
    <li><RouterLink to="/item2" class="dropdown-item">项目2</RouterLink></li>
    <li><hr class="dropdown-divider"></li>
    <li><RouterLink to="/item3" class="dropdown-item">项目3</RouterLink></li>
  </ul>
</li>
```

## 路由配置详解

### 路由文件位置
`src/router/index.ts`

### 路由配置示例
```typescript
const routes = [
  {
    path: '/',                    // 访问路径
    name: 'Home',                 // 路由名称（用于编程式导航）
    component: HomeView           // 组件（或懒加载）
  },
  {
    path: '/blog/:id',           // 动态路由
    name: 'BlogDetail',
    component: () => import('@/views/blog/BlogDetail.vue')
  },
  {
    path: '/about',
    name: 'About',
    component: AboutView,
    meta: {                      // 路由元信息
      requiresAuth: true,
      title: '关于我们'
    }
  }
]
```

### 路由导航方式
```vue
<!-- 模板中使用 -->
<RouterLink to="/path">链接文本</RouterLink>

<!-- 编程式导航 -->
<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

function goToPage() {
  router.push('/path')           // 跳转
  router.replace('/path')        // 替换当前路由
  router.go(-1)                  // 返回
}
</script>
```

## 样式和布局

### 1. Bootstrap 5
项目已集成Bootstrap 5，可以使用所有Bootstrap组件和工具类：
- 网格系统：`container`, `row`, `col-*`
- 组件：`card`, `button`, `nav`, `modal`等
- 工具类：`mt-3`, `p-4`, `text-center`, `d-flex`等

### 2. 自定义样式
- **全局样式**：`src/assets/main.css`
- **组件样式**：使用Vue的 `<style scoped>`
- **动画**：`src/assets/animations.css`

### 3. 响应式设计
使用Bootstrap的响应式断点：
- `sm`: ≥576px
- `md`: ≥768px  
- `lg`: ≥992px
- `xl`: ≥1200px
- `xxl`: ≥1400px

## 构建和部署

### 开发环境
```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 访问 http://localhost:5173
```

### 生产构建
```bash
# 构建生产版本
npm run build

# 预览构建结果
npm run preview

# 构建结果在 dist/ 目录
```

### 部署步骤
1. 运行 `npm run build`
2. 将 `dist/` 目录内容上传到服务器
3. 配置服务器指向 `index.html`

## 常见问题

### Q1: 页面样式不生效？
A: 检查CSS作用域，确保样式正确引入，使用 `!important` 覆盖Bootstrap样式。

### Q2: 路由404错误？
A: 检查路由配置路径，确保服务器配置支持Vue Router的历史模式。

### Q3: 图片不显示？
A: 图片放在 `public/` 目录使用绝对路径 `/image.png`，放在 `src/assets/` 使用相对路径导入。

### Q4: 如何添加图标？
A: 使用Bootstrap Icons（已集成），添加 `<i class="bi bi-icon-name"></i>`。

## 最佳实践

1. **组件命名**：使用PascalCase（大驼峰）
2. **文件组织**：按功能模块组织文件
3. **代码复用**：提取可复用组件到 `src/components/`
4. **性能优化**：使用路由懒加载，图片压缩
5. **代码规范**：运行 `npm run lint` 检查代码

## 版本控制
```bash
# 提交更改
git add .
git commit -m "feat: 添加新项目页面"
git push origin main
```

---

*文档最后更新：2025年12月13日*