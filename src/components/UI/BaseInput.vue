<template>
  <div class="w-full">
    <div v-if="label || $slots.label" class="flex items-center justify-between mb-2">
      <label class="label">
        <slot name="label">{{ label }}</slot>
      </label>
      <span v-if="showCount" class="text-xs text-surface-500">
        {{ modelValue.length }}/{{ maxlength }}
      </span>
    </div>
    <div class="relative">
      <i v-if="prefixIcon" :class="['absolute left-3 top-1/2 -translate-y-1/2 text-surface-400', prefixIcon]"></i>
      <input
        :type="type"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :readonly="readonly"
        :maxlength="maxlength"
        :class="inputClasses"
        @input="$emit('update:modelValue', $event.target.value)"
        @blur="$emit('blur', $event)"
        @focus="$emit('focus', $event)"
      />
      <i v-if="suffixIcon" :class="['absolute right-3 top-1/2 -translate-y-1/2 text-surface-400', suffixIcon]"></i>
    </div>
    <p v-if="error" class="mt-1.5 text-sm text-danger-500">{{ error }}</p>
    <p v-else-if="hint" class="mt-1.5 text-sm text-surface-500 dark:text-surface-400">{{ hint }}</p>
  </div>
</template>

<script setup>
import { computed } from 'vue'

defineProps({
  modelValue: {
    type: [String, Number],
    default: ''
  },
  type: {
    type: String,
    default: 'text'
  },
  label: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: ''
  },
  disabled: {
    type: Boolean,
    default: false
  },
  readonly: {
    type: Boolean,
    default: false
  },
  error: {
    type: String,
    default: ''
  },
  hint: {
    type: String,
    default: ''
  },
  prefixIcon: {
    type: String,
    default: ''
  },
  suffixIcon: {
    type: String,
    default: ''
  },
  maxlength: {
    type: Number,
    default: undefined
  },
  showCount: {
    type: Boolean,
    default: false
  },
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['sm', 'md', 'lg'].includes(value)
  }
})

defineEmits(['update:modelValue', 'blur', 'focus'])

const sizeClasses = {
  sm: 'px-3 py-2 text-sm',
  md: 'px-4 py-2.5',
  lg: 'px-5 py-3 text-lg'
}

const inputClasses = computed(() => {
  return [
    'w-full bg-white dark:bg-surface-700 border border-surface-300 dark:border-surface-600 rounded-lg text-surface-900 dark:text-surface-100 placeholder-surface-400 dark:placeholder-surface-500',
    'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200',
    'disabled:bg-surface-100 dark:disabled:bg-surface-800 disabled:cursor-not-allowed',
    'disabled:opacity-50',
    'dark:text-white',
    sizeClasses[props.size]
  ].join(' ')
})
</script>
