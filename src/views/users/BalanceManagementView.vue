<template>
  <div class="bg-surface-0 dark:bg-surface-900 min-h-screen">
    <!-- 页面头部 -->
    <div class="border-b border-surface-200 dark:border-surface-800">
      <div class="container mx-auto px-4 py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 class="text-2xl font-bold text-surface-800 dark:text-white">余额管理</h1>
          <p class="text-surface-500 dark:text-surface-400 mt-1">商家用户余额管理系统</p>
        </div>
      </div>
    </div>

    <!-- 主内容区 -->
    <div class="container mx-auto px-4 py-6">
      <!-- 数据统计区域 -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
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
              <p class="text-sm text-surface-500 dark:text-surface-400">总余额</p>
              <h3 class="text-2xl font-bold text-surface-800 dark:text-white">¥{{ totalBalance.toFixed(2) }}</h3>
            </div>
            <div class="w-10 h-10 rounded-full bg-success-100 dark:bg-success-900/30 flex items-center justify-center">
              <FontAwesomeIcon icon="wallet" class="text-success-600 dark:text-success-400" />
            </div>
          </div>
        </div>
        <div class="bg-white dark:bg-surface-800 rounded-lg shadow-sm border border-surface-200 dark:border-surface-700 p-4">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-surface-500 dark:text-surface-400">今日交易笔数</p>
              <h3 class="text-2xl font-bold text-surface-800 dark:text-white">{{ todayTransactions }}</h3>
            </div>
            <div class="w-10 h-10 rounded-full bg-info-100 dark:bg-info-900/30 flex items-center justify-center">
              <FontAwesomeIcon icon="exchange-alt" class="text-info-600 dark:text-info-400" />
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

          <!-- 账户状态筛选 -->
          <div>
            <label class="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">账户状态</label>
            <select
              v-model="filters.status"
              @change="handleSearch"
              class="w-full px-4 py-2 rounded-lg border border-surface-300 dark:border-surface-600 bg-surface-0 dark:bg-surface-900 text-surface-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
            >
              <option value="">全部</option>
              <option value="1">正常</option>
              <option value="2">冻结</option>
            </select>
          </div>

          <!-- 余额范围筛选 -->
          <div>
            <label class="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">余额范围</label>
            <select
              v-model="filters.balanceRange"
              @change="handleSearch"
              class="w-full px-4 py-2 rounded-lg border border-surface-300 dark:border-surface-600 bg-surface-0 dark:bg-surface-900 text-surface-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
            >
              <option value="">全部</option>
              <option value="0-1000">0-1000</option>
              <option value="1000-5000">1000-5000</option>
              <option value="5000-10000">5000-10000</option>
              <option value="10000+">10000+</option>
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
                v-for="balance in paginatedBalances"
                :key="balance.balance_id"
                class="border-b border-surface-200 dark:border-surface-700 hover:bg-surface-50 dark:hover:bg-surface-800/50 transition-all"
              >
                <td class="px-4 py-3 text-sm text-surface-800 dark:text-white">{{ balance.user_id }}</td>
                <td class="px-4 py-3 text-sm text-surface-800 dark:text-white">{{ balance.username }}</td>
                <td class="px-4 py-3 text-sm text-surface-800 dark:text-white">{{ balance.nickname }}</td>
                <td class="px-4 py-3 text-sm font-medium text-surface-800 dark:text-white">
                  ¥{{ balance.balance.toFixed(2) }}
                </td>
                <td class="px-4 py-3 text-sm text-surface-800 dark:text-white">{{ balance.last_transaction_time }}</td>
                <td class="px-4 py-3">
                  <span
                    :class="[
                      'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                      balance.status === 1 ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                      'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                    ]"
                  >
                    {{ balance.status === 1 ? '正常' : '冻结' }}
                  </span>
                </td>
                <td class="px-4 py-3">
                  <div class="flex items-center gap-2">
                    <button
                      @click="handleBalanceAdjust(balance)"
                      class="px-2 py-1 text-xs bg-primary-100 text-primary-800 dark:bg-primary-900/30 dark:text-primary-400 rounded hover:bg-primary-200 dark:hover:bg-primary-900/50 transition-all"
                      title="调整余额"
                    >
                      <FontAwesomeIcon icon="edit" class="mr-1" />
                      调整
                    </button>
                    <button
                      @click="handleFreezeAccount(balance)"
                      class="px-2 py-1 text-xs bg-warning-100 text-warning-800 dark:bg-warning-900/30 dark:text-warning-400 rounded hover:bg-warning-200 dark:hover:bg-warning-900/50 transition-all"
                      :title="balance.status === 1 ? '冻结账户' : '解冻账户'"
                    >
                      <FontAwesomeIcon :icon="balance.status === 1 ? 'lock' : 'unlock'" class="mr-1" />
                      {{ balance.status === 1 ? '冻结' : '解冻' }}
                    </button>
                    <button
                      @click="handleViewTransactions(balance)"
                      class="px-2 py-1 text-xs bg-info-100 text-info-800 dark:bg-info-900/30 dark:text-info-400 rounded hover:bg-info-200 dark:hover:bg-info-900/50 transition-all"
                      title="查看交易记录"
                    >
                      <FontAwesomeIcon icon="list-alt" class="mr-1" />
                      记录
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
        <div v-else-if="paginatedBalances.length === 0" class="py-10 flex flex-col justify-center items-center">
          <FontAwesomeIcon icon="wallet" class="text-4xl text-surface-300 dark:text-surface-600 mb-2" />
          <p class="text-surface-500 dark:text-surface-400">暂无余额数据</p>
        </div>

        <!-- 分页控件 -->
        <div v-else class="px-4 py-3 border-t border-surface-200 dark:border-surface-700 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div class="text-sm text-surface-500 dark:text-surface-400">
            显示 {{ (currentPage - 1) * pageSize + 1 }} 到 {{ Math.min(currentPage * pageSize, filteredBalances.length) }} 条，共 {{ filteredBalances.length }} 条
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

    <!-- 余额调整弹窗 -->
    <div v-if="showAdjustModal" class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div class="bg-white dark:bg-surface-800 rounded-lg shadow-lg w-full max-w-md">
        <div class="p-4 border-b border-surface-200 dark:border-surface-700">
          <h3 class="text-lg font-semibold text-surface-800 dark:text-white">调整余额</h3>
        </div>
        <div class="p-4">
          <div class="mb-4">
            <label class="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">用户</label>
            <p class="text-sm text-surface-600 dark:text-surface-400">{{ selectedBalance?.nickname }} ({{ selectedBalance?.username }})</p>
          </div>
          <div class="mb-4">
            <label class="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">当前余额</label>
            <p class="text-sm font-medium text-surface-800 dark:text-white">¥{{ selectedBalance?.balance.toFixed(2) }}</p>
          </div>
          <div class="mb-4">
            <label class="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">调整类型</label>
            <select v-model="adjustType" class="w-full px-4 py-2 rounded-lg border border-surface-300 dark:border-surface-600 bg-surface-0 dark:bg-surface-900 text-surface-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all">
              <option value="increase">增加</option>
              <option value="decrease">减少</option>
            </select>
          </div>
          <div class="mb-4">
            <label class="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">调整金额</label>
            <input type="number" v-model.number="adjustAmount" min="0" step="0.01" class="w-full px-4 py-2 rounded-lg border border-surface-300 dark:border-surface-600 bg-surface-0 dark:bg-surface-900 text-surface-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all" placeholder="请输入金额">
          </div>
          <div class="mb-4">
            <label class="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">备注</label>
            <input type="text" v-model="adjustRemark" class="w-full px-4 py-2 rounded-lg border border-surface-300 dark:border-surface-600 bg-surface-0 dark:bg-surface-900 text-surface-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all" placeholder="请输入备注">
          </div>
        </div>
        <div class="p-4 border-t border-surface-200 dark:border-surface-700 flex justify-end gap-2">
          <button @click="showAdjustModal = false" class="px-4 py-2 rounded-lg border border-surface-300 dark:border-surface-600 bg-surface-0 dark:bg-surface-900 text-surface-800 dark:text-white hover:bg-surface-100 dark:hover:bg-surface-800 transition-all">取消</button>
          <button @click="confirmAdjust" class="px-4 py-2 rounded-lg bg-primary-600 text-white hover:bg-primary-700 transition-all">确认调整</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import balancesData from '../../data/balances.js'

// 表格列配置
const columns = [
  { key: 'user_id', label: '用户ID' },
  { key: 'username', label: '用户名' },
  { key: 'nickname', label: '昵称' },
  { key: 'balance', label: '当前余额' },
  { key: 'last_transaction_time', label: '最近交易时间' },
  { key: 'status', label: '账户状态' },
  { key: 'actions', label: '操作' }
]

// 响应式数据
const balances = ref([])
const loading = ref(false)
const filters = ref({
  userId: '',
  username: '',
  status: '',
  balanceRange: ''
})
const sortConfig = ref({
  key: null,
  direction: 'asc'
})
const currentPage = ref(1)
const pageSize = ref(10)

// 弹窗相关
const showAdjustModal = ref(false)
const selectedBalance = ref(null)
const adjustType = ref('increase')
const adjustAmount = ref(0)
const adjustRemark = ref('')

// 计算属性
const filteredBalances = computed(() => {
  let result = [...balances.value]

  // 用户ID筛选
  if (filters.value.userId) {
    const userId = parseInt(filters.value.userId)
    result = result.filter(balance => balance.user_id === userId)
  }

  // 用户名筛选
  if (filters.value.username) {
    const searchTerm = filters.value.username.toLowerCase()
    result = result.filter(balance =>
      balance.username.toLowerCase().includes(searchTerm) ||
      balance.nickname.toLowerCase().includes(searchTerm)
    )
  }

  // 状态筛选
  if (filters.value.status) {
    const status = parseInt(filters.value.status)
    result = result.filter(balance => balance.status === status)
  }

  // 余额范围筛选
  if (filters.value.balanceRange) {
    const [min, max] = filters.value.balanceRange.split('-')
    result = result.filter(balance => {
      if (max === '+') {
        return balance.balance >= parseInt(min)
      }
      return balance.balance >= parseInt(min) && balance.balance <= parseInt(max)
    })
  }

  // 排序
  if (sortConfig.value.key) {
    result.sort((a, b) => {
      let aVal = a[sortConfig.value.key]
      let bVal = b[sortConfig.value.key]

      // 处理日期排序
      if (sortConfig.value.key === 'last_transaction_time') {
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
  return Math.ceil(filteredBalances.value.length / pageSize.value)
})

const paginatedBalances = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredBalances.value.slice(start, end)
})

// 统计数据
const totalUsers = computed(() => {
  return balances.value.length
})

const totalBalance = computed(() => {
  return balances.value.reduce((sum, balance) => sum + balance.balance, 0)
})

const todayTransactions = computed(() => {
  const today = new Date().toISOString().split('T')[0]
  return balances.value.filter(balance => {
    const transactionDate = balance.last_transaction_time.split(' ')[0]
    return transactionDate === today
  }).length
})

// 方法
const loadBalances = () => {
  loading.value = true
  // 模拟异步加载
  setTimeout(() => {
    balances.value = balancesData
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

// 余额操作
const handleBalanceAdjust = (balance) => {
  selectedBalance.value = balance
  adjustType.value = 'increase'
  adjustAmount.value = 0
  adjustRemark.value = ''
  showAdjustModal.value = true
}

const confirmAdjust = () => {
  if (!selectedBalance.value || adjustAmount.value <= 0) return

  // 模拟余额调整
  const index = balances.value.findIndex(b => b.balance_id === selectedBalance.value.balance_id)
  if (index > -1) {
    if (adjustType.value === 'increase') {
      balances.value[index].balance += adjustAmount.value
    } else {
      balances.value[index].balance = Math.max(0, balances.value[index].balance - adjustAmount.value)
    }
    balances.value[index].last_transaction_time = new Date().toLocaleString('zh-CN')
    balances.value[index].updated_at = new Date().toLocaleString('zh-CN')
  }

  showAdjustModal.value = false
  // 这里可以添加交易记录的逻辑
}

const handleFreezeAccount = (balance) => {
  // 模拟冻结/解冻账户
  const index = balances.value.findIndex(b => b.balance_id === balance.balance_id)
  if (index > -1) {
    balances.value[index].status = balance.status === 1 ? 2 : 1
    balances.value[index].frozen_amount = balance.status === 1 ? balances.value[index].balance : 0
    balances.value[index].last_transaction_time = new Date().toLocaleString('zh-CN')
    balances.value[index].updated_at = new Date().toLocaleString('zh-CN')
  }
}

const handleViewTransactions = (balance) => {
  // 这里可以实现查看交易记录的逻辑
  console.log('查看交易记录:', balance)
  // 可以跳转到交易记录页面或打开弹窗
}

// 生命周期
onMounted(() => {
  loadBalances()
})

// 监听筛选条件变化
watch(
  () => [filters.value.userId, filters.value.username, filters.value.status, filters.value.balanceRange],
  () => {
    handleSearch()
  }
)
</script>

<style scoped>
/* 自定义样式 */
</style>
