// 数据统计模拟数据

// 统计卡片数据
export const statsCards = [
  { id: 1, title: '总销售额', value: '¥128,543', change: 12.5, color: '#409eff', icon: 'Money' },
  { id: 2, title: '订单数量', value: '1,248', change: 8.2, color: '#67c23a', icon: 'ShoppingCart' },
  { id: 3, title: '访客数', value: '25,843', change: -3.5, color: '#e6a23c', icon: 'User' },
  { id: 4, title: '转化率', value: '4.2%', change: 1.8, color: '#f56c6c', icon: 'TrendCharts' }
]

// 销售趋势数据
export const salesTrendData = {
  months: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
  revenue: [85000, 92000, 88000, 105000, 112000, 108000, 125000, 132000, 128000, 145000, 152000, 168000],
  orders: [850, 920, 880, 1050, 1120, 1080, 1250, 1320, 1280, 1450, 1520, 1680]
}

// 产品分类分布数据
export const productCategoryData = [
  { name: '电子产品', value: 35 },
  { name: '家居用品', value: 25 },
  { name: '服装', value: 20 },
  { name: '食品', value: 15 },
  { name: '其他', value: 5 }
]

// 地区销售数据
export const regionalSalesData = {
  regions: ['华东', '华南', '华北', '西南', '西北', '东北'],
  sales: [45000, 38000, 32000, 25000, 18000, 12000]
}

// 用户增长数据
export const userGrowthData = {
  months: ['1月', '2月', '3月', '4月', '5月', '6月'],
  newUsers: [1200, 1500, 1800, 1600, 2200, 2500],
  activeUsers: [8500, 9200, 9800, 10500, 11200, 12500]
}