import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'introduction',
      component: () => import('../views/IntroductionView.vue'),
      meta: { title: '介绍页' }
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: () => import(/* webpackPrefetch: true */ '../views/DashboardView.vue'),
      meta: { title: '仪表盘', roles: ['admin', 'merchant'] }
    },
    {
      path: '/users',
      name: 'users',
      component: () => import('../views/UserManagementView.vue'),
      meta: { title: '用户管理', roles: ['admin'] }
    },
    {
      path: '/orders',
      name: 'orders',
      component: () => import('../views/OrderManagementView.vue'),
      meta: { title: '订单管理', roles: ['admin', 'merchant'] }
    },
    {
      path: '/statistics',
      name: 'statistics',
      component: () => import(/* webpackPreload: true */ '../views/DataStatisticsView.vue'),
      meta: { title: '数据统计', roles: ['admin', 'merchant'] }
    },
    {
      path: '/products',
      name: 'products',
      component: () => import('../views/ProductManagementView.vue'),
      meta: { title: '产品管理', roles: ['admin', 'merchant'] }
    },
    {
      path: '/after-sales',
      name: 'after-sales',
      component: () => import('../views/AfterSalesView.vue'),
      meta: { title: '售后管理', roles: ['admin', 'merchant'] }
    },
    {
      path: '/categories',
      name: 'categories',
      component: () => import('../views/CategoryManagementView.vue'),
      meta: { title: '分类管理', roles: ['admin', 'merchant'] }
    },
    {
      path: '/settings',
      name: 'settings',
      component: () => import('../views/SystemSettingsView.vue'),
      meta: { title: '系统设置', roles: ['admin'] }
    },
    {
      path: '/permissions',
      name: 'permissions',
      component: () => import('../views/PermissionManagementView.vue'),
      meta: { title: '权限管理', roles: ['admin'] }
    },
    {
      path: '/system/logs',
      name: 'logs',
      component: () => import('../views/system/LogsView.vue'),
      meta: { title: '操作日志', roles: ['admin'] }
    },
    {
      path: '/system/user-info',
      name: 'user-info',
      component: () => import('../views/system/UserInfoView.vue'),
      meta: { title: '用户信息', roles: ['admin'] }
    },
    {
      path: '/system/merchant-info',
      name: 'merchant-info',
      component: () => import('../views/system/MerchantInfoView.vue'),
      meta: { title: '商家信息', roles: ['admin'] }
    },

  ],
})

router.beforeEach((to, from, next) => {
  const userRole = localStorage.getItem('userRole') || 'admin'

  if (to.meta.roles && !to.meta.roles.includes(userRole)) {
    // 如果用户没有权限访问当前页面，重定向到不需要权限的登录页面
    next({ path: '/' })
  } else {
    next()
  }
})

export default router
