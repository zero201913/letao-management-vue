<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="modelValue" class="modal-overlay" @click.self="handleOverlayClick">
        <div :class="modalClasses" :style="{ maxWidth: maxWidth }">
          <div v-if="$slots.header || title" class="flex items-center justify-between p-6 border-b border-surface-200 dark:border-surface-700">
            <slot name="header">
              <div>
                <h3 class="text-xl font-semibold text-surface-800 dark:text-white">{{ title }}</h3>
                <p v-if="subtitle" class="text-sm text-surface-500 dark:text-surface-400 mt-1">{{ subtitle }}</p>
              </div>
            </slot>
            <button
              v-if="showClose"
              @click="close"
              class="p-2 rounded-lg text-surface-400 hover:text-surface-600 hover:bg-surface-100 dark:hover:bg-surface-700 transition-colors"
            >
              <i class="fas fa-times text-lg"></i>
            </button>
          </div>
          <div :class="['p-6', bodyClass]">
            <slot></slot>
          </div>
          <div v-if="$slots.footer" class="p-6 pt-0 border-surface-200 dark:border-surface-700">
            <slot name="footer"></slot>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { computed, watch } from 'vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: ''
  },
  subtitle: {
    type: String,
    default: ''
  },
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['sm', 'md', 'lg', 'xl', 'full'].includes(value)
  },
  showClose: {
    type: Boolean,
    default: true
  },
  closeOnOverlay: {
    type: Boolean,
    default: true
  },
  bodyClass: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['update:modelValue', 'close'])

const sizeMap = {
  sm: 'max-w-sm',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
  full: 'max-w-full mx-4'
}

const modalClasses = computed(() => {
  const baseClasses = [
    'bg-white dark:bg-surface-800 rounded-2xl shadow-modal w-full animate-scale-in',
    'max-h-[90vh] overflow-hidden flex flex-col'
  ]
  return [...baseClasses, sizeMap[props.size]].join(' ')
})

const maxWidth = computed(() => {
  if (props.size === 'full') return 'calc(100vw - 2rem)'
  return undefined
})

const close = () => {
  emit('update:modelValue', false)
  emit('close')
}

const handleOverlayClick = () => {
  if (props.closeOnOverlay) {
    close()
  }
}

watch(() => props.modelValue, (val) => {
  if (val) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
  }
})
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: all 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .modal-content,
.modal-leave-to .modal-content {
  transform: scale(0.95) translateY(10px);
}
</style>
