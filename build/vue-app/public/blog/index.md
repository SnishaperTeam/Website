---
# https://vitepress.dev/reference/default-theme-home-page
layout: home

hero:
  name: "SnishaperTeam's Blog"
  text: "技术分享与思考"
  tagline: "探索编程世界，记录学习历程"
  actions:
    - theme: brand
      text: 博客主页
      link: /
    - theme: alt
      text: C++完全入门指南：从Hello World到结构体
      link: /cpp-guide
    - theme: alt
      text: C#从入门到精通
      link: /csharp-guide
    - theme: alt
      text: XAML从入门到精通
      link: /xaml-guide

features:
  - title: C++ 指南
    icon: 📘
    details: 深入学习C++编程语言的各种特性和最佳实践
    link: /cpp-guide
  - title: 技术分享
    icon: 💡
    details: 分享编程技巧、开发经验和解决方案
  - title: 代码实践
    icon: 🔧
    details: 实际项目中的代码示例和实践指南

---
<style>
.blog-list {
  max-width: 800px;
  margin: 2rem auto;
  padding: 0 1rem;
}

.blog-list h2 {
  color: #2c3e50;
  border-bottom: 2px solid #42b883;
  padding-bottom: 0.5rem;
  margin-bottom: 1.5rem;
}

.blog-list ul {
  list-style: none;
  padding: 0;
}

.blog-list li {
  background: #f9f9f9;
  border: 1px solid #eaeaea;
  border-radius: 8px;
  padding: 1.2rem;
  margin-bottom: 1rem;
  transition: box-shadow 0.3s ease;
}

.blog-list li:hover {
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}

.blog-list h3 {
  margin-top: 0;
  margin-bottom: 0.5rem;
}

.blog-list h3 a {
  color: #2779bd;
  text-decoration: none;
  font-size: 1.2rem;
}

.blog-list h3 a:hover {
  color: #2c5282;
  text-decoration: underline;
}

.post-meta {
  margin-top: 0.5rem;
}

.post-meta .date {
  color: #7f8c8d;
  font-size: 0.9rem;
}

.home-link-container {
  text-align: center;
  margin: 2rem 0;
}

.home-link {
  display: inline-block;
  background: #42b883;
  color: white;
  padding: 0.8rem 1.5rem;
  border-radius: 20px;
  text-decoration: none;
  font-weight: bold;
  transition: background 0.3s ease;
}

.home-link:hover {
  background: #369870;
}
</style>