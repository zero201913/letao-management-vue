<template>
  <div class="relative" ref="triggerRef">
    <div @click="toggle" class="cursor-pointer">
      <slot name="trigger">
        <BaseButton variant="ghost" size="sm">
          <i class="fas fa-ellipsis-v"></i>
        </BaseButton>
      </slot>
    </div>
    <Transition name="dropdown">
      <div
        v-if="visible"
        class="dropdown-menu"
        :class="[placement === 'bottom-start' ? 'left-0' : 'right-0']"
      >
        <slot>
          <div
            v-for="(item, index) in items"
            :key="index"
            :class="[
              'dropdown-item',
              { 'border-t border-surface-100 dark:border-surface-700': item.divided },
              { 'text-danger-500': item.danger }
            ]"
            @click="handleItemClick(item)"
          >
            <i v-if="item.icon" :class="item.icon"></i>
            <span>{{ item.label }}</span>
          </div>
        </slot>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import BaseButton from './BaseButton.vue'

const props = defineProps({
  placement: {
    type: String,
    default: 'bottom-end'
  },
  trigger: {
    type: String,
    default: 'click'
  },
  items: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['select'])

const visible = ref(false)
const triggerRef = ref(null)

const toggle = () => {
  visible.value = !visible.value
}

const close = () => {
  visible.value = false
}

const handleItemClick = (item) => {
  if (!item.disabled) {
    emit('select', item)
    close()
  }
}

const handleClickOutside = (event) => {
  if (triggerRef.value && !triggerRef.value.contains(event.target)) {
    close()
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
