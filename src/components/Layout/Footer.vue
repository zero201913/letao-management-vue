<template>
  <footer class="footer">
    <el-divider :direction="'horizontal'" :border-style="isDarkMode ? 'dashed' : 'solid'" />
    <div class="footer-content">
      <el-text type="info" :size="'small'">
        © {{ currentYear }} 管理系统模板. 保留所有权利.
      </el-text>
    </div>
  </footer>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  isDarkMode: {
    type: Boolean,
    default: false
  }
})

// 获取当前年份
const currentYear = computed(() => {
  return new Date().getFullYear()
})
</script>

<style scoped>
.footer {
  text-align: center;
  padding: 15px 20px;
  margin-top: auto;
  background-color: inherit;
}

.footer-content {
  padding: 10px 0;
}

:deep(.el-divider) {
  margin: 0;
}
</style>