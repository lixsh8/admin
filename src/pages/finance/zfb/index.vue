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
      <!-- 头像 -->
      <div slot="avatar"
           slot-scope="text, it">
        <img alt="avatar"
             :src="it.user.avatar"
             style="width: 40px; height: 40px" />
      </div>
      <!-- 手机 -->
      <div slot="phone"
           slot-scope="text, it">
        {{it.user.phone}}
      </div>
      <!-- 省、市 -->
      <div slot="city"
           slot-scope="text, it">
        {{it.info.province}}{{it.info.city}}
      </div>
      <!-- 性别 -->
      <div slot="gender"
           slot-scope="text, it">
        {{it.info&&it.info.gender=='m'?'男':'女'}}
      </div>
      <!-- 是否实名 -->
      <div slot="is_certified"
           slot-scope="text, it">
        {{it.info&&it.info.is_certified=='T'?'是':'否'}}
      </div>
      <!-- 是否实名 -->
      <div slot="user_type"
           slot-scope="text, it">
        {{it.info&&it.info.user_type=='1'?'公司账户':'个人账户'}}
      </div>
      <!-- 状态 -->
      <div slot="user_status"
           slot-scope="text, it">
        {{it.info&&it.info.user_status=='T'?'正常':'不正常'}}
      </div>

      <span slot="action"
            slot-scope="text, it">
        <template>
          <a-popconfirm title="确认通过审核？"
                        @confirm="audit(it)"
                        v-auth:withdraw.audit><a>审核</a></a-popconfirm>
          <a-divider type="vertical"
                     v-auth:withdraw.remit />
          <a-popconfirm title="确认打款？"
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

const DEFINITIONS = [
  {
    type: 'inline',
    wrapperCol: { span: 24 },
    items: [
      {
        type: 'text',
        key: 'userId',
        title: '用户ID',
        placeholder: '用户ID',
        span: 8,
        labelCol: { span: 6 },
        wrapperCol: { span: 12 }
      },
      {
        type: 'text',
        key: 'nickname',
        title: '用户昵称',
        placeholder: '用户昵称',
        span: 8,
        labelCol: { span: 6 },
        wrapperCol: { span: 12 }
      }
      // ,
      // {
      //   type: 'select',
      //   key: 'channel',
      //   title: '绑定状态',
      //   placeholder: '绑定状态',
      //   span: 8,
      //   labelCol: { span: 6 },
      //   wrapperCol: { span: 12 },
      //   options: [
      //     { label: '支付宝', value: 0 },
      //     { label: '微信', value: 1 }
      //   ]
      // }
      // ,
      // {
      //   type: 'text',
      //   key: 'userId',
      //   title: '用户ID',
      //   placeholder: '用户ID',
      //   span: 12,
      //   labelCol: { span: 8 },
      //   wrapperCol: { span: 16 },
      // },
      // {
      //   type: 'text',
      //   key: 'sn',
      //   title: '订单号',
      //   placeholder: '订单号',
      //   span: 12,
      //   labelCol: { span: 8 },
      //   wrapperCol: { span: 16 },
      // }
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
          title: '支付宝UID',
          dataIndex: 'id'
        },
        {
          title: '用户ID',
          dataIndex: 'userId'
        },
        {
          title: '用户昵称',
          dataIndex: 'nickname'
        },
        {
          title: '绑定手机号',
          scopedSlots: { customRender: 'phone' }
        },
        // {
        //   title: '支付宝昵称',
        //   dataIndex: 'zfbnick'
        // },
        {
          title: '头像',
          scopedSlots: { customRender: 'avatar' }
        },
        {
          title: '省、市',
          scopedSlots: { customRender: 'city' }
        },
        {
          title: '用户类型',
          scopedSlots: { customRender: 'user_type' }
        },
        {
          title: '用户状态',
          scopedSlots: { customRender: 'user_status' }
        },
        {
          title: '是否实名',
          scopedSlots: { customRender: 'is_certified' }
        },
        {
          title: '性别',
          scopedSlots: { customRender: 'gender' }
        },
        // {
        //   title: '绑定状态',
        //   dataIndex: 'bindStatus'
        // },
        // {
        //   title: '绑定次数',
        //   dataIndex: 'bindNum'
        // },
        {
          title: '更新时间',
          dataIndex: 'updatedAt'
        }
        // ,
        // {
        //   title: '操作',
        //   dataIndex: 'action',
        //   width: '120px',
        //   fixed: 'right',
        //   scopedSlots: { customRender: 'action' }
        // }
      ],
      queryParam: {
        pageNo: 1,
        pageSize: 10
      },
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        return finance.zfb.list({ ...this.queryParam, ...parameter }).then(data => {
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
      console.log(parameter)
      this.queryParam = Object.assign(this.queryParam, parameter)
      this.$refs.table.refresh(true)
    }
  }
}
</script>

<style lang="less" scoped>
/deep/ .ant-table-tbody > tr > td {
  white-space: nowrap;
}
</style>
