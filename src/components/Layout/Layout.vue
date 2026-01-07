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
        @toggle-theme="themeStore.toggleTheme"
        @mobile-menu-toggle="isMobileMenuOpen = !isMobileMenuOpen"
      />
      
      <main class="flex-1 overflow-auto p-6">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useThemeStore } from '../../stores/theme'
import Sidebar from './Sidebar.vue'
import Topbar from './Topbar.vue'

const themeStore = useThemeStore()
const isSidebarCollapsed = ref(false)
const isMobileMenuOpen = ref(false)

const toggleSidebar = () => {
  isSidebarCollapsed.value = !isSidebarCollapsed.value
}

onMounted(() => {
  themeStore.initTheme()
})
</script>
