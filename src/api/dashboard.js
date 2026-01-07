// 仪表盘API封装
import request, { get, post } from './request'
import { dashboardStats, recentOrders, recentActivities, statsCards } from '../data/dashboard'

// 获取仪表盘统计数据
export const getDashboardStats = () => {
  // 当前使用模拟数据，后续替换为真实API调用
  // return get('/dashboard/stats')
  return Promise.resolve({
    code: 200,
    data: dashboardStats,
    message: '获取成功'
  })
}

// 获取最近订单数据
export const getRecentOrders = () => {
  // 当前使用模拟数据，后续替换为真实API调用
  // return get('/dashboard/recent-orders')
  return Promise.resolve({
    code: 200,
    data: recentOrders,
    message: '获取成功'
  })
}

// 获取最近用户活动数据
export const getRecentActivities = () => {
  // 当前使用模拟数据，后续替换为真实API调用
  // return get('/dashboard/recent-activities')
  return Promise.resolve({
    code: 200,
    data: recentActivities,
    message: '获取成功'
  })
}

// 获取统计卡片数据
export const getStatsCards = () => {
  // 当前使用模拟数据，后续替换为真实API调用
  // return get('/dashboard/stats-cards')
  return Promise.resolve({
    code: 200,
    data: statsCards,
    message: '获取成功'
  })
}