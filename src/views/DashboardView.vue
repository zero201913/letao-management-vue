<template>
  <div class="space-y-6">
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <div
        v-for="(stat, index) in stats"
        :key="index"
        class="stat-card group"
      >
        <div
          class="stat-icon flex-shrink-0 shadow-lg"
          :class="stat.iconBg"
        >
          <FontAwesomeIcon :icon="stat.icon" class="text-2xl" />
        </div>
        <div class="flex-1 min-w-0">
          <p class="text-sm font-medium text-surface-500 dark:text-surface-400 truncate">{{ stat.title }}</p>
          <p class="text-2xl font-bold text-surface-800 dark:text-white mt-1">{{ stat.value }}</p>
          <div class="flex items-center gap-1 mt-2">
            <FontAwesomeIcon
              :icon="stat.change >= 0 ? 'arrow-up' : 'arrow-down'"
              class="text-xs"
              :class="stat.change >= 0 ? 'text-success-500' : 'text-danger-500'"
            />
            <span
              :class="[
                'text-xs font-medium',
                stat.change >= 0 ? 'text-success-500' : 'text-danger-500'
              ]"
            >
              {{ Math.abs(stat.change) }}%
            </span>
            <span class="text-xs text-surface-400">较上月</span>
          </div>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <BaseCard title="销售趋势">
        <div class="h-64">
          <BaseLineChart
            :x-axis-data="salesTrendData.months"
            :series-data="salesTrendData.revenue"
            series-name="销售额"
            color="#3b82f6"
            chart-type="line"
          />
        </div>
      </BaseCard>

      <BaseCard title="产品分类分布">
        <div class="h-64">
          <BasePieChart :data="productCategoryData" />
        </div>
      </BaseCard>
    </div>

    <BaseCard title="最近订单" :padding="false" :has-table="true">
      <template #header-action>
        <BaseButton variant="primary" size="sm">
          <FontAwesomeIcon icon="eye" class="mr-1" />
          查看全部
        </BaseButton>
      </template>
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-surface-50 dark:bg-surface-800">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-semibold text-surface-600 dark:text-surface-400 uppercase tracking-wider">订单号</th>
              <th class="px-6 py-3 text-left text-xs font-semibold text-surface-600 dark:text-surface-400 uppercase tracking-wider">客户</th>
              <th class="px-6 py-3 text-left text-xs font-semibold text-surface-600 dark:text-surface-400 uppercase tracking-wider">日期</th>
              <th class="px-6 py-3 text-left text-xs font-semibold text-surface-600 dark:text-surface-400 uppercase tracking-wider">金额</th>
              <th class="px-6 py-3 text-left text-xs font-semibold text-surface-600 dark:text-surface-400 uppercase tracking-wider">状态</th>
              <th class="px-6 py-3 text-left text-xs font-semibold text-surface-600 dark:text-surface-400 uppercase tracking-wider">操作</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-surface-100 dark:divide-surface-800">
            <tr
              v-for="order in recentOrders"
              :key="order.id"
              class="hover:bg-surface-50 dark:hover:bg-surface-800/50 transition-colors"
            >
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-surface-800 dark:text-white">{{ order.orderNumber }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-surface-600 dark:text-surface-300">{{ order.customer }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-surface-600 dark:text-surface-300">{{ order.date }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-surface-800 dark:text-white">{{ order.amount }}</td>
              <td class="px-6 py-4 whitespace-nowrap">
                <BaseTag :variant="getStatusVariant(order.status)">
                  {{ order.statusText }}
                </BaseTag>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <BaseButton variant="ghost" size="sm" @click="handleViewOrder(order)">
                  <FontAwesomeIcon icon="eye" class="mr-1" />
                  详情
                </BaseButton>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </BaseCard>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <BaseCard title="用户活动统计">
        <div class="space-y-4">
          <div
            v-for="(activity, index) in activities"
            :key="index"
            class="flex items-center gap-4 p-4 rounded-lg bg-surface-50 dark:bg-surface-700/50 hover:bg-surface-100 dark:hover:bg-surface-700 transition-colors cursor-pointer"
          >
            <div class="w-10 h-10 rounded-full flex items-center justify-center" :class="activity.iconBg">
              <FontAwesomeIcon :icon="activity.icon" class="text-white" />
            </div>
            <div class="flex-1">
              <p class="text-sm font-medium text-surface-800 dark:text-white">{{ activity.title }}</p>
              <p class="text-xs text-surface-500 mt-0.5">{{ activity.time }}</p>
            </div>
            <div class="text-right">
              <p class="text-lg font-bold" :class="activity.valueColor">{{ activity.value }}</p>
              <p class="text-xs text-surface-500">{{ activity.change }}</p>
            </div>
          </div>
        </div>
      </BaseCard>

      <BaseCard title="系统状态">
        <div class="space-y-5">
          <div>
            <div class="flex justify-between mb-2">
              <span class="text-sm font-medium text-surface-700 dark:text-surface-300">CPU 使用率</span>
              <span class="text-sm text-surface-500">45%</span>
            </div>
            <BaseProgress :percentage="45" color="primary" :animated="true" :striped="true" />
          </div>
          <div>
            <div class="flex justify-between mb-2">
              <span class="text-sm font-medium text-surface-700 dark:text-surface-300">内存使用率</span>
              <span class="text-sm text-surface-500">72%</span>
            </div>
            <BaseProgress :percentage="72" color="warning" :animated="true" :striped="true" />
          </div>
          <div>
            <div class="flex justify-between mb-2">
              <span class="text-sm font-medium text-surface-700 dark:text-surface-300">磁盘使用率</span>
              <span class="text-sm text-surface-500">58%</span>
            </div>
            <BaseProgress :percentage="58" color="success" :animated="true" :striped="true" />
          </div>
          <div>
            <div class="flex justify-between mb-2">
              <span class="text-sm font-medium text-surface-700 dark:text-surface-300">网络带宽</span>
              <span class="text-sm text-surface-500">23%</span>
            </div>
            <BaseProgress :percentage="23" color="primary" :animated="true" :striped="true" />
          </div>
        </div>
      </BaseCard>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import BaseCard from '../components/UI/BaseCard.vue'
import BaseButton from '../components/UI/BaseButton.vue'
import BaseTag from '../components/UI/BaseTag.vue'
import BaseProgress from '../components/UI/BaseProgress.vue'
import BaseLineChart from '../components/UI/BaseLineChart.vue'
import BasePieChart from '../components/UI/BasePieChart.vue'
import { salesTrendData, productCategoryData } from '../data/statistics'
import {
  faEye,
  faUsers,
  faShoppingCart,
  faDollarSign,
  faArrowUp,
  faArrowDown,
  faUserPlus,
  faBell
} from '@fortawesome/free-solid-svg-icons'

const stats = ref([
  {
    title: '总访问量',
    value: '42,580',
    change: 12.5,
    icon: faEye,
    iconBg: 'bg-gradient-to-br from-primary-600 to-primary-400'
  },
  {
    title: '用户总数',
    value: '3,842',
    change: 8.2,
    icon: faUsers,
    iconBg: 'bg-gradient-to-br from-success-500 to-success-400'
  },
  {
    title: '订单总数',
    value: '1,254',
    change: 5.3,
    icon: faShoppingCart,
    iconBg: 'bg-gradient-to-br from-warning-500 to-warning-400'
  },
  {
    title: '总收入',
    value: '¥42,580',
    change: 18.7,
    icon: faDollarSign,
    iconBg: 'bg-gradient-to-br from-accent-500 to-accent-400'
  }
])

const recentOrders = ref([
  { id: 1, orderNumber: '#ORD-001', customer: '张三', date: '2024-01-15', amount: '¥245.99', status: 'completed', statusText: '已完成' },
  { id: 2, orderNumber: '#ORD-002', customer: '李四', date: '2024-01-14', amount: '¥1,250.00', status: 'completed', statusText: '已完成' },
  { id: 3, orderNumber: '#ORD-003', customer: '王五', date: '2024-01-13', amount: '¥89.50', status: 'processing', statusText: '处理中' },
  { id: 4, orderNumber: '#ORD-004', customer: '赵六', date: '2024-01-12', amount: '¥560.25', status: 'pending', statusText: '待付款' },
  { id: 5, orderNumber: '#ORD-005', customer: '钱七', date: '2024-01-11', amount: '¥1,899.99', status: 'completed', statusText: '已完成' }
])

const activities = ref([
  { title: '新用户注册', time: '5分钟前', value: '+24', change: '+12%', icon: faUserPlus, iconBg: 'bg-success-500', valueColor: 'text-success-500' },
  { title: '新订单', time: '15分钟前', value: '+18', change: '+8%', icon: faShoppingCart, iconBg: 'bg-primary-500', valueColor: 'text-primary-500' },
  { title: '访问量', time: '1小时前', value: '1,234', change: '+23%', icon: faEye, iconBg: 'bg-accent-500', valueColor: 'text-accent-500' },
  { title: '消息通知', time: '2小时前', value: '+56', change: '+15%', icon: faBell, iconBg: 'bg-warning-500', valueColor: 'text-warning-500' }
])

const getStatusVariant = (status) => {
  const variants = {
    completed: 'success',
    processing: 'primary',
    pending: 'warning'
  }
  return variants[status] || 'info'
}

const handleViewOrder = (order) => {
  console.log('查看订单详情:', order)
}
</script>
