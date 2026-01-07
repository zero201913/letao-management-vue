<template>
  <div class="space-y-6">
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <h2 class="text-2xl font-bold text-surface-800 dark:text-white">订单管理</h2>
      <div class="flex gap-2">
        <BaseButton variant="secondary">
          <i class="fas fa-download mr-2"></i>
          导出
        </BaseButton>
        <BaseButton variant="primary">
          <i class="fas fa-plus mr-2"></i>
          创建订单
        </BaseButton>
      </div>
    </div>

    <BaseCard :padding="false">
      <div class="p-4 border-b border-surface-200 dark:border-surface-700 flex flex-col sm:flex-row gap-4">
        <div class="relative flex-1">
          <i class="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-surface-400"></i>
          <input
            type="text"
            v-model="searchQuery"
            placeholder="搜索订单号或客户..."
            class="input pl-10"
          />
        </div>
        <div class="flex gap-2">
          <select v-model="statusFilter" class="input w-auto">
            <option value="">全部状态</option>
            <option value="pending">待付款</option>
            <option value="processing">处理中</option>
            <option value="shipped">已发货</option>
            <option value="completed">已完成</option>
            <option value="cancelled">已取消</option>
          </select>
          <input type="date" v-model="dateFilter" class="input w-auto" />
        </div>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-surface-50 dark:bg-surface-800">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-semibold text-surface-600 dark:text-surface-400 uppercase tracking-wider">订单号</th>
              <th class="px-6 py-3 text-left text-xs font-semibold text-surface-600 dark:text-surface-400 uppercase tracking-wider">客户</th>
              <th class="px-6 py-3 text-left text-xs font-semibold text-surface-600 dark:text-surface-400 uppercase tracking-wider">产品</th>
              <th class="px-6 py-3 text-left text-xs font-semibold text-surface-600 dark:text-surface-400 uppercase tracking-wider">金额</th>
              <th class="px-6 py-3 text-left text-xs font-semibold text-surface-600 dark:text-surface-400 uppercase tracking-wider">状态</th>
              <th class="px-6 py-3 text-left text-xs font-semibold text-surface-600 dark:text-surface-400 uppercase tracking-wider">日期</th>
              <th class="px-6 py-3 text-left text-xs font-semibold text-surface-600 dark:text-surface-400 uppercase tracking-wider">操作</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-surface-100 dark:divide-surface-800">
            <tr
              v-for="order in filteredOrders"
              :key="order.id"
              class="hover:bg-surface-50 dark:hover:bg-surface-800/50 transition-colors"
            >
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-primary-600">{{ order.orderNumber }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-surface-800 dark:text-white">{{ order.customer }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-surface-600 dark:text-surface-300">{{ order.product }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-surface-800 dark:text-white">{{ order.amount }}</td>
              <td class="px-6 py-4 whitespace-nowrap">
                <BaseTag :variant="getStatusVariant(order.status)">{{ order.statusText }}</BaseTag>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-surface-500">{{ order.date }}</td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center gap-2">
                  <BaseButton variant="ghost" size="sm" @click="handleViewOrder(order)">
                    <i class="fas fa-eye"></i>
                  </BaseButton>
                  <BaseButton variant="ghost" size="sm">
                    <i class="fas fa-edit"></i>
                  </BaseButton>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </BaseCard>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import BaseCard from '../components/UI/BaseCard.vue'
import BaseButton from '../components/UI/BaseButton.vue'
import BaseTag from '../components/UI/BaseTag.vue'

const searchQuery = ref('')
const statusFilter = ref('')
const dateFilter = ref('')

const orders = ref([
  { id: 1, orderNumber: '#ORD-2024-001', customer: '张三', product: '产品A × 2', amount: '¥1,998', status: 'completed', statusText: '已完成', date: '2024-01-15' },
  { id: 2, orderNumber: '#ORD-2024-002', customer: '李四', product: '产品B × 1', amount: '¥999', status: 'processing', statusText: '处理中', date: '2024-01-14' },
  { id: 3, orderNumber: '#ORD-2024-003', customer: '王五', product: '产品C × 3', amount: '¥2,997', status: 'shipped', statusText: '已发货', date: '2024-01-13' },
  { id: 4, orderNumber: '#ORD-2024-004', customer: '赵六', product: '产品A × 1', amount: '¥999', status: 'pending', statusText: '待付款', date: '2024-01-12' },
  { id: 5, orderNumber: '#ORD-2024-005', customer: '钱七', product: '产品D × 2', amount: '¥598', status: 'cancelled', statusText: '已取消', date: '2024-01-11' }
])

const filteredOrders = computed(() => {
  return orders.value.filter(order => {
    const matchesSearch = order.orderNumber.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
                         order.customer.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchesStatus = !statusFilter.value || order.status === statusFilter.value
    return matchesSearch && matchesStatus
  })
})

const getStatusVariant = (status) => {
  const variants = {
    pending: 'warning',
    processing: 'primary',
    shipped: 'info',
    completed: 'success',
    cancelled: 'danger'
  }
  return variants[status] || 'info'
}

const handleViewOrder = (order) => {
  console.log('查看订单:', order)
}
</script>
