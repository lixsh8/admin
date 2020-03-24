<template>
  <a-card :bordered="false">

    <div align="right">
      <a-button type="primary" icon="plus" @click="$refs.modal.show('新建问题', {})">新建问题</a-button>
    </div>

    <br />

    <a-table ref="table" rowKey="id" :columns="columns" :dataSource="dataSource" :pagination="pagination">
      <span slot="body" slot-scope="text, it">
        <h3>#{{ it.id }} - {{ it.question }}</h3>
        <div v-for="(item, index) in JSON.parse(it.options)" :key="item">
          {{ (index + 1) + ". " + item }}
        </div>
      </span>

      <span slot="action" slot-scope="text, it">
        <template>
          <a @click="$refs.modal.edit('编辑问题', it)">编辑</a>
          <a-divider type="vertical" />
          <a-popconfirm title="确认删除？" @confirm="onDelete(it)"><a>删除</a></a-popconfirm>
        </template>
      </span>

    </a-table>
    <form-modal ref="modal" :definitions="definitions" @submit="onSubmit" />
  </a-card>
</template>

<script>
import app from '@/api/app'

const DEFINITIONS = [
  {
    type: 'text',
    key: 'question',
    title: '问题',
    required: true,
    placeholder: true,
  },
  {
    type: 'json',
    key: 'options',
    title: '选项',
    required: true,
    placeholder: true,
  },
  {
    type: 'number',
    key: 'answer',
    title: '答案',
    required: true
  }
]

export default {
  data () {
    return {
      definitions: DEFINITIONS,
      // 表头
      columns: [
        {
          title: '问题',
          dataIndex: 'id',
          scopedSlots: { customRender: 'body' }
        },
        {
          title: '答案',
          dataIndex: 'answer'
        },
        {
          title: '时间',
          width: '260px',
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
      app.quiz.list({ page: this.pagination.page }).then(data => {
        this.dataSource = data
      })
    },
    onDelete ({ id }) {
      app.quiz.delete({ id }).then(data => {
        this.load()
      })
    },
    onSubmit (values, { id }, target) {
      app.quiz.save({ id, ...values }).then(data => {
        target.visible = false
        this.$message.success(id > 0 ? '编辑成功' : '添加成功')
        this.load()
      })
    }
  }
}
</script>
