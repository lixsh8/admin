import Vue from 'vue'
import VueStorage from 'vue-ls'
import config from '@/config/settings'

// base library
import '@/core/lazy/components'
import Viser from 'viser-vue'

// ext library
import VueClipboard from 'vue-clipboard2'
import Auth from '@/core/auth'

VueClipboard.config.autoSetContainer = true

Vue.use(Viser)

Vue.use(VueStorage, config.storageOptions)
Vue.use(VueClipboard)
Vue.use(Auth)
