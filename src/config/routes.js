
// eslint-disable-next-line
import { BasicLayout, RouteView, BlankLayout, PageView, UserLayout } from '@/components/layouts'

// 路由组件映射表
export const routeComponents = {
  BasicLayout: BasicLayout,
  BlankLayout: BlankLayout,
  RouteView: RouteView,
  PageView: PageView,

  '403': () => import('@/views/exception/403'),
  '404': () => import('@/views/exception/404'),
  '500': () => import('@/views/exception/500')
}

export const routeNotFound = {
  path: '*', redirect: '/404', hidden: true
}

// 根级菜单
export const routeRoot = {
  id: 0,
  name: 'index',
  path: '/',
  component: BasicLayout,
  redirect: '/index',
  meta: {
    title: '首页'
  },
  children: []
}
export const routeAccount = {
  path: '/account',
  component: RouteView,
  redirect: '/account/center',
  name: 'account',
  hidden: true,
  children: [
    {
      path: '/account/center',
      name: 'AccountCenter',
      component: () => import('@/views/account/center/Index'),
      meta: { title: '个人中心', keepAlive: true }
    },
    {
      path: '/account/setting',
      name: 'AccountSettings',
      component: () => import('@/views/account/settings/Index'),
      meta: { title: '个人设置', isHideHeader: true },
      redirect: '/account/settings/base',
      children: [
        {
          path: '/account/settings/base',
          name: 'BaseSettings',
          component: () => import('@/views/account/settings/BaseSetting'),
          meta: { title: '基本设置' }
        },
        {
          path: '/account/settings/security',
          name: 'SecuritySettings',
          component: () => import('@/views/account/settings/Security'),
          meta: { title: '安全设置', keepAlive: true }
        },
        {
          path: '/account/settings/custom',
          name: 'CustomSettings',
          component: () => import('@/views/account/settings/Custom'),
          meta: { title: '个性化设置', keepAlive: true }
        },
        {
          path: '/account/settings/binding',
          name: 'BindingSettings',
          component: () => import('@/views/account/settings/Binding'),
          meta: { title: '账户绑定', keepAlive: true }
        },
        {
          path: '/account/settings/notification',
          name: 'NotificationSettings',
          component: () => import('@/views/account/settings/Notification'),
          meta: { title: '新消息通知', keepAlive: true }
        }
      ]
    }
  ]
}
/**
 * 基础路由
 * @type { *[] }
 */
export const defaultRoutes = [
  {
    path: '/user',
    component: UserLayout,
    redirect: '/user/login',
    children: [
      {
        path: 'login',
        name: 'login',
        component: () => import('@/views/user/Login')
      },
      {
        path: 'register',
        name: 'register',
        component: () => import('@/views/user/Register')
      },
      {
        path: 'register-result',
        name: 'registerResult',
        component: () => import('@/views/user/RegisterResult')
      },
      {
        path: 'recover',
        name: 'recover',
        component: undefined
      }
    ]
  },
  {
    path: '/404',
    component: () => import('@/views/exception/404')
  },
  {
    path: '/',
    component: BasicLayout,
    redirect: '/index',
    meta: {
      title: '首页'
    },
    children: [routeAccount]
  }
]
