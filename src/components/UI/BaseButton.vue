<template>
  <button
    :type="nativeType"
    :class="buttonClasses"
    :disabled="disabled || loading"
    @click="handleClick"
  >
    <FontAwesomeIcon v-if="loading" icon="spinner" spin class="mr-2" />
    <FontAwesomeIcon v-else-if="icon" :icon="icon.replace('fas fa-', '')" class="mr-2" />
    <slot></slot>
  </button>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  variant: {
    type: String,
    default: 'primary',
    validator: (value) => ['primary', 'secondary', 'success', 'warning', 'danger', 'outline', 'ghost'].includes(value)
  },
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['sm', 'md', 'lg'].includes(value)
  },
  nativeType: {
    type: String,
    default: 'button'
  },
  disabled: {
    type: Boolean,
    default: false
  },
  loading: {
    type: Boolean,
    default: false
  },
  icon: {
    type: String,
    default: ''
  },
  block: {
    type: Boolean,
    default: false
  },
  rounded: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['click'])

const sizeClasses = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2',
  lg: 'px-6 py-3 text-lg'
}

const variantClasses = {
  primary: 'bg-primary-600 text-white hover:bg-primary-700 active:bg-primary-800 shadow-sm hover:shadow-md',
  secondary: 'bg-surface-200 text-surface-700 hover:bg-surface-300 active:bg-surface-400 dark:bg-surface-600 dark:text-surface-200 dark:hover:bg-surface-500',
  success: 'bg-success-500 text-white hover:bg-success-600 active:bg-success-700',
  warning: 'bg-warning-500 text-white hover:bg-warning-600 active:bg-warning-700',
  danger: 'bg-danger-500 text-white hover:bg-danger-600 active:bg-danger-700',
  outline: 'border-2 border-primary-600 text-primary-600 hover:bg-primary-50 active:bg-primary-100 dark:border-primary-400 dark:text-primary-400 dark:hover:bg-primary-900/30',
  ghost: 'text-surface-600 hover:bg-surface-100 active:bg-surface-200 dark:text-surface-300 dark:hover:bg-surface-700'
}

const buttonClasses = computed(() => {
  const classes = [
    'inline-flex items-center justify-center font-medium rounded-button transition-all duration-200 cursor-pointer',
    'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
    'disabled:opacity-50 disabled:cursor-not-allowed',
    sizeClasses[props.size],
    variantClasses[props.variant]
  ]
  
  if (props.rounded) {
    classes.push('rounded-full')
  }
  
  if (props.block) {
    classes.push('w-full')
  }
  
  return classes.join(' ')
})

const handleClick = (event) => {
  if (!props.disabled && !props.loading) {
    emit('click', event)
  }
}
</script>
