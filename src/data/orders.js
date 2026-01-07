// 订单管理模拟数据

export const orders = [
  { id: 1, orderNumber: '#ORD-001', customer: '李明', product: '智能手机', quantity: 1, amount: '¥ 1,250', date: '2023-10-15', status: 'active', statusText: '已完成' },
  { id: 2, orderNumber: '#ORD-002', customer: '王芳', product: '笔记本电脑', quantity: 1, amount: '¥ 8,999', date: '2023-10-14', status: 'pending', statusText: '处理中' },
  { id: 3, orderNumber: '#ORD-003', customer: '张伟', product: '无线耳机', quantity: 2, amount: '¥ 598', date: '2023-10-13', status: 'active', statusText: '已完成' },
  { id: 4, orderNumber: '#ORD-004', customer: '刘洋', product: '智能手表', quantity: 1, amount: '¥ 1,999', date: '2023-10-12', status: 'inactive', statusText: '已取消' },
  { id: 5, orderNumber: '#ORD-005', customer: '陈静', product: '平板电脑', quantity: 1, amount: '¥ 3,450', date: '2023-10-11', status: 'pending', statusText: '处理中' },
  { id: 6, orderNumber: '#ORD-006', customer: '赵强', product: '游戏主机', quantity: 1, amount: '¥ 2,699', date: '2023-10-10', status: 'pending', statusText: '处理中' },
  { id: 7, orderNumber: '#ORD-007', customer: '孙丽', product: '蓝牙音箱', quantity: 1, amount: '¥ 899', date: '2023-10-09', status: 'active', statusText: '已完成' },
  { id: 8, orderNumber: '#ORD-008', customer: '周杰', product: '智能音箱', quantity: 1, amount: '¥ 399', date: '2023-10-08', status: 'inactive', statusText: '已取消' }
]

// 订单状态选项
export const orderStatuses = [
  { value: 'active', label: '已完成' },
  { value: 'pending', label: '处理中' },
  { value: 'inactive', label: '已取消' }
]

// 产品类别选项
export const productCategories = [
  { value: 'electronics', label: '电子产品' },
  { value: 'audio', label: '音频设备' },
  { value: 'wearable', label: '可穿戴设备' },
  { value: 'gaming', label: '游戏设备' }
]