<template>
  <a-card :bordered="false">

    <a-row type="flex"
           :gutter="48"
           align="middle">
      <a-col span="18">
        <z-form ref="form"
                :definitions="filters">
          <a-range-picker :ranges="ranges"
                          :value="createValue"
                          @change="createChange" />
        </z-form>
      </a-col>
      <a-col>
        <a-button type="primary"
                  @click="$refs.form.validate(load)">查 询</a-button>
        <a-button @click="reset"
                  style="margin-left: 16px">重 置</a-button>
      </a-col>
    </a-row>

    <br>

    <s-table
             class="data-sheet"
             ref="table"
             :scroll="{x: 1400}"
             size="default"
             :rowKey="(record) => record.date"
             :columns="columns"
             :data="loadData">
      <!-- 实际广告收入 -->
      <div slot="advertActualIncome"
           slot-scope="text, it">
        <a @click="$refs.modal.edit('编辑实际广告收益', it)">添加</a>
      </div>
    </s-table>

    <form-modal ref="modal"
                :definitions="definitionsForm"
                @submit="onSubmit" />
  </a-card>
</template>

<script>
// import ZForm from '@/components/forms/Form'
import finance from '@/api/finance'
import { STable } from '@/components'
import moment from 'moment'

const DEFINITIONS = [
  {
    type: 'inline',
    wrapperCol: { span: 24 },
    items: []
  }
]

const DEFINITIONSFORM = [
  {
    type: 'text',
    key: 'title',
    title: '实际广告收益',
    required: true,
    placeholder: true
  }
]

export default {
  components: { STable },
  // components: { ZForm },
  data () {
    return {
      createValue: [],
      definitionsForm: DEFINITIONSFORM,
      filters: DEFINITIONS,
      // 日期快捷按钮
      ranges: {
        '昨天': [moment(new Date()).add(-1, 'days'), moment(new Date()).add(-1, 'days')],
        '最近7天': [moment(new Date()).add(-7, 'days'), moment(new Date()).add(-1, 'days')],
        '最近30天': [moment(new Date()).add(-30, 'days'), moment(new Date()).add(-1, 'days')],
        '上周': [moment().week(moment().week() - 1).startOf('week'), moment().week(moment().week() - 1).endOf('week')],
        '本周': [moment().startOf('week'), moment().endOf('week')],
        '上月': [moment().month(moment().month() - 1).startOf('month'), moment().month(moment().month() - 1).endOf('month')],
        '本月': [moment().startOf('month'), moment().endOf('month')],
        '去年': [moment().year(moment().year() - 1).startOf('year'), moment().year(moment().year() - 1).endOf('year')],
        '今年': [moment().startOf('year'), moment().endOf('year')]
      },
      // 表头
      columns: [
        {
          title: '日期',
          dataIndex: 'date'
        },
        {
          title: '好友团广告补贴',
          dataIndex: 'advertActualIncome'
        },
        {
          title: '渠道广告补贴',
          dataIndex: 'advertActualIncome'
        },
        {
          title: '广告实际收入',
          // dataIndex: 'advertActualIncome',
          scopedSlots: { customRender: 'advertActualIncome' }
        },
        {
          title: '好友团补贴/实际收入',
          dataIndex: 'advertActualIncome'
        },
        {
          title: '合成猫补贴',
          dataIndex: 'advertEstimateIncome'
        },
        {
          title: '领取免费金币补贴',
          dataIndex: 'advertSubsidy'
        },
        {
          title: '升级红包补贴',
          dataIndex: 'agentAdvertSubsidy'
        },
        {
          title: '领取到余额的升级红包金额',
          dataIndex: 'agentAdvertSubsidy'
        },
        {
          title: '退休工资补贴',
          dataIndex: 'agentAdvertSubsidy'
        },
        {
          title: '限时退休分红补贴',
          dataIndex: 'agentAdvertSubsidy'
        },
        {
          title: '38级限时退休分红补贴',
          dataIndex: 'agentAdvertSubsidy'
        },
        {
          title: '单身猫回收补贴',
          dataIndex: 'agentAdvertSubsidy'
        },
        {
          title: '情侣猫合成补贴',
          dataIndex: 'agentAdvertSubsidy'
        },
        {
          title: '当日补贴总金额',
          dataIndex: 'agentAdvertSubsidy'
        },
        {
          title: '好友团划到余额数',
          dataIndex: 'agentAdvertSubsidy'
        },
        {
          title: '申请提现金额',
          dataIndex: 'agentAdvertSubsidy'
        },
        {
          title: '提现打款金额',
          dataIndex: 'agentAdvertSubsidy'
        },
        {
          title: '打款金额/实际收入',
          dataIndex: 'agentAdvertSubsidy'
        },
        {
          title: '截止当天好友团资产剩余',
          dataIndex: 'agentAdvertSubsidy'
        },
        {
          title: '截止当天渠道资产剩余',
          dataIndex: 'agentAdvertSubsidy'
        },
        {
          title: '截止当天余额资产剩余',
          dataIndex: 'agentAdvertSubsidy'
        },
        {
          title: '截止当天资产总剩余',
          dataIndex: 'agentAdvertSubsidy'
        }
      ],
      queryParam: {
        pageNo: 1,
        pageSize: 10,
        beginTime: '',
        endTime: ''
      },
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        return finance.stat.list({ ...this.queryParam, ...parameter }).then(data => {
          return data
        })
      }
    }
  },
  created () {
    this.load()
  },
  methods: {
    load (parameter) {
      console.log(parameter)
      this.queryParam = Object.assign(this.queryParam, parameter)
      this.$refs.table && this.$refs.table.refresh(true)
    },
    createChange (dates, dateStrings) {
      this.createValue = dates;
      this.queryParam.beginTime = dateStrings[0]
      this.queryParam.endTime = dateStrings[1]
    },
    reset () {
      this.createValue = []
      if (this.queryParam.beginTime) {
        delete this.queryParam.beginTime
      }
      if (this.queryParam.endTime) {
        delete this.queryParam.endTime
      }
      this.$refs.form.reset()
    }
  }
}
</script>

<style lang="less" scoped>
/deep/ .ant-table-tbody > tr > td {
  white-space: nowrap;
}
</style>
