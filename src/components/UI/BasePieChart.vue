<template>
  <div ref="chartRef" class="w-full h-full"></div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch, computed, shallowRef } from 'vue'

const props = defineProps({
  data: {
    type: Array,
    required: true
  },
  colors: {
    type: Array,
    default: () => ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#ec4899', '#84cc16']
  },
  radius: {
    type: Array,
    default: () => ['0%', '70%']
  },
  height: {
    type: String,
    default: '100%'
  }
})

const chartRef = ref(null)
let chartInstance = null
let echarts = null

// 使用shallowRef减少响应式开销
const isDark = shallowRef(false)
const isLoading = ref(true)

// 缓存主题颜色，只有isDark变化时才重新计算
const getThemeColors = computed(() => {
  return {
    backgroundColor: isDark.value ? '#1e293b' : '#ffffff',
    textColor: isDark.value ? '#e2e8f0' : '#1e293b',
    tooltipBackground: isDark.value ? '#334155' : '#ffffff',
    tooltipBorder: isDark.value ? '#475569' : '#e2e8f0',
    legendColor: isDark.value ? '#94a3b8' : '#64748b'
  }
})

// 缓存图表配置，减少重复计算
const getChartOption = () => {
  if (!echarts) return null
  
  const theme = getThemeColors.value

  return {
    tooltip: {
      trigger: 'item',
      backgroundColor: theme.tooltipBackground,
      borderColor: theme.tooltipBorder,
      borderWidth: 1,
      textStyle: {
        color: theme.textColor
      },
      formatter: function(params) {
        return `${params.name}<br/>${params.marker} ${params.value}%`
      }
    },
    legend: {
      orient: 'vertical',
      right: '5%',
      top: 'center',
      textStyle: {
        color: theme.legendColor,
        fontSize: 12
      }
    },
    series: [{
      type: 'pie',
      radius: props.radius,
      center: ['40%', '50%'],
      avoidLabelOverlap: true,
      itemStyle: {
        borderRadius: 6,
        borderColor: theme.backgroundColor,
        borderWidth: 2
      },
      label: {
        show: false,
        position: 'center'
      },
      emphasis: {
        label: {
          show: true,
          fontSize: 16,
          fontWeight: 'bold',
          color: theme.textColor
        },
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.3)'
        }
      },
      labelLine: {
        show: false
      },
      data: props.data.map((item, index) => ({
        value: item.value,
        name: item.name,
        itemStyle: {
          color: props.colors[index % props.colors.length]
        }
      }))
    }]
  }
}

const initChart = async () => {
  if (!chartRef.value) return

  try {
    isLoading.value = true
    // 异步导入 ECharts
    echarts = await import('echarts')
    chartInstance = echarts.init(chartRef.value)
    updateChart()
  } catch (error) {
    console.error('Failed to load ECharts:', error)
  } finally {
    isLoading.value = false
  }
}

const updateChart = () => {
  if (!chartInstance || !echarts) return
  
  const option = getChartOption()
  if (option) {
    chartInstance.setOption(option, true) // 使用true重置，避免累积
  }
}

// 使用防抖优化resize处理
let resizeTimeout = null
const handleResize = () => {
  if (chartInstance) {
    clearTimeout(resizeTimeout)
    resizeTimeout = setTimeout(() => {
      chartInstance.resize()
    }, 100)
  }
}

// 优化主题检查，只在必要时更新
const checkTheme = () => {
  const root = document.documentElement
  const isDarkMode = root.classList.contains('dark')
  if (isDark.value !== isDarkMode) {
    isDark.value = isDarkMode
    updateChart()
  }
}

// 合并watch监听，减少触发次数
watch(
  [() => props.data, () => props.colors, () => props.radius],
  () => {
    updateChart()
  },
  { deep: false } // 关闭deep监听，减少性能开销
)

onMounted(() => {
  checkTheme()
  initChart()
  window.addEventListener('resize', handleResize)
  window.addEventListener('theme-change', checkTheme)

  // 只在必要时使用MutationObserver
  const observer = new MutationObserver(checkTheme)
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  window.removeEventListener('theme-change', checkTheme)
  if (chartInstance) {
    chartInstance.dispose()
    chartInstance = null
  }
  if (resizeTimeout) {
    clearTimeout(resizeTimeout)
  }
})
</script>
