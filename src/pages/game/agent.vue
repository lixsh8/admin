
<template>
  <a-card :bordered="false">
    <div align="right">
      <a-button type="primary"
                icon="plus"
                @click="$refs.modal.show('新建', {})">新建</a-button>
    </div>
    <br />

    <a-table ref="table"
             rowKey="userId"
             :columns="columns"
             :dataSource="dataSource"
             :pagination="pagination">
      <div slot="auth"
           slot-scope="text, record">
        {{record.isAuth===1?"是":"否"}}
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
    key: 'memberCount',
    title: '下线好友数',
    required: true,
    placeholder: '请输入下线好友数',
    rules: [{ required: true, message: '请输入下线好友数' }]
  },
  {
    type: 'text',
    key: 'currentProfit',
    title: '当前收益',
    required: true,
    placeholder: '请输入当前收益',
    rules: [{ required: true, message: '请输入当前收益' }]
  },
  {
    type: 'text',
    key: 'historyProfit',
    title: '历史总收益',
    required: true,
    placeholder: '请输入历史总收益',
    rules: [{ required: true, message: '请输入历史总收益' }]
  },
  {
    type: 'text',
    key: 'target',
    title: '目标',
    required: true,
    placeholder: '请输入目标',
    rules: [{ required: true, message: '请输入目标' }]
  },
  {
    type: 'text',
    key: 'showRate',
    title: '展示比率',
    required: true,
    placeholder: '请输入展示比率',
    rules: [{ required: true, message: '请输入展示比率' }]
  },
  {
    type: 'text',
    key: 'realRate',
    title: '实际比率',
    placeholder: '请输入实际比率',
    rules: [{ required: true, message: '请输入实际比率' }]
  },
  {
    type: 'text',
    key: 'isAuth',
    title: '是否授权蜂群',
    placeholder: '请输入是否授权蜂群',
    rules: [{ required: true, message: '请输入是否授权蜂群' }]
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
          dataIndex: 'userId'
        },
        {
          title: '下线好友数',
          dataIndex: 'memberCount',
        },
        {
          title: '当前收益',
          dataIndex: 'currentProfit'
        },
        {
          title: '历史总收益',
          dataIndex: 'historyProfit'
        },
        {
          title: '目标',
          dataIndex: 'target'
        },
        {
          title: '展示比率',
          dataIndex: 'showRate'
        },
        {
          title: '实际比率',
          dataIndex: 'realRate'
        },
        {
          title: '是否授权蜂群',
          dataIndex: 'isAuth',
          scopedSlots: { customRender: 'auth' }
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
      manage.agent.list(this.pagination.page).then(data => {
        this.dataSource = data
      })
    },
    onDelete ({ itemId }) {
      manage.agent.delete({ itemId }).then(data => {
        this.load()
      })
    },

    onSubmit (values, { itemId }, target) {
      manage.agent.save({ itemId, ...values }).then(data => {
        target.visible = false
        this.$message.success(itemId > 0 ? '编辑成功' : '添加成功')
        this.load()
      })
    }
  }
}
</script>
