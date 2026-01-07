<template>
  <div class="space-y-6">
    <h2 class="text-2xl font-bold text-surface-800 dark:text-white">数据统计</h2>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <div v-for="stat in stats" :key="stat.title" class="stat-card">
        <div class="stat-icon shadow-lg" :class="stat.iconBg">
          <FontAwesomeIcon :icon="stat.icon" class="text-xl" />
        </div>
        <div class="flex-1">
          <p class="text-sm text-surface-500">{{ stat.title }}</p>
          <p class="text-2xl font-bold text-surface-800 dark:text-white mt-1">{{ stat.value }}</p>
          <div class="flex items-center gap-1 mt-2">
            <FontAwesomeIcon 
              :icon="stat.change > 0 ? 'arrow-up' : 'arrow-down'" 
              class="text-xs" 
              :class="stat.change > 0 ? 'text-success-500' : 'text-danger-500'"
            />
            <span :class="['text-xs font-medium', stat.change > 0 ? 'text-success-500' : 'text-danger-500']">
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

    <BaseCard title="月度销售数据">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-surface-50 dark:bg-surface-800">
            <tr>
              <th class="px-4 py-3 text-left text-xs font-semibold text-surface-600 dark:text-surface-400 uppercase">月份</th>
              <th class="px-4 py-3 text-left text-xs font-semibold text-surface-600 dark:text-surface-400 uppercase">销售额</th>
              <th class="px-4 py-3 text-left text-xs font-semibold text-surface-600 dark:text-surface-400 uppercase">订单数</th>
              <th class="px-4 py-3 text-left text-xs font-semibold text-surface-600 dark:text-surface-400 uppercase">客单价</th>
              <th class="px-4 py-3 text-left text-xs font-semibold text-surface-600 dark:text-surface-400 uppercase">环比</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-surface-100 dark:divide-surface-800">
            <tr v-for="row in monthlyData" :key="row.month" class="hover:bg-surface-50 dark:hover:bg-surface-800/50">
              <td class="px-4 py-3 text-sm text-surface-800 dark:text-white">{{ row.month }}</td>
              <td class="px-4 py-3 text-sm font-medium text-surface-800 dark:text-white">{{ row.revenue }}</td>
              <td class="px-4 py-3 text-sm text-surface-600 dark:text-surface-300">{{ row.orders }}</td>
              <td class="px-4 py-3 text-sm text-surface-600 dark:text-surface-300">{{ row.avgOrder }}</td>
              <td class="px-4 py-3 text-sm">
                <span :class="row.growth > 0 ? 'text-success-500' : 'text-danger-500'">
                  {{ row.growth > 0 ? '+' : '' }}{{ row.growth }}%
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </BaseCard>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import BaseCard from '../components/UI/BaseCard.vue'
import BaseLineChart from '../components/UI/BaseLineChart.vue'
import BasePieChart from '../components/UI/BasePieChart.vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { salesTrendData, productCategoryData } from '../data/statistics'
import { 
  faDollarSign, 
  faShoppingCart, 
  faUsers, 
  faPercentage, 
  faArrowUp, 
  faArrowDown 
} from '@fortawesome/free-solid-svg-icons'

const stats = computed(() => [
  { title: '本月销售额', value: '¥128,500', change: 12.5, icon: faDollarSign, iconBg: 'bg-gradient-to-br from-success-500 to-success-400' },
  { title: '订单总数', value: '1,256', change: 8.3, icon: faShoppingCart, iconBg: 'bg-gradient-to-br from-primary-600 to-primary-400' },
  { title: '新增用户', value: '328', change: 15.2, icon: faUsers, iconBg: 'bg-gradient-to-br from-accent-500 to-accent-400' },
  { title: '转化率', value: '3.8%', change: -2.1, icon: faPercentage, iconBg: 'bg-gradient-to-br from-warning-500 to-warning-400' }
])

const monthlyData = computed(() => [
  { month: '2024年1月', revenue: '¥128,500', orders: '1,256', avgOrder: '¥102.30', growth: 12.5 },
  { month: '2023年12月', revenue: '¥114,200', orders: '1,128', avgOrder: '¥101.24', growth: 8.3 },
  { month: '2023年11月', revenue: '¥105,400', orders: '1,045', avgOrder: '¥100.86', growth: 5.2 },
  { month: '2023年10月', revenue: '¥100,200', orders: '998', avgOrder: '¥100.40', growth: -3.1 }
])
</script>
