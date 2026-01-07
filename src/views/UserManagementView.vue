<template>
  <div class="space-y-6">
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <h2 class="text-2xl font-bold text-surface-800 dark:text-white">用户管理</h2>
      <BaseButton variant="primary" @click="handleAddUser">
        <i class="fas fa-user-plus mr-2"></i>
        添加用户
      </BaseButton>
    </div>

    <BaseCard :padding="false">
      <div class="p-4 border-b border-surface-200 dark:border-surface-700 flex flex-col sm:flex-row gap-4">
        <div class="relative flex-1">
          <i class="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-surface-400"></i>
          <input
            type="text"
            v-model="searchQuery"
            placeholder="搜索用户..."
            class="input pl-10"
          />
        </div>
        <div class="flex gap-2">
          <select v-model="roleFilter" class="input w-auto">
            <option value="">全部角色</option>
            <option value="admin">管理员</option>
            <option value="merchant">商家</option>
            <option value="user">普通用户</option>
          </select>
          <select v-model="statusFilter" class="input w-auto">
            <option value="">全部状态</option>
            <option value="active">已激活</option>
            <option value="pending">待审核</option>
            <option value="inactive">已禁用</option>
          </select>
        </div>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-surface-50 dark:bg-surface-800">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-semibold text-surface-600 dark:text-surface-400 uppercase tracking-wider">ID</th>
              <th class="px-6 py-3 text-left text-xs font-semibold text-surface-600 dark:text-surface-400 uppercase tracking-wider">用户</th>
              <th class="px-6 py-3 text-left text-xs font-semibold text-surface-600 dark:text-surface-400 uppercase tracking-wider">邮箱</th>
              <th class="px-6 py-3 text-left text-xs font-semibold text-surface-600 dark:text-surface-400 uppercase tracking-wider">角色</th>
              <th class="px-6 py-3 text-left text-xs font-semibold text-surface-600 dark:text-surface-400 uppercase tracking-wider">状态</th>
              <th class="px-6 py-3 text-left text-xs font-semibold text-surface-600 dark:text-surface-400 uppercase tracking-wider">注册时间</th>
              <th class="px-6 py-3 text-left text-xs font-semibold text-surface-600 dark:text-surface-400 uppercase tracking-wider">操作</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-surface-100 dark:divide-surface-800">
            <tr
              v-for="user in filteredUsers"
              :key="user.id"
              class="hover:bg-surface-50 dark:hover:bg-surface-800/50 transition-colors"
            >
              <td class="px-6 py-4 whitespace-nowrap text-sm text-surface-600 dark:text-surface-300">{{ user.id }}</td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-full bg-gradient-to-br from-primary-600 to-accent-500 flex items-center justify-center text-white font-semibold">
                    {{ user.avatar }}
                  </div>
                  <span class="text-sm font-medium text-surface-800 dark:text-white">{{ user.username }}</span>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-surface-600 dark:text-surface-300">{{ user.email }}</td>
              <td class="px-6 py-4 whitespace-nowrap">
                <BaseTag :variant="user.role === 'admin' ? 'primary' : 'info'">
                  {{ user.role === 'admin' ? '管理员' : user.role === 'merchant' ? '商家' : '普通用户' }}
                </BaseTag>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <BaseTag :variant="getStatusVariant(user.status)">
                  {{ getStatusText(user.status) }}
                </BaseTag>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-surface-500">{{ user.registerTime }}</td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center gap-2">
                  <BaseButton variant="ghost" size="sm" @click="handleEditUser(user)">
                    <i class="fas fa-edit"></i>
                  </BaseButton>
                  <BaseButton variant="ghost" size="sm" @click="handleDeleteUser(user)">
                    <i class="fas fa-trash text-danger-500"></i>
                  </BaseButton>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="p-4 border-t border-surface-200 dark:border-surface-700 flex items-center justify-between">
        <p class="text-sm text-surface-500">
          显示 {{ (currentPage - 1) * pageSize + 1 }} 到 {{ Math.min(currentPage * pageSize, total) }} 条，共 {{ total }} 条
        </p>
        <div class="flex gap-2">
          <BaseButton
            variant="secondary"
            size="sm"
            :disabled="currentPage === 1"
            @click="currentPage--"
          >
            <i class="fas fa-chevron-left mr-1"></i>
            上一页
          </BaseButton>
          <BaseButton
            variant="secondary"
            size="sm"
            :disabled="currentPage === totalPages"
            @click="currentPage++"
          >
            下一页
            <i class="fas fa-chevron-right ml-1"></i>
          </BaseButton>
        </div>
      </div>
    </BaseCard>

    <BaseModal v-model="showModal" :title="modalTitle">
      <div class="space-y-4">
        <div>
          <label class="label">用户名</label>
          <input type="text" v-model="currentUser.username" class="input" placeholder="请输入用户名" />
        </div>
        <div>
          <label class="label">邮箱</label>
          <input type="email" v-model="currentUser.email" class="input" placeholder="请输入邮箱" />
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="label">角色</label>
            <select v-model="currentUser.role" class="input">
              <option value="admin">管理员</option>
              <option value="merchant">商家</option>
              <option value="user">普通用户</option>
            </select>
          </div>
          <div>
            <label class="label">状态</label>
            <select v-model="currentUser.status" class="input">
              <option value="active">已激活</option>
              <option value="pending">待审核</option>
              <option value="inactive">已禁用</option>
            </select>
          </div>
        </div>
      </div>
      <template #footer>
        <div class="flex justify-end gap-3">
          <BaseButton variant="secondary" @click="showModal = false">取消</BaseButton>
          <BaseButton variant="primary" @click="handleSaveUser">保存</BaseButton>
        </div>
      </template>
    </BaseModal>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import BaseCard from '../components/UI/BaseCard.vue'
import BaseButton from '../components/UI/BaseButton.vue'
import BaseTag from '../components/UI/BaseTag.vue'
import BaseModal from '../components/UI/BaseModal.vue'

const searchQuery = ref('')
const roleFilter = ref('')
const statusFilter = ref('')
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(5)
const showModal = ref(false)
const modalMode = ref('add')

const users = ref([
  { id: 1, username: '张经理', avatar: '张', email: 'zhang@example.com', role: 'admin', status: 'active', statusText: '已激活', registerTime: '2023-01-01 12:00:00' },
  { id: 2, username: '李商家', avatar: '李', email: 'li@example.com', role: 'merchant', status: 'active', statusText: '已激活', registerTime: '2023-01-02 10:30:00' },
  { id: 3, username: '王用户', avatar: '王', email: 'wang@example.com', role: 'user', status: 'pending', statusText: '待审核', registerTime: '2023-01-03 09:15:00' },
  { id: 4, username: '赵管理员', avatar: '赵', email: 'zhao@example.com', role: 'admin', status: 'active', statusText: '已激活', registerTime: '2023-01-04 14:45:00' },
  { id: 5, username: '钱商家', avatar: '钱', email: 'qian@example.com', role: 'merchant', status: 'inactive', statusText: '已禁用', registerTime: '2023-01-05 16:20:00' }
])

const currentUser = ref({
  id: null,
  username: '',
  avatar: '',
  email: '',
  role: 'user',
  status: 'active'
})

const totalPages = computed(() => Math.ceil(total.value / pageSize.value))

const filteredUsers = computed(() => {
  return users.value.filter(user => {
    const matchesSearch = user.username.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchesRole = !roleFilter.value || user.role === roleFilter.value
    const matchesStatus = !statusFilter.value || user.status === statusFilter.value
    return matchesSearch && matchesRole && matchesStatus
  })
})

const modalTitle = computed(() => {
  return modalMode.value === 'add' ? '添加用户' : '编辑用户'
})

const getStatusVariant = (status) => {
  const variants = {
    active: 'success',
    pending: 'warning',
    inactive: 'danger'
  }
  return variants[status] || 'info'
}

const getStatusText = (status) => {
  const texts = {
    active: '已激活',
    pending: '待审核',
    inactive: '已禁用'
  }
  return texts[status] || status
}

const handleAddUser = () => {
  modalMode.value = 'add'
  currentUser.value = {
    id: null,
    username: '',
    avatar: '',
    email: '',
    role: 'user',
    status: 'active'
  }
  showModal.value = true
}

const handleEditUser = (user) => {
  modalMode.value = 'edit'
  currentUser.value = { ...user }
  showModal.value = true
}

const handleDeleteUser = (user) => {
  if (confirm(`确定要删除用户 "${user.username}" 吗？`)) {
    const index = users.value.findIndex(u => u.id === user.id)
    if (index > -1) {
      users.value.splice(index, 1)
    }
  }
}

const handleSaveUser = () => {
  if (modalMode.value === 'add') {
    currentUser.value.id = users.value.length + 1
    currentUser.value.avatar = currentUser.value.username.charAt(0)
    currentUser.value.statusText = getStatusText(currentUser.value.status)
    currentUser.value.registerTime = new Date().toLocaleString()
    users.value.push({ ...currentUser.value })
  } else {
    const index = users.value.findIndex(u => u.id === currentUser.value.id)
    if (index > -1) {
      currentUser.value.avatar = currentUser.value.username.charAt(0)
      currentUser.value.statusText = getStatusText(currentUser.value.status)
      users.value[index] = { ...currentUser.value }
    }
  }
  showModal.value = false
}
</script>
