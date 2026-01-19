<template>
  <div class="bg-surface-0 dark:bg-surface-900 min-h-screen">
    <!-- 页面头部 -->
    <div class="border-b border-surface-200 dark:border-surface-800">
      <div class="container mx-auto px-4 py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 class="text-2xl font-bold text-surface-800 dark:text-white">订单管理</h1>
          <p class="text-surface-500 dark:text-surface-400 mt-1">管理系统订单信息</p>
        </div>
      </div>
    </div>

    <!-- 主内容区 -->
    <div class="container mx-auto px-4 py-6">
      <!-- 筛选条件 -->
      <div class="bg-white dark:bg-surface-800 rounded-lg shadow-sm border border-surface-200 dark:border-surface-700 p-4 mb-6">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <!-- 订单ID精确搜索 -->
          <div>
            <label class="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">订单ID</label>
            <div class="relative">
              <FontAwesomeIcon icon="search" class="absolute left-3 top-1/2 transform -translate-y-1/2 text-surface-400" />
              <input
                type="text"
                v-model="filters.orderId"
                @input="handleSearch"
                placeholder="请输入订单ID"
                class="w-full pl-10 pr-4 py-2 rounded-lg border border-surface-300 dark:border-surface-600 bg-surface-0 dark:bg-surface-900 text-surface-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
              />
            </div>
          </div>

          <!-- 日期筛选 -->
          <div>
            <label class="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">日期</label>
            <input
              type="date"
              v-model="filters.date"
              @change="handleSearch"
              class="w-full px-4 py-2 rounded-lg border border-surface-300 dark:border-surface-600 bg-surface-0 dark:bg-surface-900 text-surface-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
            />
          </div>

          <!-- 支付金额区间筛选 -->
          <div>
            <label class="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">支付金额区间</label>
            <div class="flex gap-2">
              <input
                type="number"
                v-model="filters.minAmount"
                @input="handleSearch"
                placeholder="最小金额"
                class="flex-1 px-4 py-2 rounded-lg border border-surface-300 dark:border-surface-600 bg-surface-0 dark:bg-surface-900 text-surface-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
              />
              <input
                type="number"
                v-model="filters.maxAmount"
                @input="handleSearch"
                placeholder="最大金额"
                class="flex-1 px-4 py-2 rounded-lg border border-surface-300 dark:border-surface-600 bg-surface-0 dark:bg-surface-900 text-surface-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
              />
            </div>
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
                v-for="order in paginatedOrders"
                :key="order.order_id"
                class="border-b border-surface-200 dark:border-surface-700 hover:bg-surface-50 dark:hover:bg-surface-800/50 transition-all"
              >
                <td class="px-4 py-3 text-sm text-surface-800 dark:text-white">{{ order.order_id }}</td>
                <td class="px-4 py-3 text-sm text-surface-800 dark:text-white">{{ order.order_no }}</td>
                <td class="px-4 py-3 text-sm text-surface-800 dark:text-white">{{ order.user_id }}</td>
                <td class="px-4 py-3 text-sm text-surface-800 dark:text-white">{{ order.merchant_id }}</td>
                <td class="px-4 py-3 text-sm text-surface-800 dark:text-white">{{ order.order_amount.toFixed(2) }}</td>
                <td class="px-4 py-3 text-sm text-surface-800 dark:text-white">{{ order.payment_amount.toFixed(2) }}</td>
                <td class="px-4 py-3">
                  <span
                    :class="[
                      'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                      getStatusClass(order.order_status)
                    ]"
                  >
                    {{ getStatusText(order.order_status) }}
                  </span>
                </td>
                <td class="px-4 py-3 text-sm text-surface-800 dark:text-white">{{ getPaymentMethodText(order.payment_method) }}</td>
                <td class="px-4 py-3 text-sm text-surface-800 dark:text-white">{{ formatDate(order.paid_time) }}</td>
                <td class="px-4 py-3 text-sm text-surface-800 dark:text-white">{{ order.shipping_no || '-' }}</td>
                <td class="px-4 py-3 text-sm text-surface-800 dark:text-white">{{ formatDate(order.created_at) }}</td>
                <td class="px-4 py-3 text-sm text-surface-800 dark:text-white">{{ formatDate(order.updated_at) }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- 加载状态 -->
        <div v-if="loading" class="py-10 flex justify-center items-center">
          <div class="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-500"></div>
        </div>

        <!-- 空状态 -->
        <div v-else-if="paginatedOrders.length === 0" class="py-10 flex flex-col justify-center items-center">
          <FontAwesomeIcon icon="file-alt" class="text-4xl text-surface-300 dark:text-surface-600 mb-2" />
          <p class="text-surface-500 dark:text-surface-400">暂无订单数据</p>
        </div>

        <!-- 分页控件 -->
        <div v-else class="px-4 py-3 border-t border-surface-200 dark:border-surface-700 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div class="text-sm text-surface-500 dark:text-surface-400">
            显示 {{ (currentPage - 1) * pageSize + 1 }} 到 {{ Math.min(currentPage * pageSize, filteredOrders.length) }} 条，共 {{ filteredOrders.length }} 条
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
import orders from '../data/orders.js'

// 状态映射
const statusMap = {
  1: '待付款',
  2: '待发货',
  3: '待收货',
  4: '已完成',
  5: '已取消',
  6: '退款中',
  7: '已退款'
}

const paymentMethodMap = {
  1: '支付宝',
  2: '微信支付',
  3: '银行卡',
  4: '货到付款',
  5: '其他'
}

// 表格列配置
const columns = [
  { key: 'order_id', label: '订单ID' },
  { key: 'order_no', label: '订单编号' },
  { key: 'user_id', label: '用户ID' },
  { key: 'merchant_id', label: '商家ID' },
  { key: 'order_amount', label: '订单金额' },
  { key: 'payment_amount', label: '支付金额' },
  { key: 'order_status', label: '订单状态' },
  { key: 'payment_method', label: '支付方式' },
  { key: 'paid_time', label: '支付时间' },
  { key: 'shipping_no', label: '物流单号' },
  { key: 'created_at', label: '创建时间' },
  { key: 'updated_at', label: '更新时间' }
]

// 响应式数据
const ordersData = ref([])
const loading = ref(false)
const filters = ref({
  orderId: '',
  date: '',
  minAmount: '',
  maxAmount: ''
})
const sortConfig = ref({
  key: null,
  direction: 'asc'
})
const currentPage = ref(1)
const pageSize = ref(10)

// 计算属性
const filteredOrders = computed(() => {
  let result = [...ordersData.value]

  // 订单ID精确搜索
  if (filters.value.orderId) {
    const orderId = parseInt(filters.value.orderId)
    if (!isNaN(orderId)) {
      result = result.filter(order => order.order_id === orderId)
    }
  }

  // 日期筛选
  if (filters.value.date) {
    const filterDate = new Date(filters.value.date)
    filterDate.setHours(0, 0, 0, 0)
    const nextDay = new Date(filterDate)
    nextDay.setDate(nextDay.getDate() + 1)
    result = result.filter(order => {
      const orderDate = new Date(order.created_at)
      return orderDate >= filterDate && orderDate < nextDay
    })
  }

  // 支付金额区间筛选
  if (filters.value.minAmount || filters.value.maxAmount) {
    const minAmount = parseFloat(filters.value.minAmount) || 0
    const maxAmount = parseFloat(filters.value.maxAmount) || Infinity
    result = result.filter(order => order.payment_amount >= minAmount && order.payment_amount <= maxAmount)
  }

  // 排序
  if (sortConfig.value.key) {
    result.sort((a, b) => {
      let aVal = a[sortConfig.value.key]
      let bVal = b[sortConfig.value.key]

      // 处理日期排序
      if (['paid_time', 'created_at', 'updated_at'].includes(sortConfig.value.key)) {
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
  return Math.ceil(filteredOrders.value.length / pageSize.value)
})

const paginatedOrders = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredOrders.value.slice(start, end)
})

// 方法
const loadOrders = () => {
  loading.value = true
  // 模拟异步加载
  setTimeout(() => {
    ordersData.value = orders
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

const formatDate = (dateString) => {
  if (!dateString) return ''
  return dateString
}

const getStatusText = (status) => {
  return statusMap[status] || '未知状态'
}

const getStatusClass = (status) => {
  const classes = {
    1: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    2: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    3: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
    4: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    5: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    6: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
    7: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
  }
  return classes[status] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
}

const getPaymentMethodText = (method) => {
  return paymentMethodMap[method] || '未知'
}

// 生命周期
onMounted(() => {
  loadOrders()
})

// 监听筛选条件变化
watch(
  () => [filters.value.orderId, filters.value.date, filters.value.minAmount, filters.value.maxAmount],
  () => {
    handleSearch()
  }
)
</script>

<style scoped>
/* 自定义样式 */
</style>
