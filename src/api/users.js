// 用户管理API封装
import request, { get, post, put, del } from './request'
import { users, userRoles, userStatuses } from '../data/users'

// 获取用户列表
export const getUsers = (params = {}) => {
  // 当前使用模拟数据，后续替换为真实API调用
  // return get('/users', params)
  return Promise.resolve({
    code: 200,
    data: users,
    message: '获取成功'
  })
}

// 获取单个用户详情
export const getUserById = (id) => {
  // 当前使用模拟数据，后续替换为真实API调用
  // return get(`/users/${id}`)
  const user = users.find(u => u.id === id)
  return Promise.resolve({
    code: 200,
    data: user || {},
    message: user ? '获取成功' : '用户不存在'
  })
}

// 添加用户
export const addUser = (data) => {
  // 当前使用模拟数据，后续替换为真实API调用
  // return post('/users', data)
  return Promise.resolve({
    code: 200,
    data: { ...data, id: users.length + 1 },
    message: '添加成功'
  })
}

// 编辑用户
export const editUser = (id, data) => {
  // 当前使用模拟数据，后续替换为真实API调用
  // return put(`/users/${id}`, data)
  return Promise.resolve({
    code: 200,
    data: { ...data, id },
    message: '编辑成功'
  })
}

// 删除用户
export const deleteUser = (id) => {
  // 当前使用模拟数据，后续替换为真实API调用
  // return del(`/users/${id}`)
  return Promise.resolve({
    code: 200,
    message: '删除成功'
  })
}

// 获取用户角色选项
export const getUserRoles = () => {
  // 当前使用模拟数据，后续替换为真实API调用
  // return get('/users/roles')
  return Promise.resolve({
    code: 200,
    data: userRoles,
    message: '获取成功'
  })
}

// 获取用户状态选项
export const getUserStatuses = () => {
  // 当前使用模拟数据，后续替换为真实API调用
  // return get('/users/statuses')
  return Promise.resolve({
    code: 200,
    data: userStatuses,
    message: '获取成功'
  })
}