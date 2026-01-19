<template>
  <div class="introduction-page">
    <!-- 波浪背景 -->
    <WaveBackground
      ref="waveBackgroundRef"
      :particleColor="'#3b82f6'"
      :waveSpeed="0.6"
      :waveHeight="60"
      :particleSize="12"
      :particleCountX="35"
      :particleCountY="25"
      :separation="90"
      :mouseInteraction="true"
      class="z-0"
    />

    <!-- 主要内容区域 -->
    <div class="relative z-10 min-h-screen">
      <!-- 页面标题 -->
      <div class="absolute top-4 left-6 z-20 flex items-center space-x-3">
        <img src="@/assets/store.png" alt="Logo" class="w-10 h-10 rounded-full object-cover">
        <div class="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
          Letao 管理系统
        </div>
      </div>

      <!-- 登录表单区域 -->
      <section class="container mx-auto px-4 py-20 min-h-screen flex items-center justify-center">
        <BaseCard class="max-w-md w-full shadow-xl backdrop-blur-md bg-white/10 border border-white/20 fade-in">
          <div class="text-center mb-8">
            <h2 class="text-3xl font-bold text-gray-800 dark:text-white mb-2">欢迎登录</h2>
            <p class="text-gray-500 dark:text-gray-300">请输入您的账号和密码</p>
          </div>

          <div class="space-y-6">
            <!-- 用户名输入 -->
            <BaseInput
              v-model="formData.username"
              label="用户名"
              placeholder="请输入用户名"
              prefixIcon="fas fa-user"
              :error="errors.username"
              size="md"
            />

            <!-- 密码输入 -->
            <BaseInput
              v-model="formData.password"
              label="密码"
              type="password"
              placeholder="请输入密码"
              prefixIcon="fas fa-lock"
              :error="errors.password"
              size="md"
            />

            <!-- 登录按钮 -->
            <BaseButton
              variant="primary"
              size="lg"
              block
              :loading="loading"
              @click="handleLogin"
            >
              登录
            </BaseButton>
          </div>
        </BaseCard>
      </section>


    </div>
  </div>
</template>

<script setup>
import WaveBackground from '../components/WaveBackground.vue';
import BaseCard from '../components/UI/BaseCard.vue';
import BaseInput from '../components/UI/BaseInput.vue';
import BaseButton from '../components/UI/BaseButton.vue';
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useThemeStore } from '../stores/theme.js';
import usersData from '../data/users.js';

const waveBackgroundRef = ref(null);
const router = useRouter();
const themeStore = useThemeStore();

// 表单数据
const formData = ref({
  username: '',
  password: ''
});

// 错误信息
const errors = ref({
  username: '',
  password: ''
});

// 加载状态
const loading = ref(false);

// 登录函数
const handleLogin = () => {
  // 表单验证
  if (!validateForm()) return;

  loading.value = true;

  // 模拟登录请求
  setTimeout(() => {
    // 查找用户
    const user = usersData.find(u => u.username === formData.value.username);

    if (!user) {
      loading.value = false;
      errors.value.username = '用户名不存在';
      return;
    }

    if (user.status !== 1) {
      loading.value = false;
      errors.value.username = '用户账号已被禁用';
      return;
    }

    if (user.is_deleted) {
      loading.value = false;
      errors.value.username = '用户账号已被删除';
      return;
    }

    // 简化的密码验证（实际项目中应该使用bcrypt等库进行哈希验证）
    // 这里假设密码是明文'admin123'，与存储的哈希值进行匹配
    if (formData.value.password !== 'admin123') {
      loading.value = false;
      errors.value.password = '密码错误';
      return;
    }

    loading.value = false;

    // 登录成功，存储用户信息
    localStorage.setItem('userRole', user.user_type === 3 ? 'admin' : user.user_type === 2 ? 'merchant' : 'user');
    localStorage.setItem('userId', user.user_id);
    localStorage.setItem('username', user.username);
    localStorage.setItem('nickname', user.nickname);
    localStorage.setItem('email', user.email);

    // 跳转到dashboard页面
    router.push('/dashboard');
  }, 1500);
};

// 表单验证函数
const validateForm = () => {
  let isValid = true;

  // 重置错误信息
  errors.value = {
    username: '',
    password: ''
  };

  // 验证用户名
  if (!formData.value.username.trim()) {
    errors.value.username = '用户名不能为空';
    isValid = false;
  }

  // 验证密码
  if (!formData.value.password.trim()) {
    errors.value.password = '密码不能为空';
    isValid = false;
  } else if (formData.value.password.length < 6) {
    errors.value.password = '密码长度不能少于6位';
    isValid = false;
  }

  return isValid;
};

// 初始化主题
onMounted(() => {
  themeStore.initTheme();
});
</script>

<style scoped>
.introduction-page {
  min-height: 100vh;
  position: relative;
  overflow-x: hidden;
  background: linear-gradient(to bottom, #f3f4f6, #e5e7eb);
}

.dark .introduction-page {
  background: linear-gradient(to bottom, #0f172a, #1e293b);
}

/* 自定义动画效果 */
.fade-in {
  animation: fadeIn 1.5s ease-in-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.floating {
  animation: floating 3s ease-in-out infinite;
}

@keyframes floating {
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
}

/* 自定义滚动条 */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
}

::-webkit-scrollbar-thumb {
  background: rgba(59, 130, 246, 0.6);
  border-radius: 10px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(59, 130, 246, 0.8);
}

.z-0 {
  z-index: 0;
}

.z-10 {
  z-index: 10;
}

.z-20 {
  z-index: 20;
}
</style>
