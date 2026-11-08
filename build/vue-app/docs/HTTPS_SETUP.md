# HTTPS 配置指南

## 为什么需要 HTTPS？

### 安全问题
目前开发环境使用 HTTP，数据以**明文传输**，存在以下风险：

1. **内容篡改** - 静态资源与页面内容可能被中间人替换
2. **数据伪造** - 传输中的数据可能被篡改
3. **中间人攻击** - 攻击者可以劫持访问流量
4. **隐私泄露** - 用户的访问记录可能被第三方观察

### 生产环境
**Cloudflare Pages 自动提供 HTTPS**
- 你的网站部署后会自动使用 HTTPS
- Cloudflare 提供免费 SSL 证书
- 所有数据传输都会加密

---

## 本地开发启用 HTTPS

### 方法一：使用 Vite 内置 HTTPS（推荐用于测试）

#### 1. 安装 mkcert（生成可信证书）

**Windows:**
```powershell
# 使用 Chocolatey
choco install mkcert

# 或使用 Scoop
scoop install mkcert
```

**macOS:**
```bash
brew install mkcert
```

**Linux:**
```bash
sudo apt install libnss3-tools
# 然后从 GitHub 下载 mkcert
```

#### 2. 创建本地 CA
```bash
mkcert -install
```

#### 3. 生成证书
在项目根目录创建 `certs` 文件夹：
```bash
mkdir certs
cd certs
mkcert localhost
```

会生成两个文件：
- `localhost.pem` (证书)
- `localhost-key.pem` (私钥)

#### 4. 修改 vite.config.ts

```typescript
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'node:path'
import fs from 'node:fs'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
  server: {
    port: 5174,
    https: {
      key: fs.readFileSync('./certs/localhost-key.pem'),
      cert: fs.readFileSync('./certs/localhost.pem'),
    }
  },
  // ... 其他配置
})
```

#### 5. 重启开发服务器
```bash
npm run dev
```

现在访问：`https://localhost:5174/`

---

### 方法二：使用自签名证书（快速但不推荐）

#### 1. 使用 OpenSSL 生成证书
```bash
openssl req -x509 -newkey rsa:2048 -keyout key.pem -out cert.pem -days 365 -nodes
```

#### 2. 配置 Vite
```typescript
server: {
  port: 5174,
  https: {
    key: fs.readFileSync('./key.pem'),
    cert: fs.readFileSync('./cert.pem'),
  }
}
```

⚠️ **注意**：浏览器会显示安全警告，需要手动信任证书。

---

### 方法三：使用 ngrok 或 localtunnel（最简单）

#### 使用 ngrok
```bash
# 安装 ngrok
npm install -g ngrok

# 启动 HTTP 服务器
npm run dev

# 在另一个终端创建 HTTPS 隧道
ngrok http 5174
```

会生成一个 HTTPS URL，例如：`https://abc123.ngrok.io`

---

## 🌐 生产环境配置

### Cloudflare Pages（已自动配置）

你的网站已经部署在 Cloudflare Pages 上：

**自动 HTTPS**
- Cloudflare 免费提供 SSL 证书
- 所有流量自动加密
- 无需额外配置

**强制 HTTPS**
1. 登录 Cloudflare Dashboard
2. 选择你的域名
3. 进入 **SSL/TLS** → **Edge Certificates**
4. 开启 **Always Use HTTPS**

**HSTS（可选增强）**
在 Cloudflare Workers 中添加：
```javascript
addEventListener('fetch', event => {
  const response = await fetch(event.request)
  response.headers.set('Strict-Transport-Security', 
    'max-age=31536000; includeSubDomains; preload')
  return response
})
```

---

## 检查 HTTPS 状态

### 浏览器检查
1. 打开开发者工具（F12）
2. 切换到 **Security** 标签
3. 查看连接是否安全

### 在线工具
- https://www.ssllabs.com/ssltest/
- https://why-no-padlock.com/

---

## 重要提示

### 开发环境
- **HTTP 是可以接受的** - 仅限本地开发
- **不要在生产环境使用 HTTP**
- 确保 `.env.local` 中的敏感信息不被提交

### 生产环境
- **必须使用 HTTPS**
- 启用 HSTS
- 定期更新 SSL 证书
- 使用强加密套件

---

## 快速检查清单

- [ ] 生产环境使用 HTTPS
- [ ] Cloudflare Always Use HTTPS 已启用
- [ ] 浏览器显示安全锁图标
- [ ] 没有混合内容警告
- [ ] 环境变量中的密钥未泄露

---

## 推荐方案

**开发环境**：继续使用 HTTP（方便调试）
**生产环境**：Cloudflare 自动处理 HTTPS（已完成）

你的网站部署到 Cloudflare Pages 后已经是安全的 HTTPS 连接了！
