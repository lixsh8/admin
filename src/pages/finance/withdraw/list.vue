<template>
  <a-card :bordered="false">

    <a-row type="flex"
           :gutter="48"
           align="middle">
      <a-col span="18">
        <z-form ref="form"
                :definitions="filters" />
      </a-col>
      <a-col>
        <a-button type="primary"
                  @click="$refs.form.validate(load)">查 询</a-button>
        <a-button @click="$refs.form.reset()"
                  style="margin-left: 16px">重 置</a-button>
      </a-col>
    </a-row>

    <br>

    <s-table class="data-sheet"
             ref="table"
             :scroll="{x: 1400}"
             size="default"
             :rowKey="(record) => record.id"
             :columns="columns"
             :data="loadData">
      <div slot="order"
           slot-scope="text, it">
        #{{ it.id }} <br> SN: {{ it.sn }}
      </div>

      <div slot="result"
           slot-scope="text, it">
        <div v-if="it.state === 3">
          付款单号：{{ it.remitOrderNo }} <br />
          打款时间：{{ it.remitAt }}
        </div>
        <a-tooltip v-if="it.state === 4">
          <template slot="title">
            {{ it.errorDesc }}
          </template>
          <span v-if="it.errorCode">[{{ it.errorCode }}]</span> {{ it.rejectReason }}
        </a-tooltip>
      </div>

      <span slot="action"
            slot-scope="text, it">
        <template>
          <a-popconfirm title="确认通过审核？"
                        v-if="it.state==0"
                        @confirm="audit(it)"
                        v-auth:withdraw.audit><a>审核</a></a-popconfirm>
          <!-- <a-divider type="vertical"
                     v-if="it.state==2"
                     v-auth:withdraw.remit /> -->
          <a-popconfirm title="确认打款？"
                        v-if="it.state==2"
                        @confirm="remit(it)"
                        v-auth:withdraw.remit><a>打款</a></a-popconfirm>
        </template>
      </span>

    </s-table>
  </a-card>
</template>

<script>
import ZForm from '@/components/forms/Form'
import { STable } from '@/components'
import finance from '@/api/finance'

const STATES = ['提现中', '待审核', '审核通过', '提现成功', '提现失败']
const CHANNELS = ['', '支付宝', '微信']

const DEFINITIONS = [
  {
    type: 'inline',
    wrapperCol: { span: 24 },
    items: [
      {
        type: 'select',
        key: 'state',
        title: '提现状态',
        placeholder: '提现状态',
        span: 12,
        labelCol: { span: 8 },
        wrapperCol: { span: 16 },
        options: [
          { label: '提现中', value: 0 },
          { label: '待审核', value: 1 },
          { label: '审核通过', value: 2 },
          { label: '提现成功', value: 3 },
          { label: '提现失败', value: 4 }
        ]
      },
      {
        type: 'select',
        key: 'channel',
        title: '提现通道',
        placeholder: '提现通道',
        span: 12,
        labelCol: { span: 8 },
        wrapperCol: { span: 16 },
        options: [
          { label: '支付宝', value: 1 },
          { label: '微信', value: 2 }
        ]
      },
      {
        type: 'text',
        key: 'userId',
        title: '用户ID',
        placeholder: '用户ID',
        span: 12,
        labelCol: { span: 8 },
        wrapperCol: { span: 16 }
      },
      {
        type: 'text',
        key: 'sn',
        title: '订单号',
        placeholder: '订单号',
        span: 12,
        labelCol: { span: 8 },
        wrapperCol: { span: 16 }
      }
    ]
  }
]

export default {
  components: { ZForm, STable },
  data () {
    return {
      filters: DEFINITIONS,
      // 表头
      columns: [
        {
          title: '#',
          dataIndex: 'id'
        },
        {
          title: '用户ID',
          dataIndex: 'userId'
        },
        {
          title: 'SN',
          dataIndex: 'sn'
        },
        {
          title: '金额',
          dataIndex: 'amount'
        },
        {
          title: '手续费',
          dataIndex: 'fee'
        },
        {
          title: '提现账号',
          dataIndex: 'account'
        },
        {
          title: '提现通道',
          dataIndex: 'channel',
          customRender: (_, it) => CHANNELS[it.channel]
        },
        {
          title: 'IP',
          dataIndex: 'ip'
        },
        {
          title: '状态',
          dataIndex: 'state',
          customRender: (_, it) => STATES[it.state]
        },
        {
          title: '提现结果',
          scopedSlots: { customRender: 'result' }
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
          fixed: 'right',
          scopedSlots: { customRender: 'action' }
        }
      ],
      queryParam: {
        pageNo: 1,
        pageSize: 10
      },
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        return finance.withdraw.list({ ...this.queryParam, ...parameter }).then(data => {
          return data
        })
      }
    }
  },
  created () {
    // this.load()
  },
  methods: {
    load (parameter) {
      this.queryParam = Object.assign(this.queryParam, parameter)
      this.$refs.table.refresh(true)
    },
    audit ({ id }) {
      finance.withdraw.audit({ id }).then(data => {
        this.load()
      })
    },
    remit ({ id }) {
      finance.withdraw.remit({ id }).then(data => {
        this.load()
      })
    }
  }
}
</script>

<style lang="less" scoped>
/deep/ .ant-table-tbody > tr > td {
  white-space: nowrap;
}
</style>
