// 权限管理模拟数据

export const roles = [
  { id: 1, name: '超级管理员', description: '拥有系统所有权限', permissionCount: 25, status: 'active', statusText: '启用' },
  { id: 2, name: '管理员', description: '拥有大部分管理权限', permissionCount: 18, status: 'active', statusText: '启用' },
  { id: 3, name: '编辑', description: '拥有内容编辑权限', permissionCount: 12, status: 'active', statusText: '启用' },
  { id: 4, name: '查看员', description: '仅拥有查看权限', permissionCount: 8, status: 'inactive', statusText: '禁用' }
]

// 权限树数据
export const permissionTree = [
  {
    id: 1,
    name: '仪表盘',
    key: 'dashboard',
    children: [
      { id: 11, name: '查看仪表盘', key: 'dashboard:view' }
    ]
  },
  {
    id: 2,
    name: '用户管理',
    key: 'users',
    children: [
      { id: 21, name: '查看用户列表', key: 'users:view' },
      { id: 22, name: '添加用户', key: 'users:add' },
      { id: 23, name: '编辑用户', key: 'users:edit' },
      { id: 24, name: '删除用户', key: 'users:delete' },
      { id: 25, name: '导出用户', key: 'users:export' }
    ]
  },
  {
    id: 3,
    name: '订单管理',
    key: 'orders',
    children: [
      { id: 31, name: '查看订单列表', key: 'orders:view' },
      { id: 32, name: '处理订单', key: 'orders:process' },
      { id: 33, name: '取消订单', key: 'orders:cancel' },
      { id: 34, name: '导出订单', key: 'orders:export' }
    ]
  },
  {
    id: 4,
    name: '产品管理',
    key: 'products',
    children: [
      { id: 41, name: '查看产品列表', key: 'products:view' },
      { id: 42, name: '添加产品', key: 'products:add' },
      { id: 43, name: '编辑产品', key: 'products:edit' },
      { id: 44, name: '删除产品', key: 'products:delete' },
      { id: 45, name: '上架/下架产品', key: 'products:status' }
    ]
  },
  {
    id: 5,
    name: '数据统计',
    key: 'statistics',
    children: [
      { id: 51, name: '查看统计数据', key: 'statistics:view' },
      { id: 52, name: '导出统计报表', key: 'statistics:export' }
    ]
  },
  {
    id: 6,
    name: '系统设置',
    key: 'settings',
    children: [
      { id: 61, name: '修改系统设置', key: 'settings:edit' },
      { id: 62, name: '管理权限', key: 'permissions:manage' }
    ]
  }
]

// 角色状态选项
export const roleStatuses = [
  { value: 'active', label: '启用' },
  { value: 'inactive', label: '禁用' }
]