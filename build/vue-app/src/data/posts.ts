export interface BlogPost {
  id: string
  slug: string
  title: string
  excerpt: string
  date: string
  author: string
  category: string
  tags: string[]
  link: string
}

export const staticPosts: BlogPost[] = [
  {
    id: 'static-1',
    slug: 'cpp-guide',
    title: 'C++完全入门指南：从Hello World到结构体',
    excerpt: '详细的C++入门指南，从Hello World到结构体等核心概念，适合初学者系统学习。',
    date: '2026-12-24',
    author: 'SnishaperTeam',
    category: '编程教程',
    tags: ['C++', '编程入门', '指针', '结构体'],
    link: '/blog/cpp-guide',
  },
  {
    id: 'static-2',
    slug: 'csharp-guide',
    title: 'C# 从入门到精通（零基础到进阶）',
    excerpt: '全面的C#学习指南，涵盖基础语法到高级特性，附带学生管理系统实战项目。',
    date: '2026-03-04',
    author: 'SnishaperTeam',
    category: '编程教程',
    tags: ['C#', '面向对象', '实战项目'],
    link: '/blog/csharp-guide',
  },
  {
    id: 'static-3',
    slug: 'xaml-guide',
    title: 'XAML 从入门到精通（零基础到进阶）',
    excerpt: 'WPF界面开发完全指南，从XAML基础语法到MVVM架构模式，待办事项应用实战。',
    date: '2026-03-04',
    author: 'SnishaperTeam',
    category: '编程教程',
    tags: ['XAML', 'WPF', 'MVVM'],
    link: '/blog/xaml-guide',
  },
]
