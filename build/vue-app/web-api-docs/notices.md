# notices — 应用公告

供 SniShaper / FlowWeaver / SnishaperDroid 客户端拉取应用公告。响应带 `Access-Control-Allow-Origin: *`，可跨域调用。

## 产品参数

所有 notices 接口都需要 `?product=`：

| product | 说明 |
|---|---|
| `snishaper` | SniShaper 桌面端 |
| `flowweaver` | FlowWeaver |
| `SnishaperDroid` | Snishaper-Droid |

缺失或非法返回 `400 invalid_product`。

## 公告对象

```json
{
  "id": "n1",
  "title": "标题（必填）",
  "title_en": "英文标题（可选）",
  "title_ru": "俄文标题（可选）",
  "body": "正文（必填）",
  "body_en": "（可选）",
  "body_ru": "（可选）",
  "level": "info | important | critical",
  "published_at": "ISO8601",
  "expires_at": "ISO8601（可选，过期自动隐藏）",
  "link": "https://...（可选）",
  "link_text": "链接文字（可选）",
  "pinned": false
}
```

## 公告列表

```
GET /api/notices?product=snishaper
```

| 参数 | 说明 |
|---|---|
| `all` | `1/true/yes` 时包含已过期公告 |
| `limit` | 最多返回条数，上限 200 |
| `fresh` | `1` 时跳过缓存 |

响应（`Cache-Control: public, max-age=30` + `ETag`）：

```json
{
  "ok": true,
  "version": 7,
  "updated_at": "ISO8601",
  "count": 2,
  "total": 3,
  "source": "...",
  "notices": [ Notice ]
}
```

## 公告详情

```
GET /api/notices/:id?product=snishaper
```

返回 `{ "ok": true, "version": n, "notice": Notice }`，不存在 `404`。

## 发布/替换公告

```
POST /api/notices?product=snishaper        （管理员）
```

body 为 Notice 对象（`id` 相同视为替换，置顶优先、其余按发布时间倒序）。成功返回 `200`（替换）或 `201`（新建），带 `{ "ok": true, "replaced": bool, "version": n, "notice": Notice }`。

## 更新公告

```
PATCH /api/notices/:id?product=snishaper        （管理员）
```

body 中字段覆盖原值（缺省字段保留），`title` / `body` 不允许为空。

## 删除公告

```
DELETE /api/notices/:id?product=snishaper        （管理员）
```

返回 `{ "ok": true, "version": n, "removed": "<id>" }`。

## 公告管理登录

管理员 = 邮箱在服务端 `NOTICE_ADMIN_EMAIL` 白名单内且账号可用的用户。

```
GET /api/notices/auth
```

携带 Bearer Token 时返回 `{ "ok": true, "authenticated": true }`，否则 `401`。

```
POST /api/notices/auth
```

```json
{ "email": "admin@x.y", "password": "..." }
```

- 成功：`{ "ok": true, "token": "<JWT>", "authenticated": true }`
- 单 IP 连续失败 5 次锁定 60 秒（`429 too_many_attempts` + `retry_after`）
