<template>
  <a-card :bordered="false">
    <z-form ref="form"
            layout="inline"
            :definitions="filters"
            @submit="load"
            justify="start" />

    <br />
    <s-table ref="table"
             size="default"
             :scroll="{ x: 1400 }"
             :rowKey="(record) => record.id"
             :columns="columns"
             :data="loadData">
      <div slot="user"
           slot-scope="text, it">
        <a-row type="flex"
               :gutter="15"
               align="middle">
          <a-col>
            <img alt="avatar"
                 :src="it.avatar"
                 style="width: 40px; height: 40px" />
          </a-col>
          <a-col>
            <b> #{{ it.id }} <br> {{ it.nickname }}<span v-if="it.isIdentified">(已实名)</span></b>
            <br> {{ it.pin }}
          </a-col>
        </a-row>
      </div>
      <div slot="avatar"
           slot-scope="text, it">
        <img alt="avatar"
             :src="it.avatar"
             style="width: 40px; height: 40px" />
      </div>

      <div slot="contact"
           slot-scope="text, it">
        <div v-if="it.phone">手机：{{ it.phone }}</div>
        <div v-if="it.email">邮箱：{{ it.email }}</div>
      </div>

      <div slot="info"
           slot-scope="text, it">
        <span v-if="it.realname">{{ it.realname }}</span>
        <span v-if="it.sex">{{ it.sex }}</span>
      </div>

      <div slot="register"
           slot-scope="text, it">
        <div>{{ ENDPOINTS[it.registerEndpoint] }}</div>
        <div>{{ it.registerIp }}</div>
        <div>{{ it.registerAt }}</div>
      </div>

      <div slot="first"
           slot-scope="text, it">
        <div>{{ ENDPOINTS[it.firstLoginEndpoint] }}</div>
        <div>{{ it.firstLoginIp }}</div>
        <div>{{ it.firstLoginAt }}</div>
      </div>

      <div slot="last"
           slot-scope="text, it">
        <div>{{ ENDPOINTS[it.lastLoginEndpoint] }}</div>
        <div>{{ it.lastLoginIp }}</div>
        <div>{{ it.lastLoginAt }}</div>
      </div>

      <span slot="action"
            slot-scope="text, it">
        <template>
          <!-- <a @click="onDetail(it, 'invite')">邀请关系</a> -->
          <a-button type="primary"
                    ghost
                    size="small"
                    @click="onDetail(it, 'invite')">邀请关系</a-button>
          <div class="pt"></div>
          <!-- <a-divider type="vertical" /> -->
          <!-- <a @click="onDetail(it, 'property')">用户资产</a> -->
          <a-button type="danger"
                    ghost
                    size="small"
                    @click="onDetail(it, 'property')">用户资产</a-button>
          <div class="pt"></div>
          <!-- <a-divider type="vertical" /> -->
          <!-- <a @click="onDetail(it, 'stat')">数据统计</a> -->
          <a-button type="primary"
                    ghost
                    size="small"
                    @click="onDetail(it, 'stat')">数据统计</a-button>
          <div class="pt"></div>
          <!-- <a-divider type="vertical" /> -->
          <!-- <a @click="$refs.modalBlack.show('确认拉黑？', it)">拉黑</a> -->
          <a-button type="danger"
                    ghost
                    size="small"
                    @click="$refs.modalBlack.show('确认拉黑？', it)">拉黑</a-button>
        </template>
      </span>
    </s-table>

    <form-modal ref="modalBlack"
                :definitions="blackFields"
                @submit="onBlack"
                layout="vertical" />

    <!-- 弹窗 -->
    <a-modal width='70%'
             :title="modalTitle"
             :visible="visible"
             @ok="handleOk"
             :confirmLoading="confirmLoading"
             @cancel="handleCancel">

      <s-table ref="tableModal"
               size="default"
               :showPagination="showPagination"
               :rowKey="(record) => record.userId"
               :columns="columnsCommon"
               :data="loadDataCommon">
        <!-- 邀请关系 -->
        <span slot="user"
              slot-scope="text, it">{{it.user.nickname}}</span>
        <span slot="directInviterId"
              slot-scope="text, it">
          <a @click="userDetail(it.directInviterId)"
             v-if="it.directInviterId>0">{{it.directInviterId}}</a>
          <span v-else>无</span>
        </span>
        <span slot="spreadInviterId"
              slot-scope="text, it">
          <a @click="userDetail(it.spreadInviterId)"
             v-if="it.spreadInviterId>0">{{it.spreadInviterId}}</a>
          <span v-else>无</span>
        </span>
        <span slot="agentId"
              slot-scope="text, it">
          <!-- <a href=""
             @click="userDetail(it.agentId)"
             v-if="it.isAgent==1">{{it.agentId}}</a> -->
          <span v-if="it.isAgent==1">{{it.agentId}}</span>
          <span v-else>无</span>
        </span>
        <!-- 资产 -->
        <span slot="alipay"
              slot-scope="text, it">{{it.alipay==''?"未绑定":it.alipay}}</span>
        <span slot="withdraw"
              slot-scope="text, it">{{it.income[0].amount}}</span>
        <span slot="withdraw"
              slot-scope="text, it">{{it.withdrawal.amount}}</span>
      </s-table>

    </a-modal>

    <form-modal ref="modal"
                :cancelBtn="false"
                submitBtnText="关 闭"
                :definitions="definitions"
                @submit="onSubmit" />
  </a-card>
</template>

<script>
import user from '@/api/user'
import { STable } from '@/components'

const DEFINITIONS = [
  {
    type: 'text',
    key: 'alipay',
    title: '支付宝账号',
    readonly: 'readonly'
  },
  {
    type: 'text',
    key: 'balance',
    title: '账户余额',
    readonly: 'readonly'
  },
  {
    type: 'text',
    key: 'income',
    title: '累计收益',
    readonly: 'readonly'
  },
  {
    type: 'text',
    key: 'withdrawal',
    title: '累计提现',
    readonly: 'readonly'
  },
  {
    type: 'text',
    key: 'withdrawal',
    title: '好友团累计收益',
    readonly: 'readonly'
  },
  {
    type: 'text',
    key: 'withdrawal',
    title: '渠道累计收益',
    readonly: 'readonly'
  },
  {
    type: 'text',
    key: 'withdrawal',
    title: '当前积分',
    readonly: 'readonly'
  },
  {
    type: 'text',
    key: 'withdrawal',
    title: '累计积分',
    readonly: 'readonly'
  }
]

const DEFINITIONS_STAT = [
  {
    type: 'text',
    key: 'advert',
    title: '看广告次数',
    readonly: 'readonly'
  },
  {
    type: 'text',
    key: 'direct_num',
    title: '直接好友人数',
    readonly: 'readonly'
  },
  {
    type: 'text',
    key: 'spread_num',
    title: '间接好友人数',
    readonly: 'readonly'
  },
  {
    type: 'text',
    key: 'agent_num',
    title: '渠道好友人数',
    readonly: 'readonly'
  }
]

export default {
  components: {
    STable
  },
  data () {
    return {
      definitions: DEFINITIONS,
      ENDPOINTS: {
        0: '',
        100: '网页浏览器',

        10100: '安卓网页浏览器',
        10001: '安卓应用',
        10201: '安卓微信客户端',

        20100: 'iOS网页浏览器',
        20001: 'iOS应用',
        20201: 'iOS微信客户端'
      },
      filters: [
        {
          type: 'number',
          key: 'id',
          title: '用户ID',
          min: 1
          // span: 8,
        },
        {
          type: 'text',
          key: 'name',
          title: '用户邀请码'
          // span: 8,
        },
        {
          type: 'text',
          key: 'phone',
          title: '微信昵称'
          // span: 8,
        },
        {
          type: 'text',
          key: 'phone',
          title: '直接邀请人ID'
          // span: 8,
        },
        {
          type: 'inline',
          // span: 8,
          items: [
            { type: 'submit' },
            { type: 'reset' }
          ]
        }
      ],
      blackFields: [
        {
          type: 'textarea',
          key: 'reason',
          title: '拉黑原因',
          required: true,
          placeholder: true
        }
      ],
      // 表头
      columns: [
        {
          title: '用户',
          scopedSlots: { customRender: 'user' } // id, name, avatar
        },
        {
          title: '邀请码',
          // dataIndex: 'id'
          customRender: (text, it) => { return it.id }
        },
        {
          title: '联系方式',
          dataIndex: 'phone',
          scopedSlots: { customRender: 'contact' } // phone, email
        },
        {
          title: '注册来源/IP/时间',
          scopedSlots: { customRender: 'register' }
        },
        {
          title: '首次登录来源/IP/时间',
          // dataIndex: 'email',
          scopedSlots: { customRender: 'first' }
        },
        {
          title: '最后一次登录来源/IP/时间',
          // dataIndex: 'id',
          scopedSlots: { customRender: 'last' }
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
      queryParam2: {
        pageNo: 1,
        pageSize: 10
      },
      queryParam3: {
      },
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        return user.list({ ...this.queryParam, ...parameter }).then(data => {
          return data
        })
      },
      // 加载数据方法 必须为 Promise 对象
      userId: 0,
      showPagination: true,
      loadData2: parameter => {
        return user.invite.list({ ...this.queryParam2, ...parameter, userId: this.userId }).then(data => {
          return data
        })
      },

      // 弹窗
      modalTitle: '弹窗',
      visible: false,
      confirmLoading: false,
      // 公用
      columnsCommon: [],
      dataCommon: [],
      paginationCommon: true,
      loadDataCommon: null,
      // 邀请关系列表
      // 表头
      columnsInvite: [
        {
          title: '用户ID',
          dataIndex: 'userId'
        },
        {
          title: '用户昵称',
          scopedSlots: { customRender: 'user' }
        },
        {
          title: '直接邀请人ID',
          scopedSlots: { customRender: 'directInviterId' }
        },
        {
          title: '间接邀请人ID',
          scopedSlots: { customRender: 'spreadInviterId' }
        },
        {
          title: '渠道ID',
          scopedSlots: { customRender: 'agentId' }
        },
        {
          title: '邀请时间',
          dataIndex: 'createdAt'
        }
      ]
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

    onBlack (values, { id }, target) {
      user.checklist.save({ userId: id, type: 1, ...values }).then(data => {
        target.visible = false
        this.$message.success('拉黑成功')
        // this.load()
      })
    },

    onDetail (it, type) {
      if (type === 'invite') {
        this.userId = it.id
        this.$nextTick(() => {
          this.$refs.tableModal && this.$refs.tableModal.refresh(true)
          this.modalTitle = '邀请关系'
          // this.loadDataCommon = this.loadData2
          this.columnsCommon = this.columnsInvite

          this.loadDataCommon = parameter => {
            return user.invite.list({ ...this.queryParam2, ...parameter, userId: this.userId }).then(data => {
              return data
            })
          }
        })
        this.showModal()
      } else if (type === 'property') {
        this.definitions = DEFINITIONS
        this.userId = it.id
        user.property.list({ userId: this.userId }).then(data => {
          this.$refs.modal.edit('用户资产', data)
        })
      } else {
        this.definitions = DEFINITIONS_STAT
        this.userId = it.id
        user.stat.list({ userId: this.userId }).then(data => {
          this.$refs.modal.edit('数据统计', data)
        })
      }
    },
    onSubmit () {
      this.$refs.modal.visible = false
    },
    // 查看用户
    userDetail (id) {
      this.visible = false
      this.load({ id: id })
    },
    // 显示弹窗
    showModal () {
      this.visible = true;
    },
    handleOk (e) {
      this.confirmLoading = true;
      setTimeout(() => {
        this.visible = false;
        this.confirmLoading = false;
      }, 2000);
    },
    handleCancel (e) {
      console.log('Clicked cancel button');
      this.visible = false;
    }
  }
}
</script>

<style lang="less" scoped>
.ant-table td {
  white-space: nowrap;
}
.pt {
  height: 8px;
}
</style>
