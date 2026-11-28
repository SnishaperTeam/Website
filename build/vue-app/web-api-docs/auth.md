# auth — 邮箱账号

邮箱注册、登录、个人资料与密码管理。验证码经邮件发送（6 位数字，10 分钟有效，60 秒冷却，错 5 次作废）。

## 发送验证码

```
POST /api/auth/otp/send
```

```json
{ "email": "a@b.c", "purpose": "register" }
```

| 字段 | 说明 |
|---|---|
| `email` | 合法邮箱 |
| `purpose` | `register`（注册）或 `password_reset`（重置密码） |

- 成功：`{ "ok": true }`
- `purpose=register` 且邮箱已注册：`409`
- `purpose=password_reset` 且邮箱未注册：仍返回 `{ "ok": true }`（不泄露用户是否存在）
- 60 秒内重复发送：`429`

## 注册

```
POST /api/auth/register
```

```json
{ "email": "a@b.c", "password": "至少8位", "nickname": "2-24字符", "otpCode": "123456" }
```

- `nickname` 可省略，默认取邮箱前缀；`otpCode` 必填（`purpose=register` 的验证码）
- 成功 `201`：

```json
{ "token": "<JWT>", "user": { "id": "...", "email": "a@b.c", "nickname": "...", "avatarUrl": null, "createdAt": "..." } }
```

## 登录

```
POST /api/auth/login
```

```json
{ "email": "a@b.c", "password": "..." }
```

- 成功：`{ "token": "<JWT>", "user": PrivateUser }`
- 账号仅用第三方登录（无密码）：`401`，提示先设置密码
- 封禁：`403`

## 查询个人资料

```
GET /api/auth/me        （Bearer）
```

返回 `{ "user": PrivateUser }`。

## 修改个人资料

```
PATCH /api/auth/me      （Bearer）
```

```json
{ "nickname": "新昵称", "avatarUrl": "https://..." }
```

- 两个字段均可选，但至少传一个；`avatarUrl` 需为 http(s) 链接，传 `null` 可清空
- 成功返回更新后的 `{ "user": PrivateUser }`

## 修改密码

```
POST /api/auth/change-password      （Bearer）
```

```json
{ "currentPassword": "旧密码", "newPassword": "新密码（至少8位）" }
```

- 账号原本有密码时 `currentPassword` 必填且需正确；纯第三方账号可省略（首次设置密码）
- 成功返回 `{ "token": "<新JWT>" }`（旧 Token 仍有效至自然过期）

## 重置密码

```
POST /api/auth/reset-password
```

```json
{ "email": "a@b.c", "otpCode": "123456", "password": "新密码（至少8位）" }
```

使用 `purpose=password_reset` 的验证码。成功返回 `{ "ok": true }`。

## 注销账号

```
DELETE /api/auth/account       （Bearer）
```

```json
{ "password": "确认密码" }
```

需密码确认；成功后级联删除该用户的文章、评论、收藏、测评历史与第三方绑定。

## 公开用户信息

```
GET /api/users/:id
```

返回 `{ "user": PublicUser }`；被封禁用户返回 `404`。
