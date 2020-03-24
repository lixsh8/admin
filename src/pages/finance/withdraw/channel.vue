<template>
  <a-card :bordered="false">

    <a-row>
      <a-col align="right">
        <a-button type="primary" icon="plus" @click="$refs.modal.show('新建通道', { })">新建通道</a-button>
      </a-col>
    </a-row>

    <br />

    <a-table ref="table" rowKey="id" :columns="columns" :dataSource="dataSource" :pagination="pagination">
      <div slot="content" slot-scope="text, it">
        <a-row type="flex" :gutter="15" align="middle">
          <a-col v-if="it.icon">
            <img alt="icon" :src="it.icon" style="max-width: 40px; max-height: 40px" />
          </a-col>
          <a-col>
            <h3 v-if="it.name">#{{ it.id }} - {{ it.name }}({{ it.key }})</h3>
            <p v-if="it.desc">{{ record.desc }}</p>
          </a-col>
        </a-row>
      </div>

      <div slot="status" slot-scope="text, it">
        <p>
          {{ it.enabled ? '启用' : '停用' }}
          <span v-if="it.recommend">&amp; 推荐</span>
        </p>
      </div>

      <span slot="action" slot-scope="text, it">
        <template>
          <a @click="$refs.modal.edit('编辑通道', it)">编辑</a>
          <a-divider type="vertical" />
          <a @click="onDelete(it)">删除</a>
        </template>
      </span>

    </a-table>
    <form-modal ref="modal" :definitions="definitions" @submit="onSubmit" />
  </a-card>
</template>

<script>
import finance from '@/api/finance'

const DEFINITIONS = [
  {
    type: 'text',
    key: 'key',
    title: '通道标识',
    required: true,
    placeholder: true
  },
  {
    type: 'text',
    key: 'name',
    title: '通道名称',
    required: true,
    placeholder: true
  },
  {
    type: 'text',
    key: 'desc',
    title: '通道描述',
    placeholder: true
  },
  {
    type: 'image',
    key: 'icon',
    title: '通道图标',
    imagePath: 'finance-channel'
  },
  {
    type: 'number',
    key: 'sort',
    title: '排序',
    placeholder: true
  },
  {
    type: 'inline',
    title: ' ',
    colon: false,
    items: [
      {
        type: 'checkbox',
        key: 'enabled',
        label: '是否启用'
      },
      {
        type: 'checkbox',
        key: 'recommend',
        label: '是否推荐'
      }
    ]
  }
]

export default {
  data () {
    return {
      definitions: DEFINITIONS,
      selectedType: 0,
      // 表头
      columns: [
        {
          title: '通道',
          dataIndex: 'id',
          scopedSlots: { customRender: 'content' }
        },
        {
          title: '排序',
          dataIndex: 'sort'
        },
        {
          title: '状态',
          dataIndex: 'enabled',
          scopedSlots: { customRender: 'status' }
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
      finance.channel.list({ page: this.pagination.page }).then(data => {
        this.dataSource = data
      })
    },
    delete (record) {
      finance.channel.delete({ id: record.id }).then(data => {
        this.load()
      })
    },

    onSubmit (values, { id }, target) {
      finance.channel.save({ id, ...values }).then(data => {
        target && (target.visible = false)
        this.$message.success(id > 0 ? '编辑成功' : '添加成功')
        this.load()
      })
    },
    onDelete (it) {
      const content = '确认删除通道[' + it.name + ']？'
      this.$confirm({ title: '确认', content, onOk: () => this.delete(it) })
    }
  }
}
</script>
