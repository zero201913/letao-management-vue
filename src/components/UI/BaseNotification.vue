<template>
  <Teleport to="body">
    <Transition name="notification">
      <div
        v-if="visible"
        :class="[
          'fixed top-4 right-4 z-50 max-w-sm w-full p-4 rounded-xl shadow-dropdown',
          'bg-white dark:bg-surface-800 border',
          borderClass
        ]"
      >
        <div class="flex items-start gap-3">
          <div :class="['p-2 rounded-lg', iconBgClass]">
            <i :class="[icon, iconClass]"></i>
          </div>
          <div class="flex-1 min-w-0">
            <h4 class="font-medium text-surface-800 dark:text-white">{{ title }}</h4>
            <p v-if="message" class="mt-1 text-sm text-surface-600 dark:text-surface-300">{{ message }}</p>
          </div>
          <button
            @click="close"
            class="p-1 rounded-lg text-surface-400 hover:text-surface-600 hover:bg-surface-100 dark:hover:bg-surface-700 transition-colors"
          >
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div v-if="duration > 0" class="mt-3 h-1 bg-surface-200 dark:bg-surface-700 rounded-full overflow-hidden">
          <div
            class="h-full transition-all ease-linear"
            :class="iconBgClass"
            :style="{ width: `${progress}%`, transitionDuration: `${duration}ms` }"
          ></div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  type: {
    type: String,
    default: 'info',
    validator: (value) => ['success', 'warning', 'danger', 'info'].includes(value)
  },
  title: {
    type: String,
    default: ''
  },
  message: {
    type: String,
    default: ''
  },
  duration: {
    type: Number,
    default: 3000
  },
  closable: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['close'])

const visible = ref(true)
const progress = ref(100)
let timer = null

const typeMap = {
  success: { icon: 'fa-check', color: 'success' },
  warning: { icon: 'fa-exclamation', color: 'warning' },
  danger: { icon: 'fa-times', color: 'danger' },
  info: { icon: 'fa-info', color: 'primary' }
}

const icon = computed(() => typeMap[props.type].icon)

const iconClass = computed(() => {
  const colors = {
    success: 'text-success-500',
    warning: 'text-warning-500',
    danger: 'text-danger-500',
    info: 'text-primary-500'
  }
  return colors[props.type]
})

const iconBgClass = computed(() => {
  const colors = {
    success: 'bg-success-100 dark:bg-success-900/30',
    warning: 'bg-warning-100 dark:bg-warning-900/30',
    danger: 'bg-danger-100 dark:bg-danger-900/30',
    info: 'bg-primary-100 dark:bg-primary-900/30'
  }
  return colors[props.type]
})

const borderClass = computed(() => {
  const colors = {
    success: 'border-success-200 dark:border-success-800',
    warning: 'border-warning-200 dark:border-warning-800',
    danger: 'border-danger-200 dark:border-danger-800',
    info: 'border-primary-200 dark:border-primary-800'
  }
  return colors[props.type]
})

const close = () => {
  visible.value = false
  if (timer) clearInterval(timer)
  setTimeout(() => emit('close'), 300)
}

onMounted(() => {
  if (props.duration > 0) {
    const startTime = Date.now()
    timer = setInterval(() => {
      const elapsed = Date.now() - startTime
      progress.value = Math.max(0, 100 - (elapsed / props.duration) * 100)
      if (progress.value <= 0) {
        close()
      }
    }, 50)
  }
})

onUnmounted(() => {
  if (timer) clearInterval(timer)
})
</script>

<style scoped>
.notification-enter-active,
.notification-leave-active {
  transition: all 0.3s ease;
}

.notification-enter-from,
.notification-leave-to {
  opacity: 0;
  transform: translateX(100%);
}
</style>
