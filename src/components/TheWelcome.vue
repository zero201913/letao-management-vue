<script setup>
import WelcomeItem from './WelcomeItem.vue'
import {
  Document,
  Setting,
  Grid,
  ChatLineRound,
  Star
} from '@element-plus/icons-vue'

const openReadmeInEditor = () => fetch('/__open-in-editor?file=README.md')
</script>

<template>
  <div class="welcome-container">
    <h2 class="welcome-title">欢迎使用管理系统</h2>
    <p class="welcome-subtitle">这是一个基于Vue 3 + Element Plus构建的现代化管理系统模板</p>
    
    <WelcomeItem>
      <template #icon>
        <el-icon :size="32"><Document /></el-icon>
      </template>
      <template #heading>文档</template>

      Vue’s
      <a href="https://vuejs.org/" target="_blank" rel="noopener">官方文档</a>
      提供了开始使用所需的所有信息。
    </WelcomeItem>

    <WelcomeItem>
      <template #icon>
        <el-icon :size="32"><Setting /></el-icon>
      </template>
      <template #heading>工具链</template>

      本项目使用
      <a href="https://vite.dev/guide/features.html" target="_blank" rel="noopener">Vite</a>
      进行开发和构建。推荐的IDE配置是
      <a href="https://code.visualstudio.com/" target="_blank" rel="noopener">VSCode</a>
      +
      <a href="https://github.com/vuejs/language-tools" target="_blank" rel="noopener">Vue - Official</a>
      插件。

      <br />

      更多说明可在
      <a href="javascript:void(0)" @click="openReadmeInEditor"><code>README.md</code></a>
      中找到。
    </WelcomeItem>

    <WelcomeItem>
      <template #icon>
        <el-icon :size="32"><Grid /></el-icon>
      </template>
      <template #heading>生态系统</template>

      获取官方工具和库：
      <a href="https://pinia.vuejs.org/" target="_blank" rel="noopener">Pinia</a>、
      <a href="https://router.vuejs.org/" target="_blank" rel="noopener">Vue Router</a>、
      <a href="https://test-utils.vuejs.org/" target="_blank" rel="noopener">Vue Test Utils</a>
      和
      <a href="https://github.com/vuejs/devtools" target="_blank" rel="noopener">Vue Dev Tools</a>。
    </WelcomeItem>

    <WelcomeItem>
      <template #icon>
        <el-icon :size="32"><ChatLineRound /></el-icon>
      </template>
      <template #heading>社区</template>

      遇到问题？在
      <a href="https://chat.vuejs.org" target="_blank" rel="noopener">Vue Land</a>
      或
      <a href="https://stackoverflow.com/questions/tagged/vue.js" target="_blank" rel="noopener">StackOverflow</a>
      上提问。关注
      <a href="https://x.com/vuejs" target="_blank" rel="noopener">@vuejs</a>
      获取最新动态。
    </WelcomeItem>

    <WelcomeItem>
      <template #icon>
        <el-icon :size="32"><Star /></el-icon>
      </template>
      <template #heading>支持Vue</template>

      作为独立项目，Vue依赖社区支持。您可以通过
      <a href="https://vuejs.org/sponsor/" target="_blank" rel="noopener">成为赞助商</a>
      来帮助我们。
    </WelcomeItem>
  </div>
</template>

<style scoped>
.welcome-container {
  padding: 20px 0;
}

.welcome-title {
  font-size: 1.8rem;
  font-weight: 700;
  color: var(--el-text-color-primary);
  margin-bottom: 0.5rem;
}

.welcome-subtitle {
  color: var(--el-text-color-secondary);
  font-size: 1.1rem;
  margin-bottom: 2rem;
}
</style>
