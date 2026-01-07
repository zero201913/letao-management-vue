<template>
  <aside
    class="h-full flex flex-col bg-white dark:bg-surface-800 transition-all duration-300"
    :class="[
      isCollapsed ? 'w-[70px]' : 'w-[240px]',
      mobileOpen ? 'fixed inset-y-0 left-0 z-50 transform' : '',
      mobileOpen && !isCollapsed ? 'translate-x-0' : '',
      mobileOpen && isCollapsed ? 'translate-x-0' : '',
      !mobileOpen && isCollapsed ? '-translate-x-full lg:translate-x-0' : ''
    ]"
  >
    <div class="flex items-center gap-3 px-4 h-[70px] border-b border-surface-200 dark:border-surface-700">
      <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-600 to-primary-400 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
        L
      </div>
      <span v-if="!isCollapsed" class="font-bold text-xl text-surface-800 dark:text-white whitespace-nowrap">Letao</span>
    </div>

    <nav class="flex-1 overflow-y-auto py-4 px-3 scrollbar-thin">
      <ul class="space-y-1">
        <li v-for="item in menuItems" :key="item.path">
          <router-link
            :to="item.path"
            v-slot="{ isActive }"
            custom
          >
            <div
              :class="[
                'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 cursor-pointer',
                'hover:bg-surface-100 dark:hover:bg-surface-700',
                isActive ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 font-medium' : 'text-surface-600 dark:text-surface-300',
                isCollapsed ? 'justify-center' : ''
              ]"
              @click="handleMenuClick(item.path)"
            >
              <FontAwesomeIcon :icon="['fas', item.icon.replace('fa-', '')]" class="text-lg w-5 text-center" />
              <span v-if="!isCollapsed" class="truncate">{{ item.label }}</span>
            </div>
          </router-link>
        </li>
      </ul>
    </nav>

    <div class="p-4 border-t border-surface-200 dark:border-surface-700">
      <div
        :class="[
          'flex items-center gap-3 px-3 py-2 rounded-lg text-surface-600 dark:text-surface-300',
          'hover:bg-surface-100 dark:hover:bg-surface-700 cursor-pointer transition-all duration-200',
          isCollapsed ? 'justify-center' : ''
        ]"
      >
        <FontAwesomeIcon icon="question-circle" class="text-lg" />
        <span v-if="!isCollapsed" class="text-sm">帮助与支持</span>
      </div>
    </div>
  </aside>

  <div
    v-if="mobileOpen"
    class="fixed inset-0 bg-black/50 z-40 lg:hidden"
    @click="$emit('update:mobileOpen', false)"
  ></div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const props = defineProps({
  isCollapsed: {
    type: Boolean,
    default: false
  },
  mobileOpen: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['toggle-sidebar', 'update:mobileOpen'])

const route = useRoute()
const router = useRouter()

const menuItems = [
  { path: '/dashboard', label: '仪表盘', icon: 'fa-tachometer-alt' },
  { path: '/orders', label: '订单管理', icon: 'fa-shopping-cart' },
  { path: '/statistics', label: '数据统计', icon: 'fa-chart-line' },
  { path: '/products', label: '产品管理', icon: 'fa-box' },
  { path: '/users', label: '用户管理', icon: 'fa-users' },
  { path: '/settings', label: '系统设置', icon: 'fa-cog' },
  { path: '/permissions', label: '权限管理', icon: 'fa-key' }
]

const handleMenuClick = (path) => {
  router.push(path)
  if (window.innerWidth <= 1024) {
    emit('update:mobileOpen', false)
  }
}
</script>
