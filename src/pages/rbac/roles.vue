<template>
  <a-card :bordered="false" :style="{ height: '100%' }">
    <a-row :gutter="24">
      <a-col :md="4">
        <a-list itemLayout="vertical" :dataSource="roles">
          <a-list-item slot="renderItem" slot-scope="item, index" @click="onRoleSelect(item)" :class="selected.id == item.id ? 'selected' : ''" :key="index">
            <a-list-item-meta :style="{ marginBottom: '0' }">
              <div slot="title" align="center">{{ item.name }}</div>
              <div slot="description" align="center">{{ item.desc }}</div>
            </a-list-item-meta>
          </a-list-item>
        </a-list>
      </a-col>
      <a-col :md="20">
        <div style="max-width: 800px">
          <a-divider v-if="isMobile()" />
          <div v-if="selected.id">
            <h3>角色：{{ selected.name }}</h3>
            <a-divider type="horizontal" />
          </div>


          <z-form ref="form" :definitions="definitions" :labelSpan="24" :wrapperSpan="24">
            <a-divider type="horizontal" />
            <h4>操作权限</h4>

            <a-row :gutter="16" v-for="(it, key) in permissionsData" :key="key">
              <a-col :xl="4" :lg="24">
                {{ it.name }}：
              </a-col>
              <a-col :xl="20" :lg="24">
                <a-checkbox
                  v-if="it.actionsOptions.length > 0"
                  :indeterminate="it.indeterminate"
                  :checked="it.checkedAll"
                  @change="onPermissionCheckAll($event, it)">
                  全选
                </a-checkbox>
                <a-checkbox-group :options="it.actionsOptions" v-model="it.selected" @change="onPermissionCheck(it)" />
              </a-col>
            </a-row>

            <a-divider type="horizontal" />
            <h4>菜单权限</h4>
            <a-tree
              checkable
              :treeData="menusData"
              :checkedKeys="checked"
              @check="onMenuCheck" />

            <a-divider type="horizontal" />
            <a-button type="primary" icon="save" @click="saveRole()">保存</a-button>
          </z-form>
        </div>
      </a-col>
    </a-row>
  </a-card>
</template>

<script>
import { mixinDevice } from '@/utils/mixin'
import ZForm from '@/components/forms/Form'
import rbac from '@/api/rbac'

function menuNormalize (items) {
  return items.map(item => {
    const obj = {}
    obj.key = item.id
    obj.title = item.title
    obj.value = item
    obj.selectable = false
    obj.isLeaf = !item.children
    if (item.children) {
      obj.children = menuNormalize(item.children)
    }
    return obj
  })
}

const DEFINITIONS = [
  {
    type: 'text',
    key: 'name',
    title: '角色名称',
    required: true,
    placeholder: true,
  },
  {
    type: 'textarea',
    key: 'desc',
    title: '角色描述',
    placeholder: true,
  },
  {
    type: 'switch',
    key: 'enabled',
    title: '角色状态'
  }
]

export default {
  mixins: [mixinDevice],
  components: { ZForm },
  data () {
    return {
      definitions: DEFINITIONS,

      roles: [],
      permissionsData: [],
      menusData: [],

      selected: { id: 0 },
      checked: [],
      menus: { leaves: [], all: [] }
    }
  },
  created () {
    this.loadRoles()
    this.loadPermissions()
    this.loadMenus()
  },
  methods: {
    loadRoles () {
      rbac.role.list().then(data => {
        const add = { id: 0, name: '新增角色', desc: '新增一个角色', permissions: {}, navigations: {} }
        this.roles = [add, ...data]
      })
    },
    loadPermissions () {
      rbac.permission.list().then(data => {
        this.permissionsData = data.map(item => {
          item.checkedAll = false
          item.selected = []
          item.indeterminate = false
          item.actionsOptions = item.actions.map(action => ({ value: action, label: this.$actions[action] }))
          return item
        })
      })
    },
    loadMenus () {
      rbac.menu.list().then(data => {
        this.menusData = menuNormalize(data)
        console.log('menus => ', this.menusData)
      })
    },
    saveRole () {
      this.$refs.form.validate((values, { id }) => {
        const permissions = {}
        this.permissionsData.filter(perm => perm.selected.length > 0).forEach(perm => {
          permissions[perm.key] = perm.selected
        })
        const menus = this.menus

        // console.log('role save values => ', values, permissions)
        rbac.role.save({ id, permissions, menus, ...values }).then(data => {
          this.$message.success(id > 0 ? '编辑成功' : '添加成功')
          this.loadRoles()
        })
      })
    },

    onRoleSelect (role) {
      this.selected = role

      // role permissions => {permission: [action..]}
      // meta permissions => {key, name, actions: []}
      // 把权限表遍历一遍，设定要勾选的权限 action
      this.permissionsData.forEach(item => {
        item.selected = role.permissions[item.key] || []
        this.onPermissionCheck(item)
      })

      // [{id, children}]
      this.checked = role.menus.leaves || []
      this.menus = role.menus

      this.$nextTick(() => {
        this.$refs.form.update(role, true)
      })
    },

    onMenuCheck (checkedKeys, info) {
      this.checked = checkedKeys
      this.menus.leaves = info.checkedNodes.filter(node => node.data.props.isLeaf).map(node => node.key)
      this.menus.all = [...checkedKeys, ...info.halfCheckedKeys]
      console.log('onMenuCheck', this.menus, checkedKeys, info)
    },

    onPermissionCheck (p) {
      p.indeterminate = !!p.selected.length && (p.selected.length < p.actionsOptions.length)
      p.checkedAll = p.selected.length === p.actionsOptions.length
    },
    onPermissionCheckAll (e, p) {
      console.log('permission:', p)

      Object.assign(p, {
        selected: e.target.checked ? p.actions : [],
        indeterminate: false,
        checkedAll: e.target.checked
      })
    }
  }
}
</script>
