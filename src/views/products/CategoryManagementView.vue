<template>
  <div class="bg-surface-0 dark:bg-surface-900 min-h-screen">
    <!-- 页面头部 -->
    <div class="border-b border-surface-200 dark:border-surface-800">
      <div class="container mx-auto px-4 py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 class="text-2xl font-bold text-surface-800 dark:text-white">商品分类管理</h1>
          <p class="text-surface-500 dark:text-surface-400 mt-1">管理系统商品分类信息</p>
        </div>
      </div>
    </div>

    <!-- 主内容区 -->
    <div class="container mx-auto px-4 py-6">
      <!-- 筛选条件 -->
      <div class="bg-white dark:bg-surface-800 rounded-lg shadow-sm border border-surface-200 dark:border-surface-700 p-4 mb-6">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <!-- 分类名称搜索 -->
          <div>
            <label class="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">分类名称</label>
            <div class="relative">
              <FontAwesomeIcon icon="search" class="absolute left-3 top-1/2 transform -translate-y-1/2 text-surface-400" />
              <input
                type="text"
                v-model="filters.categoryName"
                @input="handleSearch"
                placeholder="请输入分类名称"
                class="w-full pl-10 pr-4 py-2 rounded-lg border border-surface-300 dark:border-surface-600 bg-surface-0 dark:bg-surface-900 text-surface-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
              />
            </div>
          </div>

          <!-- 状态筛选 -->
          <div>
            <label class="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">状态</label>
            <select
              v-model="filters.status"
              @change="handleSearch"
              class="w-full px-4 py-2 rounded-lg border border-surface-300 dark:border-surface-600 bg-surface-0 dark:bg-surface-900 text-surface-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
            >
              <option value="">全部</option>
              <option value="1">启用</option>
              <option value="2">停用</option>
            </select>
          </div>

          <!-- 是否删除筛选 -->
          <div>
            <label class="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">是否删除</label>
            <select
              v-model="filters.isDeleted"
              @change="handleSearch"
              class="w-full px-4 py-2 rounded-lg border border-surface-300 dark:border-surface-600 bg-surface-0 dark:bg-surface-900 text-surface-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
            >
              <option value="">全部</option>
              <option value="0">否</option>
              <option value="1">是</option>
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
                <th class="px-4 py-3 text-left text-sm font-medium text-surface-700 dark:text-surface-300">操作</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="category in paginatedCategories"
                :key="category.category_id"
                class="border-b border-surface-200 dark:border-surface-700 hover:bg-surface-50 dark:hover:bg-surface-800/50 transition-all"
              >
                <td class="px-4 py-3 text-sm text-surface-800 dark:text-white">{{ category.category_id }}</td>
                <td class="px-4 py-3 text-sm text-surface-800 dark:text-white">{{ category.category_code }}</td>
                <td class="px-4 py-3 text-sm text-surface-800 dark:text-white">
                  <div class="flex items-center gap-2">
                    <span>{{ category.category_name }}</span>
                    <span class="text-xs text-surface-500">({{ category.product_count }})</span>
                  </div>
                </td>
                <td class="px-4 py-3">
                  <span
                    :class="[
                      'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                      category.status === 1 ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                      'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                    ]"
                  >
                    {{ statusMap[category.status] }}
                  </span>
                </td>
                <td class="px-4 py-3">
                  <span
                    :class="[
                      'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                      category.is_deleted === 0 ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                      'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                    ]"
                  >
                    {{ deletedMap[category.is_deleted] }}
                  </span>
                </td>
                <td class="px-4 py-3 text-sm text-surface-800 dark:text-white">{{ formatDate(category.created_at) }}</td>
                <td class="px-4 py-3 text-sm text-surface-800 dark:text-white">{{ formatDate(category.updated_at) }}</td>
                <td class="px-4 py-3">
                  <div class="flex items-center gap-2">
                    <button class="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors">
                      <FontAwesomeIcon icon="edit" />
                    </button>
                    <button class="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 transition-colors">
                      <FontAwesomeIcon icon="trash" />
                    </button>
                    <button class="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-300 transition-colors">
                      <FontAwesomeIcon icon="eye" />
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- 加载状态 -->
        <div v-if="loading" class="py-10 flex justify-center items-center">
          <div class="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-500"></div>
        </div>

        <!-- 空状态 -->
        <div v-else-if="paginatedCategories.length === 0" class="py-10 flex flex-col justify-center items-center">
          <FontAwesomeIcon icon="box" class="text-4xl text-surface-300 dark:text-surface-600 mb-2" />
          <p class="text-surface-500 dark:text-surface-400">暂无分类数据</p>
        </div>

        <!-- 分页控件 -->
        <div v-else class="px-4 py-3 border-t border-surface-200 dark:border-surface-700 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div class="text-sm text-surface-500 dark:text-surface-400">
            显示 {{ (currentPage - 1) * pageSize + 1 }} 到 {{ Math.min(currentPage * pageSize, filteredCategories.length) }} 条，共 {{ filteredCategories.length }} 条
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

// 状态映射
const statusMap = {
  1: '启用',
  2: '停用'
}

const deletedMap = {
  0: '否',
  1: '是'
}

// 表格列配置
const columns = [
  { key: 'category_id', label: '分类ID' },
  { key: 'category_code', label: '分类编码' },
  { key: 'category_name', label: '分类名称' },
  { key: 'status', label: '状态' },
  { key: 'is_deleted', label: '是否删除' },
  { key: 'created_at', label: '创建时间' },
  { key: 'updated_at', label: '更新时间' }
]

// 商品分类数据
const categoryData = [
  { name: '个护', count: 60 },
  { name: '二次元', count: 60 },
  { name: '五金', count: 59 },
  { name: '农牧', count: 60 },
  { name: '卡券', count: 59 },
  { name: '图书', count: 59 },
  { name: '宠物', count: 59 },
  { name: '家具', count: 59 },
  { name: '家电', count: 59 },
  { name: '家装', count: 59 },
  { name: '手机', count: 59 },
  { name: '技能', count: 59 },
  { name: '文玩', count: 59 },
  { name: '服饰', count: 60 },
  { name: '母婴', count: 59 },
  { name: '汽车', count: 59 },
  { name: '游戏', count: 59 },
  { name: '潮玩', count: 59 },
  { name: '珠宝', count: 59 },
  { name: '电动车', count: 59 },
  { name: '电脑', count: 59 },
  { name: '相机', count: 48 },
  { name: '礼品', count: 59 },
  { name: '租房', count: 59 },
  { name: '箱包', count: 59 },
  { name: '美妆', count: 59 },
  { name: '花卉', count: 59 },
  { name: '设备', count: 59 },
  { name: '运动', count: 59 },
  { name: '音像', count: 58 },
  { name: '食品', count: 59 }
]

// 响应式数据
const categories = ref([])
const loading = ref(false)
const filters = ref({
  categoryName: '',
  status: '',
  isDeleted: ''
})
const sortConfig = ref({
  key: null,
  direction: 'asc'
})
const currentPage = ref(1)
const pageSize = ref(10)

// 计算属性
const filteredCategories = computed(() => {
  let result = [...categories.value]

  // 分类名称搜索
  if (filters.value.categoryName) {
    const searchTerm = filters.value.categoryName.toLowerCase()
    result = result.filter(category => category.category_name.toLowerCase().includes(searchTerm))
  }

  // 状态筛选
  if (filters.value.status) {
    result = result.filter(category => category.status === parseInt(filters.value.status))
  }

  // 是否删除筛选
  if (filters.value.isDeleted) {
    result = result.filter(category => category.is_deleted === parseInt(filters.value.isDeleted))
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
  return Math.ceil(filteredCategories.value.length / pageSize.value)
})

const paginatedCategories = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredCategories.value.slice(start, end)
})

// 方法
const loadCategories = () => {
  loading.value = true
  // 模拟异步加载
  setTimeout(() => {
    // 生成分类数据
    const generatedCategories = categoryData.map((item, index) => {
      const categoryId = index + 1
      return {
        category_id: categoryId,
        category_code: `CAT${String(categoryId).padStart(3, '0')}`,
        category_name: item.name,
        status: 1, // 默认启用
        is_deleted: 0, // 默认未删除
        product_count: item.count,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    })
    categories.value = generatedCategories
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

const formatDate = (dateString) => {
  if (!dateString) return ''
  return dateString
}

// 生命周期
onMounted(() => {
  loadCategories()
})

// 监听筛选条件变化
watch(
  () => [filters.value.categoryName, filters.value.status, filters.value.isDeleted],
  () => {
    handleSearch()
  }
)
</script>

<style scoped>
/* 自定义样式 */
</style>