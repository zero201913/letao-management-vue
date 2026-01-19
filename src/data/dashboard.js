// 仪表盘模拟数据

// 统计数据
export const dashboardStats = {
  totalUsers: '1,254',
  totalRevenue: '¥ 89,254',
  totalOrders: '324',
  totalVisitors: '8,542'
}

// 最近订单数据
export const recentOrders = [
  { id: 1, orderNumber: '#ORD-001', customer: '李明', date: '2023-10-15', amount: '¥ 1,250', status: 'active', statusText: '已完成' },
  { id: 2, orderNumber: '#ORD-002', customer: '王芳', date: '2023-10-14', amount: '¥ 850', status: 'pending', statusText: '处理中' },
  { id: 3, orderNumber: '#ORD-003', customer: '张伟', date: '2023-10-13', amount: '¥ 2,150', status: 'active', statusText: '已完成' },
  { id: 4, orderNumber: '#ORD-004', customer: '刘洋', date: '2023-10-12', amount: '¥ 650', status: 'inactive', statusText: '已取消' },
  { id: 5, orderNumber: '#ORD-005', customer: '陈静', date: '2023-10-11', amount: '¥ 3,450', status: 'pending', statusText: '处理中' }
]

// 最近用户活动数据
export const recentActivities = [
  { id: 1, user: '李明', type: '登录', detail: '用户成功登录系统', time: '2023-10-15 14:30', ip: '192.168.1.101' },
  { id: 2, user: '王芳', type: '购买', detail: '用户下单购买商品', time: '2023-10-15 12:15', ip: '192.168.1.102' },
  { id: 3, user: '张伟', type: '注册', detail: '新用户注册账号', time: '2023-10-15 10:45', ip: '192.168.1.103' },
  { id: 4, user: '刘洋', type: '修改', detail: '用户修改个人资料', time: '2023-10-15 09:20', ip: '192.168.1.104' },
  { id: 5, user: '陈静', type: '评论', detail: '用户对商品发表评论', time: '2023-10-15 08:10', ip: '192.168.1.105' }
]

// 统计卡片数据
export const statsCards = [
  { id: 1, title: '总用户数', value: '1,254', icon: 'fas fa-users', color: '#4361ee' },
  { id: 2, title: '本月收入', value: '¥ 89,254', icon: 'fas fa-dollar-sign', color: '#4bbf73' },
  { id: 3, title: '新增订单', value: '324', icon: 'fas fa-shopping-cart', color: '#f0ad4e' },
  { id: 4, title: '网站访问量', value: '8,542', icon: 'fas fa-chart-line', color: '#4cc9f0' }
]
