<template>
  <page-view :title="false"
             :hasExtra="false">
    <div slot="headerContent">
      <div class="title">今日平台数据</div>
      <a-row :gutter="24">
        <a-col :sm="24"
               :md="12"
               :xl="3"
               :style="{ marginBottom: '24px' }">
          <div class="r-name">新增用户数</div>
          <div class="r-num">
            <countTo :startVal='oldData&&oldData.news'
                     :endVal='newData&&newData.news'
                     :duration='1500'
                     class="color-text"></countTo>
          </div>
        </a-col>
        <a-col :sm="24"
               :md="12"
               :xl="3"
               :style="{ marginBottom: '24px' }">
          <div class="r-name">首次登录用户数</div>
          <div class="r-num">
            <countTo :startVal='oldData&&oldData.firstLogin'
                     :endVal='newData&&newData.firstLogin'
                     :duration='1500'
                     class="color-text"></countTo>
          </div>
        </a-col>
        <a-col :sm="24"
               :md="12"
               :xl="3"
               :style="{ marginBottom: '24px' }">
          <div class="r-name">活跃人数</div>
          <div class="r-num">
            <countTo :startVal='oldData&&oldData.loginNum'
                     :endVal='newData&&newData.loginNum'
                     :duration='1500'
                     class="color-text"></countTo>
          </div>
        </a-col>
        <a-col :sm="24"
               :md="12"
               :xl="3"
               :style="{ marginBottom: '24px' }">
          <div class="r-name">实名认证人数</div>
          <div class="r-num">
            <countTo :startVal='oldData&&oldData.alipay'
                     :endVal='newData&&newData.alipay'
                     :duration='1500'
                     class="color-text"></countTo>
          </div>
        </a-col>
        <a-col :sm="24"
               :md="12"
               :xl="3"
               :style="{ marginBottom: '24px' }">
          <div class="r-name">看视频人数</div>
          <div class="r-num">
            <countTo :startVal='oldData&&oldData.advert'
                     :endVal='newData&&newData.advert'
                     :duration='1500'
                     class="color-text"></countTo>
          </div>
        </a-col>
        <a-col :sm="24"
               :md="12"
               :xl="3"
               :style="{ marginBottom: '24px' }">
          <div class="r-name">分享行为总次数</div>
          <div class="r-num">
            <countTo :startVal='oldData&&oldData.shareNum'
                     :endVal='newData&&newData.shareNum'
                     :duration='1500'
                     class="color-text"></countTo>
          </div>
        </a-col>
        <a-col :sm="24"
               :md="12"
               :xl="3"
               :style="{ marginBottom: '24px' }">
          <div class="r-name">分享行为用户数</div>
          <div class="r-num">
            <countTo :startVal='oldData&&oldData.share'
                     :endVal='newData&&newData.share'
                     :duration='1500'
                     class="color-text"></countTo>
          </div>
        </a-col>
        <a-col :sm="24"
               :md="12"
               :xl="3"
               :style="{ marginBottom: '24px' }">
          <div class="r-name">推广成功用户</div>
          <div class="r-num">
            <countTo :startVal='oldData&&oldData.invitationNum'
                     :endVal='newData&&newData.invitationNum'
                     :duration='1500'
                     class="color-text"></countTo>
          </div>
        </a-col>
      </a-row>
      <!-- <div class="color-text1">
        <countTo :startVal='startVal'
                 :endVal='endVal'
                 :duration='1500'
                 class="color-text"></countTo>
      </div> -->
    </div>

    <!-- content -->
    <div>
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
    </div>
  </page-view>
</template>

<script>
import { PageView } from '@/components/layouts'
import ZForm from '@/components/forms/Form'
import { STable } from '@/components'
import stat from '@/api/stat'
import moment from 'moment'
import countTo from 'vue-count-to'

const DEFINITIONS = [
  {
    type: 'inline',
    wrapperCol: { span: 12 },
    items: [
      // {
      //   type: 'select',
      //   key: 'os',
      //   title: '操作系统',
      //   placeholder: '操作系统',
      //   span: 12,
      //   labelCol: { span: 8 },
      //   wrapperCol: { span: 16 },
      //   options: [
      //     { label: '全部', value: 0 },
      //     { label: '安卓', value: 1 },
      //     { label: 'IOS', value: 2 }
      //   ]
      // }
    ]
  }
]

export default {
  components: { countTo, PageView, ZForm, STable },
  data () {
    return {
      timer: null,
      oldData: {},
      newData: {},
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
          title: '新增用户数',
          dataIndex: 'news'
        },
        {
          title: '首次登录人数',
          dataIndex: 'firstLogin'
        },
        {
          title: '实名认证人数',
          dataIndex: 'alipay'
        },
        {
          title: '看视频人数',
          dataIndex: 'advert'
        },
        {
          title: '分享行为总次数',
          dataIndex: 'shareNum'
        },
        {
          title: '分享行为用户数',
          dataIndex: 'share'
        },
        {
          title: '推广成功用户',
          dataIndex: 'invitationNum'
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
        pageSize: 10,
        beginTime: '',
        endTime: ''
      },
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        return stat.index.list({ ...this.queryParam, ...parameter }).then(data => {
          return data
        })
      }
    }
  },
  created () {
    this.load()
    this.realTime()
    if (this.timer) clearInterval(this.timer)
    // this.timer = setInterval(() => {
    //   this.realTime()
    // }, 3000)
  },
  destroyed () {
    if (this.timer) clearInterval(this.timer)
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      // 通过 `vm` 访问组件实例
      console.log(vm.timer)
      vm.timer = setInterval(() => {
        vm.realTime()
      }, 3000)
    })
  },
  beforeRouteLeave (to, from, next) {
    if (this.timer) clearInterval(this.timer)
    console.log('leave')
    next()
  },
  methods: {
    realTime () {
      stat.index.realTime().then(data => {
        this.oldData = this.newData
        this.newData = data
      })
    },
    load (parameter) {
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
.color-text {
  display: inline-block;
  font-size: 30px;
  line-height: 1;
  color: rgb(230, 16, 194);
}
</style>
