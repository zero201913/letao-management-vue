<template>
  <header class="h-[70px] flex items-center justify-between px-6 bg-white dark:bg-surface-800 border-b border-surface-200 dark:border-surface-700 shadow-sm z-10">
    <div class="flex items-center gap-4">
      <button
        class="lg:hidden p-2 rounded-lg text-surface-600 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-700 transition-colors"
        @click="$emit('mobile-menu-toggle')"
      >
        <FontAwesomeIcon icon="bars" class="text-xl" />
      </button>
      <button
        class="hidden lg:flex p-2 rounded-lg text-surface-600 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-700 transition-all duration-300"
        @click="$emit('toggle-sidebar')"
        :class="isSidebarCollapsed ? 'rotate-180' : ''"
        title="切换侧边栏"
      >
        <FontAwesomeIcon icon="chevron-left" class="text-xl" />
      </button>
      <h1 class="text-xl font-semibold text-surface-800 dark:text-white hidden sm:block">{{ pageTitle }}</h1>
    </div>

    <div class="flex items-center gap-3">
      <div class="relative hidden md:block">
        <FontAwesomeIcon icon="search" class="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400" />
        <input
          type="text"
          placeholder="搜索..."
          class="w-64 pl-10 pr-4 py-2 bg-surface-100 dark:bg-surface-700 border-0 rounded-lg text-sm text-surface-800 dark:text-surface-200 placeholder-surface-400 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
        />
      </div>

      <div class="relative" ref="notificationRef">
        <button
            class="relative p-2 rounded-lg text-surface-600 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-700 transition-colors"
            @click="showNotifications = !showNotifications"
          >
            <FontAwesomeIcon icon="bell" class="text-lg" />
            <span class="absolute top-1 right-1 w-2 h-2 bg-danger-500 rounded-full"></span>
          </button>

        <Transition name="dropdown">
          <div
            v-if="showNotifications"
            class="absolute right-0 mt-2 w-80 bg-white dark:bg-surface-800 rounded-xl shadow-dropdown overflow-hidden"
          >
            <div class="px-4 py-3 border-b border-surface-200 dark:border-surface-700">
              <h3 class="font-semibold text-surface-800 dark:text-white">通知</h3>
            </div>
            <div class="max-h-80 overflow-y-auto">
              <div
                v-for="(notification, index) in notifications"
                :key="index"
                class="flex items-start gap-3 px-4 py-3 hover:bg-surface-50 dark:hover:bg-surface-700 cursor-pointer transition-colors border-b border-surface-100 dark:border-surface-700 last:border-0"
              >
                <div
                  class="w-2 h-2 rounded-full mt-2 flex-shrink-0"
                  :class="{
                    'bg-success-500': notification.type === 'success',
                    'bg-warning-500': notification.type === 'warning',
                    'bg-primary-500': notification.type === 'info'
                  }"
                ></div>
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-medium text-surface-800 dark:text-white">{{ notification.title }}</p>
                  <p class="text-xs text-surface-500 mt-0.5">{{ notification.time }}</p>
                </div>
              </div>
            </div>
          </div>
        </Transition>
      </div>

      <button
        class="p-2 rounded-lg text-surface-600 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-700 transition-colors"
        @click="$emit('toggle-theme')"
      >
        <FontAwesomeIcon :icon="isDarkMode ? 'sun' : 'moon'" class="text-lg" />
      </button>

      <div class="relative" ref="userRef">
        <div
          class="flex items-center gap-3 cursor-pointer p-2 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-700 transition-colors"
          @click="showUserMenu = !showUserMenu"
        >
          <div class="w-9 h-9 rounded-full bg-gradient-to-br from-primary-600 to-accent-500 flex items-center justify-center text-white font-semibold">
            张
          </div>
          <div class="hidden sm:block text-left">
            <p class="text-sm font-medium text-surface-800 dark:text-white">{{ userInfo.nickname }}</p>
            <p class="text-xs text-surface-500">{{ userInfo.role === 'admin' ? '管理员' : userInfo.role === 'merchant' ? '商家' : '用户' }}</p>
          </div>
          <FontAwesomeIcon icon="chevron-down" class="text-xs text-surface-400 hidden sm:block" />
        </div>

        <Transition name="dropdown">
          <div
            v-if="showUserMenu"
            class="absolute right-0 mt-2 w-56 bg-white dark:bg-surface-800 rounded-xl shadow-dropdown py-2"
          >
            <div class="px-4 py-2 border-b border-surface-200 dark:border-surface-700">
              <p class="font-medium text-surface-800 dark:text-white">{{ userInfo.nickname }}</p>
              <p class="text-sm text-surface-500">{{ userInfo.email }}</p>
            </div>
            <div class="py-1">
              <div class="dropdown-item">
                <FontAwesomeIcon icon="user" />
                <span>个人中心</span>
              </div>
              <div class="dropdown-item">
                <FontAwesomeIcon icon="cog" />
                <span>账户设置</span>
              </div>
            </div>
            <div class="border-t border-surface-200 dark:border-surface-700 py-1">
              <div class="dropdown-item text-danger-500" @click="handleLogout">
                <FontAwesomeIcon icon="sign-out-alt" />
                <span>退出登录</span>
              </div>
            </div>
          </div>
        </Transition>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const props = defineProps({
  isDarkMode: {
    type: Boolean,
    default: false
  },
  isSidebarCollapsed: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['toggle-theme', 'mobile-menu-toggle', 'toggle-sidebar'])

const route = useRoute()
const router = useRouter()

const showNotifications = ref(false)
const showUserMenu = ref(false)
const notificationRef = ref(null)
const userRef = ref(null)

// 用户信息
const userInfo = ref({
  nickname: localStorage.getItem('nickname') || '张经理',
  email: localStorage.getItem('email') || 'admin@example.com',
  role: localStorage.getItem('userRole') || 'admin'
})

// 退出登录
const handleLogout = () => {
  // 清除本地存储
  localStorage.removeItem('userRole')
  localStorage.removeItem('userId')
  localStorage.removeItem('username')
  localStorage.removeItem('nickname')
  localStorage.removeItem('email')

  // 跳转到登录页
  router.push('/')
}

const pageTitle = computed(() => {
  const titles = {
    '/dashboard': '仪表盘',
    '/users': '用户管理',
    '/orders': '订单管理',
    '/statistics': '数据统计',
    '/products': '产品管理',
    '/settings': '系统设置',
    '/permissions': '权限管理',
    '/help': '帮助中心'
  }
  return titles[route.path] || '管理后台'
})

const notifications = ref([
  { title: '新订单 #ORD-001', type: 'success', time: '5分钟前' },
  { title: '库存预警：产品A库存不足', type: 'warning', time: '1小时前' },
  { title: '系统更新可用', type: 'info', time: '2小时前' }
])

const handleClickOutside = (event) => {
  if (notificationRef.value && !notificationRef.value.contains(event.target)) {
    showNotifications.value = false
  }
  if (userRef.value && !userRef.value.contains(event.target)) {
    showUserMenu.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.2s ease;
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
