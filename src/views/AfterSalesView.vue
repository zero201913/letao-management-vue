<template>
  <div class="bg-surface-0 dark:bg-surface-900 min-h-screen">
    <!-- 页面头部 -->
    <div class="border-b border-surface-200 dark:border-surface-800">
      <div class="container mx-auto px-4 py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 class="text-2xl font-bold text-surface-800 dark:text-white">售后管理</h1>
          <p class="text-surface-500 dark:text-surface-400 mt-1">管理系统售后订单信息</p>
        </div>
      </div>
    </div>

    <!-- 主内容区 -->
    <div class="container mx-auto px-4 py-6">
      <!-- 筛选条件 -->
      <div class="bg-white dark:bg-surface-800 rounded-lg shadow-sm border border-surface-200 dark:border-surface-700 p-4 mb-6">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <!-- 订单编号搜索 -->
          <div>
            <label class="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">订单编号</label>
            <div class="relative">
              <FontAwesomeIcon icon="search" class="absolute left-3 top-1/2 transform -translate-y-1/2 text-surface-400" />
              <input
                type="text"
                v-model="filters.orderNo"
                @input="handleSearch"
                placeholder="请输入订单编号"
                class="w-full pl-10 pr-4 py-2 rounded-lg border border-surface-300 dark:border-surface-600 bg-surface-0 dark:bg-surface-900 text-surface-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
              />
            </div>
          </div>

          <!-- 退款状态筛选 -->
          <div>
            <label class="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">退款状态</label>
            <select
              v-model="filters.refundStatus"
              @change="handleSearch"
              class="w-full px-4 py-2 rounded-lg border border-surface-300 dark:border-surface-600 bg-surface-0 dark:bg-surface-900 text-surface-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
            >
              <option value="">全部</option>
              <option value="0">未退款</option>
              <option value="1">已退款</option>
            </select>
          </div>

          <!-- 订单状态筛选 -->
          <div>
            <label class="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">订单状态</label>
            <select
              v-model="filters.orderStatus"
              @change="handleSearch"
              class="w-full px-4 py-2 rounded-lg border border-surface-300 dark:border-surface-600 bg-surface-0 dark:bg-surface-900 text-surface-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
            >
              <option value="">全部</option>
              <option value="1">待付款</option>
              <option value="2">待发货</option>
              <option value="3">待收货</option>
              <option value="4">已完成</option>
              <option value="5">已取消</option>
              <option value="6">已退款</option>
              <option value="7">退款中</option>
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
                v-for="afterSale in paginatedAfterSales"
                :key="afterSale.order_id"
                class="border-b border-surface-200 dark:border-surface-700 hover:bg-surface-50 dark:hover:bg-surface-800/50 transition-all"
              >
                <td class="px-4 py-3 text-sm text-surface-800 dark:text-white">{{ afterSale.order_id }}</td>
                <td class="px-4 py-3 text-sm text-surface-800 dark:text-white">{{ afterSale.order_no }}</td>
                <td class="px-4 py-3 text-sm text-surface-800 dark:text-white">{{ afterSale.shipping_no || '-' }}</td>
                <td class="px-4 py-3 text-sm text-surface-800 dark:text-white">{{ formatDate(afterSale.shipped_time) }}</td>
                <td class="px-4 py-3 text-sm text-surface-800 dark:text-white">{{ formatDate(afterSale.received_time) }}</td>
                <td class="px-4 py-3 text-sm text-surface-800 dark:text-white">{{ formatDate(afterSale.completed_time) }}</td>
                <td class="px-4 py-3 text-sm text-surface-800 dark:text-white">{{ formatDate(afterSale.cancelled_time) }}</td>
                <td class="px-4 py-3 text-sm text-surface-800 dark:text-white">{{ afterSale.cancel_reason || '-' }}</td>
                <td class="px-4 py-3">
                  <span
                    :class="[
                      'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                      afterSale.is_refunded ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                    ]"
                  >
                    {{ afterSale.is_refunded ? '已退款' : '未退款' }}
                  </span>
                </td>
                <td class="px-4 py-3">
                  <button
                    @click="handleRefund(afterSale)"
                    :disabled="afterSale.is_refunded || processingRefund === afterSale.order_id"
                    class="px-3 py-1.5 rounded border border-surface-300 dark:border-surface-600 bg-surface-0 dark:bg-surface-900 text-surface-800 dark:text-white text-sm hover:bg-surface-100 dark:hover:bg-surface-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    {{ processingRefund === afterSale.order_id ? '处理中...' : '退款' }}
                  </button>
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
        <div v-else-if="paginatedAfterSales.length === 0" class="py-10 flex flex-col justify-center items-center">
          <FontAwesomeIcon icon="file-alt" class="text-4xl text-surface-300 dark:text-surface-600 mb-2" />
          <p class="text-surface-500 dark:text-surface-400">暂无售后数据</p>
        </div>

        <!-- 分页控件 -->
        <div v-else class="px-4 py-3 border-t border-surface-200 dark:border-surface-700 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div class="text-sm text-surface-500 dark:text-surface-400">
            显示 {{ (currentPage - 1) * pageSize + 1 }} 到 {{ Math.min(currentPage * pageSize, filteredAfterSales.length) }} 条，共 {{ filteredAfterSales.length }} 条
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

    <!-- 操作提示 -->
    <div v-if="showNotification" class="fixed top-4 right-4 bg-white dark:bg-surface-800 rounded-lg shadow-lg border border-surface-200 dark:border-surface-700 p-4 flex items-center gap-3 animate-slide-in">
      <FontAwesomeIcon :icon="notificationType === 'success' ? 'check-circle' : 'exclamation-circle'" :class="notificationType === 'success' ? 'text-green-500' : 'text-red-500'" class="text-xl" />
      <span class="text-surface-800 dark:text-white">{{ notificationMessage }}</span>
      <button @click="showNotification = false" class="ml-auto text-surface-400 hover:text-surface-600 dark:hover:text-surface-300">
        <FontAwesomeIcon icon="times" />
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import afterSalesData from '../data/after-sales.js'
import ordersData from '../data/orders.js'

// 表格列配置
const columns = [
  { key: 'order_id', label: '订单ID' },
  { key: 'order_no', label: '订单编号' },
  { key: 'shipping_no', label: '物流单号' },
  { key: 'shipped_time', label: '发货时间' },
  { key: 'received_time', label: '收货时间' },
  { key: 'completed_time', label: '完成时间' },
  { key: 'cancelled_time', label: '取消时间' },
  { key: 'cancel_reason', label: '取消原因' },
  { key: 'is_refunded', label: '退款状态' },
  { key: 'action', label: '操作' }
]

// 响应式数据
const afterSales = ref([])
const loading = ref(false)
const filters = ref({
  orderNo: '',
  refundStatus: '',
  orderStatus: ''
})
const sortConfig = ref({
  key: null,
  direction: 'asc'
})
const currentPage = ref(1)
const pageSize = ref(10)
const processingRefund = ref(null)
const showNotification = ref(false)
const notificationMessage = ref('')
const notificationType = ref('success')

// 计算属性
const filteredAfterSales = computed(() => {
  let result = [...afterSales.value]

  // 订单编号筛选
  if (filters.value.orderNo) {
    const searchTerm = filters.value.orderNo.toLowerCase()
    result = result.filter(afterSale => afterSale.order_no.toLowerCase().includes(searchTerm))
  }

  // 退款状态筛选
  if (filters.value.refundStatus) {
    result = result.filter(afterSale => afterSale.is_refunded === parseInt(filters.value.refundStatus))
  }

  // 订单状态筛选
  if (filters.value.orderStatus) {
    const orderStatus = parseInt(filters.value.orderStatus)
    result = result.filter(afterSale => {
      const order = ordersData.find(o => o.order_id === afterSale.order_id)
      return order && order.order_status === orderStatus
    })
  }

  // 排序
  if (sortConfig.value.key) {
    result.sort((a, b) => {
      let aVal = a[sortConfig.value.key]
      let bVal = b[sortConfig.value.key]

      // 处理日期排序
      if (['shipped_time', 'received_time', 'completed_time', 'cancelled_time'].includes(sortConfig.value.key)) {
        aVal = aVal ? new Date(aVal) : new Date(0)
        bVal = bVal ? new Date(bVal) : new Date(0)
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
  return Math.ceil(filteredAfterSales.value.length / pageSize.value)
})

const paginatedAfterSales = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredAfterSales.value.slice(start, end)
})

// 方法
const loadAfterSales = () => {
  loading.value = true
  // 模拟异步加载
  setTimeout(() => {
    afterSales.value = afterSalesData
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
  if (!dateString) return '-'
  const date = new Date(dateString)
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })
}

const showNotificationMessage = (message, type = 'success') => {
  notificationMessage.value = message
  notificationType.value = type
  showNotification.value = true

  // 3秒后自动关闭
  setTimeout(() => {
    showNotification.value = false
  }, 3000)
}

const handleRefund = (afterSale) => {
  // 设置处理中状态
  processingRefund.value = afterSale.order_id

  // 模拟异步处理
  setTimeout(() => {
    // 查找要退款的售后记录
    const index = afterSales.value.findIndex(item => item.order_id === afterSale.order_id)
    if (index !== -1) {
      // 更新退款状态
      afterSales.value[index].is_refunded = 1
      // 设置取消时间为当前时间
      afterSales.value[index].cancelled_time = new Date().toISOString()
      // 设置取消原因
      if (!afterSales.value[index].cancel_reason) {
        afterSales.value[index].cancel_reason = '用户申请退款'
      }

      // 显示成功提示
      showNotificationMessage('退款操作成功完成', 'success')
    } else {
      // 显示错误提示
      showNotificationMessage('退款操作失败，请重试', 'error')
    }

    // 重置处理中状态
    processingRefund.value = null
  }, 1000)
}

// 生命周期
onMounted(() => {
  loadAfterSales()
})
</script>

<style scoped>
/* 自定义样式 */
@keyframes slideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

.animate-slide-in {
  animation: slideIn 0.3s ease-out forwards;
}
</style>
