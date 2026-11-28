# personal — 收藏 / 测评历史 / 云同步

用户个人数据，均需 Bearer 认证。

## 收藏

### 收藏列表

```
GET /api/favorites
```

```json
{ "favorites": [ { "id": "条目ID", "title": "标题", "description": "", "icon": "", "color": "", "type": "blog" } ] }
```

`type` 为 `blog` 或 `test`。

### 添加/覆盖收藏

```
POST /api/favorites
```

```json
{ "id": "条目ID（必填）", "title": "标题（必填）", "description": "", "icon": "", "color": "", "type": "test" }
```

同一 `id` 重复提交为覆盖。返回 `{ "ok": true }`。

### 取消收藏

```
DELETE /api/favorites/:itemId
```

返回 `{ "ok": true }`。

## 测评历史

### 历史列表

```
GET /api/history
```

```json
{ "history": [ { "testId": "t1", "testTitle": "标题", "score": 90, "maxScore": 100, "level": "A", "completedAt": "ISO8601" } ] }
```

`score` / `maxScore` / `level` 可缺省；最多 50 条，按完成时间倒序。

### 上报结果

```
POST /api/history
```

```json
{ "testId": "t1（必填）", "testTitle": "标题（必填）", "score": 90, "maxScore": 100, "level": "A", "completedAt": "ISO8601（默认当前时间）" }
```

同一 `testId` 为覆盖（upsert）。返回 `{ "ok": true }`。

### 清空历史

```
DELETE /api/history
```

返回 `{ "ok": true }`。

## KV 云同步

桌面端配置云同步，按 key 存取 JSON blob（每个用户独立命名空间）。

### key 列表

```
GET /api/data
```

```json
{ "keys": ["profile", "rules"] }
```

### 读取

```
GET /api/data/:key
```

返回**原样**存储的 JSON（`Content-Type: application/json`），无外层包裹；云端没有该数据时 `404`。

key 规则：`/^[A-Za-z0-9_-]{1,64}$/`。

### 写入

```
PUT /api/data/:key
```

请求 body 即要存储的 JSON blob（≤10 MB，需带 `Content-Length`），整体覆盖旧值。返回 `{ "ok": true }`。
