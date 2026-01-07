// 权限管理API封装
import request, { get, post, put, del } from './request'
import { roles, permissionTree, roleStatuses } from '../data/permissions'

// 获取角色列表
export const getRoles = (params = {}) => {
  // 当前使用模拟数据，后续替换为真实API调用
  // return get('/roles', params)
  return Promise.resolve({
    code: 200,
    data: roles,
    message: '获取成功'
  })
}

// 获取单个角色详情
export const getRoleById = (id) => {
  // 当前使用模拟数据，后续替换为真实API调用
  // return get(`/roles/${id}`)
  const role = roles.find(r => r.id === id)
  return Promise.resolve({
    code: 200,
    data: role || {},
    message: role ? '获取成功' : '角色不存在'
  })
}

// 添加角色
export const addRole = (data) => {
  // 当前使用模拟数据，后续替换为真实API调用
  // return post('/roles', data)
  return Promise.resolve({
    code: 200,
    data: { ...data, id: roles.length + 1 },
    message: '添加成功'
  })
}

// 编辑角色
export const editRole = (id, data) => {
  // 当前使用模拟数据，后续替换为真实API调用
  // return put(`/roles/${id}`, data)
  return Promise.resolve({
    code: 200,
    data: { ...data, id },
    message: '编辑成功'
  })
}

// 删除角色
export const deleteRole = (id) => {
  // 当前使用模拟数据，后续替换为真实API调用
  // return del(`/roles/${id}`)
  return Promise.resolve({
    code: 200,
    message: '删除成功'
  })
}

// 获取权限树数据
export const getPermissionTree = () => {
  // 当前使用模拟数据，后续替换为真实API调用
  // return get('/permissions/tree')
  return Promise.resolve({
    code: 200,
    data: permissionTree,
    message: '获取成功'
  })
}

// 获取角色状态选项
export const getRoleStatuses = () => {
  // 当前使用模拟数据，后续替换为真实API调用
  // return get('/roles/statuses')
  return Promise.resolve({
    code: 200,
    data: roleStatuses,
    message: '获取成功'
  })
}

// 为角色分配权限
export const assignPermissions = (roleId, permissions) => {
  // 当前使用模拟数据，后续替换为真实API调用
  // return put(`/roles/${roleId}/permissions`, { permissions })
  return Promise.resolve({
    code: 200,
    message: '权限分配成功'
  })
}