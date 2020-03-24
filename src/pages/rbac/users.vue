<template>
  <a-card :bordered="false">

    <div align="right">
      <a-button type="primary"
                icon="plus"
                @click="$refs.modal.show('新建用户', (state.id = 0, {}))">新建用户</a-button>
    </div>
    <br>

    <a-table
             ref="table"
             rowKey="id"
             :columns="columns"
             :dataSource="dataSource"
             :pagination="pagination">
      <span slot="info"
            slot-scope="text, it">

        <a-row type="flex"
               align="middle">
          <a-col style="width: 40px;">
            <a-avatar icon="user"
                      :src="it.avatar" />
          </a-col>
          <a-col>
            {{ it.nickname }}
          </a-col>
        </a-row>
      </span>
      <span slot="contact"
            slot-scope="text, it">
        <div>手机：{{ it.phone }}</div>
        <div>邮箱：{{ it.email }}</div>
      </span>

      <span slot="action"
            slot-scope="text, it">
        <template>
          <a @click="$refs.modal.edit('编辑用户', (state.id = it.id, it))">编辑</a>
          <a-divider type="vertical"
                     v-if="it.id != 1" />
          <a-popconfirm title="确认删除？"
                        @confirm="onDelete(it)"
                        v-if="it.id != 1"><a>删除</a></a-popconfirm>
        </template>
      </span>

    </a-table>
    <form-modal ref="modal"
                :definitions="definitions"
                :state="state"
                @submit="onSubmit" />
  </a-card>
</template>

<script>
import rbac from '@/api/rbac'

const ROLES = []
const DEFINITIONS = [
  {
    type: 'text',
    key: 'nickname',
    title: '用户名',
    required: true,
    placeholder: true,
  },
  {
    type: 'text',
    key: 'phone',
    title: '手机',
    required: true,
    placeholder: true,
  },
  {
    type: 'text',
    key: 'email',
    title: '邮箱',
    required: true,
    placeholder: true,
  },
  {
    type: 'text',
    key: 'password',
    title: '密码',
    required: 'state.id < 1',
  },
  {
    type: 'checkboxgroup',
    key: 'roleIds',
    title: '角色',
    required: true,
    options: 'roles'
  },
  {
    type: 'switch',
    key: 'enabled',
    title: '是否启用'
  }
]

export default {
  data () {
    return {
      definitions: DEFINITIONS,
      // 表头
      columns: [
        {
          title: '#',
          dataIndex: 'id'
        },
        {
          title: '用户',
          dataIndex: 'nickname',
          scopedSlots: { customRender: 'info' }
        },
        {
          title: '联系方式',
          dataIndex: 'phone',
          scopedSlots: { customRender: 'contact' }
        },
        {
          title: '状态',
          dataIndex: 'enabled',
          customRender: (text, record) => (record.enabled ? '启用' : '停用')
        },
        {
          title: '添加时间',
          dataIndex: 'createdAt',
          width: '190px'
        },
        {
          title: '操作',
          dataIndex: 'action',
          width: '150px',
          scopedSlots: { customRender: 'action' }
        }
      ],
      dataSource: [],
      pagination: {
        hideOnSinglePage: true
      },
      state: {
        roles: []
      }
    }
  },
  created () {
    this.load()
    this.loadRoles()
  },
  methods: {
    loadRoles () {
      rbac.role.list().then(data => {
        this.state.roles = data.map(item => ({ label: item.name, value: item.id }))
      })
    },
    load () {
      rbac.user.list().then(data => {
        this.dataSource = data
      })
    },
    onDelete ({ id }) {
      rbac.user.delete({ id }).then(data => {
        this.load()
      })
    },

    onSubmit (values, { id }, target) {
      rbac.user.save({ id, ...values }).then(data => {
        target && (target.visible = false)
        this.$message.success(id > 0 ? '编辑成功' : '添加成功')
        this.load()
      })
    }
  }
}
</script>

<style lang="less" scoped>
</style>
