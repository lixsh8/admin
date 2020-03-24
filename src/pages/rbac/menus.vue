<template>
  <a-card :bordered="false">

    <div class="table-operator">
      <a-button type="primary" icon="plus" @click="$refs.modal.show('新建菜单', {})">新建菜单</a-button>
    </div>
    <br>

    <a-table ref="table" rowKey="id" :columns="columns" :dataSource="dataSource" :pagination="pagination">
      <span slot="row" slot-scope="text, it">
        <template>
          <a-icon :type="it.icon || ' '" /> {{ it.title }}
        </template>
      </span>

      <span slot="action" slot-scope="text, it">
        <template>
          <a @click="$refs.modal.edit('编辑菜单', it)">编辑</a>
          <a-divider type="vertical" />
          <a @click="$refs.modal.show('为[' + it.title + ']添加子菜单', {parentId: it.id})">添加</a>
          <a-divider type="vertical" v-if="!it.children" />
          <a-popconfirm title="确认删除？" @confirm="onDelete(it)" v-if="!it.children"><a>删除</a></a-popconfirm>
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
    key: 'title',
    title: '菜单名称',
    required: true,
    placeholder: true
  },
  {
    type: 'text',
    key: 'path',
    title: '菜单路径',
    required: true,
    placeholder: true,
  },
  {
    type: 'icon',
    key: 'icon',
    title: '菜单图标'
  },
  {
    type: 'number',
    key: 'sort',
    title: '排序',
    placeholder: true,
  },
  {
    type: 'inline',
    title: ' ',
    colon: false,
    items: [
      {
        type: 'checkbox',
        key: 'isHideInMenu',
        label: '隐藏',
        
      },
      {
        type: 'checkbox',
        key: 'isHideChildrenInMenu',
        label: '隐藏子级',
      },
      {
        type: 'checkbox',
        key: 'isHideHeader',
        label: '隐藏页面头部',
      },
    ]
  }
]

export default {
  name: 'TableList',
  data () {
    return {
      definitions: DEFINITIONS,
      // 表头
      columns: [
        {
          title: '标题',
          dataIndex: 'title',
          width: '250px',
          scopedSlots: { customRender: 'row' }
        },
        {
          title: '路径',
          dataIndex: 'path'
        },
        {
          title: '排序',
          dataIndex: 'sort'
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
      rbac.menu.list().then(data => {
        this.dataSource = data
      })
    },
    onDelete ({id}) {
      rbac.menu.delete({ id }).then(data => {
        this.load()
      })
    },

    onSubmit (values, { id, parentId }, target) {
      rbac.menu.save({ id, parentId, ...values }).then(data => {
        target && (target.visible = false)
        this.$message.success(id > 0 ? '编辑成功' : '添加成功')
        this.load()
      })
    }
  }
}
</script>
