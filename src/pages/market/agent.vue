
<template>
  <a-card :bordered="false">
    <div align="right"
         v-auth:agent.add>
      <a-button type="primary"
                icon="plus"
                @click="$refs.modal.show('新建', {})">新建</a-button>
    </div>
    <br />
    <s-table class="data-sheet"
             ref="table"
             :scroll="{x: 1400}"
             size="default"
             :rowKey="(record) => record.userId"
             :columns="columns"
             :data="loadData">
      <div slot="auth"
           slot-scope="text, record">
        {{record.isAuth===1?"是":"否"}}
      </div>
    </s-table>
    <form-modal ref="modal"
                :definitions="definitions"
                @submit="onSubmit" />
  </a-card>
</template>

<script>
import manage from '@/api/manage'
import { STable } from '@/components'

const DEFINITIONS = [
  {
    type: 'text',
    key: 'userId',
    title: '用户id',
    required: true,
    placeholder: '请输入用户id',
    rules: [{ required: true, message: '请输入用户id' }]
  }
]

export default {
  components: { STable },
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
          dataIndex: 'memberCount'
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
        }
        // ,
        // {
        //   title: '操作',
        //   dataIndex: 'action',
        //   width: '120px',
        //   scopedSlots: { customRender: 'action' }
        // }
      ],
      queryParam: {
        pageNo: 1,
        pageSize: 10
      },
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        return manage.agent.list({ ...this.queryParam, ...parameter }).then(data => {
          return data
        })
      }
    }
  },
  created () {
    // this.load()
    // console.log(this.$store.getters.permissions['market/agent'])
  },
  methods: {
    load (parameter) {
      console.log(parameter)
      this.queryParam = Object.assign(this.queryParam, parameter)
      this.$refs.table && this.$refs.table.refresh(true)
    },
    onDelete ({ itemId }) {
      manage.agent.delete({ itemId }).then(data => {
        this.load()
      })
    },

    onSubmit (values, { userId }, target) {
      manage.agent.save({ userId, ...values }).then(data => {
        target.visible = false
        this.$message.success(userId > 0 ? '编辑成功' : '添加成功')
        this.load()
      })
    }
  }
}
</script>
