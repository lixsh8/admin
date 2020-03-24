<template>
  <a-card :bordered="false">

    <a-row type="flex"
           :gutter="48"
           align="middle">
      <a-col>
        <a-radio-group v-model="selectedType"
                       @change="loadChecklist()"
                       buttonStyle="solid">
          <a-radio-button :value="1">黑名单</a-radio-button>
          <a-radio-button :value="2">测试用户</a-radio-button>
          <!-- <a-radio-button :value="3">外部测试用户</a-radio-button> -->
        </a-radio-group>
      </a-col>
      <a-col>
        <z-form ref="form"
                layout="inline"
                :definitions="filters"
                style="display: inline-block;" />
      </a-col>
      <a-col>
        <a-button type="primary"
                  @click="$refs.form.validate(loadChecklist)">确 定</a-button>
        <a-button @click="$refs.form.reset()"
                  style="margin-left: 16px">重 置</a-button>
      </a-col>
    </a-row>

    <br>

    <s-table
             ref="table"
             size="default"
             :rowKey="(record) => record.id"
             :columns="columns"
             :data="loadData">
      <div slot="user"
           slot-scope="text, it">
        <a-row :gutter="16"
               align="middle">
          <a-col>
            <img alt="avatar"
                 :src="it.user.avatar"
                 style="width: 40px; height: 40px" />
          </a-col>
          <a-col>
            <b> #{{ it.user.id }} <br> {{ it.user.nickname }} </b>
          </a-col>
        </a-row>
      </div>

      <!-- 注册时间 -->
      <div slot="registerAt"
           slot-scope="text, it">{{ it.user.registerAt }}</div>

      <span slot="action"
            slot-scope="text, it">
        <template>
          <a-popconfirm title="确认移出名单？"
                        @confirm="onDelete(it)"><a>移出名单</a></a-popconfirm>
        </template>
      </span>

    </s-table>
  </a-card>
</template>

<script>
import ZForm from '@/components/forms/Form'
import user from '@/api/user'
import { STable } from '@/components'

export default {
  components: { ZForm, STable },
  data () {
    return {
      filters: [
        {
          type: 'number',
          key: 'userId',
          title: '用户ID',
          min: 1
        }
      ],
      selectedType: 1,
      // 表头
      columns: [
        {
          title: '用户',
          dataIndex: 'id',
          scopedSlots: { customRender: 'user' }
        },
        {
          title: '原因',
          width: '390px',
          dataIndex: 'reason'
        },
        {
          title: '拉黑时间',
          width: '190px',
          dataIndex: 'createdAt'
        },
        {
          title: '注册时间',
          width: '190px',
          // dataIndex: 'createdAt'
          scopedSlots: { customRender: 'registerAt' }
        },
        {
          title: '操作',
          dataIndex: 'action',
          width: '120px',
          scopedSlots: { customRender: 'action' }
        }
      ],
      queryParam: {
        pageNo: 1, //第几页
        pageSize: 10, //每页中显示数据的条数
        type: 0
      },
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        return user.checklist.list({ ...this.queryParam, ...parameter, type: this.selectedType }).then(data => {
          return data
        })
      }
    }
  },
  created () {
    // this.loadChecklist()
  },
  watch: {
    typeId (val, old) {
      this.selectedType = Number.parseInt(val)
      this.loadChecklist()
      console.log('typeId => ', val, ', old => ', old)
    }
  },
  methods: {
    loadChecklist (parameter) {
      this.queryParam = Object.assign(this.queryParam, parameter, { type: this.selectedType })
      this.$refs.table && this.$refs.table.refresh(true)
    },

    onDelete ({ id, type }) {
      user.checklist.delete({ id }).then(data => {
        this.$message.success('移出名单成功')
        this.loadChecklist()
      })
    }
  }
}
</script>
