<template>
  <a-card :bordered="false">

    <div class="table-operator">
      <a-button type="primary" icon="plus" @click="$refs.modal.show('新建权限', {})">新建权限</a-button>
    </div>
    <br>

    <a-table ref="table" size="default" rowKey="id" :columns="columns" :dataSource="dataSource" :pagination="pagination">
      <span slot="actions" slot-scope="text, it">
        <a-tag v-for="(key, index) in it.actions" :key="index">{{ $actions[key] }}</a-tag>
      </span>

      <span slot="action" slot-scope="text, it">
        <template>
          <a @click="$refs.modal.edit('编辑权限', it)">编辑</a>
          <a-divider type="vertical" />
          <a-popconfirm title="确认删除？" @confirm="onDelete(it)"><a>删除</a></a-popconfirm>
        </template>
      </span>

    </a-table>
    <form-modal ref="modal" :definitions="definitions" @submit="onSubmit" />
  </a-card>
</template>

<script> 
import rbac from '@/api/rbac'

const DEFINITIONS = [
  {
    type: 'text',
    key: 'name',
    title: '权限名称',
    required: true,
    placeholder: true,
  },
  {
    type: 'text',
    key: 'key',
    title: '权限标识',
    required: true,
    placeholder: true,
  },
  {
    type: 'checkboxgroup',
    key: 'actions',
    title: '权限操作',
    required: true,
    placeholder: true,
    options: [
      { label: '新增', value: 'add' },
      { label: '删除', value: 'delete' },
      { label: '查询', value: 'query' },
      { label: '修改', value: 'edit' },
      { label: '启用', value: 'enable' },
      { label: '停用', value: 'disable' },
      { label: '导入', value: 'import' },
      { label: '导出', value: 'export' },
      { label: '审核', value: 'audit' },
      { label: '打款', value: 'remit' },
      { label: '详情', value: 'get' }
    ]
  }
]

export default {
  data () {
    return {
      definitions: DEFINITIONS,
      // 表头
      columns: [
        {
          title: '权限标识',
          dataIndex: 'key'
        },
        {
          title: '权限名称',
          dataIndex: 'name'
        },
        {
          title: '权限操作',
          dataIndex: 'actions',
          scopedSlots: { customRender: 'actions' }
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
      }
    }
  },
  created () {
    this.load()
  },
  methods: {
    load () {
      rbac.permission.list().then(data => {
        this.dataSource = data
      })
    },
    onDelete ({ id }) {
      rbac.permission.delete({ id }).then(data => {
        this.load()
      })
    },

    onSubmit (values, { id }, target) {
      rbac.permission.save({ id, ...values }).then(data => {
        target && (target.visible = false)
        this.$message.success(id > 0 ? '编辑成功' : '添加成功')
        this.load()
      })
    }
  }
}
</script>
