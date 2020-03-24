<template>
  <a-card :bordered="false">

    <div align="right">
      <a-button type="primary" icon="plus" @click="$refs.modal.show('新建配置', {})">新建配置</a-button>
    </div>

    <br />

    <a-table ref="table" rowKey="id" :columns="columns" :dataSource="dataSource" :pagination="pagination">
      <p slot="expandedRowRender" slot-scope="it" style="margin: 0">
        <z-json-editor v-model="it.value" @change="value => it.value = value" />
        <br>
        <a-button type="primary" icon="plus" @click="onSubmitValue(it.id, it.value)">保存</a-button>
      </p>

      <span slot="action" slot-scope="text, it">
        <template>
          <a @click="$refs.modal.edit('编辑配置', it)">编辑</a>
          <a-divider type="vertical" />
          <a-popconfirm title="确认删除？" @confirm="this.delete(it)"><a>删除</a></a-popconfirm>
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
    title: '配置名称',
    required: true,
    placeholder: true
  },
  {
    type: 'text',
    key: 'desc',
    title: '配置描述',
    placeholder: true,
  },
  {
    type: 'json',
    key: 'value',
    title: '配置内容',
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
          title: '配置名称',
          dataIndex: 'name'
        },
        {
          title: '配置描述',
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
      manage.config.list(this.pagination.page).then(data => {
        this.dataSource = data
      })
    },
    delete ({id}) {
      manage.config.delete({ id }).then(data => {
        this.load()
      })
    },

    onSubmitValue (id, value) {
      manage.config.update({ id, value }).then(data => {
        this.$message.success('更新成功')
      })
    },

    onSubmit (values, { id }, target) {
      manage.config.save({ id, ...values }).then(data => {
        target && (target.visible = false)
        this.$message.success(id > 0 ? '编辑成功' : '添加成功')
        this.load()
      })
    }
  }
}
</script>
