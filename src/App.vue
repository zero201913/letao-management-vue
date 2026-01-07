<script setup>
import Layout from './components/Layout/Layout.vue'
</script>

<template>
  <Layout />
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
