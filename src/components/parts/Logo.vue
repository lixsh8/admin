<template>
  <div class="logo">
    <router-link to="/">
      <LogoSvg alt="logo" />
      <h1 v-if="showTitle">{{ title }}</h1>
    </router-link>
  </div>
</template>

<script>
import LogoSvg from '@/assets/logo.svg?inline'
import { appTitle } from '@/config'

export default {
  name: 'Logo',
  components: {
    LogoSvg
  },
  props: {
    title: { type: String, default: () => appTitle },
    showTitle: { type: Boolean, default: true }
  }
}
</script>
