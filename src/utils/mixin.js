// import Vue from 'vue'
import enquireJs from 'enquire.js'
import { mapState } from 'vuex'
import { DEVICE_TYPE } from '@/config/constants'

// const mixinsComputed = Vue.config.optionMergeStrategies.computed
// const mixinsMethods = Vue.config.optionMergeStrategies.methods

const mixin = {
  computed: {
    ...mapState({
      layoutMode: state => state.app.layout,
      navTheme: state => state.app.theme,
      primaryColor: state => state.app.color,
      colorWeak: state => state.app.weak,
      fixedHeader: state => state.app.fixedHeader,
      fixSidebar: state => state.app.fixSidebar,
      contentWidth: state => state.app.contentWidth,
      autoHideHeader: state => state.app.autoHideHeader,
      sidebarOpened: state => state.app.sidebar,
      multiTab: state => state.app.multiTab
    })
  },
  methods: {
    isTopMenu () {
      return this.layoutMode === 'topmenu'
    },
    isSideMenu () {
      return !this.isTopMenu()
    }
  }
}

const mixinDevice = {
  computed: {
    ...mapState({
      device: state => state.app.device
    })
  },
  methods: {
    isMobile () {
      return this.device === DEVICE_TYPE.MOBILE
    },
    isDesktop () {
      return this.device === DEVICE_TYPE.DESKTOP
    },
    isTablet () {
      return this.device === DEVICE_TYPE.TABLET
    }
  }
}

function deviceEnquire (callback) {
  // screen and (max-width: 1087.99px)
  enquireJs.register('screen and (max-width: 576px)', {
    match () {
      callback && callback(DEVICE_TYPE.MOBILE)
    }
  }).register('screen and (min-width: 576px) and (max-width: 1199px)', {
    match () {
      callback && callback(DEVICE_TYPE.TABLET)
    }
  }).register('screen and (min-width: 1200px)', {
    match () {
      callback && callback(DEVICE_TYPE.DESKTOP)
    }
  })
}

const AppDeviceEnquire = {
  mounted () {
    const { $store } = this
    deviceEnquire(deviceType => $store.dispatch('toggleDevice', deviceType))
  }
}

export { mixin, mixinDevice, AppDeviceEnquire }
