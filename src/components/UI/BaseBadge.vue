<template>
  <div class="badge" :class="[variantClass, sizeClass, roundClass]">
    <slot></slot>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  variant: {
    type: String,
    default: 'primary',
    validator: (value) => ['primary', 'success', 'warning', 'danger', 'info', 'surface'].includes(value)
  },
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['sm', 'md', 'lg'].includes(value)
  },
  round: {
    type: Boolean,
    default: false
  },
  outline: {
    type: Boolean,
    default: false
  }
})

const variantClass = computed(() => {
  const variants = {
    primary: 'bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200',
    success: 'bg-success-100 text-success-800 dark:bg-success-900 dark:text-success-200',
    warning: 'bg-warning-100 text-warning-800 dark:bg-warning-900 dark:text-warning-200',
    danger: 'bg-danger-100 text-danger-800 dark:bg-danger-900 dark:text-danger-200',
    info: 'bg-surface-100 text-surface-800 dark:bg-surface-700 dark:text-surface-200',
    surface: 'bg-surface-200 text-surface-700 dark:bg-surface-600 dark:text-surface-200'
  }
  
  if (props.outline) {
    return `border border-${props.variant}-500 text-${props.variant}-600 bg-transparent dark:text-${props.variant}-400`
  }
  
  return variants[props.variant]
})

const sizeClass = computed(() => {
  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-0.5 text-sm',
    lg: 'px-3 py-1 text-base'
  }
  return sizes[props.size]
})

const roundClass = computed(() => {
  return props.round ? 'rounded-full' : 'rounded-badge'
})
</script>
