# oauth — 第三方登录

支持 **GitHub / Google / Microsoft** 三家（服务端需配置对应 `*_CLIENT_ID` / `*_CLIENT_SECRET`，未配置时重定向回登录页并提示）。

流程基于 OAuth 2.0 + PKCE，中间状态通过 `oauth_flow` HttpOnly Cookie 传递（10 分钟有效）。

## 发起登录

```
GET /api/auth/oauth/:provider/start
```

`provider` ∈ `github` | `google` | `microsoft`。

- `302` 重定向到第三方授权页
- 可选参数 `?bind=<ticket>`：已登录用户绑定第三方账号（ticket 来自 [bind/start](#生成绑定票据)）

## 登录回调

```
GET /api/auth/oauth/:provider/callback
```

由第三方授权页跳回，服务端根据账号状态 `302` 到前端：

| 情形 | 跳转 |
|---|---|
| 登录 / 注册 / 绑定成功 | `/auth/oauth-callback?code=<登录码>` |
| 邮箱已注册且有密码（需确认绑定） | `/auth/oauth-bind?ticket=<票据>` |
| 任何失败 | `/auth?oauth_error=<信息>` |

## 登录码换取会话

```
POST /api/auth/oauth/exchange
```

```json
{ "code": "<登录码>" }
```

登录码一次性、60 秒有效。成功返回：

```json
{ "token": "<JWT>", "user": PrivateUser }
```

## 查询已绑定账号

```
GET /api/auth/oauth/accounts        （Bearer）
```

```json
{ "accounts": [ { "provider": "github", "email": "...", "displayName": "...", "avatarUrl": "...", "createdAt": "..." } ] }
```

## 解绑第三方账号

```
DELETE /api/auth/oauth/accounts/:provider       （Bearer）
```

- 成功：`{ "ok": true }`
- 若该第三方是唯一登录方式且账号未设置密码：`400`「这是唯一的登录方式，请先设置密码」

## 生成绑定票据

```
POST /api/auth/oauth/bind/start        （Bearer）
```

返回 `{ "ticket": "..." }`（10 分钟有效）。将 ticket 拼到 `start` 接口：`GET /api/auth/oauth/:provider/start?bind=<ticket>`。

## 确认绑定

```
POST /api/auth/oauth/bind/confirm
```

```json
{ "ticket": "<oauth-bind 票据>", "password": "账号密码" }
```

用于「第三方邮箱已注册且有密码」的场景，验证密码后完成绑定。成功返回 `{ "code": "<登录码>" }`，再走 [exchange](#登录码换取会话)。
