<template>
  <div :class="cardClasses">
    <div v-if="$slots.header || title" class="mb-4 ml-1">
      <slot name="header">
        <h3 :class="['text-lg font-semibold text-surface-800 dark:text-white', hasTable ? 'ml-6 pt-4' : '']">{{ title }}</h3>
        <p v-if="subtitle" class="text-sm text-surface-500 dark:text-surface-400 mt-1">{{ subtitle }}</p>
      </slot>
    </div>
    <div :class="contentClass">
      <slot></slot>
    </div>
    <div v-if="$slots.footer" class="mt-4 pt-4 border-t border-surface-200 dark:border-surface-700 px-6">
      <slot name="footer"></slot>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  title: {
    type: String,
    default: ''
  },
  subtitle: {
    type: String,
    default: ''
  },
  hover: {
    type: Boolean,
    default: false
  },
  padding: {
    type: Boolean,
    default: true
  },
  bordered: {
    type: Boolean,
    default: false
  },
  hasTable: {
    type: Boolean,
    default: false
  }
})

const cardClasses = computed(() => {
  const classes = [
    'bg-white dark:bg-surface-800 rounded-card shadow-card px-6 py-5',
    'transition-all duration-300'
  ]

  if (props.hover) {
    classes.push('hover:shadow-card-hover hover:-translate-y-1 cursor-pointer')
  }

  if (!props.padding) {
    classes.push('!p-0')
  }

  if (props.bordered) {
    classes.push('border border-surface-200 dark:border-surface-700')
  }

  return classes.join(' ')
})

const contentClass = computed(() => {
  return props.padding ? 'px-2' : ''
})
</script>
