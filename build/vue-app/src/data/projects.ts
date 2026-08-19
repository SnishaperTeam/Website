export interface ProjectFeature {
  icon: string
  title: string
  desc: string
}

export interface ProjectTechCard {
  badge: string
  tag: string
  desc: string
}

export interface ProjectHighlight {
  icon: string
  title: string
  desc: string
}

export interface ProjectFaqList {
  label: string
  desc: string
}

export interface ProjectFaq {
  q: string
  a?: string
  html?: boolean
  content?: string
  list?: ProjectFaqList[]
  a1?: string
  a2?: string
}

export interface ProjectStepNote {
  type: 'mono' | 'dot' | 'badges'
  text?: string
  badges?: string[]
}

export interface ProjectStep {
  num: string
  title: string
  desc: string
  note?: ProjectStepNote
}

export interface ProjectStackItem {
  label: string
  text: string
}

export interface ProjectTermStat {
  label: string
  value: string
  version?: boolean
}

export interface ProjectTermRow {
  label: string
  badge: string
  badgeClass?: string
}

export interface ProjectTerminal {
  barTitle: string
  command: string
  status: string
  stats: ProjectTermStat[]
}

export interface ProjectButton {
  icon: string
  label: string
  action: 'modal' | 'scroll'
  target?: string
}

export interface DownloadButton {
  icon: string
  label: string
  kind: 'asset' | 'static'
  assetPattern?: RegExp
  fallbackUrl?: string
  proxy?: boolean
  url?: string
}

export interface DownloadCard {
  icon: string
  title: string
  subtitle?: string
  versionInfo?: boolean
  buttons?: DownloadButton[]
}

export interface SoftwareProjectConfig {
  id: string
  rootClass: string
  gradientClass: string
  versionTag: string
  showStars?: boolean
  fallbackVersion: string
  title: string
  headline: string
  subtitle: string
  divider: string
  repo: string
  workerBase: string
  releasesUrl: string
  terminal: ProjectTerminal
  navLabels: Record<string, string>
  heroButtons: ProjectButton[]
  features: ProjectFeature[]
  techCards: ProjectTechCard[]
  highlight: ProjectHighlight
  faqs: ProjectFaq[]
  steps: ProjectStep[]
  tips: string[]
  stackDesc: string
  stackItems: ProjectStackItem[]
  stackTermRows: ProjectTermRow[]
  downloadTitle: string
  downloadDesc: string
  downloadCta: string
  downloadFooter: string[]
  modalTitle: string
  downloadCards: DownloadCard[]
  extraLinks?: DownloadButton[]
}

export const snishaperConfig: SoftwareProjectConfig = {
  id: 'snishaper',
  rootClass: 'snishaper-page',
  gradientClass: 'snip-gradient',
  versionTag: 'Windows 原生应用',
  fallbackVersion: '1.28',
  title: 'SniShaper',
  headline: '专为复杂网络环境设计',
  subtitle: 'TLS 分片、QUIC 重建、ECH 注入 — 让你的流量在封锁网络中持续可用。',
  divider: '// snishaper',
  repo: 'SniShaper/SniShaper',
  workerBase: 'https://dongle.dpdns.org',
  releasesUrl: 'https://github.com/SniShaper/SniShaper/releases',
  terminal: {
    barTitle: 'snishaper status',
    command: 'snishaper --status',
    status: '代理状态：运行中',
    stats: [
      { label: '上行', value: '1.2 MB/s' },
      { label: '下行', value: '4.7 MB/s' },
      { label: '模式', value: 'TLS-RF' },
      { label: 'GUI', value: '', version: true },
    ],
  },
  navLabels: {
    features: '功能特性',
    tech: '核心技术',
    faq: '常见问题',
    quickstart: '快速上手',
    changelog: '更新日志',
    download: '下载',
  },
  heroButtons: [
    { icon: 'mdi:download', label: '立即下载', action: 'modal' },
    { icon: 'mdi:chip', label: '了解技术原理', action: 'scroll', target: 'tech' },
  ],
  features: [
    { icon: 'mdi:earth', title: '智能分流', desc: '内置 GFWList 规则集，数万个被封锁域名开箱即通。' },
    { icon: 'mdi:lightning-bolt', title: 'CF 优选 IP', desc: '自动从 Cloudflare 全球节点池中挑选延迟最低的节点。' },
    { icon: 'mdi:dns', title: 'DNS 上游', desc: '支持配置 DNS 上游服务器，配合域名绕过功能，智能解析 DNS 请求。' },
    { icon: 'mdi:lan', title: 'TUN 模式', desc: '虚拟网卡实现全局流量代理，所有应用无需配置即可使用。' },
    { icon: 'mdi:code-json', title: 'JSON 规则', desc: '支持域名、IP CIDR、策略组，编辑 JSON 即时生效，无需重启。' },
    { icon: 'mdi:certificate', title: '证书管理', desc: '内置 MITM 代理 CA 证书安装向导，一键完成。' },
    { icon: 'mdi:speedometer', title: '延迟测试', desc: '内置节点测速，智能选择最优路径。' },
    { icon: 'mdi:account-group', title: '多平台支持', desc: '支持 Discord、Twitch 和 XChat 等平台的智能分流和代理规则。' },
  ],
  techCards: [
    { badge: 'TLS-RF', tag: '客户端实现', desc: 'TLS 分片技术将 Client Hello 拆分为多个 TLS 记录分片传输。DPI 设备通常只检查第一个分片，真实 SNI 得以隐藏。' },
    { badge: 'QUIC', tag: '基于 quic-go', desc: '基于 UDP 的 QUIC 协议天然规避 TCP 特征检测。在本地重建 QUIC 连接，将真实流量封装其中。' },
    { badge: 'ECH', tag: 'TLS 1.3 标准', desc: '加密 Client Hello 将原本明文的部分加密，连 TLS 握手的第一步都无法被窥探。兼容 Cloudflare 等主流 ECH 基础设施。' },
  ],
  highlight: {
    icon: 'mdi:swap-horizontal-circle',
    title: '迁移模式',
    desc: '利用TLS 1.2的会话恢复，最大化封锁环境下的可用性。',
  },
  faqs: [
    {
      q: '为什么要安装根证书？',
      a: 'SniShaper 通过 MITM（中间人代理）技术实现流量拦截和分析，以便对特定域名进行智能分流。MITM 代理需要安装自定义 CA 根证书来解密 HTTPS 流量。安装后，所有由 SniShaper 签发的证书都会被系统信任。'
    },
    {
      q: 'TLS-RF 和 ECH 模式有什么区别？',
      html: true,
      content: '<strong style="color:var(--color-white)">TLS-RF</strong>&nbsp;（TLS 分片）通过将 Client Hello 拆分为多个 TLS 记录分片传输，适用于大多数场景，无需服务器特殊配置。<br/><br/><strong style="color:var(--color-white)">ECH</strong>&nbsp;（加密 Client Hello）将原本明文的 TLS 扩展部分完全加密，安全性更高，但需要目标服务器支持 ECH（如 Cloudflare CDN）。'
    },
    {
      q: '如何选择合适的代理模式？',
      list: [
        { label: 'TLS-RF', desc: '推荐作为默认选项，兼容性好' },
        { label: 'ECH', desc: '最高防护级别，适合 Cloudflare 站点' },
        { label: 'QUIC', desc: '基于 UDP，规避 TCP 特征检测' },
      ]
    },
    {
      q: 'TUN 模式和系统代理有什么区别？',
      a1: '系统代理：只影响支持代理设置的应用程序（如浏览器），需要应用主动使用代理配置。',
      a2: 'TUN 模式：通过虚拟网卡接管全部流量，实现全局代理，无需应用程序额外配置。适合游戏、桌面应用等不支持代理协议的场景。'
    },
    {
      q: 'Cloudflare 优选 IP 是什么原理？',
      a: 'Cloudflare 拥有全球数百万个 IP 节点。通过 API 获取 IP 池后，SniShaper 会自动对每个 IP 进行延迟测试，挑选出延迟最低的节点使用。这可以显著提升访问速度和稳定性。'
    },
    {
      q: 'SniShaper 是否开源免费？',
      a: '是的，SniShaper 采用 MIT 开源许可证，完全免费使用。源代码托管在 GitHub 上，接受社区贡献。你可以自由查看、修改和分发代码。'
    },
  ],
  steps: [
    {
      num: '1',
      title: '下载安装',
      desc: '从网站下载最新版本的 SniShaper，解压后双击运行 snishaper.exe。',
      note: { type: 'mono', text: 'Windows 10/11 x64' },
    },
    {
      num: '2',
      title: '安装证书',
      desc: '首次运行后，进入证书管理页面，点击「安装根证书」，按系统提示完成安装。',
      note: { type: 'dot', text: 'Windows 安全提示确认' },
    },
    {
      num: '3',
      title: '启动代理',
      desc: '选择合适的代理模式，点击「开启代理」。可选择开启系统代理或 TUN 模式。',
      note: { type: 'badges', badges: ['TLS-RF', 'ECH', 'QUIC'] },
    },
  ],
  tips: [
    '首次使用建议选择 TLS-RF 模式，兼容性最好',
    '开启系统代理后浏览器即可使用，无需单独配置',
    '游戏或桌面应用建议开启 TUN 模式实现全局代理',
    '勾选开机自启和最小化到托盘获得最佳体验',
  ],
  stackDesc: 'Wails v3 带来原生 Windows 桌面体验。Go 后端处理核心逻辑 — TLS 混淆、QUIC 重建、规则匹配。React/TypeScript 前端提供响应式图形界面。',
  stackItems: [
    { label: 'Go', text: '高性能代理核心' },
    { label: 'React', text: 'TypeScript + Vite 构建 UI' },
    { label: 'Wails', text: '原生 Windows 桌面应用' },
    { label: 'MIT', text: '开源免费' },
  ],
  stackTermRows: [
    { label: '本地应用', badge: '客户端' },
    { label: 'SniShaper', badge: 'TLS-RF / ECH / QUIC', badgeClass: '' },
    { label: '', badge: 'Cloudflare / VPS' },
    { label: '目标网站', badge: '畅通', badgeClass: 'ok' },
  ],
  downloadTitle: '准备掌控流量了吗？',
  downloadDesc: '下载 SniShaper Windows 版本。开源免费，无需注册。',
  downloadCta: '下载 Windows x64',
  downloadFooter: ['Windows 10/11', '图形界面', '开源项目'],
  modalTitle: '选择下载方式',
  downloadCards: [
    {
      icon: 'mdi:microsoft-windows',
      title: '安装程序 (exe)',
      buttons: [
        { icon: 'mdi:github', label: 'GitHub 原链下载', kind: 'asset', assetPattern: /\.exe$/i, fallbackUrl: 'https://github.com/SniShaper/SniShaper/releases/download/v1.28/Snishaper-1.28-x64Setup.exe' },
        { icon: 'mdi:flash', label: '加速站下载', kind: 'asset', assetPattern: /\.exe$/i, fallbackUrl: 'https://github.com/SniShaper/SniShaper/releases/download/v1.28/Snishaper-1.28-x64Setup.exe', proxy: true },
      ],
    },
    {
      icon: 'mdi:archive',
      title: '便携版 (7z)',
      buttons: [
        { icon: 'mdi:github', label: 'GitHub 原链下载', kind: 'asset', assetPattern: /\.7z$/i, fallbackUrl: 'https://github.com/SniShaper/SniShaper/releases/download/v1.28/SniShaper-x64.7z' },
        { icon: 'mdi:flash', label: '加速站下载', kind: 'asset', assetPattern: /\.7z$/i, fallbackUrl: 'https://github.com/SniShaper/SniShaper/releases/download/v1.28/SniShaper-x64.7z', proxy: true },
      ],
    },
  ],
}

export const lumineConfig: SoftwareProjectConfig = {
  id: 'lumine',
  rootClass: 'lumine-page',
  gradientClass: 'lumine-gradient',
  versionTag: 'Android 原生应用 · F-Droid 已上架',
  showStars: true,
  fallbackVersion: '0.1.8',
  title: 'Lumine-For-Android',
  headline: 'Android 上的 Clash 风格代理',
  subtitle: 'enimul 引擎 + VPN/TUN 管道，GFWlist 黑名单分流，订阅与规则管理一手掌控。',
  divider: '// lumine-for-android',
  repo: 'SniShaper/lumine-for-android',
  workerBase: 'https://dongle.dpdns.org',
  releasesUrl: 'https://github.com/SniShaper/lumine-for-android/releases',
  terminal: {
    barTitle: 'adb shell lumine status',
    command: 'lumine --status',
    status: 'VPN 状态：已连接',
    stats: [
      { label: '核心', value: 'enimul' },
      { label: '分流', value: 'GFWlist' },
      { label: 'DNS', value: 'Fake IP' },
      { label: '版本', value: '', version: true },
    ],
  },
  navLabels: {
    features: '核心优势',
    tech: '核心技术',
    faq: '常见问题',
    quickstart: '快速上手',
    changelog: '更新日志',
    download: '下载',
  },
  heroButtons: [
    { icon: 'mdi:download', label: '获取 Lumine-For-Android', action: 'modal' },
    { icon: 'mdi:chip', label: '了解技术原理', action: 'scroll', target: 'tech' },
  ],
  features: [
    { icon: 'mdi:cellphone-android', title: '配置订阅', desc: '支持订阅 URL 拉取远程配置，一键切换不同规则集，配置管理贴近 Clash 使用习惯。' },
    { icon: 'mdi:format-list-bulleted-square', title: '独立规则页', desc: '专属规则页面，可查看、编辑并新建规则，分流策略随时调整，即时生效。' },
    { icon: 'mdi:shield-lock-outline', title: 'GFWlist 黑名单驱动', desc: '基于 GFWlist 的黑名单分流模式，只代理被封锁的域名，日常流量直连，更省电更快。' },
    { icon: 'mdi:lan', title: 'VPN/TUN 管道', desc: '系统 VPN 接口接管流量，无需 root，所有应用开箱即用，配合 tun2socks 处理 TCP/UDP。' },
    { icon: 'mdi:dns', title: '灵活 Fake IP', desc: '可配置的 Fake IP 实现，配合 DNS 劫持与 DoH 上游，智能解析并分流域名请求。' },
    { icon: 'mdi:weather-night', title: 'MD3 深色模式', desc: 'Material Design 3 主题，支持深色模式，首页状态卡片实时显示连接状态与运行阶段。' },
    { icon: 'mdi:battery-charging', title: '增强保活', desc: '开机广播、前台服务、无障碍保活与看门狗多级兜底，后台连接更稳定。' },
    { icon: 'mdi:chip', title: '多架构支持', desc: 'arm64-v8a / armeabi-v7a / x86 / x86_64 全架构构建，minSdk 24 覆盖 Android 7.0+。' },
  ],
  techCards: [
    { badge: 'enimul', tag: 'Go 核心引擎', desc: '前身是 lumine（solo connector）。经 gomobile 编译为 LumineCore.aar 嵌入 Android 应用，处理拨号、规则匹配与 DNS 解析。' },
    { badge: 'TUN/VPN', tag: '基于 tun2socks', desc: '系统 VPN 服务建立 TUN 虚拟网卡，流量经 tun2socks v2 转换为 TCP/UDP 会话交给核心代理，应用无需任何配置。' },
    { badge: 'Fake IP', tag: 'DNS 劫持 + DoH', desc: '对代理域名的 DNS 查询返回虚拟 IP，隧道内还原真实域名连接。支持 DoH 上游、DNS 劫持与缓存，解析更快更隐蔽。' },
  ],
  highlight: {
    icon: 'mdi:battery-charging',
    title: '增强保活',
    desc: '开机广播 + 前台服务 + 无障碍保活 + 看门狗定时重启，多级兜底维持后台连接。',
  },
  faqs: [
    {
      q: 'Lumine-For-Android 和 SniShaper 是什么关系？',
      a: 'Lumine-For-Android（产品名 lumine-mobile）可以看作是 SniShaper 在移动端的功能扩展：桌面端使用 Go + Wails 构建，移动端则基于同一个 enimul 引擎，换成 Kotlin + gomobile 的原生 Android 实现，并提供 VPN/TUN 管道与移动端界面。'
    },
    {
      q: 'enimul 和原来的 lumine 是什么关系？',
      html: true,
      content: '<strong style="color:var(--color-white)">enimul</strong>&nbsp;是原&nbsp;<strong style="color:var(--color-white)">lumine</strong>&nbsp;（Codeberg 上的 solo connector）更名后的新仓库。Lumine-For-Android 以 enimul 为核心，并做了一部分本地修改：为优化移动端性能，删除原版规则中的部分 IP 段，并修改了分流方式。'
    },
    {
      q: '配置文件格式和上游兼容吗？',
      a: '兼容。配置文件的语法与上游 enimul 保持一致，原有配置可以直接沿用。当前处于早期阶段，部分模式可能工作不稳定，部分网站访问可能出现异常，欢迎反馈。'
    },
    {
      q: '黑名单驱动的分流模式是什么？',
      list: [
        { label: '黑名单模式', desc: '只对 GFWlist 中记录的域名走代理，其余流量直连，日常使用更省电、更快' },
        { label: '规则自定义', desc: '独立规则页可查看、编辑、新建规则，精确控制每个域名的走向' },
        { label: '订阅切换', desc: '通过订阅 URL 拉取配置，在规则集之间一键切换' },
      ]
    },
    {
      q: 'Fake IP 是怎么工作的？',
      a: '当域名匹配代理规则时，DNS 解析阶段直接返回一个伪造的虚拟 IP，流量进入 VPN 隧道后再由引擎还原真实域名进行连接。整个过程对应用透明，避免真实目标 IP 暴露在明文 DNS 查询中。'
    },
    {
      q: 'Lumine-For-Android 是否开源免费？',
      a: '是的，项目采用 AGPLv3 开源许可证，完全免费。源码托管在 GitHub（SniShaper/lumine-for-android），同时已上架 F-Droid，可直接从应用商店安装。'
    },
  ],
  steps: [
    {
      num: '1',
      title: '下载安装',
      desc: '从 F-Droid 或 GitHub Releases 获取 APK，安装到 Android 7.0 及以上设备。',
      note: { type: 'mono', text: 'arm64-v8a / armeabi-v7a / x86 / x86_64' },
    },
    {
      num: '2',
      title: '导入订阅',
      desc: '在「配置订阅」页面添加订阅 URL 拉取配置，或直接使用内置配置，Clash 风格管理。',
      note: { type: 'dot', text: '配置切换即时生效' },
    },
    {
      num: '3',
      title: '启动代理',
      desc: '在首页点击开启 VPN，授权系统 VPN 请求后即可全局代理，GFWlist 规则自动分流。',
      note: { type: 'badges', badges: ['Fake IP', 'DoH', 'GFWlist'] },
    },
  ],
  tips: [
    '黑名单模式只代理被封锁域名，日常流量直连更省电',
    '规则页面支持查看、编辑、新建，分流策略随时调整',
    '日志页面可实时查看连接记录，便于排查问题',
    '无障碍保活可提升后台稳定性，按需开启',
  ],
  stackDesc: 'Kotlin + Jetpack Compose 构建 Material Design 3 界面。Go 引擎 enimul 负责代理核心与分流逻辑，经 gomobile 编译为 AAR 嵌入。tun2socks v2 提供 TUN 到会话的转换管道。',
  stackItems: [
    { label: 'Kotlin', text: 'Jetpack Compose · Material 3' },
    { label: 'Go', text: 'enimul 核心引擎' },
    { label: 'gomobile', text: '编译为 LumineCore.aar' },
    { label: 'tun2socks', text: 'TUN 网络管道' },
    { label: 'AGPLv3', text: '开源免费' },
  ],
  stackTermRows: [
    { label: '本地应用', badge: '直连' },
    { label: 'Lumine-For-Android', badge: 'VPN/TUN + enimul', badgeClass: '' },
    { label: '', badge: 'GFWlist 命中' },
    { label: '目标网站', badge: '代理', badgeClass: 'ok' },
  ],
  downloadTitle: '把代理装进口袋',
  downloadDesc: '获取 Lumine-For-Android。AGPLv3 开源，完全免费。',
  downloadCta: '下载 Android APK',
  downloadFooter: ['Android 7.0+', 'F-Droid', '开源项目'],
  modalTitle: '选择获取方式',
  downloadCards: [
    {
      icon: 'mdi:cellphone-android',
      title: 'F-Droid 应用商店',
      versionInfo: true,
      buttons: [
        { icon: 'mdi:shield-check', label: 'F-Droid 页面下载', kind: 'static', url: 'https://f-droid.org/packages/com.moi.lumine' },
      ],
    },
    {
      icon: 'mdi:cellphone',
      title: 'arm64-v8a APK（主流设备）',
      buttons: [
        { icon: 'mdi:github', label: 'GitHub 原链下载', kind: 'asset', assetPattern: /arm64-v8a/i, fallbackUrl: 'https://github.com/SniShaper/lumine-for-android/releases/download/v0.1.8/lumine-v0.1.8-app-arm64-v8a-release.apk' },
        { icon: 'mdi:flash', label: '加速站下载', kind: 'asset', assetPattern: /arm64-v8a/i, fallbackUrl: 'https://github.com/SniShaper/lumine-for-android/releases/download/v0.1.8/lumine-v0.1.8-app-arm64-v8a-release.apk', proxy: true },
      ],
    },
    {
      icon: 'mdi:cellphone-android',
      title: 'x86_64 APK（模拟器）',
      buttons: [
        { icon: 'mdi:github', label: 'GitHub 原链下载', kind: 'asset', assetPattern: /x86_64/i, fallbackUrl: 'https://github.com/SniShaper/lumine-for-android/releases/download/v0.1.8/lumine-v0.1.8-app-x86_64-release.apk' },
        { icon: 'mdi:flash', label: '加速站下载', kind: 'asset', assetPattern: /x86_64/i, fallbackUrl: 'https://github.com/SniShaper/lumine-for-android/releases/download/v0.1.8/lumine-v0.1.8-app-x86_64-release.apk', proxy: true },
      ],
    },
  ],
  extraLinks: [
    { icon: 'mdi:github', label: '全部 ABI 与历史版本', kind: 'static', url: 'https://github.com/SniShaper/lumine-for-android/releases' },
    { icon: 'mdi:code-tags', label: '查看源码', kind: 'static', url: 'https://github.com/SniShaper/lumine-for-android' },
  ],
}
