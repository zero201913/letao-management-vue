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
        <li v-for="item in menuItems" :key="item.path || item.label">
          <!-- 一级菜单项 -->
          <div v-if="item.children" class="space-y-1">
            <div
              :class="[
                'flex items-center justify-between gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 cursor-pointer',
                'hover:bg-surface-100 dark:hover:bg-surface-700 text-surface-600 dark:text-surface-300',
                isCollapsed ? 'justify-center' : ''
              ]"
              @click="toggleSubmenu(item.label)"
            >
              <div class="flex items-center gap-3">
                <FontAwesomeIcon :icon="['fas', item.icon.replace('fa-', '')]" class="text-lg w-5 text-center" />
                <span v-if="!isCollapsed" class="truncate">{{ item.label }}</span>
              </div>
              <FontAwesomeIcon
                v-if="!isCollapsed"
                :icon="isMenuExpanded(item.label) ? 'chevron-down' : 'chevron-right'"
                class="text-sm transition-transform duration-200"
              />
            </div>
            <!-- 二级菜单项 -->
            <ul v-if="isMenuExpanded(item.label) && !isCollapsed" class="pl-8 space-y-1">
              <li v-for="child in item.children" :key="child.path">
                <router-link
                  :to="child.path"
                  v-slot="{ isActive }"
                  custom
                >
                  <div
                    :class="[
                      'flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 cursor-pointer',
                      'hover:bg-surface-100 dark:hover:bg-surface-700',
                      isActive ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 font-medium' : 'text-surface-600 dark:text-surface-300'
                    ]"
                    @click="handleMenuClick(child.path)"
                  >
                    <span class="truncate">{{ child.label }}</span>
                  </div>
                </router-link>
              </li>
            </ul>
          </div>
          <!-- 没有子菜单的菜单项 -->
          <router-link
            v-else
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
import { computed, ref } from 'vue'
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
const expandedMenus = ref([])

const menuItems = [
  { path: '/dashboard', label: '仪表盘', icon: 'fa-tachometer-alt' },
  {
    label: '用户相关',
    icon: 'fa-users',
    children: [
      { path: '/users/balance', label: '余额管理' },
      { path: '/users/cart', label: '购物车管理' }
    ]
  },
  {
        label: '商品相关',
        icon: 'fa-box',
        children: [
          { path: '/products', label: '商品管理' },
          { path: '/categories', label: '分类管理' },
          { path: '/products/reviews', label: '评价管理' },
          { path: '/orders', label: '订单管理' },
          { path: '/after-sales', label: '售后管理' }
        ]
      },
  {
    label: '系统相关',
    icon: 'fa-cog',
    children: [
      { path: '/system/logs', label: '操作日志' },
      { path: '/system/user-info', label: '用户信息' },
      { path: '/system/merchant-info', label: '商家信息' },
      { path: '/settings', label: '系统设置' },
      { path: '/permissions', label: '权限管理' }
    ]
  }
]

const handleMenuClick = (path) => {
  router.push(path)
  if (window.innerWidth <= 1024) {
    emit('update:mobileOpen', false)
  }
}

const toggleSubmenu = (label) => {
  const index = expandedMenus.value.indexOf(label)
  if (index > -1) {
    expandedMenus.value.splice(index, 1)
  } else {
    expandedMenus.value.push(label)
  }
}

const isMenuExpanded = (label) => {
  return expandedMenus.value.includes(label)
}
</script>
