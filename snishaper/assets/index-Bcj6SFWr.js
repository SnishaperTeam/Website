(function(){const i=document.createElement("link").relList;if(i&&i.supports&&i.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))a(s);new MutationObserver(s=>{for(const e of s)if(e.type==="childList")for(const n of e.addedNodes)n.tagName==="LINK"&&n.rel==="modulepreload"&&a(n)}).observe(document,{childList:!0,subtree:!0});function l(s){const e={};return s.integrity&&(e.integrity=s.integrity),s.referrerPolicy&&(e.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?e.credentials="include":s.crossOrigin==="anonymous"?e.credentials="omit":e.credentials="same-origin",e}function a(s){if(s.ep)return;s.ep=!0;const e=l(s);fetch(s.href,e)}})();function r(){const t=document.getElementById("app");if(!t){console.error("App element not found");return}t.innerHTML=`
    <div class="noise-bg min-h-screen">
      <!-- Navigation -->
      <nav class="fixed top-0 left-0 right-0 z-50 px-6 py-4 md:px-12">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <img src="/logo.png" alt="SniShaper" class="w-10 h-10" />
            <span class="text-lg font-semibold tracking-tight">SniShaper</span>
          </div>
          <div class="hidden md:flex items-center gap-8 text-sm text-snip-muted">
            <a href="#features" class="hover:text-snip-orange transition-colors">功能特性</a>
            <a href="#tech" class="hover:text-snip-orange transition-colors">核心技术</a>
            <a href="#faq" class="hover:text-snip-orange transition-colors">常见问题</a>
            <a href="#download" class="hover:text-snip-orange transition-colors">下载</a>
          </div>
          
          <!-- Mobile menu button -->
          <button id="mobile-menu-btn" class="md:hidden p-2 text-snip-muted hover:text-snip-orange transition-colors">
            <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </nav>

      <!-- Hero Section -->
      <section class="relative min-h-screen flex items-center pt-24 pb-16 px-6 md:px-12 overflow-hidden">
        <!-- Decorative elements -->
        <div class="absolute top-32 right-12 w-64 h-64 bg-snip-orange/5 rounded-full blur-3xl"></div>
        <div class="absolute bottom-32 left-1/4 w-96 h-96 bg-snip-orange/3 rounded-full blur-3xl"></div>
        
        <div class="max-w-7xl mx-auto w-full">
          <div class="grid lg:grid-cols-12 gap-12 items-center">
            <!-- Left content - asymmetric -->
            <div class="lg:col-span-7 space-y-8">
              <div class="inline-flex items-center gap-2 px-3 py-1.5 bg-snip-gray rounded-full text-xs text-snip-muted border border-snip-gray-light">
                <span class="w-2 h-2 bg-snip-orange rounded-full animate-pulse"></span>
                <span class="font-mono">v1.25 Windows 原生应用</span>
              </div>
              
              <h1 class="text-5xl md:text-7xl font-bold leading-[0.95] tracking-tight">
                <span class="block">Sni</span>
                <span class="block text-gradient">Shaper</span>
              </h1>
              
              <p class="text-lg md:text-xl text-snip-muted max-w-xl leading-relaxed">
                专为复杂网络环境设计的本地代理工具。TLS 分片、QUIC 重建、ECH 注入 — 让你的流量在封锁网络中持续可用。
              </p>
              
              <div class="flex flex-wrap gap-4">
                <a href="#download" class="group relative px-6 py-3 bg-snip-orange text-white font-medium rounded-lg overflow-hidden transition-all hover:scale-105 glow-orange">
                  <span class="relative z-10">立即下载</span>
                </a>
                <a href="#tech" class="px-6 py-3 border border-snip-gray-light rounded-lg text-snip-text hover:border-snip-orange transition-colors">
                  了解技术原理
                </a>
              </div>
            </div>
            
            <!-- Right visual - UI Preview -->
            <div class="lg:col-span-5 relative">
              <div class="relative w-full max-w-md ml-auto">
                <!-- UI Window mockup -->
                <div class="code-block overflow-hidden" style="transform: rotate(-1deg)">
                  <!-- Title bar -->
                  <div class="flex items-center gap-2 px-4 py-3 bg-snip-gray-light border-b border-snip-gray">
                    <span class="w-3 h-3 rounded-full bg-red-500/80"></span>
                    <span class="w-3 h-3 rounded-full bg-yellow-500/80"></span>
                    <span class="w-3 h-3 rounded-full bg-green-500/80"></span>
                    <span class="ml-4 text-xs text-snip-muted font-mono">SniShaper v1.25</span>
                  </div>
                  <!-- UI Content -->
                  <div class="p-4 space-y-3">
                    <!-- Status indicator -->
                    <div class="flex items-center justify-between px-3 py-2 bg-snip-dark rounded-lg">
                      <span class="text-sm">代理状态</span>
                      <span class="flex items-center gap-2 text-snip-orange">
                        <span class="w-2 h-2 bg-snip-orange rounded-full animate-pulse"></span>
                        运行中
                      </span>
                    </div>
                    <!-- Mode selector -->
                    <div class="flex gap-2">
                      <div class="flex-1 px-3 py-2 bg-snip-orange/20 border border-snip-orange rounded-lg text-center text-xs">
                        TLS-RF
                      </div>
                      <div class="flex-1 px-3 py-2 bg-snip-dark rounded-lg text-center text-xs text-snip-muted">
                        QUIC
                      </div>
                      <div class="flex-1 px-3 py-2 bg-snip-dark rounded-lg text-center text-xs text-snip-muted">
                        ECH
                      </div>
                    </div>
                    <!-- Stats -->
                    <div class="grid grid-cols-2 gap-2">
                      <div class="px-3 py-2 bg-snip-dark rounded-lg">
                        <div class="text-xs text-snip-muted">上行</div>
                        <div class="text-sm font-mono text-green-400">↑ 12.5 MB/s</div>
                      </div>
                      <div class="px-3 py-2 bg-snip-dark rounded-lg">
                        <div class="text-xs text-snip-muted">下行</div>
                        <div class="text-sm font-mono text-snip-orange">↓ 45.2 MB/s</div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <!-- Floating badges -->
                <div class="absolute -top-4 -right-4 px-3 py-1.5 bg-snip-gray rounded-lg text-xs font-mono border border-snip-gray-light" style="transform: rotate(6deg)">
                  Wails v3
                </div>
                <div class="absolute -bottom-2 -left-6 px-3 py-1.5 bg-snip-gray rounded-lg text-xs font-mono border border-snip-gray-light" style="transform: rotate(-8deg)">
                  图形界面
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Advantages Section -->
      <section class="relative py-24 px-6 md:px-12 bg-snip-gray">
        <div class="absolute inset-0 opacity-5">
          <div class="absolute top-0 left-1/4 w-px h-full bg-snip-orange"></div>
          <div class="absolute top-0 right-1/3 w-px h-full bg-snip-orange"></div>
        </div>
        
        <div class="max-w-7xl mx-auto relative">
          <div class="grid lg:grid-cols-12 gap-12">
            <div class="lg:col-span-4">
              <h2 class="text-3xl md:text-4xl font-bold mb-4">
                为什么选择<span class="text-gradient"> SniShaper</span>
              </h2>
              <p class="text-snip-muted">
                专为 Windows 原生打造，无需额外运行环境，开箱即用。
              </p>
            </div>
            
            <div class="lg:col-span-8 space-y-6">
              <div class="asym-card bg-snip-dark p-6 rounded-xl border border-snip-gray-light">
                <div class="flex items-start gap-4">
                  <div class="w-10 h-10 bg-snip-orange/10 rounded-lg flex items-center justify-center shrink-0">
                    <svg class="w-5 h-5 text-snip-orange" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <div>
                    <h3 class="font-semibold mb-1">无需外部代理节点</h3>
                    <p class="text-snip-muted text-sm">直接利用 Cloudflare 全球 CDN 网络作为出口，无节点订阅费用，无中转服务器运维负担。</p>
                  </div>
                </div>
              </div>
              
              <div class="asym-card-2 bg-snip-dark p-6 rounded-xl border border-snip-gray-light ml-8">
                <div class="flex items-start gap-4">
                  <div class="w-10 h-10 bg-snip-orange/10 rounded-lg flex items-center justify-center shrink-0">
                    <svg class="w-5 h-5 text-snip-orange" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <div>
                    <h3 class="font-semibold mb-1">多协议协同，覆盖面广</h3>
                    <p class="text-snip-muted text-sm">TLS-RF、ECH、QUIC、WARP 四种模式灵活切换，绑定不同策略应对不同封锁场景，兼容性极强。</p>
                  </div>
                </div>
              </div>
              
              <div class="asym-card bg-snip-dark p-6 rounded-xl border border-snip-gray-light">
                <div class="flex items-start gap-4">
                  <div class="w-10 h-10 bg-snip-orange/10 rounded-lg flex items-center justify-center shrink-0">
                    <svg class="w-5 h-5 text-snip-orange" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 class="font-semibold mb-1">原生图形界面，真正易用</h3>
                    <p class="text-snip-muted text-sm">基于 Wails + React 构建的原生 Windows 应用，视觉清晰，操作直观，不再需要编辑配置文件。</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Tech Stack Section -->
      <section id="tech" class="relative py-24 px-6 md:px-12">
        <div class="max-w-7xl mx-auto">
          <div class="text-center mb-16">
            <h2 class="text-4xl md:text-5xl font-bold mb-4">
              三大核心<span class="text-gradient">技术</span>
            </h2>
            <p class="text-snip-muted max-w-2xl mx-auto">
              三层流量混淆技术协同工作，构筑高韧性抗封锁方案。
            </p>
          </div>
          
          <!-- Tech cards - asymmetric layout -->
          <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <!-- Card 1 -->
            <div class="group relative p-8 bg-snip-gray rounded-2xl border border-snip-gray-light hover:border-snip-orange/50 transition-all hover:-translate-y-1" style="transform: rotate(-0.5deg)">
              <div class="absolute top-4 right-4 text-xs font-mono text-snip-muted">01</div>
              <div class="w-12 h-12 bg-snip-orange/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-snip-orange/20 transition-colors">
                <svg class="w-6 h-6 text-snip-orange" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                </svg>
              </div>
              <h3 class="text-xl font-semibold mb-3">TLS-RF</h3>
              <p class="text-snip-muted text-sm mb-4">TLS 分片技术将 Client Hello 拆分为多个 TLS 记录分片传输。DPI 设备通常只检查第一个分片，真实 SNI 得以隐藏。</p>
              <div class="text-xs text-snip-orange font-mono">纯客户端实现 • 无需服务器配合</div>
            </div>
            
            <!-- Card 2 -->
            <div class="group relative p-8 bg-snip-gray rounded-2xl border border-snip-gray-light hover:border-snip-orange/50 transition-all hover:-translate-y-1 md:translate-y-8" style="transform: rotate(1deg)">
              <div class="absolute top-4 right-4 text-xs font-mono text-snip-muted">02</div>
              <div class="w-12 h-12 bg-snip-orange/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-snip-orange/20 transition-colors">
                <svg class="w-6 h-6 text-snip-orange" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 class="text-xl font-semibold mb-3">QUIC 重建</h3>
              <p class="text-snip-muted text-sm mb-4">基于 UDP 的 QUIC 协议天然规避 TCP 特征检测。我们在本地重建 QUIC 连接，将真实流量封装其中。</p>
              <div class="text-xs text-snip-orange font-mono">基于 quic-go 库 • UDP 传输</div>
            </div>
            
            <!-- Card 3 -->
            <div class="group relative p-8 bg-snip-gray rounded-2xl border border-snip-gray-light hover:border-snip-orange/50 transition-all hover:-translate-y-1 md:-translate-y-4" style="transform: rotate(-0.8deg)">
              <div class="absolute top-4 right-4 text-xs font-mono text-snip-muted">03</div>
              <div class="w-12 h-12 bg-snip-orange/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-snip-orange/20 transition-colors">
                <svg class="w-6 h-6 text-snip-orange" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 class="text-xl font-semibold mb-3">ECH 注入</h3>
              <p class="text-snip-muted text-sm mb-4">加密 Client Hello 将原本明文的部分加密，连 TLS 握手的第一步都无法被窥探。兼容 Cloudflare 等主流 ECH 基础设施。</p>
              <div class="text-xs text-snip-orange font-mono">TLS 1.3 标准 • ECH 协议</div>
            </div>
          </div>
          
          <!-- Additional modes -->
          <div class="mt-12 grid md:grid-cols-2 gap-6">
            <div class="p-6 bg-snip-dark rounded-xl border border-snip-gray-light flex items-start gap-4">
              <div class="w-8 h-8 bg-snip-muted/10 rounded-lg flex items-center justify-center shrink-0">
                <svg class="w-4 h-4 text-snip-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2" />
                </svg>
              </div>
              <div>
                <h4 class="font-medium mb-1">Server 中转模式</h4>
                <p class="text-snip-muted text-sm">在 Cloudflare Workers 或境外 VPS 部署自有中转服务器，极端封锁环境下的终极方案。</p>
              </div>
            </div>
            
            <div class="p-6 bg-snip-dark rounded-xl border border-snip-gray-light flex items-start gap-4">
              <div class="w-8 h-8 bg-snip-muted/10 rounded-lg flex items-center justify-center shrink-0">
                <svg class="w-4 h-4 text-snip-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </div>
              <div>
                <h4 class="font-medium mb-1">混合模式</h4>
                <p class="text-snip-muted text-sm">多种技术组合使用，例如 TLS-RF + Server 中转，最大化封锁环境下的可用性。</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Features Section -->
      <section id="features" class="relative py-24 px-6 md:px-12 bg-snip-gray">
        <div class="max-w-7xl mx-auto">
          <div class="text-center mb-16">
            <h2 class="text-4xl md:text-5xl font-bold mb-4">
              不只是<span class="text-gradient">代理工具</span>
            </h2>
            <p class="text-snip-muted max-w-2xl mx-auto">
              为复杂网络环境中的实际使用场景打造。
            </p>
          </div>
          
          <!-- Horizontal scroll features -->
          <div class="scroll-container pb-4 -mx-6 px-6" id="features-carousel">
            <!-- Feature 1 -->
            <div class="scroll-item w-80 p-6 bg-snip-dark rounded-xl border border-snip-gray-light">
              <div class="w-10 h-10 bg-snip-orange/10 rounded-xl flex items-center justify-center mb-4">
                <svg class="w-5 h-5 text-snip-orange" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 class="font-semibold mb-2">智能分流</h3>
              <p class="text-snip-muted text-sm">内置 GFWList 规则集，数万个被封锁域名开箱即通。</p>
            </div>
            
            <!-- Feature 2 -->
            <div class="scroll-item w-80 p-6 bg-snip-dark rounded-xl border border-snip-gray-light">
              <div class="w-10 h-10 bg-snip-orange/10 rounded-xl flex items-center justify-center mb-4">
                <svg class="w-5 h-5 text-snip-orange" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 class="font-semibold mb-2">CF 优选 IP</h3>
              <p class="text-snip-muted text-sm">自动从 Cloudflare 全球节点池中挑选延迟最低的节点。</p>
            </div>
            
            <!-- Feature 3 -->
            <div class="scroll-item w-80 p-6 bg-snip-dark rounded-xl border border-snip-gray-light">
              <div class="w-10 h-10 bg-snip-orange/10 rounded-xl flex items-center justify-center mb-4">
                <svg class="w-5 h-5 text-snip-orange" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 class="font-semibold mb-2">WARP Masque</h3>
              <p class="text-snip-muted text-sm">通过 WARP 隧道传输流量，Masque 协议提供额外保护。</p>
            </div>
            
            <!-- Feature 4 -->
            <div class="scroll-item w-80 p-6 bg-snip-dark rounded-xl border border-snip-gray-light">
              <div class="w-10 h-10 bg-snip-orange/10 rounded-xl flex items-center justify-center mb-4">
                <svg class="w-5 h-5 text-snip-orange" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 class="font-semibold mb-2">TUN 模式</h3>
              <p class="text-snip-muted text-sm">虚拟网卡实现全局流量代理，所有应用无需配置即可使用。</p>
            </div>
            
            <!-- Feature 5 -->
            <div class="scroll-item w-80 p-6 bg-snip-dark rounded-xl border border-snip-gray-light">
              <div class="w-10 h-10 bg-snip-orange/10 rounded-xl flex items-center justify-center mb-4">
                <svg class="w-5 h-5 text-snip-orange" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
              </div>
              <h3 class="font-semibold mb-2">JSON 规则</h3>
              <p class="text-snip-muted text-sm">支持域名、IP CIDR、策略组，编辑 JSON 即时生效，无需重启。</p>
            </div>
            
            <!-- Feature 6 -->
            <div class="scroll-item w-80 p-6 bg-snip-dark rounded-xl border border-snip-gray-light">
              <div class="w-10 h-10 bg-snip-orange/10 rounded-xl flex items-center justify-center mb-4">
                <svg class="w-5 h-5 text-snip-orange" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 class="font-semibold mb-2">证书管理</h3>
              <p class="text-snip-muted text-sm">内置 MITM 代理 CA 证书安装向导，一键完成。</p>
            </div>
            
            <!-- Feature 7 -->
            <div class="scroll-item w-80 p-6 bg-snip-dark rounded-xl border border-snip-gray-light">
              <div class="w-10 h-10 bg-snip-orange/10 rounded-xl flex items-center justify-center mb-4">
                <svg class="w-5 h-5 text-snip-orange" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </div>
              <h3 class="font-semibold mb-2">延迟测试</h3>
              <p class="text-snip-muted text-sm">内置节点测速，智能选择最优路径。</p>
            </div>
            
            <!-- Feature 8 -->
            <div class="scroll-item w-80 p-6 bg-snip-dark rounded-xl border border-snip-gray-light">
              <div class="w-10 h-10 bg-snip-orange/10 rounded-xl flex items-center justify-center mb-4">
                <svg class="w-5 h-5 text-snip-orange" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6z" />
                </svg>
              </div>
              <h3 class="font-semibold mb-2">托盘运行</h3>
              <p class="text-snip-muted text-sm">最小化至系统托盘，后台静默运行，不占用任务栏。</p>
            </div>
          </div>
        </div>
      </section>

      <!-- FAQ Section -->
      <section id="faq" class="relative py-24 px-6 md:px-12">
        <div class="max-w-4xl mx-auto">
          <div class="text-center mb-16">
            <h2 class="text-4xl md:text-5xl font-bold mb-4">
              常见<span class="text-gradient">问题</span>
            </h2>
            <p class="text-snip-muted max-w-2xl mx-auto">
              使用 SniShaper 过程中的常见疑问解答
            </p>
          </div>
          
          <div class="space-y-4">
            <!-- FAQ Item 1 -->
            <details class="group bg-snip-dark rounded-xl border border-snip-gray-light overflow-hidden">
              <summary class="flex items-center justify-between p-6 cursor-pointer list-none">
                <span class="font-medium">为什么要安装根证书？</span>
                <svg class="w-5 h-5 text-snip-muted transition-transform group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <div class="px-6 pb-6 text-snip-muted text-sm leading-relaxed">
                SniShaper 通过 MITM（中间人代理）技术实现流量拦截和分析，以便对特定域名进行智能分流。MITM 代理需要安装自定义 CA 根证书来解密 HTTPS 流量。安装后，所有由 SniShaper 签发的证书都会被系统信任。
              </div>
            </details>
            
            <!-- FAQ Item 2 -->
            <details class="group bg-snip-dark rounded-xl border border-snip-gray-light overflow-hidden">
              <summary class="flex items-center justify-between p-6 cursor-pointer list-none">
                <span class="font-medium">TLS-RF 和 ECH 模式有什么区别？</span>
                <svg class="w-5 h-5 text-snip-muted transition-transform group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <div class="px-6 pb-6 text-snip-muted text-sm leading-relaxed">
                <strong class="text-snip-text">TLS-RF</strong>（TLS 分片）通过将 Client Hello 拆分为多个 TLS 记录分片传输，适用于大多数场景，无需服务器特殊配置。<br/><br/>
                <strong class="text-snip-text">ECH</strong>（加密 Client Hello）将原本明文的 TLS 扩展部分完全加密，安全性更高，但需要目标服务器支持 ECH（如 Cloudflare CDN）。
              </div>
            </details>
            
            <!-- FAQ Item 3 -->
            <details class="group bg-snip-dark rounded-xl border border-snip-gray-light overflow-hidden">
              <summary class="flex items-center justify-between p-6 cursor-pointer list-none">
                <span class="font-medium">如何选择合适的代理模式？</span>
                <svg class="w-5 h-5 text-snip-muted transition-transform group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <div class="px-6 pb-6 text-snip-muted text-sm leading-relaxed">
                <ul class="list-disc list-inside space-y-2">
                  <li><strong class="text-snip-text">TLS-RF</strong>：推荐作为默认选项，兼容性好</li>
                  <li><strong class="text-snip-text">ECH</strong>：最高防护级别，适合 Cloudflare 站点</li>
                  <li><strong class="text-snip-text">QUIC</strong>：基于 UDP，规避 TCP 特征检测</li>
                  <li><strong class="text-snip-text">Server</strong>：配合自建中转服务器使用</li>
                </ul>
              </div>
            </details>
            
            <!-- FAQ Item 4 -->
            <details class="group bg-snip-dark rounded-xl border border-snip-gray-light overflow-hidden">
              <summary class="flex items-center justify-between p-6 cursor-pointer list-none">
                <span class="font-medium">TUN 模式和系统代理有什么区别？</span>
                <svg class="w-5 h-5 text-snip-muted transition-transform group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <div class="px-6 pb-6 text-snip-muted text-sm leading-relaxed">
                <strong class="text-snip-text">系统代理</strong>只影响支持代理设置的应用程序（如浏览器），需要应用主动使用代理配置。<br/><br/>
                <strong class="text-snip-text">TUN 模式</strong>通过虚拟网卡接管全部流量，实现全局代理，无需应用程序额外配置。适合游戏、桌面应用等不支持代理协议的场景。
              </div>
            </details>
            
            <!-- FAQ Item 5 -->
            <details class="group bg-snip-dark rounded-xl border border-snip-gray-light overflow-hidden">
              <summary class="flex items-center justify-between p-6 cursor-pointer list-none">
                <span class="font-medium">Cloudflare 优选 IP 是什么原理？</span>
                <svg class="w-5 h-5 text-snip-muted transition-transform group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <div class="px-6 pb-6 text-snip-muted text-sm leading-relaxed">
                Cloudflare 拥有全球数百万个 IP 节点。通过 API 获取 IP 池后，SniShaper 会自动对每个 IP 进行延迟测试，挑选出延迟最低的节点使用。这可以显著提升访问速度和稳定性。
              </div>
            </details>
            
            <!-- FAQ Item 6 -->
            <details class="group bg-snip-dark rounded-xl border border-snip-gray-light overflow-hidden">
              <summary class="flex items-center justify-between p-6 cursor-pointer list-none">
                <span class="font-medium">SniShaper 是否开源免费？</span>
                <svg class="w-5 h-5 text-snip-muted transition-transform group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <div class="px-6 pb-6 text-snip-muted text-sm leading-relaxed">
                是的，SniShaper 采用 MIT 开源许可证，完全免费使用。源代码托管在 GitHub 上，接受社区贡献。你可以自由查看、修改和分发代码。
              </div>
            </details>
          </div>
        </div>
      </section>

      <!-- Quick Start Guide -->
      <section id="quickstart" class="relative py-24 px-6 md:px-12 bg-snip-gray">
        <div class="max-w-5xl mx-auto">
          <div class="text-center mb-16">
            <h2 class="text-4xl md:text-5xl font-bold mb-4">
              快速<span class="text-gradient">上手指南</span>
            </h2>
            <p class="text-snip-muted max-w-2xl mx-auto">
              三步开始使用 SniShaper
            </p>
          </div>
          
          <div class="grid md:grid-cols-3 gap-8">
            <!-- Step 1 -->
            <div class="relative p-8 bg-snip-dark rounded-2xl border border-snip-gray-light">
              <div class="absolute -top-4 left-6 w-10 h-10 bg-snip-orange rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-snip-orange/20">
                1
              </div>
              <h3 class="text-xl font-bold mb-4 mt-2">下载安装</h3>
              <p class="text-snip-muted text-sm mb-4">从 GitHub 下载最新版本的 SniShaper，解压后双击运行 snishaper.exe。</p>
              <div class="p-3 bg-snip-gray rounded-lg font-mono text-xs text-snip-muted">
                Windows 10/11 x64
              </div>
            </div>
            
            <!-- Step 2 -->
            <div class="relative p-8 bg-snip-dark rounded-2xl border border-snip-gray-light md:transform md:-translate-y-4">
              <div class="absolute -top-4 left-6 w-10 h-10 bg-snip-orange rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-snip-orange/20">
                2
              </div>
              <h3 class="text-xl font-bold mb-4 mt-2">安装证书</h3>
              <p class="text-snip-muted text-sm mb-4">首次运行后，进入证书管理页面，点击「安装根证书」，按系统提示完成安装。</p>
              <div class="p-3 bg-snip-gray rounded-lg text-xs space-y-1">
                <div class="flex items-center gap-2">
                  <span class="w-2 h-2 bg-green-400 rounded-full"></span>
                  <span class="text-snip-muted">Windows 安全提示确认</span>
                </div>
              </div>
            </div>
            
            <!-- Step 3 -->
            <div class="relative p-8 bg-snip-dark rounded-2xl border border-snip-gray-light">
              <div class="absolute -top-4 left-6 w-10 h-10 bg-snip-orange rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-snip-orange/20">
                3
              </div>
              <h3 class="text-xl font-bold mb-4 mt-2">启动代理</h3>
              <p class="text-snip-muted text-sm mb-4">选择合适的代理模式，点击「开启代理」。可选择开启系统代理或 TUN 模式。</p>
              <div class="flex gap-2">
                <span class="px-2 py-1 bg-snip-orange/20 text-snip-orange rounded text-xs">TLS-RF</span>
                <span class="px-2 py-1 bg-snip-gray rounded text-xs text-snip-muted">ECH</span>
                <span class="px-2 py-1 bg-snip-gray rounded text-xs text-snip-muted">QUIC</span>
              </div>
            </div>
          </div>
          
          <!-- Quick tips -->
          <div class="mt-12 p-6 bg-snip-dark rounded-2xl border border-snip-gray-light">
            <h4 class="font-semibold mb-4 flex items-center gap-2">
              <svg class="w-5 h-5 text-snip-orange" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              小贴士
            </h4>
            <div class="grid md:grid-cols-2 gap-4 text-sm text-snip-muted">
              <div class="flex items-start gap-3">
                <span class="text-snip-orange mt-1">-</span>
                <span>首次使用建议选择 <strong class="text-snip-text">TLS-RF</strong> 模式，兼容性最好</span>
              </div>
              <div class="flex items-start gap-3">
                <span class="text-snip-orange mt-1">-</span>
                <span>开启 <strong class="text-snip-text">系统代理</strong> 后浏览器即可使用，无需单独配置</span>
              </div>
              <div class="flex items-start gap-3">
                <span class="text-snip-orange mt-1">-</span>
                <span>游戏或桌面应用建议开启 <strong class="text-snip-text">TUN 模式</strong> 实现全局代理</span>
              </div>
              <div class="flex items-start gap-3">
                <span class="text-snip-orange mt-1">-</span>
                <span>勾选 <strong class="text-snip-text">开机自启</strong> 和 <strong class="text-snip-text">最小化到托盘</strong> 获得最佳体验</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Tech Stack Details -->
      <section class="relative py-24 px-6 md:px-12">
        <div class="max-w-7xl mx-auto">
          <div class="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 class="text-4xl font-bold mb-6">
                现代<span class="text-gradient">技术栈</span>
              </h2>
              <p class="text-snip-muted mb-8 leading-relaxed">
                Wails v3 带来原生 Windows 桌面体验。Go 后端处理核心逻辑 — TLS 混淆、QUIC 重建、规则匹配。React/TypeScript 前端提供响应式图形界面。
              </p>
              
              <div class="space-y-4">
                <div class="flex items-center gap-3">
                  <div class="w-8 h-8 bg-blue-500/10 rounded-lg flex items-center justify-center text-xs font-bold text-blue-400">Go</div>
                  <span class="text-sm">高性能代理核心</span>
                </div>
                <div class="flex items-center gap-3">
                  <div class="w-8 h-8 bg-cyan-500/10 rounded-lg flex items-center justify-center text-xs font-bold text-cyan-400">React</div>
                  <span class="text-sm">TypeScript + Vite 构建 UI</span>
                </div>
                <div class="flex items-center gap-3">
                  <div class="w-8 h-8 bg-snip-orange/10 rounded-lg flex items-center justify-center text-xs font-bold text-snip-orange">Wails</div>
                  <span class="text-sm">原生 Windows 桌面应用</span>
                </div>
                <div class="flex items-center gap-3">
                  <div class="w-8 h-8 bg-green-500/10 rounded-lg flex items-center justify-center text-xs font-bold text-green-400">MIT</div>
                  <span class="text-sm">开源免费</span>
                </div>
              </div>
            </div>
            
            <!-- Architecture diagram -->
            <div class="relative">
              <div class="code-block p-6">
                <div class="space-y-6 font-mono text-sm">
                  <div class="flex items-center gap-4">
                    <div class="w-24 text-snip-muted">本地应用</div>
                    <div class="flex-1 border-t border-dashed border-snip-gray-light"></div>
                    <div class="px-3 py-1 bg-snip-orange/20 text-snip-orange rounded text-xs">客户端</div>
                  </div>
                  
                  <div class="flex items-center gap-4">
                    <div class="w-24"></div>
                    <div class="flex-1 border-t border-dashed border-snip-muted/30"></div>
                  </div>
                  
                  <div class="flex items-center gap-4">
                    <div class="w-24 text-snip-muted">SniShaper</div>
                    <div class="px-3 py-1 bg-snip-gray-light rounded text-xs">TLS-RF / ECH / QUIC</div>
                  </div>
                  
                  <div class="flex items-center gap-4">
                    <div class="w-24"></div>
                    <div class="flex-1 border-t border-dashed border-snip-muted/30"></div>
                  </div>
                  
                  <div class="flex items-center gap-4">
                    <div class="w-24"></div>
                    <div class="px-3 py-1 bg-snip-gray-light rounded text-xs">Cloudflare / VPS</div>
                  </div>
                  
                  <div class="flex items-center gap-4">
                    <div class="w-24"></div>
                    <div class="flex-1 border-t border-dashed border-snip-muted/30"></div>
                  </div>
                  
                  <div class="flex items-center gap-4">
                    <div class="w-24 text-snip-muted">目标网站</div>
                    <div class="flex-1 border-t border-dashed border-snip-gray-light"></div>
                    <div class="px-3 py-1 bg-green-500/20 text-green-400 rounded text-xs">畅通</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Changelog Section -->
      <section id="changelog" class="relative py-24 px-6 md:px-12">
        <div class="max-w-4xl mx-auto">
          <div class="text-center mb-16">
            <h2 class="text-4xl md:text-5xl font-bold mb-4">
              版本<span class="text-gradient">更新日志</span>
            </h2>
            <p class="text-snip-muted max-w-2xl mx-auto">
              持续迭代，不断优化体验
            </p>
          </div>
          
          <div class="space-y-8">
            <!-- v1.25 latest -->
            <div class="relative pl-8 border-l-2 border-snip-orange/30">
              <div class="absolute -left-2 top-0 w-4 h-4 bg-snip-orange rounded-full"></div>
              <div class="space-y-3">
                <div class="flex items-center gap-3 flex-wrap">
                  <span class="px-3 py-1 bg-snip-orange text-white rounded-full text-sm font-bold">v1.25</span>
                  <span class="px-2 py-0.5 bg-snip-orange/20 text-snip-orange rounded text-xs font-medium">最新发行版</span>
                </div>
                <h3 class="text-lg font-bold">增加 TUN 模式支持</h3>
                <ul class="space-y-2 text-snip-muted text-sm">
                  <li class="flex items-start gap-2">
                    <span class="text-snip-orange shrink-0">-</span>
                    <span>增加 TUN 模式支持</span>
                  </li>
                  <li class="flex items-start gap-2">
                    <span class="text-snip-orange shrink-0">-</span>
                    <span>增加一批网站适配</span>
                  </li>
                  <li class="flex items-start gap-2">
                    <span class="text-snip-orange shrink-0">-</span>
                    <span>前后端进一步分离</span>
                  </li>
                </ul>
              </div>
            </div>

            <!-- v1.2.4-stable -->
            <div class="relative pl-8 border-l-2 border-snip-gray-light">
              <div class="absolute -left-2 top-0 w-4 h-4 bg-snip-gray-light rounded-full"></div>
              <div class="space-y-3">
                <div class="flex items-center gap-3">
                  <span class="px-3 py-1 bg-snip-gray text-snip-muted rounded-full text-sm font-bold">v1.2.4-stable</span>
                </div>
                <h3 class="text-lg font-bold">暗色模式 UI 修复 & 配置分离</h3>
                <ul class="space-y-2 text-snip-muted text-sm">
                  <li class="flex items-start gap-2">
                    <span class="text-snip-orange shrink-0">-</span>
                    <span>修复暗黑模式 UI 显示问题</span>
                  </li>
                  <li class="flex items-start gap-2">
                    <span class="text-snip-orange shrink-0">-</span>
                    <span>规则配置与用户配置解耦，需重新调整设置</span>
                  </li>
                  <li class="flex items-start gap-2">
                    <span class="text-snip-orange shrink-0">-</span>
                    <span>新增开机自启选项</span>
                  </li>
                  <li class="flex items-start gap-2">
                    <span class="text-snip-orange shrink-0">-</span>
                    <span>修复部分已知问题，提升稳定性</span>
                  </li>
                </ul>
              </div>
            </div>

            <!-- v1.2.2 -->
            <div class="relative pl-8 border-l-2 border-snip-gray-light">
              <div class="absolute -left-2 top-0 w-4 h-4 bg-snip-gray-light rounded-full"></div>
              <div class="space-y-3">
                <div class="flex items-center gap-3">
                  <span class="px-3 py-1 bg-snip-gray text-snip-muted rounded-full text-sm font-bold">v1.2.2</span>
                </div>
                <h3 class="text-lg font-bold">实验性 QUIC 直连 & 完整 DoH 支持</h3>
                <ul class="space-y-2 text-snip-muted text-sm">
                  <li class="flex items-start gap-2">
                    <span class="text-snip-orange shrink-0">-</span>
                    <span>增加实验性 QUIC 直连支持，基于 quic-go 自带分片特性</span>
                  </li>
                  <li class="flex items-start gap-2">
                    <span class="text-snip-orange shrink-0">-</span>
                    <span>完整 DoH 解析支持，可指定 IPv4 / IPv6</span>
                  </li>
                </ul>
              </div>
            </div>

            <!-- v1.2.1 -->
            <div class="relative pl-8 border-l-2 border-snip-gray-light">
              <div class="absolute -left-2 top-0 w-4 h-4 bg-snip-gray-light rounded-full"></div>
              <div class="space-y-3">
                <div class="flex items-center gap-3">
                  <span class="px-3 py-1 bg-snip-gray text-snip-muted rounded-full text-sm font-bold">v1.2.1</span>
                </div>
                <h3 class="text-lg font-bold">外挂证书验证 & 规则完善</h3>
                <ul class="space-y-2 text-snip-muted text-sm">
                  <li class="flex items-start gap-2">
                    <span class="text-snip-orange shrink-0">-</span>
                    <span>增加外挂证书验证逻辑，提升域前置的安全性</span>
                  </li>
                  <li class="flex items-start gap-2">
                    <span class="text-snip-orange shrink-0">-</span>
                    <span>完善部分规则</span>
                  </li>
                </ul>
              </div>
            </div>

            <!-- v1.1.x-final -->
            <div class="relative pl-8 border-l-2 border-snip-gray-light">
              <div class="absolute -left-2 top-0 w-4 h-4 bg-snip-gray-light rounded-full"></div>
              <div class="space-y-3">
                <div class="flex items-center gap-3">
                  <span class="px-3 py-1 bg-snip-gray text-snip-muted rounded-full text-sm font-bold">v1.1.x-final</span>
                </div>
                <h3 class="text-lg font-bold">里程碑版本：最稳定最强大</h3>
                <ul class="space-y-2 text-snip-muted text-sm">
                  <li class="flex items-start gap-2">
                    <span class="text-snip-orange shrink-0">-</span>
                    <span>修复 MITM 模式 HTTP 网页问题，增加自动跳转 HTTPS</span>
                  </li>
                  <li class="flex items-start gap-2">
                    <span class="text-snip-orange shrink-0">-</span>
                    <span>引入 TLS 分片模式，可实用性用于部分网站</span>
                  </li>
                  <li class="flex items-start gap-2">
                    <span class="text-snip-orange shrink-0">-</span>
                    <span>修复 Google 系配置，同时支持 Google、YouTube 和 Gemini</span>
                  </li>
                  <li class="flex items-start gap-2">
                    <span class="text-snip-orange shrink-0">-</span>
                    <span>引入 WARP 作为可选分流，部分网站如 ChatGPT 恢复访问</span>
                  </li>
                  <li class="flex items-start gap-2">
                    <span class="text-snip-orange shrink-0">-</span>
                    <span>ECH 逻辑与 Cloudflare 解耦，后续可接入其他网站 ECH 支持</span>
                  </li>
                  <li class="flex items-start gap-2">
                    <span class="text-snip-orange shrink-0">-</span>
                    <span>优化部分页面 UI 显示</span>
                  </li>
                </ul>
              </div>
            </div>

            <!-- v1.0 -->
            <div class="relative pl-8 border-l-2 border-snip-gray-light">
              <div class="absolute -left-2 top-0 w-4 h-4 bg-snip-gray-light rounded-full"></div>
              <div class="space-y-3">
                <div class="flex items-center gap-3">
                  <span class="px-3 py-1 bg-snip-gray text-snip-muted rounded-full text-sm font-bold">v1.0</span>
                </div>
                <h3 class="text-lg font-bold">首个正式版本</h3>
                <ul class="space-y-2 text-snip-muted text-sm">
                  <li class="flex items-start gap-2">
                    <span class="text-snip-orange shrink-0">-</span>
                    <span>实现 Cloudflare ECH、并行拨号、ECDSA 证书及 UI</span>
                  </li>
                </ul>
              </div>
            </div>
            
            <!-- View more -->
            <div class="text-center pt-4">
              <span class="text-snip-muted text-sm">更多版本见更新日志</span>
            </div>
          </div>
        </div>
      </section>

      <!-- CTA Section -->
      <section id="download" class="relative py-24 px-6 md:px-12 bg-snip-gray">
        <div class="max-w-4xl mx-auto text-center relative">
          <div class="absolute inset-0 bg-snip-orange/5 rounded-3xl blur-3xl"></div>
          
          <div class="relative">
            <h2 class="text-4xl md:text-5xl font-bold mb-6">
              准备<span class="text-gradient">掌控流量</span>了吗？
            </h2>
            <p class="text-snip-muted mb-10 max-w-xl mx-auto">
              下载 SniShaper Windows 版本。开源免费，无需注册。
            </p>
            
            <div class="flex flex-wrap justify-center gap-4 mb-8">
              <a href="https://files.zohopublic.com.cn/public/workdrive-public/download/kki5t6579775a6e7b4fdaa6a78c03ae307158?x-cli-msg=%7B%22linkId%22%3A%221GumWstoV3X-35NGn%22%2C%22isFileOwner%22%3Afalse%2C%22version%22%3A%221.0%22%2C%22isWDSupport%22%3Afalse%7D" class="group relative px-8 py-4 bg-snip-orange text-white font-semibold rounded-xl overflow-hidden transition-all hover:scale-105 glow-orange">
                <span class="relative z-10 flex items-center gap-2">
                  <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  下载 Windows x64 (v1.25)
                </span>
              </a>
            </div>
            
            <div class="flex items-center justify-center gap-6 text-sm text-snip-muted">
              <span class="flex items-center gap-2">
                <span class="w-2 h-2 bg-green-400 rounded-full"></span>
                Windows 10/11
              </span>
              <span>|</span>
              <span>图形界面</span>
              <span>|</span>
              <span>开源项目</span>
            </div>
          </div>
        </div>
      </section>

      <!-- Footer -->
      <footer class="relative py-16 px-6 md:px-12 border-t border-snip-gray-light">
        <div class="max-w-7xl mx-auto">
          <div class="grid md:grid-cols-4 gap-12 mb-12">
            <!-- Brand -->
            <div class="md:col-span-2">
              <div class="flex items-center gap-3 mb-4">
                <img src="/logo.png" alt="SniShaper" class="w-10 h-10" />
                <span class="font-bold text-lg">SniShaper</span>
              </div>
              <p class="text-snip-muted text-sm max-w-md leading-relaxed mb-4">
                一款专为复杂网络环境设计的本地代理工具。通过 TLS 分片、QUIC 重建、ECH 注入等技术，让你的流量在封锁网络中持续可用。
              </p>
              <div class="flex items-center gap-4">
                <span class="text-snip-muted text-sm">SniShaper</span>
              </div>
            </div>
            
            <!-- Resources -->
            <div>
              <h4 class="font-semibold mb-4">资源</h4>
              <ul class="space-y-3 text-sm text-snip-muted">
                <li><a href="#quickstart" class="hover:text-snip-orange transition-colors">快速上手</a></li>
                <li><a href="#changelog" class="hover:text-snip-orange transition-colors">更新日志</a></li>
              </ul>
            </div>
            
            <!-- Community -->
            <div>
              <h4 class="font-semibold mb-4">社区</h4>
              <ul class="space-y-3 text-sm text-snip-muted">
                <li><span class="text-snip-text font-medium">MIT License</span></li>
                <li><span class="text-snip-text">Go + React + Wails</span></li>
              </ul>
            </div>
          </div>
          
          <div class="pt-8 border-t border-snip-gray text-center text-xs text-snip-muted">
            <p class="mb-2">SniShaper 专为恢复网络访问自由而设计。请遵守当地法律法规，合理使用。</p>
            <p>
              合作者 | 贡献者 | 网页开发者: SnishaperTeam
            </p>
            <p class="mt-2 opacity-30" style="font-size: 10px;">原作者因不可抗拒原因无法展出</p>
          </div>
        </div>
      </footer>
      
      <!-- Mobile Menu -->
      <div id="mobile-menu" class="fixed inset-0 bg-snip-dark/95 backdrop-blur-lg z-50 hidden flex-col items-center justify-center gap-8">
        <button id="mobile-menu-close" class="absolute top-6 right-6 p-2 text-snip-muted hover:text-snip-orange transition-colors">
          <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <a href="#features" class="text-2xl font-medium hover:text-snip-orange transition-colors mobile-link">功能特性</a>
        <a href="#tech" class="text-2xl font-medium hover:text-snip-orange transition-colors mobile-link">核心技术</a>
        <a href="#faq" class="text-2xl font-medium hover:text-snip-orange transition-colors mobile-link">常见问题</a>
        <a href="#download" class="text-2xl font-medium hover:text-snip-orange transition-colors mobile-link">下载</a>
      </div>
      
      <script>
        // Mobile menu functionality
        const mobileMenuBtn = document.getElementById('mobile-menu-btn');
        const mobileMenu = document.getElementById('mobile-menu');
        const mobileMenuClose = document.getElementById('mobile-menu-close');
        const mobileLinks = document.querySelectorAll('.mobile-link');
        
        function openMobileMenu() {
          mobileMenu.classList.remove('hidden');
          mobileMenu.classList.add('flex');
          document.body.style.overflow = 'hidden';
        }
        
        function closeMobileMenu() {
          mobileMenu.classList.add('hidden');
          mobileMenu.classList.remove('flex');
          document.body.style.overflow = '';
        }
        
        mobileMenuBtn?.addEventListener('click', openMobileMenu);
        mobileMenuClose?.addEventListener('click', closeMobileMenu);
        mobileLinks.forEach(link => link.addEventListener('click', closeMobileMenu));
        
        // Smooth scroll for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
          anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
              target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
          });
        });
        
        // Intersection Observer for fade-in animations
        const observerOptions = {
          threshold: 0.1,
          rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              entry.target.classList.add('opacity-100', 'translate-y-0');
              entry.target.classList.remove('opacity-0', 'translate-y-8');
            }
          });
        }, observerOptions);
        
        document.querySelectorAll('section').forEach(section => {
          section.classList.add('transition-opacity', 'transition-transform', 'duration-700');
          observer.observe(section);
        });

        // Auto-scroll for features carousel (back and forth)
        (function () {
          const carousel = document.getElementById('features-carousel');
          if (!carousel) return;

          const BASE_SPEED = 0.65;
          let speed = 0;
          let direction = 1;   // 1 = left→right, -1 = right→left
          let paused = false;
          let raf = null;

          function getMaxScroll() {
            return carousel.scrollWidth - carousel.clientWidth;
          }

          function tick() {
            if (!paused) {
              speed += (BASE_SPEED - speed) * 0.08;
              carousel.scrollLeft += speed * direction;

              const max = getMaxScroll();
              if (direction === 1 && carousel.scrollLeft >= max) {
                direction = -1;
                carousel.scrollLeft = max;
              } else if (direction === -1 && carousel.scrollLeft <= 0) {
                direction = 1;
                carousel.scrollLeft = 0;
              }
            }
            raf = requestAnimationFrame(tick);
          }

          carousel.addEventListener('mouseenter', () => { paused = true; speed = 0; });
          carousel.addEventListener('mouseleave', () => { paused = false; });
          carousel.addEventListener('touchstart', () => { paused = true;  speed = 0; }, { passive: true });
          carousel.addEventListener('touchend',   () => { paused = false; }, { passive: true });

          carousel.style.scrollSnapType = 'none';
          carousel.style.overflowX = 'hidden';

          raf = requestAnimationFrame(tick);
        })();
      <\/script>
    </div>
  `}document.addEventListener("DOMContentLoaded",()=>{r()});
