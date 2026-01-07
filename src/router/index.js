import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/dashboard'
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
      meta: { title: '产品管理', roles: ['merchant'] }
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

  ],
})

router.beforeEach((to, from, next) => {
  const userRole = localStorage.getItem('userRole') || 'admin'
  
  if (to.meta.roles && !to.meta.roles.includes(userRole)) {
    next({ path: '/dashboard' })
  } else {
    next()
  }
})

export default router
