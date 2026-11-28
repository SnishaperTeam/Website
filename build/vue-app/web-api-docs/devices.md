# devices — 设备登录

供桌面端（SniShaper 等）扫码/输码登录使用。网页端先生成 8 位登录码，桌面端用码换 30 天设备凭证。

## 生成设备登录码

```
POST /api/devices/code        （Bearer）
```

返回：

```json
{ "code": "AB23CD45", "expiresAt": 1735693200 }
```

- 8 位大写字母/数字（剔除易混淆的 `0/O/1/I/L`）
- 5 分钟有效，**一次性**，兑换后立即作废
- `expiresAt` 为 Unix 秒

## 登录码换设备凭证

```
POST /api/devices/token
```

```json
{ "code": "AB23CD45", "deviceName": "我的电脑" }
```

- `deviceName` 可选，最长 64 字符，默认「未知设备」
- 成功：

```json
{ "token": "<JWT，带 jti>", "user": PrivateUser, "deviceId": "uuid" }
```

设备 Token 与网页 Token 用法相同，但额外携带 `jti` 指向 `devices` 表对应行——设备被吊销后 Token 立即失效。

## 设备列表

```
GET /api/devices        （Bearer）
```

```json
{ "devices": [ { "id": "uuid", "device_name": "我的电脑", "created_at": "..." } ] }
```

按创建时间倒序。注意此处字段为下划线风格（`device_name`）。

## 吊销设备

```
DELETE /api/devices/:id        （Bearer）
```

删除设备记录，该设备的 Token 立即失效（后续请求返回 `401`）。只能吊销自己的设备。
