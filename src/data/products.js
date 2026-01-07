// 产品管理模拟数据

export const products = [
  { id: 1, name: '智能手机', category: '电子产品', price: '¥ 1,250', stock: 150, status: 'active', statusText: '在售', image: '📱' },
  { id: 2, name: '笔记本电脑', category: '电子产品', price: '¥ 8,999', stock: 80, status: 'active', statusText: '在售', image: '💻' },
  { id: 3, name: '无线耳机', category: '音频设备', price: '¥ 299', stock: 200, status: 'active', statusText: '在售', image: '🎧' },
  { id: 4, name: '智能手表', category: '可穿戴设备', price: '¥ 1,999', stock: 120, status: 'active', statusText: '在售', image: '⌚' },
  { id: 5, name: '平板电脑', category: '电子产品', price: '¥ 3,450', stock: 90, status: 'pending', statusText: '即将上市', image: '📋' },
  { id: 6, name: '游戏主机', category: '游戏设备', price: '¥ 2,699', stock: 50, status: 'active', statusText: '在售', image: '🎮' },
  { id: 7, name: '蓝牙音箱', category: '音频设备', price: '¥ 899', stock: 180, status: 'inactive', statusText: '下架', image: '🔊' },
  { id: 8, name: '智能音箱', category: '音频设备', price: '¥ 399', stock: 150, status: 'active', statusText: '在售', image: '🗣️' }
]

// 产品类别选项
export const productCategories = [
  { value: 'electronics', label: '电子产品' },
  { value: 'audio', label: '音频设备' },
  { value: 'wearable', label: '可穿戴设备' },
  { value: 'gaming', label: '游戏设备' },
  { value: 'accessories', label: '配件' }
]

// 产品状态选项
export const productStatuses = [
  { value: 'active', label: '在售' },
  { value: 'pending', label: '即将上市' },
  { value: 'inactive', label: '下架' }
]

// 产品品牌选项
export const productBrands = [
  { value: 'apple', label: '苹果' },
  { value: 'samsung', label: '三星' },
  { value: 'huawei', label: '华为' },
  { value: 'xiaomi', label: '小米' },
  { value: 'sony', label: '索尼' }
]