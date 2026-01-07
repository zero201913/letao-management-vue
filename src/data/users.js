// 用户管理模拟数据

export const users = [
  { id: 1, username: '李明', email: 'liming@example.com', role: '管理员', status: 'active', statusText: '活跃', registerTime: '2023-01-15', avatar: '李' },
  { id: 2, username: '王芳', email: 'wangfang@example.com', role: '用户', status: 'active', statusText: '活跃', registerTime: '2023-02-20', avatar: '王' },
  { id: 3, username: '张伟', email: 'zhangwei@example.com', role: '用户', status: 'pending', statusText: '待审核', registerTime: '2023-03-10', avatar: '张' },
  { id: 4, username: '刘洋', email: 'liuyang@example.com', role: '用户', status: 'inactive', statusText: '禁用', registerTime: '2023-04-05', avatar: '刘' },
  { id: 5, username: '陈静', email: 'chenjing@example.com', role: '管理员', status: 'active', statusText: '活跃', registerTime: '2023-05-12', avatar: '陈' },
  { id: 6, username: '赵强', email: 'zhaoqiang@example.com', role: '编辑', status: 'active', statusText: '活跃', registerTime: '2023-06-18', avatar: '赵' },
  { id: 7, username: '孙丽', email: 'sunli@example.com', role: '用户', status: 'active', statusText: '活跃', registerTime: '2023-07-22', avatar: '孙' },
  { id: 8, username: '周杰', email: 'zhoujie@example.com', role: '用户', status: 'inactive', statusText: '禁用', registerTime: '2023-08-05', avatar: '周' }
]

// 用户角色选项
export const userRoles = [
  { value: 'admin', label: '管理员' },
  { value: 'editor', label: '编辑' },
  { value: 'user', label: '用户' }
]

// 用户状态选项
export const userStatuses = [
  { value: 'active', label: '活跃' },
  { value: 'pending', label: '待审核' },
  { value: 'inactive', label: '禁用' }
]