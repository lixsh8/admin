import Vue from 'vue'
import Vuex from 'vuex'

import app from './app'
import user from './user'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    app,
    user
  },
  state: {
  },
  mutations: {
  },
  actions: {
  },
  getters: {
    device: state => state.app.device,
    theme: state => state.app.theme,
    color: state => state.app.color,
    multiTab: state => state.app.multiTab,

    info: state => state.user.info,

    avatar: state => state.user.avatar,
    name: state => state.user.name,
    welcome: state => state.user.welcome,
    permissions: state => state.user.permissions,

    userRoutes: state => state.user.routes
    // lang: state => state.i18n.lang
  }
})
