<template>
  <a-card :bordered="false">

    <!-- <a-row type="flex" :gutter="48" align="middle">
      <a-col span="18">
        <z-form ref="form" :definitions="filters" />
      </a-col>
      <a-col>
        <a-button type="primary" @click="$refs.form.validate(load)">查 询</a-button>
        <a-button @click="$refs.form.reset()" style="margin-left: 16px">重 置</a-button>
      </a-col>
    </a-row> -->

    <!-- <br> -->

    <a-table
      class="data-sheet"
      ref="table"
      rowKey="date"
      :scroll="{x: 1400}"
      :columns="columns"
      :dataSource="dataSource"
      :pagination="pagination">

    </a-table>
  </a-card>
</template>

<script>
// import ZForm from '@/components/forms/Form'
import finance from '@/api/finance'

export default {
  // components: { ZForm },
  data () {
    return {
      // 表头
      columns: [
        {
          title: '日期',
          dataIndex: 'date'
        },
        {
          title: '代理广告补贴',
          dataIndex: 'agentAdvertSubsidy'
        },
        {
          title: '团队广告补贴',
          dataIndex: 'teamAdvertSubsidy'
        },
        {
          title: '合成补贴',
          dataIndex: 'mergeSubsidy'
        },
        {
          title: '领取免费金币补贴',
          dataIndex: 'freeCoinSubsidy'
        },
        {
          title: '升级红包补贴',
          dataIndex: 'upgradeRewardSubsidy'
        },
        {
          title: '已领取的升级红包',
          dataIndex: 'upgradeRewardCollectedAmount'
        },
        {
          title: '每日分红补贴',
          dataIndex: 'bonusItemSubsidy'
        },
        {
          title: '限时分红补贴',
          dataIndex: 'luckyItemSubsidy'
        },
        {
          title: '回收物品补贴',
          dataIndex: 'moneyItemSubsidy'
        },
        {
          title: '情侣合成补贴',
          dataIndex: 'loverItemSubsidy'
        },
        {
          title: '当日补贴总金额',
          dataIndex: 'subsidy'
        },

        {
          title: '团队阶段奖励领取金额',
          dataIndex: 'teamRewardCollectedAmount'
        },
        {
          title: '团队阶段奖励生成金额',
          dataIndex: 'teamRewardGeneratedAmount'
        },
        {
          title: '团队资产剩余',
          dataIndex: 'teamRemainingAmount'
        },
        {
          title: '代理阶段奖励领取金额',
          dataIndex: 'agentRewardCollectedAmount'
        },
        {
          title: '代理阶段奖励生成金额',
          dataIndex: 'agentRewardGeneratedAmount'
        },
        {
          title: '代理资产剩余',
          dataIndex: 'agentRemainingAmount'
        },
        {
          title: '提现手续费',
          dataIndex: 'withdrawFeeAmount'
        },
        {
          title: '提现申请金额',
          dataIndex: 'withdrawApplyAmount'
        },
        {
          title: '提现打款金额',
          dataIndex: 'withdrawRemitAmount'
        },
        {
          title: '余额资产剩余',
          dataIndex: 'balance'
        }
      ],
      dataSource: [],
      pagination: {
        current: 1,
        pageSize: 50
      },
      params: {}
    }
  },
  created () {
    this.load()
  },
  methods: {
    load (values) {
      if (values) {
        this.params = values
      }
      finance.stat.list({ ...this.pagination, ...this.params }).then(data => {
        this.dataSource = data
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
