<template>
  <a-card :bordered="false">

    <a-row>
      <a-col :span="12">
        <a-radio-group v-model="selectedType"
                       @change="load()"
                       buttonStyle="solid">
          <a-radio-button :value="1">文本弹窗</a-radio-button>
          <a-radio-button :value="2">图片弹窗</a-radio-button>
          <a-radio-button :value="3">网页弹窗</a-radio-button>
        </a-radio-group>
      </a-col>
      <a-col :span="12"
             align="right">
        <a-button type="primary"
                  icon="plus"
                  @click="$refs.modal.show('新建弹窗', { type: selectedType })">新建弹窗</a-button>
      </a-col>
    </a-row>

    <br />

    <s-table ref="table"
             size="default"
             :rowKey="(record) => record.id"
             :columns="columns"
             :data="loadData">
      <span slot="body"
            slot-scope="text, it">
        <a-row :gutter="15"
               align="middle">
          <a-col :span="16">
            <h3>#{{ it.id }} - {{ it.title }}</h3>
            <p v-if="it.webpage">网页地址: <a :href="it.webpage"
                 target="_blank">{{ it.webpage }}</a></p>
            <p v-if="it.url">URL: <a :href="it.url"
                 target="_blank">{{ it.url }}</a></p>
            <p v-if="it.content">文本内容: {{ it.content }}</p>
          </a-col>
          <a-col :span="8"
                 v-if="it.image">
            <img alt="image"
                 :src="it.image"
                 style="max-width: 100px; max-height: 100px" />
          </a-col>
        </a-row>
      </span>

      <span slot="version"
            slot-scope="text, it">
        <div v-if="it.versions.ios"> IOS: {{ it.versions.ios }}</div>
        <div v-if="it.versions.android">安卓: {{ it.versions.android }}</div>
      </span>

      <span slot="enabled"
            slot-scope="text, it">
        {{it.enabled?'是':'否'}}
      </span>

      <span slot="time"
            slot-scope="text, it">
        <div>创建时间：{{ it.createdAt }}</div>
        <div>开始时间：{{ it.startAt }}</div>
        <div>结束时间：{{ it.endAt }}</div>
      </span>

      <span slot="action"
            slot-scope="text, it">
        <template>
          <a @click="$refs.modal.edit('编辑弹窗', it)">编辑</a>
          <a-divider type="vertical" />
          <a-popconfirm title="确认删除？"
                        @confirm="onDelete(it)"><a>删除</a></a-popconfirm>
        </template>
      </span>

    </s-table>
    <form-modal ref="modal"
                :definitions="definitions"
                @submit="onSubmit" />
  </a-card>
</template>

<script>
import notify from '@/api/notify'
import { STable } from '@/components'

const TYPE_NAMES = ['', '文本弹窗', '图片弹窗', '网页弹窗']

const DEFINITIONS = [
  {
    type: 'select',
    key: 'type',
    title: '类型',
    required: true,
    readonly: true,
    placeholder: true,
    options: [
      { label: '文本弹窗', value: 1 },
      { label: '图片弹窗', value: 2 },
      { label: '网页弹窗', value: 3 }
    ]
  },
  {
    type: 'text',
    key: 'title',
    title: '标题',
    required: true,
    placeholder: true
  },
  {
    type: 'text',
    key: 'url',
    title: '链接',
    required: 'data.type === 3',
    placeholder: true
  },
  {
    type: 'timerange',
    key: 'timeRange',
    title: '起止时间',
    required: true
  },
  {
    type: 'textarea',
    key: 'content',
    title: '文本内容',
    required: 'data.type === 1',
    visible: 'data.type === 1',
    placeholder: true
  },
  {
    type: 'image',
    key: 'image',
    title: '图片',
    required: 'data.type === 2',
    visible: 'data.type === 2',
    imagePath: 'dialog'
  },
  {
    type: 'text',
    key: 'webpage',
    title: '网页链接',
    required: 'data.type === 3',
    visible: 'data.type === 3',
    placeholder: true
  },
  {
    type: 'select',
    key: 'frequency',
    title: '频率',
    placeholder: true,
    collapsible: true,
    options: [
      { label: '仅弹出一次', value: -1 },
      { label: '每次启动应用时弹出', value: 0 },
      { label: '每天弹出1次', value: 1 },
      { label: '每天弹出2次', value: 2 },
      { label: '每天弹出3次', value: 3 }
    ]
  },
  {
    type: 'inline',
    title: 'Android版本',
    collapsible: true,
    justify: 'space-between',
    items: [
      {
        type: 'text',
        key: 'versions.androidMin',
        placeholder: '最小版本',
        span: 12,
        pattern: /^([0-9]{1,2})(\.[0-9]{1,2}){0,2}$/i

      },
      {
        type: 'text',
        key: 'versions.androidMax',
        placeholder: '最大版本',
        span: 12,
        pattern: /^([0-9]{1,2})(\.[0-9]{1,2}){0,2}$/i
      }
    ]
  },
  {
    type: 'inline',
    title: 'iOS版本',
    collapsible: true,
    justify: 'space-between',
    items: [
      {
        type: 'text',
        key: 'versions.iosMin',
        placeholder: '最小版本',
        span: 12,
        pattern: /^([0-9]{1,2})(\.[0-9]{1,2}){0,2}$/i

      },
      {
        type: 'text',
        key: 'versions.iosMax',
        placeholder: '最大版本',
        span: 12,
        pattern: /^([0-9]{1,2})(\.[0-9]{1,2}){0,2}$/i
      }
    ]
  },
  {
    type: 'inline',
    title: ' ',
    colon: false,
    items: [
      {
        type: 'checkbox',
        key: 'enabled',
        label: '是否启用'
      },
      {
        type: 'checkbox',
        key: 'force',
        label: '是否必须确认'
      }
    ]
  }
]

export default {
  components: { STable },
  data () {
    return {
      definitions: DEFINITIONS,
      selectedType: 1,
      // 表头
      columns: [
        {
          title: '弹窗',
          dataIndex: 'id',
          scopedSlots: { customRender: 'body' }
        },
        {
          title: '版本限制',
          width: '190px',
          scopedSlots: { customRender: 'version' }
        },
        {
          title: '类型',
          dataIndex: 'type',
          width: '90px',
          customRender: (text, record) => TYPE_NAMES[record.type]
        },
        {
          title: '是否启用',
          dataIndex: 'enabled',
          width: '90px',
          scopedSlots: { customRender: 'enabled' }
        },
        {
          title: '时间',
          width: '260px',
          scopedSlots: { customRender: 'time' }
        },
        {
          title: '操作',
          dataIndex: 'action',
          width: '120px',
          scopedSlots: { customRender: 'action' }
        }
      ],
      queryParam: {
        pageNo: 1,
        pageSize: 10
      },
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        return notify.popup.list({ ...this.queryParam, ...parameter, type: this.selectedType }).then(data => {
          return data
        })
      }
    }
  },
  created () {
    // this.load()
  },
  watch: {
    typeId (val, old) {
      this.selectedType = Number.parseInt(val)
      this.load()
      console.log('typeId => ', val, ', old => ', old)
    }
  },
  methods: {
    load (parameter) {
      this.queryParam = Object.assign(this.queryParam, parameter, { type: this.selectedType })
      this.$refs.table && this.$refs.table.refresh(true)
    },
    onDelete ({ id }) {
      notify.popup.delete({ id }).then(data => {
        this.load()
      })
    },
    onSubmit (values, { id }, target) {
      notify.popup.save({ id, ...values }).then(data => {
        target.visible = false
        this.$message.success(id > 0 ? '编辑成功' : '添加成功')
        this.load()
      })
    }
  }
}
</script>
