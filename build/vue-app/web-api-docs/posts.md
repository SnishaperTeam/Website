# posts — 用户文章

## 文章对象

```json
{
  "id": "uuid",
  "authorId": "uuid",
  "author": "作者昵称",
  "title": "标题",
  "slug": "url-slug",
  "excerpt": "摘要（可空）",
  "content": "正文 Markdown",
  "category": "分类",
  "color": "卡片色（可空）",
  "tags": ["标签"],
  "published": true,
  "views": 0,
  "likes": 0,
  "createdAt": "ISO8601",
  "updatedAt": "ISO8601"
}
```

## 文章列表

```
GET /api/posts
```

已发布文章，按创建时间倒序，最多 100 篇：`{ "posts": Post[] }`。

```
GET /api/posts?mine=1        （Bearer）
```

自己的文章（含未发布草稿），最多 100 篇。

## 创建文章

```
POST /api/posts        （Bearer）
```

```json
{
  "title": "标题（必填）",
  "slug": "my-post（必填，自动清洗为 a-z0-9-）",
  "content": "正文（必填）",
  "excerpt": "摘要（可选）",
  "category": "分类（默认「个人文章」）",
  "color": "（可选）",
  "tags": ["a", "b"],
  "published": true
}
```

- slug 被占用：`409`
- 成功 `201`：`{ "post": Post }`

## 文章详情

```
GET /api/posts/:slug
```

返回 `{ "post": Post }`，每次请求浏览量 `views` +1。不存在返回 `404`。草稿也可通过此接口按 slug 访问。

## 修改文章

```
PATCH /api/posts/item/:id        （Bearer，仅作者）
```

body 中可选传 `title` / `excerpt` / `content` / `category` / `color` / `tags` / `published`，至少一项。成功返回更新后的 `{ "post": Post }`。

## 删除文章

```
DELETE /api/posts/item/:id       （Bearer，作者或管理员）
```

同时删除该文下所有评论，返回 `{ "ok": true }`。

## 点赞

```
POST /api/posts/:slug/like
```

无需登录，浏览量式 +1（可重复点赞）。返回 `{ "likes": 42 }`。仅对已发布文章有效。
