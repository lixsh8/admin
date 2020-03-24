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
        <!-- <a-button @click="$refs.form.reset()" -->
        <a-button @click="reset"
                  style="margin-left: 16px">重 置</a-button>
      </a-col>
    </a-row>

    <br>

    <s-table class="data-sheet"
             ref="table"
             :scroll="{x: 1400}"
             size="default"
             :rowKey="(record) => record.date"
             :columns="columns"
             :data="loadData">
    </s-table>
  </a-card>
</template>

<script>
// import ZForm from '@/components/forms/Form'
import { STable } from '@/components'
import finance from '@/api/finance'
import moment from 'moment'

const DEFINITIONS = [
  {
    type: 'inline',
    wrapperCol: { span: 24 },
    items: [
      // {
      //   type: 'text',
      //   key: 'start',
      //   title: '开始日期',
      //   placeholder: '开始日期',
      //   span: 12,
      //   labelCol: { span: 8 },
      //   wrapperCol: { span: 16 }
      // },
      // {
      //   type: 'date',
      //   key: 'end',
      //   title: '结束日期',
      //   placeholder: '结束日期',
      //   span: 12,
      //   labelCol: { span: 8 },
      //   wrapperCol: { span: 16 }
      // }
    ]
  }
]

export default {
  components: { STable },
  data () {
    return {
      createValue: [],
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
          title: '广告费总收入',
          dataIndex: 'advertActualIncome'
        },
        {
          title: '补贴总支出',
          dataIndex: 'subsidy'
        },
        {
          title: '广告费总支出',
          dataIndex: 'advertSubsidy'
        },
        {
          title: '申请提现总额',
          dataIndex: 'withdrawApplyAmount'
        },
        {
          title: '实际提现总额',
          dataIndex: 'withdrawRemitAmount'
        },
        {
          title: '广告费百分比',
          dataIndex: 'advertRate'
        },
        {
          title: '提现百分比',
          dataIndex: 'withdrawRate'
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
        return finance.summary.list({ ...this.queryParam, ...parameter }).then(data => {
          return data
        })
      }
    }
  },
  created () {
    // this.load()
  },
  methods: {
    // load (values) {
    //   if (values) {
    //     this.params = values
    //   }
    //   finance.summary.list({ ...this.pagination, ...this.params }).then(data => {
    //     this.dataSource = data
    //   })
    // }
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
