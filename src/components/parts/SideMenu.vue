<template>
  <a-layout-sider
    :class="['sider', isDesktop() ? null : 'shadow', theme, fixSidebar ? 'ant-fixed-sidemenu' : null ]"
    width="256px"
    :collapsible="collapsible"
    v-model="collapsed"
    :trigger="null">
    <logo />
    <route-menu
      :collapsed="collapsed"
      :menu="menus"
      :theme="theme"
      :mode="mode"
      @select="onSelect"
      style="padding: 16px 0px;"></route-menu>
  </a-layout-sider>

</template>

<script>
import Logo from './Logo'
import RouteMenu from './RouteMenu'
import { mixin, mixinDevice } from '@/utils/mixin'

export default {
  name: 'SideMenu',
  components: { Logo, RouteMenu },
  mixins: [mixin, mixinDevice],
  props: {
    mode: { type: String, default: 'inline' },
    theme: { type: String, default: 'dark' },
    collapsible: { type: Boolean, default: false },
    collapsed: { type: Boolean, default: false },
    menus: { type: Array, equired: true }
  },
  methods: {
    onSelect (obj) {
      this.$emit('menuSelect', obj)
    }
  }
}
</script>
