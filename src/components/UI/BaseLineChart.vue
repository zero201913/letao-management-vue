<template>
  <div ref="chartRef" class="w-full h-full"></div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch, computed, shallowRef } from 'vue'

const props = defineProps({
  xAxisData: {
    type: Array,
    required: true
  },
  seriesData: {
    type: Array,
    required: true
  },
  seriesName: {
    type: String,
    default: '销售额'
  },
  color: {
    type: String,
    default: '#3b82f6'
  },
  smooth: {
    type: Boolean,
    default: true
  },
  areaStyle: {
    type: Boolean,
    default: true
  },
  height: {
    type: String,
    default: '100%'
  },
  chartType: {
    type: String,
    default: 'line',
    validator: (value) => ['line', 'bar'].includes(value)
  }
})

const chartRef = ref(null)
let chartInstance = null
let echarts = null

// 使用shallowRef减少响应式开销
const isDark = shallowRef(false)
const isLoading = ref(true)
let observer = null

// 缓存主题颜色，只有isDark变化时才重新计算
const getThemeColors = computed(() => {
  return {
    backgroundColor: isDark.value ? '#1e293b' : '#ffffff',
    textColor: isDark.value ? '#e2e8f0' : '#1e293b',
    gridColor: isDark.value ? '#334155' : '#e2e8f0',
    tooltipBackground: isDark.value ? '#334155' : '#ffffff',
    tooltipBorder: isDark.value ? '#475569' : '#e2e8f0'
  }
})

// 缓存图表配置，减少重复计算
const getChartOption = () => {
  if (!echarts) return null
  
  const theme = getThemeColors.value

  return {
    tooltip: {
      trigger: 'axis',
      backgroundColor: theme.tooltipBackground,
      borderColor: theme.tooltipBorder,
      borderWidth: 1,
      textStyle: {
        color: theme.textColor
      },
      formatter: function(params) {
        const data = params[0]
        return `${data.name}<br/>${data.marker} ${data.seriesName}: ${data.value.toLocaleString()}`
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      top: '10%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: props.xAxisData,
      axisLine: {
        lineStyle: {
          color: theme.gridColor
        }
      },
      axisLabel: {
        color: theme.textColor,
        fontSize: 12
      }
    },
    yAxis: {
      type: 'value',
      axisLine: {
        show: false
      },
      axisLabel: {
        color: theme.textColor,
        fontSize: 12,
        formatter: (value) => {
          if (value >= 10000) {
            return `${(value / 10000).toFixed(1)}万`
          }
          return value
        }
      },
      splitLine: {
        lineStyle: {
          color: theme.gridColor,
          type: 'dashed'
        }
      }
    },
    series: [{
      name: props.seriesName,
      type: props.chartType,
      smooth: props.chartType === 'line' ? props.smooth : false,
      symbol: props.chartType === 'line' ? 'circle' : 'none',
      symbolSize: 6,
      data: props.seriesData,
      areaStyle: props.chartType === 'line' && props.areaStyle ? {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: props.color },
          { offset: 1, color: echarts.color.modifyAlpha(props.color, 0) }
        ])
      } : null,
      itemStyle: {
        color: props.color
      },
      lineStyle: props.chartType === 'line' ? {
        width: 3
      } : null,
      barWidth: props.chartType === 'bar' ? '60%' : null
    }]
  }
}

const initChart = async () => {
  if (!chartRef.value) return

  try {
    isLoading.value = true
    // 异步导入 ECharts
    const EChartsModule = await import('echarts')
    echarts = EChartsModule.default || EChartsModule
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
  [() => props.seriesData, () => props.xAxisData, () => props.seriesName, () => props.color, () => props.chartType],
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
  observer = new MutationObserver(checkTheme)
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
  if (observer) {
    observer.disconnect()
    observer = null
  }
})
</script>
