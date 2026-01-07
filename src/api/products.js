// 产品管理API封装
import request, { get, post, put, del } from './request'
import { products, productCategories, productStatuses } from '../data/products'

// 获取产品列表
export const getProducts = (params = {}) => {
  // 当前使用模拟数据，后续替换为真实API调用
  // return get('/products', params)
  return Promise.resolve({
    code: 200,
    data: products,
    message: '获取成功'
  })
}

// 获取单个产品详情
export const getProductById = (id) => {
  // 当前使用模拟数据，后续替换为真实API调用
  // return get(`/products/${id}`)
  const product = products.find(p => p.id === id)
  return Promise.resolve({
    code: 200,
    data: product || {},
    message: product ? '获取成功' : '产品不存在'
  })
}

// 添加产品
export const addProduct = (data) => {
  // 当前使用模拟数据，后续替换为真实API调用
  // return post('/products', data)
  return Promise.resolve({
    code: 200,
    data: { ...data, id: products.length + 1 },
    message: '添加成功'
  })
}

// 编辑产品
export const editProduct = (id, data) => {
  // 当前使用模拟数据，后续替换为真实API调用
  // return put(`/products/${id}`, data)
  return Promise.resolve({
    code: 200,
    data: { ...data, id },
    message: '编辑成功'
  })
}

// 删除产品
export const deleteProduct = (id) => {
  // 当前使用模拟数据，后续替换为真实API调用
  // return del(`/products/${id}`)
  return Promise.resolve({
    code: 200,
    message: '删除成功'
  })
}

// 获取产品类别选项
export const getProductCategories = () => {
  // 当前使用模拟数据，后续替换为真实API调用
  // return get('/products/categories')
  return Promise.resolve({
    code: 200,
    data: productCategories,
    message: '获取成功'
  })
}

// 获取产品状态选项
export const getProductStatuses = () => {
  // 当前使用模拟数据，后续替换为真实API调用
  // return get('/products/statuses')
  return Promise.resolve({
    code: 200,
    data: productStatuses,
    message: '获取成功'
  })
}

// 上架/下架产品
export const updateProductStatus = (id, status) => {
  // 当前使用模拟数据，后续替换为真实API调用
  // return put(`/products/${id}/status`, { status })
  return Promise.resolve({
    code: 200,
    message: '更新成功'
  })
}