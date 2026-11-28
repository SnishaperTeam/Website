# comments — 评论

按文章 slug 组织。

## 评论对象

```json
{
  "id": "uuid",
  "postSlug": "my-post",
  "userId": "uuid",
  "author": "昵称",
  "avatarUrl": "https://...",
  "content": "评论内容",
  "createdAt": "ISO8601"
}
```

## 评论列表

```
GET /api/comments/:slug
```

按时间正序，最多 500 条：`{ "comments": Comment[] }`。

## 发表评论

```
POST /api/comments/:slug        （Bearer）
```

```json
{ "content": "评论内容（非空，≤2000 字）" }
```

成功 `201`：`{ "comment": Comment }`。

## 删除评论

```
DELETE /api/comments/item/:id        （Bearer，评论作者或管理员）
```

返回 `{ "ok": true }`。
