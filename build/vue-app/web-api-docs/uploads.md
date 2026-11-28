# uploads — 图片上传

经 Supabase Storage 中转，返回公网 URL。

## 上传图片

```
POST /api/uploads        （Bearer）
```

```json
{ "data": "data:image/png;base64,iVBORw0...", "kind": "avatar" }
```

| 字段 | 说明 |
|---|---|
| `data` | Data URL，仅支持 `image/png`、`image/jpeg`、`image/webp`、`image/gif`、`image/avif`，≤3 MB |
| `kind` | `avatar` 或 `post`（默认），决定存储路径前缀 |

成功 `201`：

```json
{ "url": "https://<supabase>/storage/v1/object/public/<bucket>/avatar/<uid>/<ts>-<rand>.png" }
```

存储后端未配置时返回 `503`。
