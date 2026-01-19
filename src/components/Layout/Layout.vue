<template>
  <div class="flex h-full bg-surface-100 dark:bg-surface-900">
    <Sidebar
      :is-collapsed="isSidebarCollapsed"
      :mobile-open="isMobileMenuOpen"
      @toggle-sidebar="toggleSidebar"
      @update:mobileOpen="isMobileMenuOpen = $event"
    />
    
    <div class="flex-1 flex flex-col overflow-hidden">
      <Topbar
        :is-dark-mode="themeStore.isDark"
        :is-sidebar-collapsed="isSidebarCollapsed"
        @toggle-theme="themeStore.toggleTheme"
        @mobile-menu-toggle="isMobileMenuOpen = !isMobileMenuOpen"
        @toggle-sidebar="toggleSidebar"
      />
      
      <main class="flex-1 overflow-auto p-6">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useThemeStore } from '../../stores/theme'
import Sidebar from './Sidebar.vue'
import Topbar from './Topbar.vue'

const themeStore = useThemeStore()
const isSidebarCollapsed = ref(false)
const isMobileMenuOpen = ref(false)
const MOBILE_BREAKPOINT = 1025
const STORAGE_KEY = 'sidebar_collapsed_state'

// 检查窗口宽度并设置侧边栏状态
const checkWindowWidth = () => {
  const width = window.innerWidth
  if (width < MOBILE_BREAKPOINT) {
    isSidebarCollapsed.value = true
    isMobileMenuOpen.value = false
  } else {
    // 桌面端使用localStorage中保存的状态
    const savedState = localStorage.getItem(STORAGE_KEY)
    isSidebarCollapsed.value = savedState ? JSON.parse(savedState) : false
  }
}

// 监听窗口大小变化
const handleResize = () => {
  checkWindowWidth()
}

const toggleSidebar = () => {
  isSidebarCollapsed.value = !isSidebarCollapsed.value
  // 保存状态到localStorage
  localStorage.setItem(STORAGE_KEY, JSON.stringify(isSidebarCollapsed.value))
}

onMounted(() => {
  themeStore.initTheme()
  // 初始化时检查窗口宽度和localStorage状态
  checkWindowWidth()
  // 添加窗口大小变化监听
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  // 移除窗口大小变化监听
  window.removeEventListener('resize', handleResize)
})
</script>
