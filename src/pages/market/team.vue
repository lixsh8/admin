<template>
  <a-card :bordered="false">
    <!--
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
      <a-button @click="$refs.form.reset()"
                style="margin-left: 16px">重 置</a-button>
    </a-col>
    </a-row> -->
    <br>

    <s-table ref="table"
             size="default"
             :rowKey="(record) => record.id"
             :columns="columns"
             :data="loadData">
      <div slot="order"
           slot-scope="text, it">
        #{{it.id}} <br> SN: {{it.sn}}
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
import { STable } from '@/components'
import manage from '@/api/manage'
import moment from 'moment'

const DEFINITIONS = [
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
          title: '#',
          dataIndex: 'userId'
        },
        {
          title: '当前收益',
          dataIndex: 'currentProfit'
        },
        {
          title: '历史收益',
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
        return manage.team.list({ ...this.queryParam, ...parameter }).then(data => {
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
