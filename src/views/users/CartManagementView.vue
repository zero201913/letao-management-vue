<template>
  <div class="bg-surface-0 dark:bg-surface-900 min-h-screen">
    <!-- 页面头部 -->
    <div class="border-b border-surface-200 dark:border-surface-800">
      <div class="container mx-auto px-4 py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 class="text-2xl font-bold text-surface-800 dark:text-white">购物车管理</h1>
          <p class="text-surface-500 dark:text-surface-400 mt-1">管理用户购物车数据</p>
        </div>
      </div>
    </div>

    <!-- 主内容区 -->
    <div class="container mx-auto px-4 py-6">
      <!-- 数据统计区域 -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div class="bg-white dark:bg-surface-800 rounded-lg shadow-sm border border-surface-200 dark:border-surface-700 p-4">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-surface-500 dark:text-surface-400">总用户数</p>
              <h3 class="text-2xl font-bold text-surface-800 dark:text-white">{{ totalUsers }}</h3>
            </div>
            <div class="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
              <FontAwesomeIcon icon="users" class="text-primary-600 dark:text-primary-400" />
            </div>
          </div>
        </div>
        <div class="bg-white dark:bg-surface-800 rounded-lg shadow-sm border border-surface-200 dark:border-surface-700 p-4">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-surface-500 dark:text-surface-400">总商品数</p>
              <h3 class="text-2xl font-bold text-surface-800 dark:text-white">{{ totalGoods }}</h3>
            </div>
            <div class="w-10 h-10 rounded-full bg-success-100 dark:bg-success-900/30 flex items-center justify-center">
              <FontAwesomeIcon icon="box" class="text-success-600 dark:text-success-400" />
            </div>
          </div>
        </div>
        <div class="bg-white dark:bg-surface-800 rounded-lg shadow-sm border border-surface-200 dark:border-surface-700 p-4">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-surface-500 dark:text-surface-400">总金额</p>
              <h3 class="text-2xl font-bold text-surface-800 dark:text-white">¥{{ totalAmount.toFixed(2) }}</h3>
            </div>
            <div class="w-10 h-10 rounded-full bg-info-100 dark:bg-info-900/30 flex items-center justify-center">
              <FontAwesomeIcon icon="wallet" class="text-info-600 dark:text-info-400" />
            </div>
          </div>
        </div>
        <div class="bg-white dark:bg-surface-800 rounded-lg shadow-sm border border-surface-200 dark:border-surface-700 p-4">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-surface-500 dark:text-surface-400">平均购物车商品数</p>
              <h3 class="text-2xl font-bold text-surface-800 dark:text-white">{{ averageItems.toFixed(1) }}</h3>
            </div>
            <div class="w-10 h-10 rounded-full bg-warning-100 dark:bg-warning-900/30 flex items-center justify-center">
              <FontAwesomeIcon icon="calculator" class="text-warning-600 dark:text-warning-400" />
            </div>
          </div>
        </div>
      </div>

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

          <!-- 用户名搜索 -->
          <div>
            <label class="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">用户名</label>
            <div class="relative">
              <FontAwesomeIcon icon="search" class="absolute left-3 top-1/2 transform -translate-y-1/2 text-surface-400" />
              <input
                type="text"
                v-model="filters.username"
                @input="handleSearch"
                placeholder="请输入用户名"
                class="w-full pl-10 pr-4 py-2 rounded-lg border border-surface-300 dark:border-surface-600 bg-surface-0 dark:bg-surface-900 text-surface-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
              />
            </div>
          </div>

          <!-- 商品类别筛选 -->
          <div>
            <label class="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">商品类别</label>
            <select
              v-model="filters.goodsType"
              @change="handleSearch"
              class="w-full px-4 py-2 rounded-lg border border-surface-300 dark:border-surface-600 bg-surface-0 dark:bg-surface-900 text-surface-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
            >
              <option value="">全部</option>
              <option value="潮玩">潮玩</option>
              <option value="数码">数码</option>
              <option value="服装">服装</option>
              <option value="食品">食品</option>
            </select>
          </div>

          <!-- 购物车状态筛选 -->
          <div>
            <label class="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">购物车状态</label>
            <select
              v-model="filters.status"
              @change="handleSearch"
              class="w-full px-4 py-2 rounded-lg border border-surface-300 dark:border-surface-600 bg-surface-0 dark:bg-surface-900 text-surface-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
            >
              <option value="">全部</option>
              <option value="1">活跃</option>
              <option value="2">已结算</option>
              <option value="3">已失效</option>
            </select>
          </div>
        </div>

        <!-- 时间范围选择 -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div>
            <label class="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">开始时间</label>
            <input
              type="datetime-local"
              v-model="filters.startDate"
              @input="handleSearch"
              class="w-full px-4 py-2 rounded-lg border border-surface-300 dark:border-surface-600 bg-surface-0 dark:bg-surface-900 text-surface-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
            />
          </div>
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

      <!-- 批量操作区 -->
      <div class="bg-white dark:bg-surface-800 rounded-lg shadow-sm border border-surface-200 dark:border-surface-700 p-4 mb-6 flex flex-wrap items-center gap-4">
        <div class="flex items-center gap-2">
          <input
            type="checkbox"
            v-model="selectAll"
            @change="handleSelectAll"
            class="w-4 h-4 rounded border-surface-300 dark:border-surface-600 bg-surface-0 dark:bg-surface-900 text-primary-600 focus:ring-primary-500"
          />
          <label class="text-sm text-surface-700 dark:text-surface-300">全选</label>
        </div>
        <div class="flex items-center gap-2">
          <button
            @click="handleBatchDelete"
            :disabled="selectedCarts.length === 0"
            class="px-3 py-1.5 text-sm bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 rounded hover:bg-red-200 dark:hover:bg-red-900/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            <FontAwesomeIcon icon="trash-alt" class="mr-1" />
            批量删除
          </button>
        </div>
        <div class="flex items-center gap-2">
          <select v-model="batchStatus" class="px-3 py-1.5 text-sm border border-surface-300 dark:border-surface-600 bg-surface-0 dark:bg-surface-900 text-surface-800 dark:text-white rounded focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all">
            <option value="">批量更新状态</option>
            <option value="1">活跃</option>
            <option value="2">已结算</option>
            <option value="3">已失效</option>
          </select>
          <button
            @click="handleBatchUpdateStatus"
            :disabled="selectedCarts.length === 0 || !batchStatus"
            class="px-3 py-1.5 text-sm bg-primary-100 text-primary-800 dark:bg-primary-900/30 dark:text-primary-400 rounded hover:bg-primary-200 dark:hover:bg-primary-900/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            <FontAwesomeIcon icon="sync-alt" class="mr-1" />
            确认更新
          </button>
        </div>
      </div>

      <!-- 表格区域 -->
      <div class="bg-white dark:bg-surface-800 rounded-lg shadow-sm border border-surface-200 dark:border-surface-700 overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead>
              <tr class="bg-surface-50 dark:bg-surface-800/50 border-b border-surface-200 dark:border-surface-700">
                <th class="px-4 py-3 text-left text-sm font-medium text-surface-700 dark:text-surface-300 w-12">
                  <input
                    type="checkbox"
                    v-model="selectAll"
                    @change="handleSelectAll"
                    class="w-4 h-4 rounded border-surface-300 dark:border-surface-600 bg-surface-0 dark:bg-surface-900 text-primary-600 focus:ring-primary-500"
                  />
                </th>
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
                v-for="cart in paginatedCarts"
                :key="cart.cart_id"
                class="border-b border-surface-200 dark:border-surface-700 hover:bg-surface-50 dark:hover:bg-surface-800/50 transition-all"
              >
                <td class="px-4 py-3">
                  <input
                    type="checkbox"
                    v-model="selectedCarts"
                    :value="cart.cart_id"
                    class="w-4 h-4 rounded border-surface-300 dark:border-surface-600 bg-surface-0 dark:bg-surface-900 text-primary-600 focus:ring-primary-500"
                  />
                </td>
                <td class="px-4 py-3 text-sm text-surface-800 dark:text-white">{{ cart.user_id }}</td>
                <td class="px-4 py-3 text-sm text-surface-800 dark:text-white">{{ cart.username }}</td>
                <td class="px-4 py-3 text-sm text-surface-800 dark:text-white">{{ cart.goods_id }}</td>
                <td class="px-4 py-3 text-sm text-surface-800 dark:text-white">
                  <div class="max-w-xs truncate" :title="cart.goods_name">{{ cart.goods_name }}</div>
                </td>
                <td class="px-4 py-3">
                  <img
                    :src="cart.goods_thumbnail"
                    :alt="cart.goods_name"
                    class="w-12 h-12 rounded object-cover"
                  />
                </td>
                <td class="px-4 py-3 text-sm font-medium text-surface-800 dark:text-white">¥{{ cart.price.toFixed(2) }}</td>
                <td class="px-4 py-3 text-sm text-surface-800 dark:text-white">{{ cart.quantity }}</td>
                <td class="px-4 py-3 text-sm font-medium text-surface-800 dark:text-white">¥{{ cart.subtotal.toFixed(2) }}</td>
                <td class="px-4 py-3 text-sm text-surface-800 dark:text-white">{{ cart.created_at }}</td>
                <td class="px-4 py-3">
                  <span
                    :class="[
                      'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                      cart.status === 1 ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                      cart.status === 2 ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                      'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
                    ]"
                  >
                    {{ statusMap[cart.status] }}
                  </span>
                </td>
                <td class="px-4 py-3">
                  <div class="flex items-center gap-2">
                    <button
                      @click="handleViewDetails(cart)"
                      class="px-2 py-1 text-xs bg-info-100 text-info-800 dark:bg-info-900/30 dark:text-info-400 rounded hover:bg-info-200 dark:hover:bg-info-900/50 transition-all"
                      title="查看详情"
                    >
                      <FontAwesomeIcon icon="eye" class="mr-1" />
                      查看
                    </button>
                    <button
                      @click="handleEdit(cart)"
                      class="px-2 py-1 text-xs bg-primary-100 text-primary-800 dark:bg-primary-900/30 dark:text-primary-400 rounded hover:bg-primary-200 dark:hover:bg-primary-900/50 transition-all"
                      title="编辑"
                    >
                      <FontAwesomeIcon icon="edit" class="mr-1" />
                      编辑
                    </button>
                    <button
                      @click="handleDelete(cart.cart_id)"
                      class="px-2 py-1 text-xs bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 rounded hover:bg-red-200 dark:hover:bg-red-900/50 transition-all"
                      title="删除"
                    >
                      <FontAwesomeIcon icon="trash-alt" class="mr-1" />
                      删除
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
        <div v-else-if="paginatedCarts.length === 0" class="py-10 flex flex-col justify-center items-center">
          <FontAwesomeIcon icon="shopping-cart" class="text-4xl text-surface-300 dark:text-surface-600 mb-2" />
          <p class="text-surface-500 dark:text-surface-400">暂无购物车数据</p>
        </div>

        <!-- 分页控件 -->
        <div v-else class="px-4 py-3 border-t border-surface-200 dark:border-surface-700 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div class="text-sm text-surface-500 dark:text-surface-400">
            显示 {{ (currentPage - 1) * pageSize + 1 }} 到 {{ Math.min(currentPage * pageSize, filteredCarts.length) }} 条，共 {{ filteredCarts.length }} 条
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
import cartsData from '../../data/carts.js'

// 状态映射
const statusMap = {
  1: '活跃',
  2: '已结算',
  3: '已失效'
}

// 表格列配置
const columns = [
  { key: 'user_id', label: '用户ID' },
  { key: 'username', label: '用户名' },
  { key: 'goods_id', label: '商品ID' },
  { key: 'goods_name', label: '商品名称' },
  { key: 'goods_thumbnail', label: '商品图片' },
  { key: 'price', label: '单价' },
  { key: 'quantity', label: '数量' },
  { key: 'subtotal', label: '小计金额' },
  { key: 'created_at', label: '加入时间' },
  { key: 'status', label: '购物车状态' },
  { key: 'actions', label: '操作' }
]

// 响应式数据
const carts = ref([])
const loading = ref(false)
const filters = ref({
  userId: '',
  username: '',
  goodsType: '',
  status: '',
  startDate: '',
  endDate: ''
})
const sortConfig = ref({
  key: null,
  direction: 'asc'
})
const currentPage = ref(1)
const pageSize = ref(10)
const selectedCarts = ref([])
const selectAll = ref(false)
const batchStatus = ref('')

// 计算属性
const filteredCarts = computed(() => {
  let result = [...carts.value]

  // 用户ID筛选
  if (filters.value.userId) {
    const userId = parseInt(filters.value.userId)
    result = result.filter(cart => cart.user_id === userId)
  }

  // 用户名筛选
  if (filters.value.username) {
    const searchTerm = filters.value.username.toLowerCase()
    result = result.filter(cart => 
      cart.username.toLowerCase().includes(searchTerm) ||
      cart.nickname.toLowerCase().includes(searchTerm)
    )
  }

  // 商品类别筛选
  if (filters.value.goodsType) {
    result = result.filter(cart => cart.goods_type === filters.value.goodsType)
  }

  // 状态筛选
  if (filters.value.status) {
    const status = parseInt(filters.value.status)
    result = result.filter(cart => cart.status === status)
  }

  // 开始时间筛选
  if (filters.value.startDate) {
    const startDate = new Date(filters.value.startDate)
    result = result.filter(cart => {
      const cartDate = new Date(cart.created_at)
      return cartDate >= startDate
    })
  }

  // 结束时间筛选
  if (filters.value.endDate) {
    const endDate = new Date(filters.value.endDate)
    result = result.filter(cart => {
      const cartDate = new Date(cart.created_at)
      return cartDate <= endDate
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
  return Math.ceil(filteredCarts.value.length / pageSize.value)
})

const paginatedCarts = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredCarts.value.slice(start, end)
})

// 统计数据
const totalUsers = computed(() => {
  const userIds = new Set(carts.value.map(cart => cart.user_id))
  return userIds.size
})

const totalGoods = computed(() => {
  return carts.value.reduce((sum, cart) => sum + cart.quantity, 0)
})

const totalAmount = computed(() => {
  return carts.value.reduce((sum, cart) => sum + cart.subtotal, 0)
})

const averageItems = computed(() => {
  const userIds = new Set(carts.value.map(cart => cart.user_id))
  if (userIds.size === 0) return 0
  return totalGoods.value / userIds.size
})

// 方法
const loadCarts = () => {
  loading.value = true
  // 模拟异步加载
  setTimeout(() => {
    carts.value = cartsData
    loading.value = false
  }, 500)
}

const handleSearch = () => {
  currentPage.value = 1
  selectedCarts.value = []
  selectAll.value = false
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

// 全选/取消全选
const handleSelectAll = () => {
  if (selectAll.value) {
    selectedCarts.value = filteredCarts.value.map(cart => cart.cart_id)
  } else {
    selectedCarts.value = []
  }
}

// 批量删除
const handleBatchDelete = () => {
  if (selectedCarts.value.length === 0) return

  // 模拟批量删除
  carts.value = carts.value.filter(cart => !selectedCarts.value.includes(cart.cart_id))
  selectedCarts.value = []
  selectAll.value = false
}

// 批量更新状态
const handleBatchUpdateStatus = () => {
  if (selectedCarts.value.length === 0 || !batchStatus.value) return

  // 模拟批量更新状态
  carts.value = carts.value.map(cart => {
    if (selectedCarts.value.includes(cart.cart_id)) {
      return {
        ...cart,
        status: parseInt(batchStatus.value),
        updated_at: new Date().toLocaleString('zh-CN')
      }
    }
    return cart
  })

  selectedCarts.value = []
  selectAll.value = false
  batchStatus.value = ''
}

// 单个操作
const handleViewDetails = (cart) => {
  // 这里可以实现查看详情的逻辑
  console.log('查看详情:', cart)
}

const handleEdit = (cart) => {
  // 这里可以实现编辑的逻辑
  console.log('编辑:', cart)
}

const handleDelete = (cartId) => {
  // 模拟删除
  carts.value = carts.value.filter(cart => cart.cart_id !== cartId)
  selectedCarts.value = selectedCarts.value.filter(id => id !== cartId)
}

// 生命周期
onMounted(() => {
  loadCarts()
})

// 监听筛选条件变化
watch(
  () => [filters.value.userId, filters.value.username, filters.value.goodsType, filters.value.status, filters.value.startDate, filters.value.endDate],
  () => {
    handleSearch()
  }
)

// 监听选中项变化
watch(
  () => selectedCarts.value.length,
  (newLength) => {
    selectAll.value = newLength > 0 && newLength === filteredCarts.value.length
  }
)
</script>

<style scoped>
/* 自定义样式 */
</style>