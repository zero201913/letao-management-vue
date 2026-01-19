<script setup>
import Layout from './components/Layout/Layout.vue'
import { useRoute } from 'vue-router'

const route = useRoute()

// 定义不需要Layout的路由路径
const noLayoutRoutes = ['/']
</script>

<template>
  <!-- 根据路由路径决定是否显示Layout -->
  <template v-if="noLayoutRoutes.includes(route.path)">
    <router-view />
  </template>
  <Layout v-else />
</template>

<style>
/* 全局样式重置和基础设置 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: 'Segoe UI', 'Microsoft YaHei', sans-serif;
}

body {
  overflow-x: hidden;
}

/* 确保深色模式下的全局样式正确 */
.dark-mode {
  background-color: #1a1a2e;
  color: white;
}
</style>
