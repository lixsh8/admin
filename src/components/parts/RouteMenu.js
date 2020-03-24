import Menu from 'ant-design-vue/es/menu'
import Icon from 'ant-design-vue/es/icon'

const { Item, SubMenu } = Menu

export default {
  name: 'RouteMenu',
  props: {
    menu: { type: Array, required: true },
    theme: { type: String, default: 'dark' },
    mode: { type: String, default: 'inline' },
    collapsed: { type: Boolean, default: false }
  },
  data () {
    return {
      openKeys: [],
      selectedKeys: [],
      cachedOpenKeys: []
    }
  },
  computed: {
    rootSubmenuKeys: vm => {
      const keys = []
      vm.menu.forEach(item => keys.push(item.path))
      return keys
    }
  },
  mounted () {
    this.updateMenu()
  },
  watch: {
    collapsed (val) {
      if (val) {
        this.cachedOpenKeys = this.openKeys.concat()
        this.openKeys = []
      } else {
        this.openKeys = this.cachedOpenKeys
      }
    },
    $route: function () {
      this.updateMenu()
    }
  },
  methods: {
    // select menu item
    onOpenChange (openKeys) {
      // 在水平模式下时执行，并且不再执行后续
      if (this.mode === 'horizontal') {
        this.openKeys = openKeys
        return
      }
      // 非水平模式时
      const latestOpenKey = openKeys.find(key => !this.openKeys.includes(key))
      if (!this.rootSubmenuKeys.includes(latestOpenKey)) {
        this.openKeys = openKeys
      } else {
        this.openKeys = latestOpenKey ? [latestOpenKey] : []
      }
    },
    updateMenu () {
      const routes = this.$route.matched.concat()
      const { hidden } = this.$route.meta
      if (routes.length >= 3 && hidden) {
        routes.pop()
        this.selectedKeys = [routes[routes.length - 1].path]
      } else {
        this.selectedKeys = [routes.pop().path]
      }
      const openKeys = []
      if (this.mode === 'inline') {
        routes.forEach(item => {
          openKeys.push(item.path)
        })
      }

      this.collapsed ? (this.cachedOpenKeys = openKeys) : (this.openKeys = openKeys)
    },

    // render
    renderItem (menu) {
      if (menu.hideInMenu) {
        return null
      }
      return menu.children && !menu.hideChildrenInMenu ? this.renderSubMenu(menu) : this.renderMenuItem(menu)
    },
    renderMenuItem (menu) {
      const isHttp = menu.path && (menu.path.startsWith('http://') || menu.path.startsWith('https://'))
      const tag = isHttp ? 'a' : 'router-link'
      const props = { to: { name: menu.name } }
      const attrs = { href: menu.path, target: menu.meta.target || (isHttp && '_blank') }

      if (menu.children && menu.hideChildrenInMenu) {
        // 把有子菜单的 并且 父菜单是要隐藏子菜单的
        // 都给子菜单增加一个 hidden 属性
        // 用来给刷新页面时， selectedKeys 做控制用
        menu.children.forEach(item => {
          item.meta.hideInMenu = true
        })
      }

      return (
        <Item {...{ key: menu.path }}>
          <tag {...{ props, attrs }}>
            {this.renderIcon(menu.meta.icon)}
            <span>{menu.meta.title}</span>
          </tag>
        </Item>
      )
    },
    renderSubMenu (menu) {
      const children = []
      if (!menu.hideChildrenInMenu) {
        menu.children.forEach(item => children.push(this.renderItem(item)))
      }
      return (
        <SubMenu {...{ key: menu.path }}>
          <span slot="title">
            {this.renderIcon(menu.meta.icon)}
            <span>{menu.meta.title}</span>
          </span>
          {children}
        </SubMenu>
      )
    },
    renderIcon (icon) {
      if (icon === 'none' || icon === '' || icon === undefined) {
        return null
      }
      const props = typeof icon === 'object' ? { component: icon } : { type: icon }
      return (
        <Icon {... { props } }/>
      )
    }
  },

  render () {
    const { mode, theme, menu, openKeys } = this
    const props = { mode, theme, openKeys }
    const on = {
      select: obj => {
        this.selectedKeys = obj.selectedKeys
        this.$emit('select', obj)
      },
      openChange: this.onOpenChange
    }

    const children = menu.map(item => this.renderItem(item))
    return (
      <Menu vModel={this.selectedKeys} {...{ props, on }}>
        {children}
      </Menu>
    )
  }
}
