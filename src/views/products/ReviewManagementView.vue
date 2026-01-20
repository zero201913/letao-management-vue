<template>
  <div class="bg-surface-0 dark:bg-surface-900 min-h-screen">
    <!-- 页面头部 -->
    <div class="border-b border-surface-200 dark:border-surface-800">
      <div class="container mx-auto px-4 py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 class="text-2xl font-bold text-surface-800 dark:text-white">评价管理</h1>
          <p class="text-surface-500 dark:text-surface-400 mt-1">商品评价管理系统</p>
        </div>
      </div>
    </div>

    <!-- 主内容区 -->
    <div class="container mx-auto px-4 py-6">
      <!-- 筛选条件 -->
      <div class="bg-white dark:bg-surface-800 rounded-lg shadow-sm border border-surface-200 dark:border-surface-700 p-4 mb-6">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <!-- 用户ID搜索 -->
          <div>
            <label class="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">用户ID</label>
            <div class="relative">
              <FontAwesomeIcon icon="search" class="absolute left-3 top-1/2 transform -translate-y-1/2 text-surface-400" />
              <input
                type="text"
                v-model="filters.userId"
                @input="handleSearch"
                placeholder="请输入用户ID"
                class="w-full pl-10 pr-4 py-2 rounded-lg border border-surface-300 dark:border-surface-600 bg-surface-0 dark:bg-surface-900 text-surface-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
              />
            </div>
          </div>

          <!-- 商品ID搜索 -->
          <div>
            <label class="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">商品ID</label>
            <div class="relative">
              <FontAwesomeIcon icon="search" class="absolute left-3 top-1/2 transform -translate-y-1/2 text-surface-400" />
              <input
                type="text"
                v-model="filters.goodsId"
                @input="handleSearch"
                placeholder="请输入商品ID"
                class="w-full pl-10 pr-4 py-2 rounded-lg border border-surface-300 dark:border-surface-600 bg-surface-0 dark:bg-surface-900 text-surface-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
              />
            </div>
          </div>

          <!-- 评论时间开始 -->
          <div>
            <label class="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">开始时间</label>
            <input
              type="datetime-local"
              v-model="filters.startDate"
              @input="handleSearch"
              class="w-full px-4 py-2 rounded-lg border border-surface-300 dark:border-surface-600 bg-surface-0 dark:bg-surface-900 text-surface-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
            />
          </div>

          <!-- 评论时间结束 -->
          <div>
            <label class="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">结束时间</label>
            <input
              type="datetime-local"
              v-model="filters.endDate"
              @input="handleSearch"
              class="w-full px-4 py-2 rounded-lg border border-surface-300 dark:border-surface-600 bg-surface-0 dark:bg-surface-900 text-surface-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
            />
          </div>
        </div>
      </div>

      <!-- 表格区域 -->
      <div class="bg-white dark:bg-surface-800 rounded-lg shadow-sm border border-surface-200 dark:border-surface-700 overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead>
              <tr class="bg-surface-50 dark:bg-surface-800/50 border-b border-surface-200 dark:border-surface-700">
                <th
                  v-for="column in columns"
                  :key="column.key"
                  @click="handleSort(column.key)"
                  class="px-4 py-3 text-left text-sm font-medium text-surface-700 dark:text-surface-300 cursor-pointer hover:bg-surface-100 dark:hover:bg-surface-700/50 transition-all"
                >
                  <div class="flex items-center gap-1">
                    <span>{{ column.label }}</span>
                    <FontAwesomeIcon
                      v-if="sortConfig.key === column.key"
                      :icon="sortConfig.direction === 'asc' ? 'sort-up' : 'sort-down'"
                      class="text-xs"
                    />
                    <FontAwesomeIcon
                      v-else
                      icon="sort"
                      class="text-xs text-surface-400"
                    />
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="comment in paginatedComments"
                :key="comment.comment_id"
                class="border-b border-surface-200 dark:border-surface-700 hover:bg-surface-50 dark:hover:bg-surface-800/50 transition-all"
              >
                <td class="px-4 py-3 text-sm text-surface-800 dark:text-white">{{ comment.comment_id }}</td>
                <td class="px-4 py-3 text-sm text-surface-800 dark:text-white">{{ comment.user_id }}</td>
                <td class="px-4 py-3 text-sm text-surface-800 dark:text-white">{{ comment.nickname }}</td>
                <td class="px-4 py-3 text-sm text-surface-800 dark:text-white">{{ comment.goods_id }}</td>
                <td class="px-4 py-3">
                  <img
                    :src="comment.goods_thumbnail"
                    :alt="comment.goods_name"
                    class="w-12 h-12 rounded object-cover"
                  />
                </td>
                <td class="px-4 py-3 text-sm text-surface-800 dark:text-white">
                  <div class="max-w-xs truncate" :title="comment.goods_name">{{ comment.goods_name }}</div>
                </td>
                <td class="px-4 py-3 text-sm text-surface-800 dark:text-white">
                  <div class="max-w-md">{{ comment.content }}</div>
                </td>
                <td class="px-4 py-3 text-sm text-surface-800 dark:text-white">{{ comment.like_count }}</td>
                <td class="px-4 py-3 text-sm text-surface-800 dark:text-white">{{ comment.created_at }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- 加载状态 -->
        <div v-if="loading" class="py-10 flex justify-center items-center">
          <div class="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-500"></div>
        </div>

        <!-- 空状态 -->
        <div v-else-if="paginatedComments.length === 0" class="py-10 flex flex-col justify-center items-center">
          <FontAwesomeIcon icon="comment-slash" class="text-4xl text-surface-300 dark:text-surface-600 mb-2" />
          <p class="text-surface-500 dark:text-surface-400">暂无评论数据</p>
        </div>

        <!-- 分页控件 -->
        <div v-else class="px-4 py-3 border-t border-surface-200 dark:border-surface-700 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div class="text-sm text-surface-500 dark:text-surface-400">
            显示 {{ (currentPage - 1) * pageSize + 1 }} 到 {{ Math.min(currentPage * pageSize, filteredComments.length) }} 条，共 {{ filteredComments.length }} 条
          </div>
          <div class="flex items-center gap-2">
            <select
              v-model="pageSize"
              @change="handlePageSizeChange"
              class="px-2 py-1 rounded border border-surface-300 dark:border-surface-600 bg-surface-0 dark:bg-surface-900 text-surface-800 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="5">5条/页</option>
              <option value="10">10条/页</option>
              <option value="20">20条/页</option>
              <option value="50">50条/页</option>
            </select>
            <div class="flex items-center gap-1">
              <button
                @click="currentPage = 1"
                :disabled="currentPage === 1"
                class="px-3 py-1 rounded border border-surface-300 dark:border-surface-600 bg-surface-0 dark:bg-surface-900 text-surface-800 dark:text-white text-sm hover:bg-surface-100 dark:hover:bg-surface-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                首页
              </button>
              <button
                @click="currentPage--"
                :disabled="currentPage === 1"
                class="px-3 py-1 rounded border border-surface-300 dark:border-surface-600 bg-surface-0 dark:bg-surface-900 text-surface-800 dark:text-white text-sm hover:bg-surface-100 dark:hover:bg-surface-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                上一页
              </button>
              <span class="px-3 py-1 text-sm text-surface-800 dark:text-white bg-surface-100 dark:bg-surface-800 rounded border border-surface-300 dark:border-surface-600">
                {{ currentPage }}
              </span>
              <button
                @click="currentPage++"
                :disabled="currentPage === totalPages"
                class="px-3 py-1 rounded border border-surface-300 dark:border-surface-600 bg-surface-0 dark:bg-surface-900 text-surface-800 dark:text-white text-sm hover:bg-surface-100 dark:hover:bg-surface-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                下一页
              </button>
              <button
                @click="currentPage = totalPages"
                :disabled="currentPage === totalPages"
                class="px-3 py-1 rounded border border-surface-300 dark:border-surface-600 bg-surface-0 dark:bg-surface-900 text-surface-800 dark:text-white text-sm hover:bg-surface-100 dark:hover:bg-surface-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                末页
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import commentsData from '../../data/comments.js'

// 表格列配置
const columns = [
  { key: 'comment_id', label: '评论ID' },
  { key: 'user_id', label: '用户ID' },
  { key: 'nickname', label: '用户昵称' },
  { key: 'goods_id', label: '商品ID' },
  { key: 'goods_thumbnail', label: '商品图片' },
  { key: 'goods_name', label: '商品名称' },
  { key: 'content', label: '评论内容' },
  { key: 'like_count', label: '点赞数' },
  { key: 'created_at', label: '创建时间' }
]

// 响应式数据
const comments = ref([])
const loading = ref(false)
const filters = ref({
  userId: '',
  goodsId: '',
  startDate: '',
  endDate: ''
})
const sortConfig = ref({
  key: null,
  direction: 'asc'
})
const currentPage = ref(1)
const pageSize = ref(10)

// 计算属性
const filteredComments = computed(() => {
  let result = [...comments.value]

  // 用户ID筛选
  if (filters.value.userId) {
    const userId = parseInt(filters.value.userId)
    result = result.filter(comment => comment.user_id === userId)
  }

  // 商品ID筛选
  if (filters.value.goodsId) {
    const goodsId = parseInt(filters.value.goodsId)
    result = result.filter(comment => comment.goods_id === goodsId)
  }

  // 开始时间筛选
  if (filters.value.startDate) {
    const startDate = new Date(filters.value.startDate)
    result = result.filter(comment => {
      const commentDate = new Date(comment.created_at)
      return commentDate >= startDate
    })
  }

  // 结束时间筛选
  if (filters.value.endDate) {
    const endDate = new Date(filters.value.endDate)
    result = result.filter(comment => {
      const commentDate = new Date(comment.created_at)
      return commentDate <= endDate
    })
  }

  // 排序
  if (sortConfig.value.key) {
    result.sort((a, b) => {
      let aVal = a[sortConfig.value.key]
      let bVal = b[sortConfig.value.key]

      // 处理日期排序
      if (sortConfig.value.key === 'created_at') {
        aVal = new Date(aVal)
        bVal = new Date(bVal)
      }

      if (aVal < bVal) {
        return sortConfig.value.direction === 'asc' ? -1 : 1
      }
      if (aVal > bVal) {
        return sortConfig.value.direction === 'asc' ? 1 : -1
      }
      return 0
    })
  }

  return result
})

const totalPages = computed(() => {
  return Math.ceil(filteredComments.value.length / pageSize.value)
})

const paginatedComments = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredComments.value.slice(start, end)
})

// 方法
const loadComments = () => {
  loading.value = true
  // 模拟异步加载
  setTimeout(() => {
    comments.value = commentsData
    loading.value = false
  }, 500)
}

const handleSearch = () => {
  currentPage.value = 1
  // 可以在这里添加加载状态
}

const handleSort = (key) => {
  if (sortConfig.value.key === key) {
    sortConfig.value.direction = sortConfig.value.direction === 'asc' ? 'desc' : 'asc'
  } else {
    sortConfig.value.key = key
    sortConfig.value.direction = 'asc'
  }
}

const handlePageSizeChange = () => {
  currentPage.value = 1
}

// 生命周期
onMounted(() => {
  loadComments()
})

// 监听筛选条件变化
watch(
  () => [filters.value.userId, filters.value.goodsId, filters.value.startDate, filters.value.endDate],
  () => {
    handleSearch()
  }
)
</script>

<style scoped>
/* 自定义样式 */
</style>
