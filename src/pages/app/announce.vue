<template>
  <a-card :bordered="false">

    <a-row>
      <a-col :span="12">
        <a-radio-group :defaultValue="0"
                       v-model="selectedType"
                       @change="load()"
                       buttonStyle="solid">
          <a-radio-button :value="0">系统公告</a-radio-button>
          <a-radio-button :value="1">精选活动</a-radio-button>
        </a-radio-group>
      </a-col>
      <a-col :span="12"
             align="right">
        <a-button type="primary"
                  icon="plus"
                  @click="$refs.modal.show('新建公告', { type: selectedType })">新建公告</a-button>
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
        <h3>{{ it.title }}</h3>
        <div>{{ it.content }}</div>
      </span>
      <span slot="image"
            slot-scope="text, it">
        <img :src="it.image"
             width="120" />
      </span>

      <span slot="action"
            slot-scope="text, it">
        <template>
          <a @click="$refs.modal.edit('编辑公告', it)">编辑</a>
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

const TYPE_NAMES = ['系统公告', '精选活动']

const DEFINITIONS = [
  {
    type: 'select',
    key: 'type',
    title: '类型',
    required: true,
    readonly: true,
    placeholder: true,
    options: [
      { label: '系统公告', value: 0 },
      { label: '精选活动', value: 1 }
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
    type: 'textarea',
    key: 'content',
    title: '内容',
    required: true,
    placeholder: true
  },
  {
    type: 'text',
    key: 'url',
    title: '链接'
  }
  // ,
  // {
  //   type: 'image',
  //   key: 'image',
  //   title: '图片',
  //   visible: 'data.type === 1',
  //   imagePath: 'announce'
  // }
]

export default {
  components: { STable },
  data () {
    return {
      definitions: DEFINITIONS,
      selectedType: 0,
      // 表头
      columns: [
        {
          title: '#',
          dataIndex: 'id'
        },
        {
          title: '标题',
          dataIndex: 'title',
          scopedSlots: { customRender: 'body' }
        },
        // {
        //   title: '',
        //   dataIndex: 'image',
        //   scopedSlots: { customRender: 'image' }
        // },
        {
          title: '类型',
          dataIndex: 'type',
          width: '90px',
          customRender: (text, record) => TYPE_NAMES[record.type]
        },
        {
          title: '发布时间',
          width: '190px',
          dataIndex: 'createdAt'
        },
        {
          title: '操作',
          dataIndex: 'action',
          width: '150px',
          scopedSlots: { customRender: 'action' }
        }
      ],
      queryParam: {
        pageNo: 1,
        pageSize: 10
      },
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        return notify.announce.list({ ...this.queryParam, ...parameter, type: this.selectedType }).then(data => {
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
      this.queryParam = Object.assign(this.queryParam, parameter, { type: this.selectedType })
      this.$refs.table && this.$refs.table.refresh(true)
    },
    onDelete ({ id }) {
      notify.announce.delete({ id }).then(data => {
        this.load()
      })
    },

    onSubmit (values, { id }, target) {
      notify.announce.save({ id, ...values }).then(data => {
        target.visible = false
        this.$message.success(id > 0 ? '编辑成功' : '添加成功')
        this.load()
      })
    }
  }
}
</script>
