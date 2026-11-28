import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'snishaper-core',
  description: 'SnishaperTeam snishaper-core Go 库 API 文档',
  base: '/api/',
  outDir: '../public/api',
  themeConfig: {
    nav: [
      { text: '主站', link: 'https://jetcpp.ccwu.cc' },
      { text: 'GitHub', link: 'https://github.com/SnishaperTeam/snishaper-core' },
    ],
    sidebar: [
      {
        text: 'API 参考',
        items: [
          { text: '总览', link: '/' },
          { text: 'proxy — 代理引擎', link: '/proxy' },
          { text: 'evolution — 规则演化', link: '/evolution' },
          { text: 'tlsfrag — TLS 分片', link: '/tlsfrag' },
          { text: 'quicrewrite — QUIC 重写', link: '/quicrewrite' },
          { text: 'singtun — TUN 接入', link: '/singtun' },
          { text: 'certmanager — 证书管理', link: '/certmanager' },
          { text: 'dohresolver — DoH 解析', link: '/dohresolver' },
          { text: 'cfpool — CF 优选 IP', link: '/cfpool' },
          { text: 'gfwlist — GFWList', link: '/gfwlist' },
          { text: 'sysproxy — 系统代理', link: '/sysproxy' },
          { text: 'netiface — 网卡工具', link: '/netiface' },
          { text: 'subscription — 订阅解析', link: '/subscription' },
          { text: 'config — 配置模型', link: '/config' },
          { text: 'log — 日志门面', link: '/log' },
          { text: 'openutil — 打开文件', link: '/openutil' },
          { text: 'atomicfile — 原子写文件', link: '/atomicfile' },
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
