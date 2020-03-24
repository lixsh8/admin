
import store from '@/store'

import { PERMISSION_ACTIONS } from '@/config/constants'

function plugin (Vue) {
  if (plugin.installed) {
    return
  }

  !Vue.prototype.$auth && Object.defineProperties(Vue.prototype, {
    $auth: {
      get () {
        const _this = this
        return (name) => {
          const permissions = _this.$store.getters.permissions
          const [perm, action] = name.split(':')
          return permissions && Array.isArray(permissions[perm]) && permissions[perm].includes(action)
        }
      }
    }
  })

  !Vue.prototype.$actions && Object.defineProperties(Vue.prototype, {
    $actions: {
      get () {
        return PERMISSION_ACTIONS
      }
    }
  })

  Vue.directive('auth', {
    inserted: function (el, { rawName }, vnode) {
      const permissions = store.getters.permissions
      if (permissions) {
        const [perm, action] = rawName.split(':')[1].split('.')
        if (Array.isArray(permissions[perm]) && permissions[perm].includes(action)) {
          return
        }
      }
      el.parentNode && el.parentNode.removeChild(el) || (el.style.display = 'none')
    }
  })
}

export default plugin
