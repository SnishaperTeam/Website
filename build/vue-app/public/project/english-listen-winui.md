# English Listen WinUI - 现代化英语听写训练工具

从 Qt6 全面迁移至 **WinUI 3**，用 Windows 11 原生体验重新定义英语听写训练。

## 项目介绍

### 项目概述
English Listen WinUI 是 English Listen 的全新架构版本，从 Qt6/C++ 迁移至 WinUI 3 框架，采用现代化的 Windows 原生界面设计。项目采用 **C# + C++ 混合开发**架构——C# (WinUI 3) 负责现代化的用户界面，C++ NativeBackend 负责性能敏感的听写逻辑，通过 P/Invoke 互操作无缝衔接。当前版本 v2.7.0。

### 与 Qt6 版本的核心区别
| 特性 | Qt6 版本 | WinUI 3 版本 |
|------|----------|--------------|
| UI 框架 | Qt6 Widgets | WinUI 3 (Windows App SDK) |
| 开发语言 | C++17 | C# 13 + C++ Native |
| 架构模式 | 简单 MVC | 完整 MVVM |
| 视觉风格 | 跨平台风格 | Windows 11 原生 Mica 材质 |
| 翻译服务 | 无 | 百度翻译 API 集成 |
| 自动更新 | 手动 | 应用内自动更新 |
| 语音引擎 | SAPI + Flite | Windows SAPI / Windows TTS |

### 核心功能

#### 智能词库管理
- **灵活编辑**：随心添加/删除单词，支持批量操作
- **文件管理**：支持 TXT、CSV 多格式导入导出，多级分类管理
- **智能保存**：自动保存学习记录，实时同步临时词库
- **分组管理**：支持创建、编辑、删除词库分组，拖拽式管理
- **搜索筛选**：快速搜索单词，按首字母、数字等条件筛选
- **批量翻译**：集成百度翻译 API，一键翻译整个词库

#### 个性化训练控制
- **时间调节**：自由设定朗读间隔（1-60秒），倒计时显示
- **播放控制**：暂停/继续功能，随时掌控训练节奏
- **快速导航**：上一词/下一词快速切换
- **重复播放**：强化记忆效果，空格键快捷重复
- **随机顺序**：支持随机播放模式，增加挑战性
- **翻译显示**：听写时可同时显示中文翻译

#### 智能听写模式
- **在线模式**：边听边在输入框中输入，系统实时判断正误，支持 Enter 提交
- **纸笔模式**：在纸上记录，最后手动输入正确数量
- **Levenshtein 算法**：智能拼写检查，提供相似单词建议

#### 学习进度追踪
- **四大统计卡片**：总测试次数、平均正确率、总学习单词数、连续学习天数
- **正确率趋势图**：Canvas 绘制的折线图
- **测试历史列表**：每条记录显示词库名、时间、正确数/总数、正确率
- **导出 CSV** 和清空记录功能

#### 视觉体验
- **Mica 背景材质**：Windows 11 原生透明效果
- **主题切换**：跟随系统 / 浅色 / 深色三档
- **NavigationView**：左侧侧边栏导航，现代 Windows 应用风格
- **响应式布局**：适配各种屏幕尺寸

### 使用场景
- **学生**：课后英语听写练习，多用户系统支持独立学习数据
- **教师**：课堂听写测试工具，纸笔/在线双模式
- **自学者**：可视化图表追踪学习进度，连续学习天数统计
- **培训机构**：多用户管理，每个用户数据独立隔离

## 技术架构

### 技术栈
| 技术组件 | 版本/说明 | 用途 |
|----------|-----------|------|
| UI 框架 | WinUI 3 | Windows 原生界面框架 |
| 前端语言 | C# 13 | ViewModel、Services、Models |
| 后端引擎 | C++ Native | 听写逻辑、定时器、语音控制 |
| 运行时 | .NET 8.0 | 跨平台运行时 |
| Windows App SDK | 1.8+ | Windows 应用开发 SDK |
| 语音合成 | Windows SAPI / System.Speech | 系统语音引擎 |
| 翻译服务 | 百度翻译 API | HTTP 调用，带缓存和限额 |
| 数据序列化 | Newtonsoft.Json | JSON 序列化/反序列化 |
| 应用打包 | MSIX | Windows 应用打包 |
| 架构模式 | MVVM | Model-View-ViewModel |

### 分层架构
```
┌─────────────────────────────────────────────┐
│              Views (XAML Pages)              │
│  HomePage, WordsPage, DictationTestPage,     │
│  ProgressPage, SettingsPage, UserPage, etc.   │
├─────────────────────────────────────────────┤
│            ViewModels (C#)                   │
│  MainViewModel, ModernDictationViewModel,    │
│  ViewModelBase, RelayCommand                  │
├─────────────────────────────────────────────┤
│             Services (C#)                     │
│  SpeechService, ModernDictationService,      │
│  SettingsService, BaiduTranslateService,     │
│  UpdateService, ChartService, PasswordService│
├─────────────────────────────────────────────┤
│          Native Backend (C++)                │
│  DictationBackend, NativeDictationExports,   │
│  QT6DictationBackend, TestBackend            │
├─────────────────────────────────────────────┤
│             Models (C#)                      │
│  Word, WordList, WordListGroup,              │
│  UserData, TestResult, AppSettings, VoiceInfo│
└─────────────────────────────────────────────┘
```

### C# 与 C++ 互操作
C++ NativeBackend 通过 C API (`extern "C"`) 导出，C# 端通过 `NativeMethods.cs` 进行 P/Invoke 调用。C++ 端实现了完整的 `DictationBackend` 类，包含词表管理、定时器、语音控制、回调机制等。

### 开发环境
- **IDE**：Visual Studio 2026
- **工作负载**：C++ 桌面开发 + .NET 桌面开发
- **Windows SDK**：10.0.26100 或更高版本
- **CMake**：3.16+（编译 Native Backend）
- **.NET SDK**：10.0

## 系统要求

### 最低配置
| 项目 | 要求 |
|------|------|
| 操作系统 | Windows 10 版本 17763+ |
| 运行时 | .NET 8.0 / 10.0 Runtime |
| 处理器 | x64 / ARM64 / x86 |
| 内存 | 2GB RAM |
| 存储空间 | 100MB |

### 推荐配置
| 项目 | 要求 |
|------|------|
| 操作系统 | Windows 11 24H2+ |
| 处理器 | Intel Core i5 或更高 |
| 内存 | 4GB RAM 或更高 |
| 存储空间 | 100MB |

## 快速开始

1. **启动程序**：双击桌面快捷方式或从开始菜单启动
2. **添加单词**：通过侧边栏导航到"查看单词"页面，添加或导入词库
3. **选择单词**：在单词列表中勾选要听写的单词
4. **开始测试**：点击"开始听写"，选择听写模式（纸笔/在线）
5. **查看结果**：测试结束后查看答案和统计信息
6. **追踪进度**：登录后可在"学习进度"页面查看详细的学习数据

### 快捷键
| 快捷键 | 功能 |
|--------|------|
| 空格键 | 重复朗读当前单词 |
| 左方向键 | 返回上一个单词 |
| 右方向键 | 跳转到下一个单词 |
| ESC 键 | 暂停/继续测试 |
| Enter 键 | 确认输入 |

## 开源地址

### 代码仓库
- **GitHub**: [https://github.com/dongzheyu/English-Listen-WinUI](https://github.com/dongzheyu/English-Listen-WinUI)
- **Gitee**: [https://gitee.com/jetcpp/English-Listen-WinUI](https://gitee.com/jetcpp/English-Listen-WinUI)

### 项目信息
- **问题反馈**: [GitHub Issues](https://github.com/dongzheyu/English-Listen-WinUI/issues)
- **功能建议**: [GitHub Discussions](https://github.com/dongzheyu/English-Listen-WinUI/discussions)
## 下载地址
- **MicrosoftStore本地**:[ms-windows-store://pdp/?productid=9PLK90CNTJBG](ms-windows-store://pdp/?productid=9PLK90CNTJBG)
- **MicrosoftStore网页**:[https://apps.microsoft.com/detail/9PLK90CNTJBG](https://apps.microsoft.com/detail/9PLK90CNTJBG)
## 更新记录

### v2.7.0 (WinUI3 版本)
- 基于 WinUI 3 框架完全重构界面
- NavigationView 侧边栏导航
- Windows 11 24H2+ 高质量语音支持
- 智能语音引擎（Windows SAPI / Windows TTS）
- 语音试听功能，支持英文/中文语音分别选择
- 应用内自动更新系统
- 完整 MVVM 架构（ViewModelBase + RelayCommand）
- C# + C++ 混合语言开发（NativeBackend）
- 深色/浅色/跟随系统三档主题
- 用户账户系统（登录/注册/多用户管理）
- 词库管理（添加、删除、导入、导出、分组）
- 学习进度统计（正确率趋势图、历史记录）
- 百度翻译 API 集成（带缓存和每日限额管理）
- Levenshtein 编辑距离智能拼写检查
- 快捷键支持

### 许可证
MIT 许可证 - 版权所有 (c) 2026 SnishaperTeam

---

*让英语学习变得更简单、更高效！*
