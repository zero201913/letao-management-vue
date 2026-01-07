<template>
  <div class="table-container scrollbar-thin">
    <table class="table">
      <thead v-if="headers.length > 0">
        <tr>
          <th
            v-for="header in headers"
            :key="header.key"
            :class="[
              header.align === 'center' ? 'text-center' : '',
              header.align === 'right' ? 'text-right' : '',
              header.sortable ? 'cursor-pointer select-none hover:bg-surface-200 dark:hover:bg-surface-700' : ''
            ]"
            @click="header.sortable && handleSort(header.key)"
          >
            <div class="flex items-center gap-2" :class="{ 'justify-center': header.align === 'center', 'justify-end': header.align === 'right' }">
              {{ header.label }}
              <i
                v-if="header.sortable"
                :class="[
                  'fas text-xs transition-colors',
                  sortKey === header.key
                    ? 'text-primary-600'
                    : 'text-surface-400'
                ]"
                :class="sortKey === header.key && sortOrder === 'desc' ? 'fa-sort-down' : 'fa-sort-up'"
              ></i>
            </div>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="loading">
          <td :colspan="headers.length || 1" class="text-center py-12">
            <i class="fas fa-spinner fa-spin text-2xl text-primary-500"></i>
            <p class="mt-2 text-surface-500">加载中...</p>
          </td>
        </tr>
        <tr v-else-if="data.length === 0">
          <td :colspan="headers.length || 1" class="text-center py-12">
            <i class="fas fa-inbox text-4xl text-surface-300 dark:text-surface-600"></i>
            <p class="mt-2 text-surface-500">{{ emptyText }}</p>
          </td>
        </tr>
        <template v-else>
          <tr
            v-for="(row, rowIndex) in data"
            :key="rowIndex"
            :class="{ 'cursor-pointer': clickable }"
            @click="handleRowClick(row, rowIndex)"
          >
            <td
              v-for="header in headers"
              :key="header.key"
              :class="[
                'text-surface-700 dark:text-surface-300',
                header.align === 'center' ? 'text-center' : '',
                header.align === 'right' ? 'text-right' : ''
              ]"
            >
              <slot :name="`cell-${header.key}`" :row="row" :index="rowIndex" :value="row[header.key]">
                {{ row[header.key] }}
              </slot>
            </td>
          </tr>
        </template>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  data: {
    type: Array,
    default: () => []
  },
  headers: {
    type: Array,
    default: () => []
  },
  loading: {
    type: Boolean,
    default: false
  },
  emptyText: {
    type: String,
    default: '暂无数据'
  },
  clickable: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['row-click', 'sort'])

const sortKey = ref('')
const sortOrder = ref('asc')

const handleSort = (key) => {
  if (sortKey.value === key) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortKey.value = key
    sortOrder.value = 'asc'
  }
  emit('sort', { key: sortKey.value, order: sortOrder.value })
}

const handleRowClick = (row, index) => {
  if (props.clickable) {
    emit('row-click', row, index)
  }
}
</script>
