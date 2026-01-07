// 订单管理API封装
import request, { get, post, put, del } from './request'
import { orders, orderStatuses } from '../data/orders'

// 获取订单列表
export const getOrders = (params = {}) => {
  // 当前使用模拟数据，后续替换为真实API调用
  // return get('/orders', params)
  return Promise.resolve({
    code: 200,
    data: orders,
    message: '获取成功'
  })
}

// 获取单个订单详情
export const getOrderById = (id) => {
  // 当前使用模拟数据，后续替换为真实API调用
  // return get(`/orders/${id}`)
  const order = orders.find(o => o.id === id)
  return Promise.resolve({
    code: 200,
    data: order || {},
    message: order ? '获取成功' : '订单不存在'
  })
}

// 添加订单
export const addOrder = (data) => {
  // 当前使用模拟数据，后续替换为真实API调用
  // return post('/orders', data)
  return Promise.resolve({
    code: 200,
    data: { ...data, id: orders.length + 1 },
    message: '添加成功'
  })
}

// 编辑订单
export const editOrder = (id, data) => {
  // 当前使用模拟数据，后续替换为真实API调用
  // return put(`/orders/${id}`, data)
  return Promise.resolve({
    code: 200,
    data: { ...data, id },
    message: '编辑成功'
  })
}

// 删除订单
export const deleteOrder = (id) => {
  // 当前使用模拟数据，后续替换为真实API调用
  // return del(`/orders/${id}`)
  return Promise.resolve({
    code: 200,
    message: '删除成功'
  })
}

// 获取订单状态选项
export const getOrderStatuses = () => {
  // 当前使用模拟数据，后续替换为真实API调用
  // return get('/orders/statuses')
  return Promise.resolve({
    code: 200,
    data: orderStatuses,
    message: '获取成功'
  })
}

// 处理订单
export const processOrder = (id) => {
  // 当前使用模拟数据，后续替换为真实API调用
  // return put(`/orders/${id}/process`)
  return Promise.resolve({
    code: 200,
    message: '处理成功'
  })
}

// 取消订单
export const cancelOrder = (id) => {
  // 当前使用模拟数据，后续替换为真实API调用
  // return put(`/orders/${id}/cancel`)
  return Promise.resolve({
    code: 200,
    message: '取消成功'
  })
}