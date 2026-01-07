<template>
  <div class="progress" :class="{ 'striped': striped, 'animated': striped && animated }">
    <div
      class="progress-bar"
      :class="[colorClass]"
      :style="{ width: `${percentage}%` }"
    ></div>
  </div>
  <div v-if="showLabel" class="flex justify-between mt-1">
    <span class="text-sm text-surface-600 dark:text-surface-400">{{ label }}</span>
    <span class="text-sm font-medium" :class="textColorClass">{{ percentage }}%</span>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  percentage: {
    type: Number,
    default: 0,
    validator: (value) => value >= 0 && value <= 100
  },
  color: {
    type: String,
    default: 'primary',
    validator: (value) => ['primary', 'success', 'warning', 'danger'].includes(value)
  },
  label: {
    type: String,
    default: ''
  },
  showLabel: {
    type: Boolean,
    default: false
  },
  striped: {
    type: Boolean,
    default: false
  },
  animated: {
    type: Boolean,
    default: false
  }
})

const colorClass = computed(() => {
  const colors = {
    primary: 'bg-primary-600',
    success: 'bg-success-500',
    warning: 'bg-warning-500',
    danger: 'bg-danger-500'
  }
  return colors[props.color]
})

const textColorClass = computed(() => {
  const colors = {
    primary: 'text-primary-600',
    success: 'text-success-600',
    warning: 'text-warning-600',
    danger: 'text-danger-600'
  }
  return colors[props.color]
})
</script>

<style scoped>
.progress.striped .progress-bar {
  background-image: linear-gradient(
    45deg,
    rgba(255, 255, 255, 0.15) 25%,
    transparent 25%,
    transparent 50%,
    rgba(255, 255, 255, 0.15) 50%,
    rgba(255, 255, 255, 0.15) 75%,
    transparent 75%,
    transparent
  );
  background-size: 1rem 1rem;
}

.progress.animated .progress-bar {
  animation: progress-stripes 1s linear infinite;
}

@keyframes progress-stripes {
  from {
    background-position: 1rem 0;
  }
  to {
    background-position: 0 0;
  }
}
</style>
