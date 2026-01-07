// 帮助中心API封装
import request, { get, post } from './request'
import { faqs, helpCategories, helpArticles } from '../data/help'

// 获取FAQ列表
export const getFaqs = (params = {}) => {
  // 当前使用模拟数据，后续替换为真实API调用
  // return get('/help/faqs', params)
  return Promise.resolve({
    code: 200,
    data: faqs,
    message: '获取成功'
  })
}

// 获取帮助分类
export const getHelpCategories = () => {
  // 当前使用模拟数据，后续替换为真实API调用
  // return get('/help/categories')
  return Promise.resolve({
    code: 200,
    data: helpCategories,
    message: '获取成功'
  })
}

// 获取帮助文章列表
export const getHelpArticles = (params = {}) => {
  // 当前使用模拟数据，后续替换为真实API调用
  // return get('/help/articles', params)
  return Promise.resolve({
    code: 200,
    data: helpArticles,
    message: '获取成功'
  })
}

// 获取单个帮助文章详情
export const getHelpArticleById = (id) => {
  // 当前使用模拟数据，后续替换为真实API调用
  // return get(`/help/articles/${id}`)
  const article = helpArticles.find(a => a.id === id)
  return Promise.resolve({
    code: 200,
    data: article || {},
    message: article ? '获取成功' : '文章不存在'
  })
}

// 搜索帮助内容
export const searchHelp = (keyword) => {
  // 当前使用模拟数据，后续替换为真实API调用
  // return get('/help/search', { keyword })
  return Promise.resolve({
    code: 200,
    data: {
      faqs: faqs.filter(faq => faq.question.includes(keyword) || faq.answer.includes(keyword)),
      articles: helpArticles.filter(article => article.title.includes(keyword) || article.content.includes(keyword))
    },
    message: '搜索成功'
  })
}