// ie polyfill
import '@babel/polyfill'

import Vue from 'vue'
import App from './App.vue'
import store from './store/'

import router from './core/router'
import bootstrap from './core/bootstrap'
import './core/use'

Vue.config.productionTip = false

new Vue({
  router,
  store,
  created: bootstrap,
  render: h => h(App)
}).$mount('#app')
