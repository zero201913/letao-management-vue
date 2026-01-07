<template>
  <div class="space-y-6">
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <h2 class="text-2xl font-bold text-surface-800 dark:text-white">产品管理</h2>
      <BaseButton variant="primary" @click="handleAddProduct">
        <i class="fas fa-plus mr-2"></i>
        添加产品
      </BaseButton>
    </div>

    <BaseCard :padding="false">
      <div class="p-4 border-b border-surface-200 dark:border-surface-700 flex flex-col sm:flex-row gap-4">
        <div class="relative flex-1">
          <i class="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-surface-400"></i>
          <input
            type="text"
            v-model="searchQuery"
            placeholder="搜索产品..."
            class="input pl-10"
          />
        </div>
        <div class="flex gap-2">
          <select v-model="categoryFilter" class="input w-auto">
            <option value="">全部分类</option>
            <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
          </select>
          <select v-model="statusFilter" class="input w-auto">
            <option value="">全部状态</option>
            <option value="active">在售</option>
            <option value="inactive">下架</option>
          </select>
        </div>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-surface-50 dark:bg-surface-800">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-semibold text-surface-600 dark:text-surface-400 uppercase tracking-wider">ID</th>
              <th class="px-6 py-3 text-left text-xs font-semibold text-surface-600 dark:text-surface-400 uppercase tracking-wider">产品名称</th>
              <th class="px-6 py-3 text-left text-xs font-semibold text-surface-600 dark:text-surface-400 uppercase tracking-wider">分类</th>
              <th class="px-6 py-3 text-left text-xs font-semibold text-surface-600 dark:text-surface-400 uppercase tracking-wider">价格</th>
              <th class="px-6 py-3 text-left text-xs font-semibold text-surface-600 dark:text-surface-400 uppercase tracking-wider">库存</th>
              <th class="px-6 py-3 text-left text-xs font-semibold text-surface-600 dark:text-surface-400 uppercase tracking-wider">状态</th>
              <th class="px-6 py-3 text-left text-xs font-semibold text-surface-600 dark:text-surface-400 uppercase tracking-wider">创建时间</th>
              <th class="px-6 py-3 text-left text-xs font-semibold text-surface-600 dark:text-surface-400 uppercase tracking-wider">操作</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-surface-100 dark:divide-surface-800">
            <tr
              v-for="product in filteredProducts"
              :key="product.id"
              class="hover:bg-surface-50 dark:hover:bg-surface-800/50 transition-colors"
            >
              <td class="px-6 py-4 whitespace-nowrap text-sm text-surface-600 dark:text-surface-300">{{ product.id }}</td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-lg bg-surface-100 dark:bg-surface-700 flex items-center justify-center">
                    <i class="fas fa-box text-surface-400"></i>
                  </div>
                  <span class="text-sm font-medium text-surface-800 dark:text-white">{{ product.name }}</span>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <BaseTag variant="info">{{ product.category }}</BaseTag>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-surface-800 dark:text-white">{{ product.price }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-surface-600 dark:text-surface-300">{{ product.stock }}</td>
              <td class="px-6 py-4 whitespace-nowrap">
                <BaseTag :variant="product.status === 'active' ? 'success' : 'warning'">
                  {{ product.status === 'active' ? '在售' : '下架' }}
                </BaseTag>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-surface-500">{{ product.createTime }}</td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center gap-2">
                  <BaseButton variant="ghost" size="sm" @click="handleViewProduct(product)">
                    <i class="fas fa-eye"></i>
                  </BaseButton>
                  <BaseButton variant="ghost" size="sm" @click="handleEditProduct(product)">
                    <i class="fas fa-edit"></i>
                  </BaseButton>
                  <BaseButton variant="ghost" size="sm" @click="handleDeleteProduct(product)">
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
          <label class="label">产品名称</label>
          <input type="text" v-model="currentProduct.name" class="input" placeholder="请输入产品名称" />
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="label">分类</label>
            <select v-model="currentProduct.category" class="input">
              <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
            </select>
          </div>
          <div>
            <label class="label">价格</label>
            <input type="text" v-model="currentProduct.price" class="input" placeholder="¥0.00" />
          </div>
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="label">库存</label>
            <input type="number" v-model="currentProduct.stock" class="input" placeholder="0" />
          </div>
          <div>
            <label class="label">状态</label>
            <select v-model="currentProduct.status" class="input">
              <option value="active">在售</option>
              <option value="inactive">下架</option>
            </select>
          </div>
        </div>
      </div>
      <template #footer>
        <div class="flex justify-end gap-3">
          <BaseButton variant="secondary" @click="showModal = false">取消</BaseButton>
          <BaseButton variant="primary" @click="handleSaveProduct">保存</BaseButton>
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
const categoryFilter = ref('')
const statusFilter = ref('')
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(5)
const showModal = ref(false)
const modalMode = ref('add')

const categories = ['电子产品', '家居用品', '服装', '食品', '美妆']

const products = ref([
  { id: 1, name: '产品1', category: '电子产品', price: '¥999', stock: 100, status: 'active', createTime: '2023-01-01 12:00:00' },
  { id: 2, name: '产品2', category: '家居用品', price: '¥199', stock: 50, status: 'active', createTime: '2023-01-02 10:30:00' },
  { id: 3, name: '产品3', category: '服装', price: '¥299', stock: 200, status: 'inactive', createTime: '2023-01-03 09:15:00' },
  { id: 4, name: '产品4', category: '食品', price: '¥49', stock: 300, status: 'active', createTime: '2023-01-04 14:45:00' },
  { id: 5, name: '产品5', category: '美妆', price: '¥149', stock: 150, status: 'active', createTime: '2023-01-05 16:20:00' }
])

const currentProduct = ref({
  id: null,
  name: '',
  category: '电子产品',
  price: '',
  stock: 0,
  status: 'active'
})

const totalPages = computed(() => Math.ceil(total.value / pageSize.value))

const filteredProducts = computed(() => {
  return products.value.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchesCategory = !categoryFilter.value || product.category === categoryFilter.value
    const matchesStatus = !statusFilter.value || product.status === statusFilter.value
    return matchesSearch && matchesCategory && matchesStatus
  })
})

const modalTitle = computed(() => {
  return modalMode.value === 'add' ? '添加产品' : '编辑产品'
})

const handleAddProduct = () => {
  modalMode.value = 'add'
  currentProduct.value = {
    id: null,
    name: '',
    category: '电子产品',
    price: '',
    stock: 0,
    status: 'active'
  }
  showModal.value = true
}

const handleEditProduct = (product) => {
  modalMode.value = 'edit'
  currentProduct.value = { ...product }
  showModal.value = true
}

const handleViewProduct = (product) => {
  console.log('查看产品:', product)
}

const handleDeleteProduct = (product) => {
  if (confirm(`确定要删除产品 "${product.name}" 吗？`)) {
    const index = products.value.findIndex(p => p.id === product.id)
    if (index > -1) {
      products.value.splice(index, 1)
    }
  }
}

const handleSaveProduct = () => {
  if (modalMode.value === 'add') {
    currentProduct.value.id = products.value.length + 1
    products.value.push({ ...currentProduct.value, createTime: new Date().toLocaleString() })
  } else {
    const index = products.value.findIndex(p => p.id === currentProduct.value.id)
    if (index > -1) {
      products.value[index] = { ...currentProduct.value }
    }
  }
  showModal.value = false
}
</script>
