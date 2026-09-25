<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { useTypewriter } from '@/composables/useTypewriter'
import { useStaggeredFade } from '@/composables/useStaggeredFade'

const { display, cursor, done } = useTypewriter('服务条款 / Terms of Service', 50)
const items = Array.from({ length: 10 })
const { visible } = useStaggeredFade(items.length, 100)
</script>

<template>
  <div>
    <section class="page-head">
      <h1>
        <span>$ cat terms.md</span><br>
        <span class="typewriter" style="font-size:var(--font-size-lg);">{{ display }}</span>
        <span class="typewriter-cursor" :class="{ done }"></span>
      </h1>
      <p class="subtitle" style="transform:translateX(40px);">最后更新时间：2026年5月21日</p>
    </section>

    <section class="mb-40" style="padding-left:40px;">
      <p style="line-height:1.8; color:var(--color-text); max-width:75ch;">
        欢迎使用 SnishaperTeam Website（以下简称"服务"）。在您使用本服务前，请仔细阅读并理解本条款。继续使用即表示您同意接受本条款的所有内容。
      </p>
    </section>

    <section class="mb-60 formal-section" style="padding-left:40px;">
      <article v-for="(_, i) in items" :key="i"
        class="stagger-item formal-article" :class="{ visible: visible[i] }"
      >
        <template v-if="i === 0">
          <h2 class="formal-h2">一、服务说明</h2>
          <p>SnishaperTeam Website 提供以下内容服务：</p>
          <ul>
            <li>技术博客文章的发布与阅读</li>
            <li>项目作品的展示与分享</li>
            <li>用户账号注册与管理</li>
            <li>评论区互动功能（如开启）</li>
            <li>心理测评问卷测试（仅供参考）</li>
          </ul>
          <p>我们保留随时修改、暂停或终止部分或全部服务的权利，无需提前通知。</p>
        </template>

        <template v-if="i === 1">
          <h2 class="formal-h2">二、用户注册与账号安全</h2>
          <h3 class="formal-h3">2.1 账号注册</h3>
          <ul>
            <li>您需使用有效的邮箱地址进行注册</li>
            <li>您需提供真实、准确的信息完成注册</li>
            <li>每个账号仅限注册用户本人使用，不得转让、出借或售卖</li>
          </ul>
          <h3 class="formal-h3">2.2 账号安全</h3>
          <ul>
            <li>您有责任维护账号密码的机密性和安全性</li>
            <li>所有使用您的账号进行的活动均由您负责</li>
            <li>如发现任何未经授权的使用，请立即联系我们</li>
            <li>我们建议定期更换密码并使用强密码</li>
          </ul>
          <h3 class="formal-h3">2.3 账号封禁</h3>
          <p>如您违反本条款或平台规则，我们有权暂停或终止您的账号，包括但不限于：</p>
          <ul>
            <li>发布违法、违规内容</li>
            <li>侵犯他人知识产权或合法权益</li>
            <li>进行恶意攻击、骚扰其他用户</li>
            <li>利用服务从事非法活动</li>
          </ul>
        </template>

        <template v-if="i === 2">
          <h2 class="formal-h2">三、用户行为规范</h2>
          <h3 class="formal-h3">3.1 禁止行为</h3>
          <p>在使用本服务时，您不得：</p>
          <ul>
            <li>发布违反国家法律法规的内容</li>
            <li>发布淫秽、色情、暴力、恐怖主义内容</li>
            <li>发布侵犯他人知识产权、商业秘密等内容</li>
            <li>发布垃圾广告、恶意营销、诱导分享内容</li>
            <li>发布谣言、虚假信息，损害他人或机构声誉</li>
            <li>恶意扫描、攻击服务器或干扰服务正常运行</li>
            <li>收集或存储其他用户的个人信息</li>
            <li>利用技术手段恶意刷量、刷赞</li>
          </ul>
          <h3 class="formal-h3">3.2 内容责任</h3>
          <p>用户对自己在平台上发布的内容负全部责任，包括但不限于：</p>
          <ul>
            <li>确保内容不侵犯任何第三方的知识产权、肖像权、名誉权等</li>
            <li>确保内容真实、准确，不构成误导或欺诈</li>
            <li>承担因内容违法而引发的全部法律责任</li>
          </ul>
        </template>

        <template v-if="i === 3">
          <h2 class="formal-h2">四、知识产权声明</h2>
          <h3 class="formal-h3">4.1 平台内容</h3>
          <p>本平台的所有内容（包括但不限于文字、图片、代码、设计、布局）均受知识产权法保护，归平台所有者或相应权利人所有。</p>
          <h3 class="formal-h3">4.2 用户内容</h3>
          <p>您在平台上发布的内容，版权仍归您所有，但您授予平台在全球范围内、永久的、非排他性的许可，允许平台展示、传播该内容。</p>
          <h3 class="formal-h3">4.3 开源项目</h3>
          <p>平台上展示的开源项目，其版权归项目作者所有，使用范围遵循各项目附带的开源许可证（如 MIT、GPL 等）。</p>
        </template>

        <template v-if="i === 4">
          <h2 class="formal-h2">五、免责声明</h2>
          <h3 class="formal-h3">5.1 服务可用性</h3>
          <p>我们尽量保证服务的连续性和稳定性，但不保证：</p>
          <ul>
            <li>服务永远不会中断或出错</li>
            <li>服务完全不受病毒、木马等恶意程序影响</li>
            <li>数据永远不会丢失</li>
          </ul>
          <h3 class="formal-h3">5.2 第三方链接</h3>
          <p>本平台可能包含指向第三方网站的链接，这些链接仅供您参考：</p>
          <ul>
            <li>我们对第三方网站的内容、隐私政策、安全性不承担责任</li>
            <li>使用第三方网站的风险由您自行承担</li>
            <li>我们与第三方之间不存在任何形式的合作关系（除非明确声明）</li>
          </ul>
          <h3 class="formal-h3">5.3 测评结果</h3>
          <p>平台提供的心理测评问卷（如 MBTI、抑郁测试等）仅供参考，不构成专业医疗诊断或建议。如有心理健康问题，请咨询专业医生。</p>
        </template>

        <template v-if="i === 5">
          <h2 class="formal-h2">六、隐私保护</h2>
          <p>我们重视您的隐私，详细的数据收集和使用政策请参考我们的 <RouterLink to="/privacy" class="formal-link">隐私政策</RouterLink>。使用本服务即表示您同意我们按照隐私政策收集、使用和保护您的信息。</p>
        </template>

        <template v-if="i === 6">
          <h2 class="formal-h2">七、违规处理</h2>
          <p>如您违反上述条款，我们有权采取以下一项或多项措施：</p>
          <ul>
            <li>警告并要求限期整改</li>
            <li>删除违规内容</li>
            <li>暂时封禁账号</li>
            <li>永久封禁账号</li>
            <li>向相关监管部门报告</li>
          </ul>
          <p>您对处理决定有异议的，可以通过 GitHub Issues 提出申诉。</p>
        </template>

        <template v-if="i === 7">
          <h2 class="formal-h2">八、条款变更</h2>
          <p>我们可能会不时修订本条款。修订后的条款会在本网站公布，恕不另行个别通知。当条款发生重大变化时，我们会通过网站公告或登录提示的方式通知您。若您继续使用我们的服务，即表示同意受修订后条款的约束。</p>
        </template>

        <template v-if="i === 8">
          <h2 class="formal-h2">九、其他</h2>
          <ul>
            <li>本条款的解释、效力适用中华人民共和国法律</li>
            <li>如本条款的任何部分被认定为无效，不影响其他部分的效力</li>
            <li>我们未及时行使本条款下的权利，不构成对该权利的放弃</li>
          </ul>
        </template>

        <template v-if="i === 9">
          <h2 class="formal-h2">十、联系我们</h2>
          <ul>
            <li><strong>GitHub</strong>：<a href="https://github.com/dongzheyu" target="_blank" class="formal-link">github.com/dongzheyu</a></li>
            <li><strong>Gitee</strong>：<a href="https://gitee.com/jetcpp" target="_blank" class="formal-link">gitee.com/jetcpp</a></li>
          </ul>
        </template>
      </article>
    </section>

    <div class="divider-geek mb-40" style="margin-left:40px;">
      <span>end of document</span>
    </div>

    <section class="mb-40" style="padding-left:40px;">
      <p class="text-faint" style="font-size:var(--font-size-xs); max-width:65ch;">
        本服务条款依据《中华人民共和国民法典》《中华人民共和国网络安全法》《中华人民共和国数据安全法》等相关法律法规制定。
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
.formal-link {
  color: var(--color-white);
  border-bottom: 1px solid rgba(255,255,255,0.2);
  text-decoration: none;
}
.formal-link:hover { border-bottom-color: var(--color-white); }
</style>
