# 总览

本站（[jetcpp.ccwu.cc](https://jetcpp.ccwu.cc)）后端 API 的参考文档。后端运行在 Cloudflare Pages Functions 上（`/api/*` 路径），数据存储在 D1（可切换 Supabase Postgres）。

- **Base URL**：`https://jetcpp.ccwu.cc`
- **所有接口**均以 `/api/` 为前缀，请求与响应体均为 JSON（`application/json; charset=utf-8`）

## 认证

除标注「公开」的接口外，均需在请求头携带 JWT：

```
Authorization: Bearer <token>
```

- Token 由登录类接口返回（[邮箱登录](/auth)、[第三方登录](/oauth)、[设备登录](/devices)），有效期 **30 天**
- 算法 HS256；设备登录签发的 Token 额外携带 `jti`，设备被吊销后立即失效
- Token 过期返回 `401`，需重新登录；账号被封禁返回 `403`

## 响应约定

网站接口使用两种风格：

| 风格 | 成功 | 失败 | 使用者 |
|---|---|---|---|
| 用户侧 | 直接返回数据对象，如 `{ "user": ... }` | `{ "error": "中文错误信息" }` | auth / posts / comments 等大部分接口 |
| 公告/管理侧 | `{ "ok": true, ... }` | `{ "ok": false, "error": "英文错误码" }` | notices / admin 系列 |

常用状态码：

| 状态码 | 含义 |
|---|---|
| 400 | 参数错误 / 请求格式错误 |
| 401 | 未登录、凭证过期或无效 |
| 403 | 无权限或账号被封禁 |
| 404 | 资源不存在 |
| 409 | 冲突（邮箱已注册、slug 已占用等） |
| 429 | 请求过于频繁（验证码、登录限流） |

## 用户对象

```json
// PublicUser（公开，如 GET /api/users/:id）
{ "id": "uuid", "nickname": "昵称", "avatarUrl": "https://...", "createdAt": "ISO8601" }

// PrivateUser（仅本人/登录后，多一个 email）
{ "id": "uuid", "email": "a@b.c", "nickname": "昵称", "avatarUrl": null, "createdAt": "ISO8601" }
```

## 接口速览

| 方法 | 路径 | 说明 | 鉴权 |
|---|---|---|---|
| GET | `/health` | 健康检查（不在 /api 前缀下） | 公开 |
| POST | `/api/auth/otp/send` | 发送邮箱验证码 | 公开 |
| POST | `/api/auth/register` | 注册 | 公开 |
| POST | `/api/auth/login` | 邮箱密码登录 | 公开 |
| GET / PATCH | `/api/auth/me` | 查询 / 修改个人资料 | Bearer |
| POST | `/api/auth/change-password` | 修改密码 | Bearer |
| POST | `/api/auth/reset-password` | 重置密码 | 公开 |
| DELETE | `/api/auth/account` | 注销账号 | Bearer |
| GET | `/api/auth/oauth/:provider/start` | 发起第三方登录 | 公开 |
| GET | `/api/auth/oauth/:provider/callback` | 第三方登录回调 | 公开 |
| POST | `/api/auth/oauth/exchange` | 登录码换取会话 | 公开 |
| GET | `/api/auth/oauth/accounts` | 已绑定的第三方账号 | Bearer |
| DELETE | `/api/auth/oauth/accounts/:provider` | 解绑第三方账号 | Bearer |
| POST | `/api/auth/oauth/bind/start` | 生成绑定票据 | Bearer |
| POST | `/api/auth/oauth/bind/confirm` | 确认绑定 | 公开 |
| POST | `/api/devices/code` | 生成设备登录码 | Bearer |
| POST | `/api/devices/token` | 登录码换设备凭证 | 公开 |
| GET | `/api/devices` | 设备列表 | Bearer |
| DELETE | `/api/devices/:id` | 吊销设备 | Bearer |
| GET / POST | `/api/posts` | 文章列表 / 创建 | GET 公开，POST Bearer |
| GET | `/api/posts/:slug` | 文章详情（浏览 +1） | 公开 |
| PATCH / DELETE | `/api/posts/item/:id` | 修改 / 删除文章 | Bearer（作者或管理员） |
| POST | `/api/posts/:slug/like` | 点赞 | 公开 |
| GET / POST | `/api/comments/:slug` | 评论列表 / 发表 | GET 公开，POST Bearer |
| DELETE | `/api/comments/item/:id` | 删除评论 | Bearer（作者或管理员） |
| GET / POST / DELETE | `/api/favorites` | 收藏列表 / 添加 / 删除 | Bearer |
| GET / POST / DELETE | `/api/history` | 测评历史 | Bearer |
| GET | `/api/data` | 云同步 key 列表 | Bearer |
| GET / PUT | `/api/data/:key` | 云同步读写 | Bearer |
| POST | `/api/uploads` | 上传图片 | Bearer |
| GET / POST | `/api/notices` | 应用公告列表 / 发布 | GET 公开，POST 管理员 |
| GET / POST | `/api/notices/auth` | 公告管理登录 | 公开 |
| GET / PATCH / DELETE | `/api/notices/:id` | 公告详情 / 更新 / 删除 | GET 公开，其余管理员 |
| GET | `/api/users/:id` | 公开用户信息 | 公开 |
| GET / POST | `/api/admin/session` | 管理员会话 | GET Bearer |
| GET | `/api/admin/stats` | 站点统计 | 管理员 |
| GET | `/api/admin/comments`、`DELETE .../:id` | 评论管理 | 管理员 |
| GET | `/api/admin/posts`、`DELETE .../:id` | 文章管理 | 管理员 |
| GET | `/api/admin/users`、`POST/DELETE .../:id` | 用户管理 | 管理员 |
| GET / POST / PATCH / DELETE | `/api/projects`、`/api/projects/:id` | 项目卡片 | GET 公开，写操作管理员 |
| GET / POST | `/api/page-edits` | 页面文案覆盖 | GET 公开，POST 管理员 |
