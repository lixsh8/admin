<template>
  <a-card :bordered="false">
    <!-- <a-row type="flex"
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

    <a-table class="data-sheet"
             ref="table"
             :rowKey="(record,index) => index"
             :scroll="{x: 1400}"
             :columns="columns"
             :dataSource="dataSource"
             :pagination="pagination">
      <div slot="target"
           slot-scope="text, it">
        {{it.target_text}} <br> 目标: {{it.target}}
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

    </a-table>
  </a-card>
</template>

<script>
// import ZForm from '@/components/forms/Form'
import manage from '@/api/manage'
import moment from 'moment'

const DEFINITIONS = [
]

export default {
  // components: { ZForm },
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
          title: '目标',
          scopedSlots: { customRender: 'target' }
        },
        {
          title: '展示比率',
          dataIndex: 'show_rate'
        },
        {
          title: '真实比率',
          dataIndex: 'real_rate'
        }
      ],
      dataSource: [],
      pagination: {
        current: 1,
        pageSize: 50
      },
      params: {
      }
    }
  },
  created () {
    this.load()
  },
  methods: {
    load (values) {
      if (values) {
        this.params = { ...this.params, ...values }
      }
      manage.teamTarget.list({ ...this.pagination, ...this.params }).then(data => {
        this.dataSource = data
      })
    },
    createChange (dates, dateStrings) {
      this.createValue = dates;
      this.params.beginTime = dateStrings[0]
      this.params.endTime = dateStrings[1]
    },
    reset () {
      this.createValue = []
      if (this.params.beginTime) {
        delete this.params.beginTime
      }
      if (this.params.endTime) {
        delete this.params.endTime
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
