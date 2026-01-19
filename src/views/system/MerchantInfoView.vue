<template>
  <div class="bg-surface-0 dark:bg-surface-900 min-h-screen">
    <!-- 页面头部 -->
    <div class="border-b border-surface-200 dark:border-surface-800">
      <div class="container mx-auto px-4 py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 class="text-2xl font-bold text-surface-800 dark:text-white">商家信息</h1>
          <p class="text-surface-500 dark:text-surface-400 mt-1">管理系统商家信息</p>
        </div>
      </div>
    </div>

    <!-- 主内容区 -->
    <div class="container mx-auto px-4 py-6">
      <!-- 筛选条件 -->
      <div class="bg-white dark:bg-surface-800 rounded-lg shadow-sm border border-surface-200 dark:border-surface-700 p-4 mb-6">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <!-- 商家名称搜索 -->
          <div>
            <label class="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">商家名称</label>
            <div class="relative">
              <FontAwesomeIcon icon="search" class="absolute left-3 top-1/2 transform -translate-y-1/2 text-surface-400" />
              <input
                type="text"
                v-model="filters.name"
                @input="handleSearch"
                placeholder="请输入商家名称"
                class="w-full pl-10 pr-4 py-2 rounded-lg border border-surface-300 dark:border-surface-600 bg-surface-0 dark:bg-surface-900 text-surface-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
              />
            </div>
          </div>

          <!-- 商家状态筛选 -->
          <div>
            <label class="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">商家状态</label>
            <select
              v-model="filters.status"
              @change="handleSearch"
              class="w-full px-4 py-2 rounded-lg border border-surface-300 dark:border-surface-600 bg-surface-0 dark:bg-surface-900 text-surface-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
            >
              <option value="">全部</option>
              <option value="1">活跃</option>
              <option value="2">禁用</option>
              <option value="3">审核中</option>
            </select>
          </div>

          <!-- 商家类型筛选 -->
          <div>
            <label class="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">商家类型</label>
            <select
              v-model="filters.type"
              @change="handleSearch"
              class="w-full px-4 py-2 rounded-lg border border-surface-300 dark:border-surface-600 bg-surface-0 dark:bg-surface-900 text-surface-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
            >
              <option value="">全部</option>
              <option value="1">实体店</option>
              <option value="2">网店</option>
              <option value="3">混合经营</option>
            </select>
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
                v-for="merchant in paginatedMerchants" 
                :key="merchant.id"
                class="border-b border-surface-200 dark:border-surface-700 hover:bg-surface-50 dark:hover:bg-surface-800/50 transition-all"
              >
                <td class="px-4 py-3 text-sm text-surface-800 dark:text-white">{{ merchant.id }}</td>
                <td class="px-4 py-3 text-sm text-surface-800 dark:text-white">{{ merchant.name }}</td>
                <td class="px-4 py-3 text-sm text-surface-800 dark:text-white">{{ merchant.contact_person }}</td>
                <td class="px-4 py-3 text-sm text-surface-800 dark:text-white">{{ merchant.contact_phone }}</td>
                <td class="px-4 py-3 text-sm text-surface-800 dark:text-white">{{ merchant.address }}</td>
                <td class="px-4 py-3">
                  <span 
                    :class="[
                      'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                      getStatusClass(merchant.status)
                    ]"
                  >
                    {{ getStatusLabel(merchant.status) }}
                  </span>
                </td>
                <td class="px-4 py-3">
                  <span 
                    :class="[
                      'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                      getTypeClass(merchant.type)
                    ]"
                  >
                    {{ getTypeLabel(merchant.type) }}
                  </span>
                </td>
                <td class="px-4 py-3 text-sm text-surface-800 dark:text-white">{{ formatDate(merchant.created_at) }}</td>
                <td class="px-4 py-3 text-sm text-surface-800 dark:text-white">{{ formatDate(merchant.updated_at) }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- 加载状态 -->
        <div v-if="loading" class="py-10 flex justify-center items-center">
          <div class="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-500"></div>
        </div>

        <!-- 空状态 -->
        <div v-else-if="paginatedMerchants.length === 0" class="py-10 flex flex-col justify-center items-center">
          <FontAwesomeIcon icon="store-slash" class="text-4xl text-surface-300 dark:text-surface-600 mb-2" />
          <p class="text-surface-500 dark:text-surface-400">暂无商家数据</p>
        </div>

        <!-- 分页控件 -->
        <div v-else class="px-4 py-3 border-t border-surface-200 dark:border-surface-700 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div class="text-sm text-surface-500 dark:text-surface-400">
            显示 {{ (currentPage - 1) * pageSize + 1 }} 到 {{ Math.min(currentPage * pageSize, filteredMerchants.length) }} 条，共 {{ filteredMerchants.length }} 条
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

// 状态和类型映射
const statusMap = {
  1: '活跃',
  2: '禁用',
  3: '审核中'
}

const typeMap = {
  1: '实体店',
  2: '网店',
  3: '混合经营'
}

// 表格列配置
const columns = [
  { key: 'id', label: '商家ID' },
  { key: 'name', label: '商家名称' },
  { key: 'contact_person', label: '联系人' },
  { key: 'contact_phone', label: '联系电话' },
  { key: 'address', label: '地址' },
  { key: 'status', label: '状态' },
  { key: 'type', label: '商家类型' },
  { key: 'created_at', label: '创建时间' },
  { key: 'updated_at', label: '更新时间' }
]

// 响应式数据
const merchants = ref([])
const loading = ref(false)
const filters = ref({
  name: '',
  status: '',
  type: ''
})
const sortConfig = ref({
  key: null,
  direction: 'asc'
})
const currentPage = ref(1)
const pageSize = ref(10)

// 计算属性
const filteredMerchants = computed(() => {
  let result = [...merchants.value]
  
  // 商家名称筛选
  if (filters.value.name) {
    const searchTerm = filters.value.name.toLowerCase()
    result = result.filter(merchant => merchant.name.toLowerCase().includes(searchTerm))
  }
  
  // 商家状态筛选
  if (filters.value.status) {
    result = result.filter(merchant => merchant.status === parseInt(filters.value.status))
  }
  
  // 商家类型筛选
  if (filters.value.type) {
    result = result.filter(merchant => merchant.type === parseInt(filters.value.type))
  }
  
  // 排序
  if (sortConfig.value.key) {
    result.sort((a, b) => {
      let aVal = a[sortConfig.value.key]
      let bVal = b[sortConfig.value.key]
      
      // 处理日期排序
      if (['created_at', 'updated_at'].includes(sortConfig.value.key)) {
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
  return Math.ceil(filteredMerchants.value.length / pageSize.value)
})

const paginatedMerchants = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredMerchants.value.slice(start, end)
})

// 方法
const loadMerchants = () => {
  loading.value = true
  // 模拟异步加载
  setTimeout(() => {
    // 生成模拟数据
    const mockMerchants = []
    for (let i = 1; i <= 30; i++) {
      mockMerchants.push({
        id: i,
        name: `商家${i}`,
        contact_person: `联系人${i}`,
        contact_phone: `1380013800${i}`,
        address: `北京市朝阳区某某街道${i}号`,
        status: Math.floor(Math.random() * 3) + 1,
        type: Math.floor(Math.random() * 3) + 1,
        created_at: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().replace('T', ' ').slice(0, 19),
        updated_at: new Date(Date.now() - Math.random() * 15 * 24 * 60 * 60 * 1000).toISOString().replace('T', ' ').slice(0, 19)
      })
    }
    merchants.value = mockMerchants
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

const getStatusClass = (status) => {
  const statusClasses = {
    1: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    2: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    3: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
  }
  return statusClasses[status] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
}

const getStatusLabel = (status) => {
  return statusMap[status] || '未知'
}

const getTypeClass = (type) => {
  const typeClasses = {
    1: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    2: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
    3: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200'
  }
  return typeClasses[type] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
}

const getTypeLabel = (type) => {
  return typeMap[type] || '未知'
}

const formatDate = (dateString) => {
  if (!dateString) return ''
  return dateString
}

// 生命周期
onMounted(() => {
  loadMerchants()
})
</script>

<style scoped>
/* 自定义样式 */
</style>