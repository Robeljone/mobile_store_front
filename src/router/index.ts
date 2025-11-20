import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

import AuthLayout from '../layouts/AuthLayout.vue'
import AppLayout from '../layouts/AppLayout.vue'
import { validateToken } from './auth'
import RouteViewComponent from '../layouts/RouterBypass.vue'
// import { validateToken } from './auth'
const routes: Array<RouteRecordRaw> = [
  {
    path: '/:pathMatch(.*)*',
    redirect: { name: 'dashboard' },
  },
  {
    name: 'admin',
    path: '/',
    component: AppLayout,
    redirect: { name: 'login' },
    children: [
      {
        name: 'dashboard',
        path: 'dashboard',
        meta: { requiresAuth: true },
        component: () => import('../pages/store_app/dashboard.vue'),
      },
      {
        name: 'Management',
        path: '/management',
        component: RouteViewComponent,
        children: [
          {
            name: 'products',
            path: '/products',
            meta: { requiresAuth: true },
            component: () => import('../pages/store_app/product.vue'),
          },
          {
            name: 'customer',
            path: 'customer',
            meta: { requiresAuth: true },
            component: () => import('../pages/store_app/customer.vue'),
          },
          {
            name: 'supplier',
            path: 'supplier',
            meta: { requiresAuth: true },
            component: () => import('../pages/store_app/supplier.vue'),
          },
           {
            name: 'brand',
            path: 'brand',
            meta: { requiresAuth: true },
            component: () => import('../pages/store_app/brand.vue'),
          },
           {
            name: 'model',
            path: 'model',
            meta: { requiresAuth: true },
            component: () => import('../pages/store_app/model.vue'),
          }
        ],
      },
      {
        name: 'POS',
        path: '/pos',
        component: RouteViewComponent,
        children: [
          {
            name: 'sales',
            path: 'sales',
            meta: { requiresAuth: true },
            component: () => import('../pages/store_app/sales.vue'),
          },
          {
            name: 'purchase',
            path: 'purchase',
            meta: { requiresAuth: true },
            component: () => import('../pages/store_app/purchase.vue'),
          },
        ],
      },
      {
        name: 'Settings',
        path: '/settings',
        component: RouteViewComponent,
        children: [
          {
            name: 'users',
            path: 'users',
            meta: { requiresAuth: true },
            component: () => import('../pages/store_app/user.vue'),
          },
          {
            name: 'roles',
            path: 'roles',
            meta: { requiresAuth: true },
            component: () => import('../pages/store_app/role.vue'),
          },
          {
            name: 'permission',
            path: 'permission',
            meta: { requiresAuth: true },
            component: () => import('../pages/store_app/permission.vue'),
          }
        ],
      },
      {
        name: 'Reports',
        path: '/reports',
        component: RouteViewComponent,
        children: [
          {
            name: 'sales_report',
            path: 'sales_report',
            meta: { requiresAuth: true },
            component: () => import('../pages/store_app/sales_report.vue'),
          },
          {
            name: 'purchase_report',
            path: 'purchase_report',
            meta: { requiresAuth: true },
            component: () => import('../pages/store_app/purchase_report.vue'),
          },
        ],
      },
    ],
  },
  {
    path: '/auth',
    component: AuthLayout,
    children: [
      {
        name: 'login',
        path: 'login',
        component: () => import('../pages/auth/Login.vue'),
      },
      {
        name: 'signup',
        path: 'signup',
        component: () => import('../pages/auth/Signup.vue'),
      },
      {
        name: 'recover-password',
        path: 'recover-password',
        component: () => import('../pages/auth/RecoverPassword.vue'),
      },
      {
        name: 'recover-password-email',
        path: 'recover-password-email',
        component: () => import('../pages/auth/CheckTheEmail.vue'),
      },
      {
        path: '',
        redirect: { name: 'login' },
      },
    ],
  },
  {
    name: '404',
    path: '/404',
    component: () => import('../pages/404.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    }
    // For some reason using documentation example doesn't scroll on page navigation.
    if (to.hash) {
      return { el: to.hash, behavior: 'smooth' }
    } else {
      window.scrollTo(0, 0)
    }
  },
  routes,
})

//check each route if the token is there.
router.beforeEach(async (to, from, next) => {
  const token = localStorage.getItem('token')
  if (to.meta.requiresAuth) {
    if (!token) {
      return next({ name: 'auth/login' })
    }
    // const isValid = await validateToken()
    // if (!isValid) {
    //   return next({ name: 'auth/login' })
    // }
  }

  next()
})

export default router
