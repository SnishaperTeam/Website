<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { useTypewriter } from '@/composables/useTypewriter'
import { useStaggeredFade } from '@/composables/useStaggeredFade'

const { display, cursor, done } = useTypewriter('隐私政策 / Privacy Policy', 50)
const items = Array.from({ length: 9 })
const { visible } = useStaggeredFade(items.length, 100)
</script>

<template>
  <div>
    <section class="page-head">
      <h1>
        <span>$ cat privacy.md</span><br>
        <span class="typewriter" style="font-size:var(--font-size-lg);">{{ display }}</span>
        <span class="typewriter-cursor" :class="{ done }"></span>
      </h1>
      <p class="subtitle" style="transform:translateX(40px);">最后更新时间：2026年5月21日</p>
    </section>

    <section class="mb-40" style="padding-left:40px;">
      <p style="line-height:1.8; color:var(--color-text); max-width:75ch;">
        SnishaperTeam Website（以下简称"我们"）尊重和保护用户的隐私权。本隐私政策说明我们如何收集、使用、存储和保护您的个人信息。请您在使用我们的服务前仔细阅读本隐私政策。
      </p>
    </section>

    <section class="mb-60 formal-section" style="padding-left:40px;">
      <article v-for="(_, i) in items" :key="i"
        class="stagger-item formal-article" :class="{ visible: visible[i] }"
      >
        <template v-if="i === 0">
          <h2 class="formal-h2">一、信息的收集与使用</h2>
          <h3 class="formal-h3">1.1 注册与登录</h3>
          <p>当我们提供用户注册功能时，我们会收集以下信息：</p>
          <ul>
            <li><strong>邮箱地址</strong>：用于创建账号、登录验证、密码重置以及发送重要通知</li>
            <li><strong>密码</strong>：您的密码会以加密形式存储，我们不会查看或记录您的明文密码</li>
          </ul>
          <p>您提供的信息仅用于改善您的使用体验和我们的服务质量。</p>

          <h3 class="formal-h3">1.2 自动收集的信息</h3>
          <p>当您访问本网站时，我们的服务器可能会自动记录以下信息：</p>
          <ul>
            <li>访问日志（包括页面访问记录、访问时间等）</li>
            <li>浏览器类型和设备信息（用于优化显示效果）</li>
            <li>IP地址（仅用于安全防护和地域分析，不关联个人身份）</li>
          </ul>

          <h3 class="formal-h3">1.3 不会收集的信息</h3>
          <p>未经您的明确同意，我们不会收集以下敏感信息：</p>
          <ul>
            <li>身份证号、手机号等个人身份信息</li>
            <li>支付信息、银行账号等财务信息</li>
            <li>位置信息、通讯录、相册等设备权限信息</li>
            <li>人脸识别、指纹等生物识别信息</li>
          </ul>
        </template>

        <template v-if="i === 1">
          <h2 class="formal-h2">二、信息的使用方式</h2>
          <p>我们收集的信息仅用于以下目的：</p>
          <ul>
            <li>为您提供账号登录和服务访问功能</li>
            <li>保存您发布的内容（如博客文章、项目评论等）</li>
            <li>保障账号安全和系统稳定运行</li>
            <li>改进网站功能和使用体验</li>
            <li>发送重要的系统通知和安全提醒</li>
          </ul>
          <p class="formal-note">我们承诺：不会将您的个人信息出售给第三方，不会用于商业营销目的。</p>
        </template>

        <template v-if="i === 2">
          <h2 class="formal-h2">三、信息的存储与保护</h2>
          <h3 class="formal-h3">3.1 数据存储</h3>
          <ul>
            <li>您的账号信息存储在 <strong>Supabase</strong>（数据库服务）上</li>
            <li>您发布的公开内容通过 <strong>GitHub Pages</strong> 进行托管和展示</li>
            <li>所有数据传输均使用 <strong>HTTPS 加密</strong></li>
          </ul>
          <h3 class="formal-h3">3.2 安全措施</h3>
          <ul>
            <li>密码使用 bcrypt 算法加密存储</li>
            <li>使用 JWT Token 进行身份验证</li>
            <li>定期更新安全策略和系统补丁</li>
            <li>限制服务器访问权限，防止未授权访问</li>
          </ul>
          <h3 class="formal-h3">3.3 数据存储期限</h3>
          <ul>
            <li>活跃账号的信息会一直保留，直到您主动删除账号</li>
            <li>您发布的公开内容会一直展示，直到您主动删除</li>
            <li>登录日志会在 30 天后自动清理</li>
          </ul>
        </template>

        <template v-if="i === 3">
          <h2 class="formal-h2">四、信息的共享与披露</h2>
          <p>我们不会主动与任何第三方分享您的个人信息，除非：</p>
          <ul>
            <li>获得您的明确同意</li>
            <li>根据法律法规或政府要求必须披露</li>
            <li>为维护公众利益或用户的合法权益所必需</li>
          </ul>
          <h3 class="formal-h3">第三方服务说明</h3>
          <p>本网站使用了以下第三方服务，这些服务可能会有有限的信息收集：</p>
          <ul>
            <li><strong>Supabase</strong>：提供数据库和认证服务</li>
            <li><strong>GitHub Pages</strong>：提供静态页面托管服务</li>
            <li><strong>CloudFlare</strong>：提供 CDN 和安全服务，<a href="https://www.cloudflare-cn.com/" target="_blank" class="formal-link">cloudflare-cn.com</a></li>
            <li><strong>域名托管</strong>：DigitalPlat，<a href="https://dash.domain.digitalplat.org/signup?ref=TZRrkCdFjm" target="_blank" class="formal-link">dash.domain.digitalplat.org</a></li>
          </ul>
          <p class="formal-note">建议您了解这些第三方服务的隐私政策，以做出明智的决定。</p>
        </template>

        <template v-if="i === 4">
          <h2 class="formal-h2">五、您的权利</h2>
          <p>根据相关法律法规，您享有以下权利：</p>
          <ul>
            <li><strong>访问权</strong>：您可以查看我们存储的您的个人信息</li>
            <li><strong>更正权</strong>：您可以要求更正不准确的个人信息</li>
            <li><strong>删除权</strong>：您可以随时删除自己的账号和发布的内容</li>
            <li><strong>撤回同意权</strong>：您可以撤回之前给予的同意</li>
          </ul>
        </template>

        <template v-if="i === 5">
          <h2 class="formal-h2">六、Cookie 和技术</h2>
          <p>本网站可能使用以下技术：</p>
          <ul>
            <li><strong>Local Storage</strong>：用于存储用户的登录状态和界面偏好设置</li>
            <li><strong>Session Storage</strong>：临时存储会话数据，关闭浏览器后自动清除</li>
          </ul>
        </template>

        <template v-if="i === 6">
          <h2 class="formal-h2">七、未成年人保护</h2>
          <ul>
            <li>若您是未满 14 周岁的未成年人，请在监护人的指导下使用我们的服务</li>
            <li>监护人应了解并同意本隐私政策的内容</li>
            <li>我们不会故意收集未成年人的个人信息</li>
          </ul>
        </template>

        <template v-if="i === 7">
          <h2 class="formal-h2">八、联系我们</h2>
          <ul>
            <li><strong>GitHub</strong>：<a href="https://github.com/dongzheyu" target="_blank" class="formal-link">github.com/dongzheyu</a></li>
            <li><strong>Gitee</strong>：<a href="https://gitee.com/jetcpp" target="_blank" class="formal-link">gitee.com/jetcpp</a></li>
            <li><strong>哔哩哔哩</strong>：<a href="https://space.bilibili.com/3546730880567808" target="_blank" class="formal-link">SnishaperTeam</a></li>
          </ul>
          <p>我们会在收到您的请求后 7 个工作日内予以回复。</p>
        </template>

        <template v-if="i === 8">
          <h2 class="formal-h2">九、政策的更新</h2>
          <p>我们可能会适时更新本隐私政策。更新后的政策会在本网站公布，恕不另行个别通知。当政策发生重大变化时，我们会通过网站公告或登录提示的方式通知您。若您继续使用我们的服务，即表示同意受更新后的隐私政策约束。</p>
        </template>
      </article>
    </section>

    <div class="divider-geek mb-40" style="margin-left:40px;">
      <span>end of document</span>
    </div>

    <section class="mb-40" style="padding-left:40px;">
      <p class="text-faint" style="font-size:var(--font-size-xs); max-width:65ch;">
        本隐私政策依据《中华人民共和国个人信息保护法》《中华人民共和国网络安全法》等相关法律法规制定。
      </p>
      <RouterLink to="/" class="btn-geek mt-20" style="display:inline-flex;">
        <Icon icon="mdi:arrow-left" width="14" /> 返回首页
      </RouterLink>
    </section>
  </div>
</template>

<style scoped>
.stagger-item { opacity: 0; transform: translateY(12px); }
.stagger-item.visible {
  opacity: 1;
  transform: translateY(0);
  transition: all 0.5s var(--ease-out-expo);
}

.formal-article {
  margin-bottom: 48px;
  max-width: 75ch;
}
.formal-h2 {
  font-size: var(--font-size-lg);
  font-weight: 400;
  color: var(--color-white);
  letter-spacing: 0.03em;
  margin-bottom: 20px;
  padding-bottom: 8px;
  border-bottom: 1px solid var(--color-border);
}
.formal-h3 {
  font-size: var(--font-size-base);
  font-weight: 400;
  color: var(--color-white);
  margin: 24px 0 12px;
}
.formal-article p {
  line-height: 1.8;
  color: var(--color-text);
  margin-bottom: 12px;
}
.formal-article ul {
  padding-left: 20px;
  margin-bottom: 16px;
}
.formal-article li {
  line-height: 1.8;
  color: var(--color-text);
  margin-bottom: 6px;
}
.formal-article li strong { color: var(--color-white); font-weight: 400; }
.formal-note {
  padding: 12px 16px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  color: var(--color-green);
  font-size: var(--font-size-sm);
  margin-top: 16px;
}
.formal-link {
  color: var(--color-white);
  border-bottom: 1px solid rgba(255,255,255,0.2);
  text-decoration: none;
}
.formal-link:hover { border-bottom-color: var(--color-white); }
</style>
