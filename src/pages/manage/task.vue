<template>
  <a-card :bordered="false">

    <div :span="12" align="right">
      <a-button type="primary" icon="plus" @click="$refs.modal.show('新建任务', {})">新建任务</a-button>
    </div>

    <br>

    <a-table ref="table" rowKey="id" :columns="columns" :dataSource="dataSource" :pagination="pagination">

      <b slot="task" slot-scope="text, it">{{it.name}}(#{{it.id}})</b>

      <div slot="detail" slot-scope="text, it">
        <div>任务描述: {{ it.desc }}</div>
        <div v-if="it.url || it.action">任务动作: <span v-if="it.action">{{it.action || '去完成'}}</span> => <a href="javascript:;">{{it.url}}</a></div>
        <div v-if="it.awardType>0">奖励类型: {{ it.awardType }} | {{ it.awardAmount }}</div>
        <div v-if="it.awardDesc">奖励描述: {{ it.awardDesc }}</div>
      </div>
      <div slot="repeat" slot-scope="text, it">
        <div v-if="it.repeatTimes>0">
          <divp>次数: {{ it.repeatTimes }}</divp>
          <div>间隔: {{ it.repeatInterval }}秒</div>
        </div>
      </div>

      <span slot="action" slot-scope="text, it">
        <template>
          <a @click="$refs.modal.edit('编辑任务', it)">编辑</a>
          <a-divider type="vertical" />
          <a @click="$refs.modal.show('为[' + it.name + ']添加子任务', {parentId: it.id})">添加</a>
          <a-divider type="vertical" v-if="!it.children" />
          <a-popconfirm title="确认删除？" @confirm="onDelete(it)" v-if="!it.children"><a>删除</a></a-popconfirm>
        </template>
      </span>

    </a-table>
    <form-modal ref="modal" :definitions="definitions" :state="state" @submit="onSubmit" />
  </a-card>
</template>

<script>
import manage from '@/api/manage' 

const STATES = ['停用', '启用', '测试可见']
const GROUPS = ['无', '赚更多']

const DEFINITIONS = [
  {
    type: 'select',
    key: 'group',
    title: '任务分组',
    required: true,
    initialValue: 0,
    options: [
      { label: '无', value: 0 },
      { label: '赚更多', value: 1 },
    ]
  },
  {
    type: 'text',
    key: 'name',
    title: '任务名称',
    required: true,
    placeholder: true,
  },
  {
    type: 'text',
    key: 'desc',
    title: '任务描述',
    placeholder: true,
  },
  {
    type: 'text',
    title: '奖励描述',
    key: 'awardDesc',
    placeholder: true,
  },
  {
    type: 'text',
    key: 'url',
    title: '链接',
    placeholder: true,
  },
  {
    type: 'select',
    key: 'state',
    title: '状态',
    initialValue: 1,
    options: [
      { label: '停用', value: 0 },
      { label: '启用', value: 1 },
      { label: '测试可见', value: 2 }
    ]
  },
  {
    type: 'inline',
    title: '奖励配置',
    collapsible: true,
    justify: 'space-between',
    items: [
      {
        type: 'select',
        key: 'awardType',
        span: 12,
        initialValue: 0,
        options: [
          { label: '无', value: 0 },
          { label: '现金', value: 1 },
          { label: '金币', value: 2 }
        ]
      },
      {
        type: 'number',
        key: 'awardAmount',
        placeholder: '数量',
        span: 12,
      }
    ]
  },
  {
    type: 'inline',
    title: '每日重复',
    collapsible: true,
    justify: 'space-between',
    items: [
      {
        type: 'number',
        key: 'repeatTimes',
        placeholder: '次数',
        span: 12,
      },
      {
        type: 'number',
        key: 'repeatInterval',
        placeholder: '间隔',
        span: 12,
      }
    ]
  },
  {
    type: 'text',
    key: 'action',
    title: '动作文案',
    placeholder: true,
    collapsible: true,
  },
  {
    type: 'number',
    key: 'lifetime',
    name: '有效期',
    title: '有效期(天数)',
    collapsible: true,
    placeholder: true,
  },
  {
    type: 'number',
    key: 'weight',
    title: '权值',
    collapsible: true,
    placeholder: true,
  }
]


export default {
  data () {
    return {
      definitions: DEFINITIONS,
      state: {},
      // 表头
      columns: [
        {
          title: '任务',
          dataIndex: 'id',
          scopedSlots: { customRender: 'task' }
        },
        {
          title: '任务详情',
          dataIndex: 'awardType',
          scopedSlots: { customRender: 'detail' }
        },
        {
          title: '分组',
          dataIndex: 'group',
          customRender: (text, it) => GROUPS[it.group]
        },
        {
          title: '重复',
          dataIndex: 'repeatTimes',
          scopedSlots: { customRender: 'repeat' }
        },
        {
          title: '状态',
          dataIndex: 'state',
          customRender: (text, it) => STATES[it.state]
        },
        {
          title: '权值',
          dataIndex: 'weight'
        },
        {
          title: '时间',
          width: '190px',
          dataIndex: 'updatedAt'
        },
        {
          title: '操作',
          dataIndex: 'action',
          width: '190px',
          scopedSlots: { customRender: 'action' }
        }
      ],

      dataSource: [],
      pagination: {
        hideOnSinglePage: true
      }
    }
  },
  created () {
    this.load()
  },
  methods: {
    load() {
      manage.task.list().then(data => {
        this.dataSource = data
      })
    },
    onDelete (record) {
      manage.task.delete({ id: record.id }).then(data => {
        this.load()
      })
    },

    onSubmit (values, { id, parentId }, target) {
      manage.task.save({ id, parentId, ...values }).then(data => {
        target.visible = false
        this.$message.success(id > 0 ? '编辑成功' : '添加成功')
        this.load()
      })
    }
  }
}
</script>
