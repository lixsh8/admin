<template>
  <div class="user-wrapper">
    <div class="content-box">

      <!-- <notice-icon class="action"/> -->

      <a-dropdown>
        <span class="action ant-dropdown-link user-dropdown-menu">
          <a-avatar class="avatar" size="small" :src="avatar"/>
          <span>{{ name }}</span>
        </span>
        <a-menu slot="overlay" class="user-dropdown-menu-wrapper">

          <a-menu-item v-for="(it, index) in menus" :key="index">
            <router-link :to="{ path: it.path }">
              <a-icon :type="it.icon"/>
              <span>{{it.title}}</span>
            </router-link>
          </a-menu-item>

          <a-menu-divider/>

          <a-menu-item key="3">
            <a href="javascript:;" @click="onLogout">
              <a-icon type="logout"/>
              <span>退出登录</span>
            </a>
          </a-menu-item>

        </a-menu>
      </a-dropdown>
    </div>
  </div>
</template>

<script>
// import NoticeIcon from './NoticeIcon'
import { mapActions, mapGetters } from 'vuex'



export default {
  name: 'UserMenu',
  // components: { NoticeIcon },
  data () {
    return {
      menus: [
        { title: '个人中心', path: '/account/center', icon: 'user' },
        { title: '账户设置', path: '/account/settings', icon: 'setting' }
      ]
    }
  },
  computed: {
    ...mapGetters(['name', 'avatar'])

  },
  methods: {
    ...mapActions(['logout']),
    doLogout () {
      return this.logout({}).then(() => {
        setTimeout(() => window.location.reload(), 16)
      }).catch(err => {
        this.$message.error({ title: '错误', description: err.message })
      })
    },
    onLogout () {
      this.$confirm({ title: '提示', content: '真的要注销登录吗 ?', onOk: () => this.doLogout() })
    }
  }
}
</script>
