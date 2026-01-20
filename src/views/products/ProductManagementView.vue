<template>
  <div class="bg-surface-0 dark:bg-surface-900 min-h-screen">
    <!-- 页面头部 -->
    <div class="border-b border-surface-200 dark:border-surface-800">
      <div class="container mx-auto px-4 py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 class="text-2xl font-bold text-surface-800 dark:text-white">产品管理</h1>
          <p class="text-surface-500 dark:text-surface-400 mt-1">管理系统产品信息</p>
        </div>
        <BaseButton variant="primary" @click="handleAddProduct">
          <i class="fas fa-plus"></i>
          添加产品
        </BaseButton>
      </div>
    </div>

    <!-- 主内容区 -->
    <div class="container mx-auto px-4 py-6">
      <!-- 筛选条件 -->
      <div class="bg-white dark:bg-surface-800 rounded-lg shadow-sm border border-surface-200 dark:border-surface-700 p-4 mb-6">
        <div class="grid grid-cols-1 md:grid-cols-12 gap-6">
          <!-- 产品名称搜索 -->
          <div class="md:col-span-3">
            <label class="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">产品名称</label>
            <div class="relative">
              <i class="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-surface-400"></i>
              <input
                type="text"
                v-model="searchQuery"
                placeholder="请输入产品名称"
                class="w-full px-4 py-2 rounded-lg border border-surface-300 dark:border-surface-600 bg-surface-0 dark:bg-surface-900 text-surface-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
                @input="handleSearch"
              />
            </div>
          </div>

          <!-- 产品类型筛选 -->
          <div class="md:col-span-2">
            <label class="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">产品类型</label>
            <select
              v-model="categoryFilter"
              @change="handleSearch"
              class="w-full px-4 py-2 rounded-lg border border-surface-300 dark:border-surface-600 bg-surface-0 dark:bg-surface-900 text-surface-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
            >
              <option value="">全部分类</option>
              <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
            </select>
          </div>

          <!-- 价格区间筛选 -->
          <div class="md:col-span-4">
            <label class="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">价格区间</label>
            <div class="flex items-center gap-3">
              <input
                type="number"
                v-model="priceRange.min"
                placeholder="最低价"
                class="flex-1 px-4 py-2 rounded-lg border border-surface-300 dark:border-surface-600 bg-surface-0 dark:bg-surface-900 text-surface-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
                @input="handleSearch"
              />
              <span class="text-surface-500 text-sm whitespace-nowrap">-</span>
              <input
                type="number"
                v-model="priceRange.max"
                placeholder="最高价"
                class="flex-1 px-4 py-2 rounded-lg border border-surface-300 dark:border-surface-600 bg-surface-0 dark:bg-surface-900 text-surface-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
                @input="handleSearch"
              />
            </div>
          </div>

          <!-- 每页显示数量 -->
          <div class="md:col-span-3">
            <label class="block text-sm font-medium text-surface-500 dark:text-surface-300 mb-1">每页显示</label>
            <select
              v-model="pageSize"
              @change="handlePageSizeChange"
              class="w-full px-4 py-2 rounded-lg border border-surface-300 dark:border-surface-600 bg-surface-0 dark:bg-surface-900 text-surface-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
            >
              <option value="10">10条/页</option>
              <option value="20">20条/页</option>
              <option value="50">50条/页</option>
            </select>
          </div>
        </div>
      </div>

      <!-- 表格区域 -->
      <div class="bg-white dark:bg-surface-800 rounded-lg shadow-sm border border-surface-200 dark:border-surface-700 overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full table-layout-fixed">
            <thead>
              <tr class="bg-surface-50 dark:bg-surface-800/50 border-b border-surface-200 dark:border-surface-700">
                <th class="px-4 py-3 text-left text-sm font-medium text-surface-700 dark:text-surface-300 w-[60px]">ID</th>
                <th class="px-4 py-3 text-left text-sm font-medium text-surface-700 dark:text-surface-300 w-[40%]">产品名称</th>
                <th class="px-4 py-3 text-left text-sm font-medium text-surface-700 dark:text-surface-300 w-[80px]">类型</th>
                <th class="px-4 py-3 text-left text-sm font-medium text-surface-700 dark:text-surface-300 w-[100px]">折扣价</th>
                <th class="px-4 py-3 text-left text-sm font-medium text-surface-700 dark:text-surface-300 w-[100px]">原价</th>
                <th class="px-4 py-3 text-left text-sm font-medium text-surface-700 dark:text-surface-300 w-[20%]">店铺</th>
                <th class="px-4 py-3 text-left text-sm font-medium text-surface-700 dark:text-surface-300 w-[120px]">操作</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="product in paginatedProducts"
                :key="product.id"
                class="border-b border-surface-200 dark:border-surface-700 hover:bg-surface-50 dark:hover:bg-surface-800/50 transition-all"
              >
                <td class="px-4 py-3 text-sm text-surface-800 dark:text-white">{{ product.id }}</td>
                <td class="px-4 py-3">
                  <div class="flex items-center gap-3">
                    <img :src="product.thumbnail" :alt="product.name" class="w-10 h-10 rounded-lg object-cover flex-shrink-0" />
                    <span class="text-sm font-medium text-surface-800 dark:text-white truncate max-w-[calc(100%-40px)]">{{ product.name }}</span>
                  </div>
                </td>
                <td class="px-4 py-3">
                  <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                    {{ product.type }}
                  </span>
                </td>
                <td class="px-4 py-3 text-sm font-medium text-surface-800 dark:text-white">¥{{ product.discountedPrice || product.originalPrice }}</td>
                <td class="px-4 py-3 text-sm text-surface-600 dark:text-surface-300 line-through">¥{{ product.originalPrice || '-' }}</td>
                <td class="px-4 py-3 text-sm text-surface-600 dark:text-surface-300 truncate">{{ product.shop }}</td>
                <td class="px-4 py-3">
                  <div class="flex items-center gap-2">
                    <button
                      @click="handleViewProduct(product)"
                      class="w-8 h-8 flex items-center justify-center rounded border border-surface-300 dark:border-surface-600 bg-surface-0 dark:bg-surface-900 text-surface-800 dark:text-white hover:bg-surface-100 dark:hover:bg-surface-800 transition-all"
                    >
                      <i class="fas fa-eye text-sm"></i>
                    </button>
                    <button
                      @click="handleEditProduct(product)"
                      class="w-8 h-8 flex items-center justify-center rounded border border-surface-300 dark:border-surface-600 bg-surface-0 dark:bg-surface-900 text-surface-800 dark:text-white hover:bg-surface-100 dark:hover:bg-surface-800 transition-all"
                    >
                      <i class="fas fa-edit text-sm"></i>
                    </button>
                    <button
                      @click="handleDeleteProduct(product)"
                      class="w-8 h-8 flex items-center justify-center rounded border border-surface-300 dark:border-surface-600 bg-surface-0 dark:bg-surface-900 text-danger-500 hover:bg-surface-100 dark:hover:bg-surface-800 transition-all"
                    >
                      <i class="fas fa-trash text-sm"></i>
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
        <div v-else-if="paginatedProducts.length === 0" class="py-10 flex flex-col justify-center items-center">
          <i class="fas fa-box text-4xl text-surface-300 dark:text-surface-600 mb-2"></i>
          <p class="text-surface-500 dark:text-surface-400">暂无产品数据</p>
        </div>

        <!-- 分页控件 -->
        <div v-else class="px-4 py-3 border-t border-surface-200 dark:border-surface-700 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div class="text-sm text-surface-500 dark:text-surface-400">
            显示 {{ (currentPage - 1) * pageSize + 1 }} 到 {{ Math.min(currentPage * pageSize, filteredProducts.length) }} 条，共 {{ filteredProducts.length }} 条
          </div>
          <div class="flex items-center gap-2">
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

    <BaseModal v-model="showModal" :title="modalTitle">
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">产品名称</label>
          <input type="text" v-model="currentProduct.name" class="w-full px-4 py-2 rounded-lg border border-surface-300 dark:border-surface-600 bg-surface-0 dark:bg-surface-900 text-surface-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all" placeholder="请输入产品名称" />
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">分类</label>
            <select v-model="currentProduct.type" class="w-full px-4 py-2 rounded-lg border border-surface-300 dark:border-surface-600 bg-surface-0 dark:bg-surface-900 text-surface-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all">
              <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">折扣价</label>
            <input type="number" v-model="currentProduct.discountedPrice" class="w-full px-4 py-2 rounded-lg border border-surface-300 dark:border-surface-600 bg-surface-0 dark:bg-surface-900 text-surface-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all" placeholder="0.00" />
          </div>
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">原价</label>
            <input type="number" v-model="currentProduct.originalPrice" class="w-full px-4 py-2 rounded-lg border border-surface-300 dark:border-surface-600 bg-surface-0 dark:bg-surface-900 text-surface-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all" placeholder="0.00" />
          </div>
          <div>
            <label class="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">店铺</label>
            <input type="text" v-model="currentProduct.shop" class="w-full px-4 py-2 rounded-lg border border-surface-300 dark:border-surface-600 bg-surface-0 dark:bg-surface-900 text-surface-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all" placeholder="请输入店铺名称" />
          </div>
        </div>
        <div>
          <label class="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">缩略图URL</label>
          <input type="text" v-model="currentProduct.thumbnail" class="w-full px-4 py-2 rounded-lg border border-surface-300 dark:border-surface-600 bg-surface-0 dark:bg-surface-900 text-surface-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all" placeholder="请输入图片URL" />
        </div>
      </div>
      <template #footer>
        <div class="flex justify-end gap-3">
          <button
            @click="showModal = false"
            class="px-4 py-2 rounded-lg border border-surface-300 dark:border-surface-600 bg-surface-0 dark:bg-surface-900 text-surface-800 dark:text-white text-sm hover:bg-surface-100 dark:hover:bg-surface-800 transition-all"
          >
            取消
          </button>
          <button
            @click="handleSaveProduct"
            class="px-4 py-2 rounded-lg bg-primary-500 text-white text-sm hover:bg-primary-600 transition-all"
          >
            保存
          </button>
        </div>
      </template>
    </BaseModal>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import BaseButton from '../../components/UI/BaseButton.vue'
import BaseModal from '../../components/UI/BaseModal.vue'
import goodsData from '../../data/goods.js'

const searchQuery = ref('')
const categoryFilter = ref('')
const priceRange = ref({ min: null, max: null })
const currentPage = ref(1)
const pageSize = ref(10)
const showModal = ref(false)
const modalMode = ref('add')
const loading = ref(false)

// 处理商品数据，添加ID
const products = ref([])
const categories = ref([])

onMounted(() => {
  loadProducts()
})

const loadProducts = () => {
  loading.value = true
  // 模拟异步加载
  setTimeout(() => {
    // 初始化商品数据，添加ID
    products.value = goodsData.map((item, index) => ({
      id: index + 1,
      ...item
    }))

    // 提取所有商品类型
    const types = [...new Set(goodsData.map(item => item.type))]
    categories.value = types

    loading.value = false
  }, 500)
}

const currentProduct = ref({
  id: null,
  name: '',
  type: '',
  discountedPrice: 0,
  originalPrice: 0,
  shop: '',
  thumbnail: ''
})

const totalPages = computed(() => Math.ceil(filteredProducts.value.length / pageSize.value))

const filteredProducts = computed(() => {
  return products.value.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchesCategory = !categoryFilter.value || product.type === categoryFilter.value

    // 价格区间筛选
    let matchesPrice = true
    const price = product.discountedPrice || product.originalPrice
    if (priceRange.value.min !== null && priceRange.value.min !== '') {
      matchesPrice = matchesPrice && price >= parseFloat(priceRange.value.min)
    }
    if (priceRange.value.max !== null && priceRange.value.max !== '') {
      matchesPrice = matchesPrice && price <= parseFloat(priceRange.value.max)
    }

    return matchesSearch && matchesCategory && matchesPrice
  })
})

const paginatedProducts = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredProducts.value.slice(start, end)
})

const modalTitle = computed(() => {
  return modalMode.value === 'add' ? '添加产品' : '编辑产品'
})

const handleSearch = () => {
  currentPage.value = 1
}

const handlePageSizeChange = () => {
  currentPage.value = 1
}

const handleAddProduct = () => {
  modalMode.value = 'add'
  currentProduct.value = {
    id: null,
    name: '',
    type: categories.value[0] || '',
    discountedPrice: 0,
    originalPrice: 0,
    shop: '',
    thumbnail: ''
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
    products.value.push({ ...currentProduct.value })
  } else {
    const index = products.value.findIndex(p => p.id === currentProduct.value.id)
    if (index > -1) {
      products.value[index] = { ...currentProduct.value }
    }
  }
  showModal.value = false
}
</script>
