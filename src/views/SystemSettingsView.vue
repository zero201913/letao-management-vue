<template>
  <div class="space-y-6">
    <h2 class="text-2xl font-bold text-surface-800 dark:text-white">系统设置</h2>

    <BaseCard title="基本设置">
      <div class="space-y-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="font-medium text-surface-800 dark:text-white">深色模式</p>
            <p class="text-sm text-surface-500 mt-1">启用深色主题以保护眼睛</p>
          </div>
          <button
            @click="themeStore.toggleTheme()"
            class="relative w-14 h-7 rounded-full transition-colors duration-300"
            :class="themeStore.isDark ? 'bg-primary-600' : 'bg-surface-300'"
          >
            <span
              class="absolute top-1 w-5 h-5 bg-white rounded-full transition-all duration-300 shadow"
              :class="themeStore.isDark ? 'left-8' : 'left-1'"
            ></span>
          </button>
        </div>

        <div class="flex items-center justify-between border-t border-surface-200 dark:border-surface-700 pt-6">
          <div>
            <p class="font-medium text-surface-800 dark:text-white">邮件通知</p>
            <p class="text-sm text-surface-500 mt-1">接收系统重要通知邮件</p>
          </div>
          <button
            class="relative w-14 h-7 rounded-full transition-colors duration-300"
            :class="settings.emailNotify ? 'bg-primary-600' : 'bg-surface-300'"
            @click="settings.emailNotify = !settings.emailNotify"
          >
            <span
              class="absolute top-1 w-5 h-5 bg-white rounded-full transition-all duration-300 shadow"
              :class="settings.emailNotify ? 'left-8' : 'left-1'"
            ></span>
          </button>
        </div>

        <div class="flex items-center justify-between border-t border-surface-200 dark:border-surface-700 pt-6">
          <div>
            <p class="font-medium text-surface-800 dark:text-white">自动登录</p>
            <p class="text-sm text-surface-500 mt-1">下次访问时自动登录账户</p>
          </div>
          <button
            class="relative w-14 h-7 rounded-full transition-colors duration-300"
            :class="settings.autoLogin ? 'bg-primary-600' : 'bg-surface-300'"
            @click="settings.autoLogin = !settings.autoLogin"
          >
            <span
              class="absolute top-1 w-5 h-5 bg-white rounded-full transition-all duration-300 shadow"
              :class="settings.autoLogin ? 'left-8' : 'left-1'"
            ></span>
          </button>
        </div>
      </div>
    </BaseCard>

    <BaseCard title="个人信息">
      <div class="space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="label">用户名</label>
            <input type="text" v-model="profile.username" class="input" />
          </div>
          <div>
            <label class="label">邮箱</label>
            <input type="email" v-model="profile.email" class="input" />
          </div>
          <div>
            <label class="label">手机号</label>
            <input type="tel" v-model="profile.phone" class="input" />
          </div>
          <div>
            <label class="label">角色</label>
            <input type="text" :value="profile.role" class="input bg-surface-100 dark:bg-surface-700" disabled />
          </div>
        </div>
        <div class="flex justify-end pt-4">
          <BaseButton variant="primary">保存更改</BaseButton>
        </div>
      </div>
    </BaseCard>

    <BaseCard title="安全设置">
      <div class="space-y-4">
        <div>
          <label class="label">当前密码</label>
          <input type="password" v-model="security.currentPassword" class="input" placeholder="请输入当前密码" />
        </div>
        <div>
          <label class="label">新密码</label>
          <input type="password" v-model="security.newPassword" class="input" placeholder="请输入新密码" />
        </div>
        <div>
          <label class="label">确认新密码</label>
          <input type="password" v-model="security.confirmPassword" class="input" placeholder="请确认新密码" />
        </div>
        <div class="flex justify-end pt-4">
          <BaseButton variant="primary">修改密码</BaseButton>
        </div>
      </div>
    </BaseCard>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useThemeStore } from '../stores/theme'
import BaseCard from '../components/UI/BaseCard.vue'
import BaseButton from '../components/UI/BaseButton.vue'

const themeStore = useThemeStore()

const settings = reactive({
  emailNotify: true,
  autoLogin: false
})

const profile = reactive({
  username: '张经理',
  email: 'admin@example.com',
  phone: '138****8888',
  role: '管理员'
})

const security = reactive({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})
</script>
