# SniShaper - 智能网络代理工具

从传统代理到 **TLS-RF 分片**、**QUIC 重建**、**ECH 注入**，用 Go + Wails v3 重新定义网络代理体验。

## 项目介绍

### 项目概述
SniShaper 是一款专为复杂网络环境设计的本地代理工具，基于 **Go 1.24+** 和 **Wails v3** 框架构建。项目采用现代化的技术栈——Go 语言负责高性能的代理核心，Vue.js 提供跨平台的图形界面，通过 Wails Runtime Bridge 实现无缝通信。当前版本 v1.25。

### 与同类工具的核心区别
| 特性 | 传统代理工具 | SniShaper |
|------|----------|--------------|
| 核心技术 | 简单 SOCKS/HTTP 代理 | TLS-RF、QUIC、ECH 多技术融合 |
| 开发语言 | C++/Python | Go 1.24+ |
| UI 框架 | Qt/Electron | Wails v3 (轻量级) |
| 代理模式 | 单一模式 | 六模式全方位覆盖 |
| 规则引擎 | 手动配置 | GFWList 智能分流 |
| ECH 支持 | 无 | 自动获取并注入 echconfig |
| QUIC 优化 | 无 | quic-go 混淆特性 |

### 核心功能

#### 六模式全方位覆盖
- **Transparent 模式**：轻量级透明代理，适合基础使用场景
- **Direct 模式**：直连模式，无代理转发
- **Proxy 模式**：标准代理模式，支持自定义上游
- **Tunnel 模式**：隧道模式，支持深度定制和协议封装
- **Masque 模式**：基于 WARP 的 Masque 隧道，集成 Cloudflare 优选 IP
- **Server 模式**：服务端转发模式，支持在 CF Workers 或 VPS 上部署私有节点

#### 灵活策略引擎
- **TLS-RF (TLS 分片)**：通过分片技术规避针对 SNI 的精准阻断，可实用性用于部分网站
- **QUIC 重建**：利用 quic-go 的混淆特性和自带分片特性绕过常规 SNI 检测
- **ECH 注入**：自动获取并注入 echconfig，实现加密客户端问候，与 Cloudflare 解耦，后续可接入其它网站的 ECH 支持
- **智能分流**：基于 GFWList 自动识别被屏蔽域名，大多数规则外网站无需手动配置即可连接
- **完整 DoH 解析**：支持指定 IPv4/IPv6，提升 DNS 解析安全性

#### 优选 IP 与 WARP 集成
- **Cloudflare 优选 IP 池**：自动优选最佳 Cloudflare IP，提升访问速度
- **WARP Masque 隧道**：集成 Cloudflare WARP 技术，让部分网站如 ChatGPT 恢复访问
- **智能路由**：根据网络状况自动选择最优路径，部分 Server 规则可与 WARP 互换

#### TUN 模式支持（v1.25 新增）
- **系统级代理**：接管所有系统流量，无需单独配置应用
- **透明代理**：对应用程序完全透明，无需修改任何设置
- **全局覆盖**：支持所有网络协议的代理转发

#### 安全增强
- **外挂证书验证**：提升域前置的安全性（取决于具体配置，有灵活取舍）
- **ECDSA 证书**：支持现代椭圆曲线数字签名算法
- **MITM 模式优化**：修复 HTTP 网页问题，增加自动跳转 HTTPS
- **Google 系优化**：修复原先 Google 系网站的混乱配置，同时支持 Google、YouTube 和 Gemini

#### 图形化界面
- **现代化 UI**：基于 Wails v3 + Vue.js 构建的跨平台桌面应用
- **黑暗模式**：完整的深色主题支持，UI 细节优化
- **规则面板**：可视化的规则管理界面，快速配置规则
- **实时日志**：实时显示代理运行状态和日志信息
- **证书管理**：一键安装/重新安装系统证书
- **开机启动**：支持 Windows 开机自启动选项

### 使用场景
- **开发者**：安全访问境外开发资源和技术文档
- **研究人员**：获取国际学术资源和研究资料
- **普通用户**：稳定的日常网络访问需求，ChatGPT、Google 等服务恢复访问
- **高级用户**：自定义规则和部署私有 Server 节点，灵活配置 ECH 和域前置：稳定的日常网络访问需求
- **高级用户**：自定义规则和部署私有 Server 节点

## 技术架构

### 技术栈
| 技术组件 | 版本/说明 | 用途 |
|----------|-----------|------|
| 编程语言 | Go 1.24+ | 核心代理逻辑实现 |
| UI 框架 | Wails v3 | 跨平台桌面应用框架 |
| 前端框架 | Vue.js | 现代化 Web 界面 |
| TLS 库 | utls | 自定义 TLS 指纹 |
| QUIC 库 | quic-go | QUIC 协议实现 |
| 代理核心 | 自研 | 多模式代理引擎 |
| 系统代理 | sysproxy | Windows 系统代理设置 |
| 证书管理 | mkcert | 本地 CA 证书生成 |

### 分层架构
```
┌─────────────────────────────────────────────┐
│          Frontend (Vue.js + Wails)           │
│  Dashboard, Rules, Settings, Logs Pages      │
├─────────────────────────────────────────────┤
│          Wails Runtime Bridge                │
│  Go <-> JavaScript 双向通信                   │
├─────────────────────────────────────────────┤
│         Core Proxy Engine (Go)               │
│  app.go, core_runtime.go, core_client.go     │
│  external_mihomo.go, core_api.go             │
├─────────────────────────────────────────────┤
│        Protocol Implementations              │
│  TLS-RF, QUIC, ECH, Masque, Server Mode      │
├─────────────────────────────────────────────┤
│         System Integration                   │
│  sysproxy, autostart, certificate management │
└─────────────────────────────────────────────┘
```

### 核心模块说明

#### 1. 代理核心 (app.go - 46.6KB)
主应用程序逻辑，包含：
- 六种代理模式的实现
- 规则引擎和路由决策
- 配置管理和持久化
- 生命周期管理

#### 2. 运行时管理 (core_runtime.go - 12KB)
负责代理实例的运行时控制：
- 启动/停止代理
- 状态监控
- 资源管理
- 错误处理

#### 3. 客户端实现 (core_client.go - 8KB)
代理客户端的核心逻辑：
- 连接建立和维护
- 数据传输
- 协议协商
- 流量整形

#### 4. API 接口 (core_api.go - 5.4KB)
提供外部调用接口：
- Wails 绑定方法
- 前端交互 API
- 状态查询接口

#### 5. 外部集成 (external_mihomo.go - 9.2KB)
与 Mihomo 核心的集成：
- 规则导入
- 配置转换
- 兼容性适配

### 开发环境
- **Go**: 1.25+
- **Node.js**: 24+
- **npm**: 11+
- **Wails CLI**: v3
- **IDE**: VS Code / GoLand

## 系统要求

### 最低配置
| 项目 | 要求 |
|------|------|
| 操作系统 | Windows 10/11 (x64) |
| 处理器 | x64 架构 |
| 内存 | 2GB RAM |
| 存储空间 | 100MB |

### 推荐配置
| 项目 | 要求 |
|------|------|
| 操作系统 | Windows 11 24H2+ |
| 处理器 | Intel Core i5 或更高 |
| 内存 | 4GB RAM 或更高 |
| 存储空间 | 200MB |

## 快速开始

### 下载安装
1. **下载最新版本**：访问 [GitHub Releases](https://github.com/coolapijust/snishaper/releases)
2. **解压运行**：解压后双击 `snishaper.exe` 启动

### 初始配置
1. **安装证书**：
   - 打开应用主界面
   - 点击「证书管理」
   - 点击「**点击重新安装证书**」
   - 确认系统提示完成安装

2. **配置规则**：
   - 软件内置丰富的官方规则
   - 可在「规则面板」中查看和自定义
   - 根据实际需求调整规则

3. **启动代理**：
   - 选择合适的代理模式
   - 点击「**启动代理**」按钮
   - 观察日志确认运行状态

### 常用操作
- **切换模式**：在模式选择器中选择不同代理模式
- **查看日志**：实时查看代理运行日志
- **管理规则**：添加、编辑、删除自定义规则
- **证书管理**：重新安装或卸载证书

## 构建与开发

### 克隆仓库
```powershell
git clone https://github.com/coolapijust/snishaper.git
cd snishaper
```

### 安装依赖
```powershell
# 安装前端依赖
cd frontend
npm install

# 构建前端静态资源
npm run build
cd ..
```

### 编译项目
```powershell
# 方式一：使用构建脚本（推荐）
powershell -ExecutionPolicy Bypass -File .\scripts\build_windows.ps1

# 方式二：手动编译 Go 主程序
go build -ldflags="-s -w" -o "build/bin/snishaper.exe"
```

### 开发调试
```powershell
# 开发模式运行（热重载）
wails dev
```

### 构建产物
- **前端资源**：`frontend/dist`
- **可执行文件**：`build/bin/snishaper.exe`
- **完整包**：`build/bin/` 目录

## 开源地址

### 代码仓库
- **GitHub**: [https://github.com/jhonsmithsamsmith/SniShaper](https://github.com/jhonsmithsamsmith/SniShaper)

### 项目资源
- **问题反馈**: [GitHub Issues](https://github.com/jhonsmithsamsmith/SniShaper/issues)
- **功能建议**: [GitHub Discussions](https://github.com/jhonsmithsamsmith/SniShaper/discussions)
- **详细文档**: [GitHub Wiki](https://github.com/coolapijust/snishaper/wiki)

### Wiki 文档
- **[核心模式介绍](https://github.com/coolapijust/snishaper/wiki/Core-Proxy-Modes)**：了解 TLS-RF、QUIC 与 Server 模式的运行原理
- **[规则自定义指南](https://github.com/coolapijust/snishaper/wiki/Custom-Rules-Guide)**：学习如何开发针对性的规则
- **[界面配置实操](https://github.com/coolapijust/snishaper/wiki/GUI-Configuration)**：GUI 快速配置规则教程
- **[服务端部署](https://github.com/coolapijust/snishaper/wiki/Server-Deployment)**：在 CF Workers 或 VPS 上架设 Server 节点
- **[常见问题排除](https://github.com/coolapijust/snishaper/wiki/FAQ)**：解决证书警告、规则不生效等问题

## 更新记录

### v1.25 (最新发行版)
- **TUN 模式支持**：系统级代理，接管所有流量
- **网站适配增强**：增加一批网站适配规则
- **架构优化**：前后端进一步分离，提升可维护性
- **性能优化**：核心代理引擎性能提升

### v1.2.4-stable
- **黑暗模式 UI 修复**：完善深色主题显示细节
- **配置分离**：规则配置和用户配置脱离，请重新调整设置
- **开机启动选项**：新增 Windows 开机自启动功能
- **稳定性提升**：修复部分已知问题，提示整体稳定性

### v1.2.2
- **QUIC 直连支持**：增加实验性的 QUIC 直连功能，基于 quic-go 自带分片特性
- **完整 DoH 解析**：支持指定 IPv4/IPv6，提升 DNS 解析安全性
- **协议优化**：QUIC 协议栈进一步优化

### v1.2.1
- **外挂证书验证**：增加外挂证书验证逻辑，提升域前置的安全性（取决于具体配置，有灵活取舍）
- **规则完善**：完善部分网站规则，提升兼容性
- **安全增强**：证书验证机制升级

### v1.1.x-final
这是 SniShaper 迄今为止最稳定、最强大的版本。

**核心改进：**
- **MITM 模式修复**：修复了 MITM 模式 HTTP 网页的问题，增加自动跳转 HTTPS
- **TLS 分片模式**：引入了 TLS 分片模式，可实用性用于部分网站
- **Google 系优化**：修复了原先 Google 系网站的混乱配置，同时支持 Google、YouTube 和 Gemini
- **WARP 集成**：引入了 WARP 作为可选分流，让部分网站如 ChatGPT 恢复访问。部分 Server 规则可与 WARP 互换
- **UI 优化**：优化了部分页面 UI 显示，提升用户体验
- **ECH 解耦**：ECH 逻辑与 Cloudflare 解耦，后续可接入其它网站的 ECH 支持

### v1.1.1
- **文档更新**：Update VPS deployment instructions
- **部署指南**：完善服务端部署说明

### v1.1
- **基础性修复**：修复已知问题和稳定性改进
- **规则优化**：优化代理规则，提升兼容性

### v1.0
- **Cloudflare ECH**：实现 Cloudflare ECH 支持
- **并行拨号**：引入 parallel dial 技术
- **ECDSA 证书**：支持 ECDSA 证书生成和管理
- **UI 重构**：用户界面全面重构，现代化设计

## 下载地址

### 最新版本 (v1.25)
- **官方下载**: [点击下载 SniShaper-win-amd64.7z](https://files.zohopublic.com.cn/public/workdrive-public/download/kki5t6579775a6e7b4fdaa6a78c03ae307158?x-cli-msg=%7B%22linkId%22%3A%221GumWstoV3X-35NGn%22%2C%22isFileOwner%22%3Afalse%2C%22version%22%3A%221.0%22%2C%22isWDSupport%22%3Afalse%7D)
  - 文件大小：21.2 MB
  - SHA256: `f7f0f74e588196e37d24e4c827408274fe55785981396d7d1f8714bd4f3ed17b`
  - 发布时间：1 周前
- **源代码 (zip)**: [GitHub Releases](https://github.com/jhonsmithsamsmith/SniShaper/releases)
- **源代码 (tar.gz)**: [GitHub Releases](https://github.com/jhonsmithsamsmith/SniShaper/releases)

### 历史版本
- **v1.2.4-stable** (3 周前)
- **v1.2.2** (4 周前)
- **v1.2.1** (4 周前)
- **v1.1.x-final** (1 个月前)
- **v1.1.1** (1 个月前)
- **v1.1** (1 个月前)
- **v1.0** (2 个月前)

所有版本请访问：[GitHub Releases](https://github.com/jhonsmithsamsmith/SniShaper/releases)

## 致谢与声明

### 官方网站
- **官方网站**: [https://jetcpp.ccwu.cc/](https://jetcpp.ccwu.cc/)

### 合作者与贡献者
- **合作者 & 网页开发者**: JetCPP
- **社区维护者**: jhonsmithsamsmith

### 重要声明
> **原作者因某群体的无下限污蔑、信息曝光和圈层共振，已退出开发工作。仓库已移交给一位社区开发者继续维护。**

本项目受益于以下优秀开源项目的启发：

- [SNIBypassGUI](https://github.com/racpast/SNIBypassGUI/)
- [DoH-ECH-Demo](https://github.com/0xCaner/DoH-ECH-Demo)
- [lumine](https://github.com/moi-si/lumine)
- [usque](https://github.com/Diniboy1123/usque)

## 许可证

[MIT License](LICENSE) - 版权所有 (c) 2026 SniShaper 社区

---

*让网络连接更稳定、更安全！*

**官方网站**: [https://jetcpp.ccwu.cc/](https://jetcpp.ccwu.cc/) | **合作者 & 网页开发者**: JetCPP
