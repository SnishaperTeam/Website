# admin — 管理接口

站点后台管理。管理员 = 邮箱在服务端 `NOTICE_ADMIN_EMAIL` 白名单内的用户，接口使用 `{ "ok": true/false, ... }` 响应风格，错误码为英文（如 `unauthorized`）。

## 管理员会话

```
POST /api/admin/session
```

```json
{ "email": "admin@x.y", "password": "..." }
```

成功：`{ "ok": true, "admin": true, "token": "<JWT>", "user": PrivateUser }`；凭据错误 `401 invalid_credentials`。

```
GET /api/admin/session        （Bearer）
```

返回 `{ "ok": true, "admin": true, "user": PrivateUser }`。

## 站点统计

```
GET /api/admin/stats        （管理员）
```

```json
{ "ok": true, "stats": { "users": 10, "posts": 5, "publishedPosts": 4, "comments": 20, "favorites": 8, "history": 30 } }
```

## 评论管理

```
GET /api/admin/comments                （管理员）  最新 200 条
DELETE /api/admin/comments/:id         （管理员）
```

## 文章管理

```
GET /api/admin/posts                   （管理员）  最新 200 条（含草稿，附作者昵称）
DELETE /api/admin/posts/:id            （管理员）  连带删除该文评论
```

## 用户管理

```
GET /api/admin/users                          （管理员）  最新 200 个，含 email / banned / hasPassword / oauthProviders
POST /api/admin/users/:id    { "action": "ban" | "unban" }   （管理员）
DELETE /api/admin/users/:id                    （管理员）  级联删除该用户内容
```

## 项目卡片

```
GET /api/projects          （公开）
```

```json
{ "projects": [ { "id": "uuid", "title": "...", "description": "...", "category": "系统", "link": "/project/x", "external": false, "createdAt": "..." } ] }
```

```
POST /api/projects         （管理员）
```

```json
{ "title": "必填", "description": "必填", "category": "默认「系统」", "link": "站内以 / 开头，外链需 http(s)", "external": false }
```

```
PATCH /api/projects/:id    （管理员）  可改 title / description / category / link / external
DELETE /api/projects/:id   （管理员）
```

## 页面文案覆盖

```
GET /api/page-edits?path=/blogs/some-post        （公开）
```

返回 `{ "overrides": { "key": "文案" } }`（无记录时为空对象）。

```
POST /api/page-edits        （管理员）
```

```json
{ "path": "/blogs/some-post", "overrides": { "title": "新标题" } }
```

- `path` 必须以 `/` 开头
- `overrides` 最多 2000 条，key 最长 600 字符，value 必须为字符串
