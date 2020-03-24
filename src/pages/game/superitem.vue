<template>
  <a-card :bordered="false">
    <!-- <div align="right">
      <a-button type="primary"
                icon="plus"
                @click="$refs.modal.show('新建合成物', {})">新建合成物</a-button>
    </div> -->
    <br />

    <a-table ref="table"
             rowKey="itemId"
             :columns="columns"
             :dataSource="dataSource"
             :pagination="pagination">
      <div slot="content"
           slot-scope="text, record">
        <img alt="image"
             :src="record.image"
             style="max-width: 100px; max-height: 100px" />
      </div>
      <span slot="action"
            slot-scope="text, it">
        <template>
          <a @click="$refs.modal.edit('编辑合成物', it)">编辑</a>
          <!-- <a-divider type="vertical" /> -->
          <!-- <a-popconfirm title="确认删除？"
                        @confirm="onDelete(it)"><a>删除</a></a-popconfirm> -->
        </template>
      </span>

    </a-table>
    <form-modal ref="modal"
                :definitions="definitions"
                @submit="onSubmit" />
  </a-card>
</template>

<script>
import manage from '@/api/manage'

const DEFINITIONS = [
  {
    type: 'text',
    key: 'name',
    title: '合成物名称',
    required: true,
    placeholder: '请输入合成物名称',
    rules: [{ required: true, message: '请输入合成物名称' }]
  },
  {
    type: 'text',
    key: 'level',
    readonly: 'readonly',
    title: '合成物等级',
    placeholder: '请输入合成物等级'
  },
  {
    type: 'image',
    key: 'image',
    title: '图片',
    required: true,
    imagePath: 'link'
  },
  {
    type: 'text',
    key: 'chance',
    title: '概率',
    placeholder: '请输入概率',
    rules: [{ required: true, message: '请输入概率' }]
  },
  {
    type: 'textarea',
    key: 'desc',
    title: '描述',
    placeholder: '请输入描述'
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
          dataIndex: 'itemId'
        },
        {
          title: '图片',
          dataIndex: 'image',
          scopedSlots: { customRender: 'content' }
        },
        {
          title: '合成物等级',
          dataIndex: 'level'
        },
        {
          title: '合成物名称',
          dataIndex: 'name'
        },
        {
          title: '概率',
          dataIndex: 'chance'
        },
        {
          title: '来源',
          dataIndex: 'sources'
        },
        {
          title: '描述',
          dataIndex: 'desc'
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
      manage.superitem.list(this.pagination.page).then(data => {
        this.dataSource = data
      })
    },
    onDelete ({ itemId }) {
      manage.superitem.delete({ itemId }).then(data => {
        this.load()
      })
    },

    onSubmit (values, { itemId }, target) {
      manage.superitem.save({ itemId, ...values }).then(data => {
        target.visible = false
        this.$message.success(itemId > 0 ? '编辑成功' : '添加成功')
        this.load()
      })
    }
  }
}
</script>
