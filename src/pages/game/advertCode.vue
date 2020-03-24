<template>
  <a-card :bordered="false">

    <div align="right">
      <a-button type="primary" icon="plus" @click="$refs.modal.show('新建广告位', {})">新建广告位</a-button>
    </div>

    <br />

    <a-table ref="table" rowKey="id" :columns="columns" :dataSource="dataSource" :pagination="pagination">

      <span slot="action" slot-scope="text, it">
        <template>
          <a @click="$refs.modal.edit('编辑广告位', it)">编辑</a>
          <a-divider type="vertical" />
          <a-popconfirm title="确认删除？" @confirm="onDelete(it)"><a>删除</a></a-popconfirm>
        </template>
      </span>

    </a-table>
    <form-modal ref="modal" :definitions="definitions" @submit="onSubmit" />
  </a-card>
</template>

<script>
import config from '@/api/config'

const DEFINITIONS = [
  {
    type: 'text',
    key: 'id',
    title: '广告位ID',
    required: true,
    placeholder: true,
    readonly: true
  },
  {
    type: 'text',
    key: 'appId',
    title: '广告位APPID',
    required: true,
    placeholder: true,
    readonly: true
  },
  {
    type: 'text',
    key: 'codeId',
    title: '广告位代码',
    required: true,
    placeholder: true,
    readonly: true
  },
  {
    type: 'text',
    key: 'name',
    title: '广告位名称',
    required: true,
    placeholder: true
  },
  {
    type: 'text',
    key: 'fee',
    title: '单价',
    required: true,
    placeholder: true
  },
  {
    type: 'text',
    key: 'secret',
    title: '密钥',
    required: true,
    placeholder: true
  },
]

export default {
  data () {
    return {
      definitions: DEFINITIONS,
      // 表头
      columns: [
        {
          title: '广告位ID',
          dataIndex: 'id'
        },
        {
          title: '广告位名称',
          dataIndex: 'name'
        },
        {
          title: '应用ID',
          dataIndex: 'appId'
        },
        {
          title: '代码位',
          dataIndex: 'codeId'
        },
        {
          title: '单价',
          dataIndex: 'fee'
        },
        {
          title: '密钥',
          dataIndex: 'secret'
        },
        {
          title: '时间',
          width: '190px',
          dataIndex: 'createdAt'
        },
        {
          title: '操作',
          dataIndex: 'action',
          width: '120px',
          scopedSlots: { customRender: 'action' }
        }
      ],
      dataSource: [],
      pagination: {
        current: 1,
        pageSize: 50
      }
    }
  },
  created () {
    this.load()
  },
  methods: {
    load () {
      config.advertCode.list().then(data => {
        this.dataSource = data
      })
    },
    onDelete ({ id }) {
      config.advertCode.delete({ id }).then(data => {
        this.load()
      })
    },

    onSubmit (values, { id }, target) {
      config.advertCode.save({ id, ...values }).then(data => {
        target.visible = false
        this.$message.success(id > 0 ? '编辑成功' : '添加成功')
        this.load()
      })
    }
  }
}
</script>
