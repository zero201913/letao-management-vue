<template>
  <div class="bg-surface-0 dark:bg-surface-900 min-h-screen">
    <!-- 页面头部 -->
    <div class="border-b border-surface-200 dark:border-surface-800">
      <div class="container mx-auto px-4 py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 class="text-2xl font-bold text-surface-800 dark:text-white">操作日志</h1>
          <p class="text-surface-500 dark:text-surface-400 mt-1">系统操作日志记录</p>
        </div>
      </div>
    </div>

    <!-- 主内容区 -->
    <div class="container mx-auto px-4 py-6">
      <!-- 筛选条件 -->
      <div class="bg-white dark:bg-surface-800 rounded-lg shadow-sm border border-surface-200 dark:border-surface-700 p-4 mb-6">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <!-- 操作人搜索 -->
          <div>
            <label class="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">操作人</label>
            <div class="relative">
              <FontAwesomeIcon icon="search" class="absolute left-3 top-1/2 transform -translate-y-1/2 text-surface-400" />
              <input
                type="text"
                v-model="filters.operator"
                @input="handleSearch"
                placeholder="请输入操作人"
                class="w-full pl-10 pr-4 py-2 rounded-lg border border-surface-300 dark:border-surface-600 bg-surface-0 dark:bg-surface-900 text-surface-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
              />
            </div>
          </div>

          <!-- 操作类型筛选 -->
          <div>
            <label class="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">操作类型</label>
            <select
              v-model="filters.type"
              @change="handleSearch"
              class="w-full px-4 py-2 rounded-lg border border-surface-300 dark:border-surface-600 bg-surface-0 dark:bg-surface-900 text-surface-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
            >
              <option value="">全部</option>
              <option value="login">登录</option>
              <option value="logout">登出</option>
              <option value="create">创建</option>
              <option value="update">更新</option>
              <option value="delete">删除</option>
              <option value="query">查询</option>
            </select>
          </div>

          <!-- 日期范围筛选 -->
          <div>
            <label class="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">操作日期</label>
            <input
              type="date"
              v-model="filters.date"
              @change="handleSearch"
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
                v-for="log in paginatedLogs" 
                :key="log.id"
                class="border-b border-surface-200 dark:border-surface-700 hover:bg-surface-50 dark:hover:bg-surface-800/50 transition-all"
              >
                <td class="px-4 py-3 text-sm text-surface-800 dark:text-white">{{ log.id }}</td>
                <td class="px-4 py-3 text-sm text-surface-800 dark:text-white">{{ log.operator }}</td>
                <td class="px-4 py-3">
                  <span 
                    :class="[
                      'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                      getTypeClass(log.type)
                    ]"
                  >
                    {{ log.type }}
                  </span>
                </td>
                <td class="px-4 py-3 text-sm text-surface-800 dark:text-white">{{ log.action }}</td>
                <td class="px-4 py-3 text-sm text-surface-800 dark:text-white">{{ log.ip }}</td>
                <td class="px-4 py-3 text-sm text-surface-800 dark:text-white">{{ log.user_agent }}</td>
                <td class="px-4 py-3 text-sm text-surface-800 dark:text-white">{{ formatDate(log.created_at) }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- 加载状态 -->
        <div v-if="loading" class="py-10 flex justify-center items-center">
          <div class="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-500"></div>
        </div>

        <!-- 空状态 -->
        <div v-else-if="paginatedLogs.length === 0" class="py-10 flex flex-col justify-center items-center">
          <FontAwesomeIcon icon="file-alt" class="text-4xl text-surface-300 dark:text-surface-600 mb-2" />
          <p class="text-surface-500 dark:text-surface-400">暂无日志数据</p>
        </div>

        <!-- 分页控件 -->
        <div v-else class="px-4 py-3 border-t border-surface-200 dark:border-surface-700 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div class="text-sm text-surface-500 dark:text-surface-400">
            显示 {{ (currentPage - 1) * pageSize + 1 }} 到 {{ Math.min(currentPage * pageSize, filteredLogs.length) }} 条，共 {{ filteredLogs.length }} 条
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
import { ref, computed, onMounted } from 'vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

// 表格列配置
const columns = [
  { key: 'id', label: '日志ID' },
  { key: 'operator', label: '操作人' },
  { key: 'type', label: '操作类型' },
  { key: 'action', label: '操作内容' },
  { key: 'ip', label: 'IP地址' },
  { key: 'user_agent', label: '用户代理' },
  { key: 'created_at', label: '操作时间' }
]

// 响应式数据
const logs = ref([])
const loading = ref(false)
const filters = ref({
  operator: '',
  type: '',
  date: ''
})
const sortConfig = ref({
  key: null,
  direction: 'asc'
})
const currentPage = ref(1)
const pageSize = ref(10)

// 计算属性
const filteredLogs = computed(() => {
  let result = [...logs.value]
  
  // 操作人筛选
  if (filters.value.operator) {
    const searchTerm = filters.value.operator.toLowerCase()
    result = result.filter(log => log.operator.toLowerCase().includes(searchTerm))
  }
  
  // 操作类型筛选
  if (filters.value.type) {
    result = result.filter(log => log.type === filters.value.type)
  }
  
  // 日期筛选
  if (filters.value.date) {
    const filterDate = new Date(filters.value.date)
    result = result.filter(log => {
      const logDate = new Date(log.created_at)
      return logDate.toDateString() === filterDate.toDateString()
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
  return Math.ceil(filteredLogs.value.length / pageSize.value)
})

const paginatedLogs = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredLogs.value.slice(start, end)
})

// 方法
const loadLogs = () => {
  loading.value = true
  // 模拟异步加载
  setTimeout(() => {
    // 生成模拟数据
    const mockLogs = []
    for (let i = 1; i <= 50; i++) {
      mockLogs.push({
        id: i,
        operator: ['张三', '李四', '王五', '赵六'][Math.floor(Math.random() * 4)],
        type: ['login', 'logout', 'create', 'update', 'delete', 'query'][Math.floor(Math.random() * 6)],
        action: `执行了${['登录', '登出', '创建', '更新', '删除', '查询'][Math.floor(Math.random() * 6)]}操作`,
        ip: `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
        user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        created_at: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString().replace('T', ' ').slice(0, 19)
      })
    }
    logs.value = mockLogs
    loading.value = false
  }, 500)
}

const handleSearch = () => {
  currentPage.value = 1
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

const getTypeClass = (type) => {
  const typeClasses = {
    login: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    logout: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
    create: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    update: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    delete: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    query: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
  }
  return typeClasses[type] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
}

const formatDate = (dateString) => {
  if (!dateString) return ''
  return dateString
}

// 生命周期
onMounted(() => {
  loadLogs()
})
</script>

<style scoped>
/* 自定义样式 */
</style>