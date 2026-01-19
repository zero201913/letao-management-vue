<template>
  <div class="bg-surface-0 dark:bg-surface-900 min-h-screen">
    <!-- 页面头部 -->
    <div class="border-b border-surface-200 dark:border-surface-800">
      <div class="container mx-auto px-4 py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 class="text-2xl font-bold text-surface-800 dark:text-white">用户信息</h1>
          <p class="text-surface-500 dark:text-surface-400 mt-1">管理系统用户信息</p>
        </div>
      </div>
    </div>

    <!-- 主内容区 -->
    <div class="container mx-auto px-4 py-6">
      <!-- 筛选条件 -->
      <div class="bg-white dark:bg-surface-800 rounded-lg shadow-sm border border-surface-200 dark:border-surface-700 p-4 mb-6">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
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

          <!-- 性别筛选 -->
          <div>
            <label class="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">性别</label>
            <select
              v-model="filters.gender"
              @change="handleSearch"
              class="w-full px-4 py-2 rounded-lg border border-surface-300 dark:border-surface-600 bg-surface-0 dark:bg-surface-900 text-surface-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
            >
              <option value="">全部</option>
              <option value="0">未知</option>
              <option value="1">男</option>
              <option value="2">女</option>
            </select>
          </div>

          <!-- 手机号模糊匹配 -->
          <div>
            <label class="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">手机号</label>
            <div class="relative">
              <FontAwesomeIcon icon="search" class="absolute left-3 top-1/2 transform -translate-y-1/2 text-surface-400" />
              <input
                type="text"
                v-model="filters.phoneNumber"
                @input="handleSearch"
                placeholder="请输入手机号"
                class="w-full pl-10 pr-4 py-2 rounded-lg border border-surface-300 dark:border-surface-600 bg-surface-0 dark:bg-surface-900 text-surface-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
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
                v-for="user in paginatedUsers"
                :key="user.user_id"
                class="border-b border-surface-200 dark:border-surface-700 hover:bg-surface-50 dark:hover:bg-surface-800/50 transition-all"
              >
                <td class="px-4 py-3 text-sm text-surface-800 dark:text-white">{{ user.user_id }}</td>
                <td class="px-4 py-3 text-sm text-surface-800 dark:text-white">{{ user.username }}</td>
                <td class="px-4 py-3 text-sm text-surface-800 dark:text-white">{{ user.nickname }}</td>
                <td class="px-4 py-3">
                  <img
                    src="/src/assets/user.webp"
                    :alt="user.nickname"
                    class="w-8 h-8 rounded-full object-cover"
                  />
                </td>
                <td class="px-4 py-3 text-sm text-surface-800 dark:text-white">{{ user.phone_number }}</td>
                <td class="px-4 py-3 text-sm text-surface-800 dark:text-white">{{ user.email }}</td>
                <td class="px-4 py-3">
                  <span
                    :class="[
                      'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                      user.gender === 0 ? 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200' :
                      user.gender === 1 ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                      'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200'
                    ]"
                  >
                    {{ genderMap[user.gender] }}
                  </span>
                </td>
                <td class="px-4 py-3">
                  <span
                    class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                  >
                    用户
                  </span>
                </td>
                <td class="px-4 py-3">
                  <span
                    :class="[
                      'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                      user.status === 1 ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                      'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                    ]"
                  >
                    {{ statusMap[user.status] }}
                  </span>
                </td>
                <td class="px-4 py-3 text-sm text-surface-800 dark:text-white">{{ formatDate(user.last_login_time) }}</td>
                <td class="px-4 py-3 text-sm text-surface-800 dark:text-white">{{ formatDate(user.created_at) }}</td>
                <td class="px-4 py-3 text-sm text-surface-800 dark:text-white">{{ formatDate(user.updated_at) }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- 加载状态 -->
        <div v-if="loading" class="py-10 flex justify-center items-center">
          <div class="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-500"></div>
        </div>

        <!-- 空状态 -->
        <div v-else-if="paginatedUsers.length === 0" class="py-10 flex flex-col justify-center items-center">
          <FontAwesomeIcon icon="user-slash" class="text-4xl text-surface-300 dark:text-surface-600 mb-2" />
          <p class="text-surface-500 dark:text-surface-400">暂无用户数据</p>
        </div>

        <!-- 分页控件 -->
        <div v-else class="px-4 py-3 border-t border-surface-200 dark:border-surface-700 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div class="text-sm text-surface-500 dark:text-surface-400">
            显示 {{ (currentPage - 1) * pageSize + 1 }} 到 {{ Math.min(currentPage * pageSize, filteredUsers.length) }} 条，共 {{ filteredUsers.length }} 条
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
import usersData from '../../data/users.js'

// 状态映射
const genderMap = {
  0: '未知',
  1: '男',
  2: '女'
}



const statusMap = {
  1: '活跃',
  2: '禁用'
}

// 表格列配置
const columns = [
  { key: 'user_id', label: '用户ID' },
  { key: 'username', label: '用户名' },
  { key: 'nickname', label: '昵称' },
  { key: 'avatar_url', label: '头像' },
  { key: 'phone_number', label: '手机号' },
  { key: 'email', label: '邮箱' },
  { key: 'gender', label: '性别' },
  { key: 'user_type', label: '用户' },
  { key: 'status', label: '状态' },
  { key: 'last_login_time', label: '最后登录时间' },
  { key: 'created_at', label: '创建时间' },
  { key: 'updated_at', label: '更新时间' }
]

// 响应式数据
const users = ref([])
const loading = ref(false)
const filters = ref({
  username: '',
  gender: '',
  phoneNumber: ''
})
const sortConfig = ref({
  key: null,
  direction: 'asc'
})
const currentPage = ref(1)
const pageSize = ref(10)

// 计算属性
const filteredUsers = computed(() => {
  let result = [...users.value]

  // 用户名筛选
  if (filters.value.username) {
    const searchTerm = filters.value.username.toLowerCase()
    result = result.filter(user => user.username.toLowerCase().includes(searchTerm))
  }

  // 性别筛选
  if (filters.value.gender) {
    result = result.filter(user => user.gender === parseInt(filters.value.gender))
  }

  // 手机号模糊匹配
  if (filters.value.phoneNumber) {
    const searchTerm = filters.value.phoneNumber.toLowerCase()
    result = result.filter(user => user.phone_number.toLowerCase().includes(searchTerm))
  }

  // 排序
  if (sortConfig.value.key) {
    result.sort((a, b) => {
      let aVal = a[sortConfig.value.key]
      let bVal = b[sortConfig.value.key]

      // 处理日期排序
      if (['last_login_time', 'created_at', 'updated_at'].includes(sortConfig.value.key)) {
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
  return Math.ceil(filteredUsers.value.length / pageSize.value)
})

const paginatedUsers = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredUsers.value.slice(start, end)
})

// 方法
const loadUsers = () => {
  loading.value = true
  // 模拟异步加载
  setTimeout(() => {
    users.value = usersData
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

// 生命周期
onMounted(() => {
  loadUsers()
})

// 监听筛选条件变化
watch(
  () => [filters.value.username, filters.value.gender, filters.value.phoneNumber],
  () => {
    handleSearch()
  }
)
</script>

<style scoped>
/* 自定义样式 */
</style>
