import Vue from 'vue'
import Router from 'vue-router'
import notification from 'ant-design-vue/es/notification'
import NProgress from 'nprogress' // progress bar
import '@/assets/nprogress.less' // progress bar custom style

import store from '@/store'
import { ACCESS_TOKEN } from '@/store/ls'
import { appTitle } from '@/config'
import { defaultRoutes } from '@/config/routes'
import { setDocumentTitle } from '@/utils/util'

// hack router push callback
const originalPush = Router.prototype.push
Router.prototype.push = function push (location, onResolve, onReject) {
  if (onResolve || onReject) return originalPush.call(this, location, onResolve, onReject)
  return originalPush.call(this, location).catch(err => err)
}

Vue.use(Router)

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  scrollBehavior: () => ({ y: 0 }),
  routes: defaultRoutes
})

const ROUTE_WHITE_LIST = ['login', 'register', 'registerResult'] // no redirect ROUTE_WHITE_LIST

NProgress.configure({ showSpinner: false }) // NProgress Configuration

router.beforeEach((to, from, next) => {
  NProgress.start() // start progress bar
  to.meta && (typeof to.meta.title !== 'undefined' && setDocumentTitle(`${to.meta.title} - ${appTitle}`))

  if (Vue.ls.get(ACCESS_TOKEN)) {
    /* has token */
    if (to.path === '/user/login') {
      next({ path: '/' })
      NProgress.done()
    } else if (store.getters.info) {
      next()
    } else {
      store.dispatch('init').then(() => {
        // console.log('routes => ', data, store.getters.userRoutes)
        // 动态添加可访问路由表
        router.addRoutes(store.getters.userRoutes)
        const redirect = decodeURIComponent(from.query.redirect || to.path)
        if (to.path === redirect) {
          if (!to.name) {
            next({ name: to.fullPath.substr(1), replace: true })
          } else {
            next({ ...to, replace: true })
          }
        } else {
          // 跳转到目的路由
          next({ path: redirect })
        }
      }).catch(() => {
        notification.error({ message: '错误', description: '请求用户信息失败，请重试' })
        store.dispatch('logout').then(() => {
          next({ path: '/user/login', query: { redirect: to.fullPath } })
        })
      })
    }
  } else if (ROUTE_WHITE_LIST.includes(to.name)) {
    // 在免登录白名单，直接进入
    next()
  } else {
    next({ path: '/user/login', query: { redirect: to.fullPath } })
    NProgress.done()
  }
})

router.afterEach(() => {
  NProgress.done() // finish progress bar
})

export default router
