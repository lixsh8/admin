import Vue from 'vue'
import { ACCESS_TOKEN } from '@/store/ls'
import { welcome } from '@/utils/util'
import { menusToRoutes } from '@/core/router/util'

import admin from '@/api/admin'

const user = {
  state: {
    info: null,
    nickname: '',
    avatar: '',
    permissions: {},
    routes: [],
    welcome: ''
  },

  mutations: {
    SET_WELCOME: (state, welcome) => {
      state.welcome = welcome
    },
    SET_INFO: (state, info) => {
      state.info = info
      state.nickname = info ? info.nickname : ''
      state.avatar = info ? info.avatar : ''
    },
    SET_ROUTERS: (state, routers) => {
      state.routes = routers
    },
    SET_PERMISSIONS: (state, permissions) => {
      state.permissions = permissions
    }
  },

  actions: {
    // 登录
    login ({ commit }, params) {
      return admin.auth.login(params)
    },

    // 登录后初始化
    init ({ commit }) {
      return new Promise((resolve, reject) => {
        admin.user.init().then(data => {
          commit('SET_INFO', data)
          commit('SET_WELCOME', welcome())
          commit('SET_ROUTERS', menusToRoutes(data.menus))
          commit('SET_PERMISSIONS', data.permissions)

          resolve(data)
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 获取用户信息
    info ({ commit }) {
      return new Promise((resolve, reject) => {
        admin.user.info().then(data => {
          commit('SET_WELCOME', welcome())
          commit('SET_INFO', data)

          resolve(data)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 登出
    logout ({ commit, state }) {
      return new Promise((resolve) => {
        admin.auth.logout().then(() => resolve()).catch(() => resolve()).finally(() => {
          commit('SET_INFO', null)
          Vue.ls.remove(ACCESS_TOKEN)
        })
      })
    }
  }
}

export default user
