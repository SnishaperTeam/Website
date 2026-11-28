import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'jetcpp.ccwu.cc API',
  description: 'SnishaperTeam 网站后端 API 文档',
  base: '/api/',
  outDir: '../public/api',
  themeConfig: {
    nav: [
      { text: '主站', link: 'https://jetcpp.ccwu.cc' },
      { text: 'snishaper-core API', link: 'https://jetcpp.ccwu.cc/project/snishaper-core/api/' },
    ],
    sidebar: [
      {
        text: 'API 参考',
        items: [
          { text: '总览', link: '/' },
          { text: 'auth — 邮箱账号', link: '/auth' },
          { text: 'oauth — 第三方登录', link: '/oauth' },
          { text: 'devices — 设备登录', link: '/devices' },
          { text: 'posts — 文章', link: '/posts' },
          { text: 'comments — 评论', link: '/comments' },
          { text: 'personal — 收藏/历史/云同步', link: '/personal' },
          { text: 'uploads — 图片上传', link: '/uploads' },
          { text: 'notices — 应用公告', link: '/notices' },
          { text: 'admin — 管理接口', link: '/admin' },
        ],
      },
    ],
    docFooter: { prev: '上一篇', next: '下一篇' },
    outline: { label: '本页目录', level: [2, 3] },
    returnToTopLabel: '回到顶部',
    sidebarMenuLabel: '目录',
    darkModeSwitchLabel: '深色模式',
    lightModeSwitchTitle: '切换到浅色模式',
    darkModeSwitchTitle: '切换到深色模式',
  },
})
