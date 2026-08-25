import fs from 'fs'
import path from 'path'
import { createClient } from '@supabase/supabase-js'

const SITE_URL = 'https://jetcpp.dpdns.org'

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY

const staticPosts = [
  {
    title: 'C++完全入门指南：从Hello World到结构体',
    slug: 'cpp-guide',
    excerpt: '这是一篇详细的C++入门指南，从最基础的Hello World程序开始，逐步讲解变量、数据类型、控制流、函数、指针到结构体等核心概念。',
    date: '2026-12-24',
    category: '编程教程'
  },
  {
    title: 'C# 从入门到精通（零基础到进阶）',
    slug: 'csharp-guide',
    excerpt: '一份全面的C#学习指南，涵盖从基础语法到高级特性的完整知识体系。',
    date: '2026-03-04',
    category: '编程教程'
  },
  {
    title: 'XAML 从入门到精通（零基础到进阶）',
    slug: 'xaml-guide',
    excerpt: 'WPF界面开发完全指南，从XAML基础语法到MVVM架构模式。',
    date: '2026-03-04',
    category: '编程教程'
  }
]

async function fetchUserPosts() {
  if (!supabaseUrl || !supabaseKey) {
    console.warn('Supabase 环境变量未设置，跳过用户文章')
    return []
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseKey)
    const { data, error } = await supabase
      .from('user_posts')
      .select('title, slug, excerpt, content, category, color, created_at')
      .eq('published', true)
      .order('created_at', { ascending: false })
      .limit(50)

    if (error) {
      console.error('Supabase 查询错误:', error.message)
      return []
    }

    console.log(`从 Supabase 获取到 ${(data || []).length} 篇用户文章`)

    return (data || []).map(post => ({
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt || (post.content ? post.content.substring(0, 200).replace(/[#*`\n]/g, ' ').trim() + '...' : ''),
      date: new Date(post.created_at).toISOString(),
      category: post.category || '个人文章'
    }))
  } catch (err) {
    console.error('获取用户文章失败:', err.message)
    return []
  }
}

function escapeXml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

function escapeCdata(str) {
  return String(str).replace(/]]>/g, ']]]]><![CDATA[>')
}

function safeSlug(slug) {
  return encodeURIComponent(String(slug).trim())
}

function generateRSS(userPosts) {
  const buildDate = new Date().toUTCString()
  const allPosts = [...userPosts, ...staticPosts]

  const items = allPosts.map(post => {
    const slug = safeSlug(post.slug)
    const link = `${SITE_URL}/blog/${slug}`
    return `
    <item>
      <title><![CDATA[${escapeCdata(post.title)}]]></title>
      <link>${escapeXml(link)}</link>
      <description><![CDATA[${escapeCdata(post.excerpt)}]]></description>
      <pubDate>${new Date(post.date).toUTCString()}</pubDate>
      <category>${escapeXml(post.category)}</category>
      <guid isPermaLink="false">${escapeXml(link)}</guid>
    </item>`
  }).join('')

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>JetCPP Team 博客</title>
    <link>${SITE_URL}</link>
    <description>代码重塑世界 · 创新驱动未来 - JetCPP Team 技术博客</description>
    <language>zh-CN</language>
    <lastBuildDate>${buildDate}</lastBuildDate>
    <atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml"/>
    <image>
      <url>${SITE_URL}/logo.png</url>
      <title>JetCPP Team</title>
      <link>${SITE_URL}</link>
    </image>
    ${items}
  </channel>
</rss>`

  fs.writeFileSync(path.join(process.cwd(), 'public', 'feed.xml'), rss)
  console.log(`RSS feed generated: ${allPosts.length} posts (${userPosts.length} user + ${staticPosts.length} static)`)
}

async function main() {
  const userPosts = await fetchUserPosts()
  generateRSS(userPosts)
}

main().catch(err => {
  console.error('生成 RSS 失败:', err)
  generateRSS([])
  process.exit(0)
})
