<template>
  <a-card :bordered="false">

    <div align="right">
      <a-button type="primary" icon="plus" @click="$refs.modal.show('新建表单', {})">表单</a-button>
    </div>

    <br />

    <a-table ref="table" size="default" rowKey="id"
      :columns="columns"
      :dataSource="dataSource"
      :pagination="pagination"
    >
      <p slot="expandedRowRender" slot-scope="it" style="margin: 0">
        <z-json-editor v-model="it.schema" />
      </p>

      <span slot="action" slot-scope="text, it">
        <template>
          <a @click="$refs.modal.edit('编辑表单', it)">表单</a>
          <a-divider type="vertical" />
          <a-popconfirm title="确认删除？" @confirm="onDelete(it)"><a>删除</a></a-popconfirm>
        </template>
      </span>

    </a-table>
    <form-modal ref="modal" :definitions="definitions" @submit="onSubmit" :width="800" :labelSpan="4" :wrapperSpan="18"/>
  </a-card>
</template>

<script>
import manage from '@/api/manage' 
import ZJsonEditor from '@/components/forms/JsonEditor'
 

const DEFINITIONS = [
  {
    type: 'text',
    key: 'name',
    title: '表单名称',
    required: true,
    placeholder: true
  },
  {
    type: 'text',
    key: 'desc',
    title: '表单描述',
    placeholder: true,
  },
  {
    type: 'json',
    key: 'schema',
    title: '表单定义',
    placeholder: true,
  }
]


export default {
  components: {
    ZJsonEditor
  },
  data () {
    return {
      definitions: DEFINITIONS,
      // 表头
      columns: [
        {
          title: '表单名称',
          dataIndex: 'name'
        },
        {
          title: '表单描述',
          dataIndex: 'desc'
        },
        {
          title: '时间',
          width: '190px',
          dataIndex: 'updatedAt'
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
      manage.form.list(this.pagination.page).then(data => {
        this.dataSource = data
      })
    },
    onDelete ({id}) {
      manage.form.delete({ id }).then(data => {
        this.load()
      })
    },

    onSubmit (values, { id }, target) {
      manage.form.save({ id, ...values }).then(data => {
        target && (target.visible = false)
        this.$message.success(id > 0 ? '编辑成功' : '添加成功')
        this.load()
      })
    }
  }
}
</script>
