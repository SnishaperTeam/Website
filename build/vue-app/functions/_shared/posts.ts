export interface PostRow {
  id: string
  author_id: string
  title: string
  slug: string
  excerpt: string | null
  content: string
  category: string | null
  color: string | null
  tags: string | null
  published: number
  views: number
  likes: number
  created_at: string
  updated_at: string
  nickname?: string | null
}

export function toPost(row: PostRow) {
  return {
    id: row.id,
    authorId: row.author_id,
    author: row.nickname || null,
    title: row.title,
    slug: row.slug,
    excerpt: row.excerpt,
    content: row.content,
    category: row.category,
    color: row.color,
    tags: row.tags ? String(row.tags).split(',').map((t) => t.trim()).filter(Boolean) : [],
    published: !!row.published,
    views: row.views,
    likes: row.likes,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}
