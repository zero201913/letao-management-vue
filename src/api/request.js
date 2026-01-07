// 请求封装 - 基于axios
import axios from 'axios'

// 创建axios实例
const request = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api', // 从环境变量获取API地址
  timeout: 10000, // 请求超时时间
  headers: {
    'Content-Type': 'application/json'
  }
})

// 请求拦截器
request.interceptors.request.use(
  config => {
    // 在发送请求之前做些什么，比如添加token
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  error => {
    // 对请求错误做些什么
    console.error('请求错误:', error)
    return Promise.reject(error)
  }
)

// 响应拦截器
request.interceptors.response.use(
  response => {
    // 对响应数据做点什么
    const res = response.data
    
    // 根据实际业务逻辑处理响应
    if (res.code === 200) {
      return res
    } else {
      // 处理错误响应
      console.error('响应错误:', res.message || '请求失败')
      return Promise.reject(new Error(res.message || '请求失败'))
    }
  },
  error => {
    // 对响应错误做点什么
    console.error('响应错误:', error)
    
    // 处理网络错误、超时等
    let message = '请求失败'
    if (error.message.includes('timeout')) {
      message = '请求超时，请稍后重试'
    } else if (error.message.includes('Network Error')) {
      message = '网络错误，请检查网络连接'
    }
    
    return Promise.reject(new Error(message))
  }
)

// 导出请求方法
export default request

// 导出常用HTTP方法
export const get = (url, params = {}) => {
  return request({
    url,
    method: 'get',
    params
  })
}

export const post = (url, data = {}) => {
  return request({
    url,
    method: 'post',
    data
  })
}

export const put = (url, data = {}) => {
  return request({
    url,
    method: 'put',
    data
  })
}

export const del = (url, params = {}) => {
  return request({
    url,
    method: 'delete',
    params
  })
}