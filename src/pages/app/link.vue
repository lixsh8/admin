<template>
  <a-card :bordered="false">

    <a-row>
      <a-col :span="12">
        <a-select v-model="selectedTypeId"
                  :options="types"
                  @change="onTypeChange"
                  style="width: 200px" />
      </a-col>
      <a-col :span="12"
             align="right">
        <a-button type="primary"
                  icon="plus"
                  @click="$refs.modal.show('新建链接', { typeId: selectedTypeId, isShow: true })">新建链接</a-button>
      </a-col>
    </a-row>

    <br />

    <a-table
             ref="table"
             rowKey="id"
             :columns="columns"
             :dataSource="dataSource"
             :pagination="pagination">
      <div slot="content"
           slot-scope="text, record">
        <a-row type="flex"
               :gutter="15"
               align="middle">
          <a-col v-if="record.image">
            <img alt="image"
                 :src="record.image"
                 style="max-width: 100px; max-height: 100px" />
          </a-col>
          <a-col>
            <h3 v-if="record.title">{{record.title}}</h3>
            <div v-if="record.url">URL: <a :href="record.url"
                 target="_blank">{{record.url}}</a></div>
            <div v-if="record.upm">标识: {{record.upm }}</div>
            <div v-if="record.desc">{{record.desc }}</div>
          </a-col>
        </a-row>
      </div>
      <div slot="version"
           slot-scope="text, record"
           style="white-space: nowrap">
        <div v-if="record.versionIos">IOS: {{ record.versionIos }}</div>
        <div v-if="record.versionAndroid">安卓: {{ record.versionAndroid }}</div>
      </div>

      <span slot="action"
            slot-scope="text, record">
        <template>
          <a @click="$refs.modal.edit('编辑', record)">编辑</a>
          <a-divider type="vertical" />
          <a-popconfirm title="确认删除？"
                        @confirm="onDelete(it)"><a>删除</a></a-popconfirm>
        </template>
      </span>

    </a-table>
    <form-modal ref="modal"
                :definitions="definitions"
                :state="state"
                @submit="onSubmit" />
  </a-card>
</template>

<script>
import manage from '@/api/manage'

const DEFINITIONS = [
  {
    type: 'text',
    key: 'title',
    title: '标题',
    required: true,
    exists: 'state.fields.includes("title")',
    placeholder: true
  },
  {
    type: 'text',
    key: 'desc',
    title: '描述',
    required: true,
    exists: 'state.fields.includes("desc")',
    placeholder: true
  },
  {
    type: 'image',
    key: 'image',
    title: '图片',
    required: true,
    exists: 'state.fields.includes("image")',
    imagePath: 'link'
  },
  {
    type: 'text',
    key: 'url',
    title: '链接',
    required: true,
    placeholder: true
  },
  {
    type: 'text',
    key: 'upm',
    title: '标识',
    placeholder: true
  },
  {
    type: 'inline',
    title: '最小版本号',
    justify: 'space-between',
    items: [
      {
        type: 'text',
        key: 'versionAndroid',
        placeholder: '最小版本号(android)',
        span: 12,
        pattern: /^([0-9]{1,2})(\.[0-9]{1,2}){0,2}$/i
      },
      {
        type: 'text',
        key: 'versionIos',
        placeholder: '最小版本号(ios)',
        span: 12,
        pattern: /^([0-9]{1,2})(\.[0-9]{1,2}){0,2}$/i
      }
    ]
  },
  {
    type: 'number',
    key: 'sort',
    title: '排序',
    placeholder: true
  },
  {
    type: 'switch',
    key: 'visible',
    title: '是否显示',
    initialValue: true
  }
]

export default {
  props: {
    typeId: { type: String, default: "5" }
  },
  data () {
    return {
      definitions: DEFINITIONS,
      state: {},
      // 表头
      columns: [
        {
          title: '#',
          dataIndex: 'id',
          width: '40px'
        },
        {
          title: '链接',
          dataIndex: 'url',
          scopedSlots: { customRender: 'content' }
        },
        {
          title: '版本',
          dataIndex: 'versionAndroid',
          scopedSlots: { customRender: 'version' }
        },
        {
          title: '是否显示',
          dataIndex: 'visible',
          customRender: (text, record) => record.visible ? '是' : '否'
        },
        {
          title: '排序',
          dataIndex: 'sort'
        },
        {
          title: '时间',
          width: '190px',
          dataIndex: 'updatedAt'
        },
        {
          title: '操作',
          dataIndex: 'action',
          width: '120px',
          scopedSlots: { customRender: 'action' }
        }
      ],

      types: [],
      selectedTypeId: Number.parseInt(this.typeId),
      dataSource: [],
      pagination: {
        current: 1,
        pageSize: 50
      }
    }
  },
  created () {
    this.loadTypes()
    this.loadLinks()
  },
  watch: {
    typeId (val, old) {
      this.selectedTypeId = Number.parseInt(val)

      const { data } = this.types.find(option => {
        return option.value === this.selectedTypeId
      })

      if (data) {
        this.state = data
        this.loadLinks()
      }
      console.log('typeId => ', val, ', old => ', old)
    }
  },
  methods: {
    loadTypes () {
      manage.linkType.list().then(data => {
        // console.log('data => ', data)
        this.types = data.map(it => {
          if (it.id === this.selectedTypeId) {
            this.state = it
          }
          return { data: it, label: `#${it.id}-${it.name}`, key: it.id, value: it.id }
        })
        if (this.selectedTypeId <= 0 && Array.isArray(data) && data.length > 0) {
          this.loadLinks(data[0].id)
        }
      })
      this.loadLinks()
    },
    loadLinks (type) {
      if (type) {
        this.selectedTypeId = type
      }
      if (this.selectedTypeId > 0) {
        manage.link.list(this.selectedTypeId).then(data => {
          this.dataSource = data
        })
      }
    },
    onDelete (record) {
      manage.link.delete({ id: record.id }).then(data => {
        this.loadLinks()
      })
    },

    onTypeChange (item, vnode) {
      // console.log('onTypeChange => ', item, vnode)
      const type = vnode.data.props.data
      this.state = type.fields
      this.loadLinks(item)
    },
    onSubmit (values, { id, typeId }, target) {
      manage.link.save({ id, typeId, ...values }).then(data => {
        target.visible = false
        this.$message.success(id > 0 ? '编辑成功' : '添加成功')
        this.loadLinks(typeId)
      })
    }
  }
}
</script>
