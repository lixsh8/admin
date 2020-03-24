<template>
  <a-card :bordered="false">

    <div class="table-operator">
      <a-button type="primary"
                icon="plus"
                @click="$refs.modal.show('新建分类', {})">新建</a-button>
    </div>

    <br />

    <a-table
             ref="table"
             size="default"
             rowKey="id"
             :columns="columns"
             :dataSource="dataSource"
             :pagination="pagination">
      <div slot="type"
           slot-scope="text, record">
        <h3>{{record.name}}</h3>
        <div>{{ record.note }}</div>
      </div>
      <div slot="content"
           slot-scope="text, record"
           style="white-space: nowrap">
        <a-tag v-if="record.hasTitle"
               style="color: #52c41a">标题</a-tag>
        <a-tag v-if="record.hasDesc"
               style="color: #1890ff">描述</a-tag>
        <a-tag v-if="record.hasImage"
               style="color: #f5222d">图片</a-tag>
      </div>

      <span slot="action"
            slot-scope="text, record">
        <template>
          <a @click="$refs.modal.edit('编辑分类', record)">编辑</a>
          <a-divider type="vertical" />
          <a-popconfirm title="确认删除？"
                        @confirm="onDelete(it)"><a>删除</a></a-popconfirm>
        </template>
      </span>

    </a-table>
    <form-modal ref="modal"
                :definitions="definitions"
                @submit="onSubmit" />
  </a-card>
</template>

<script>
import manage from '@/api/manage'


const DEFINITIONS = [
  {
    type: 'text',
    key: 'name',
    title: '分类名称',
    required: true,
    placeholder: true,
  },
  {
    type: 'text',
    key: 'note',
    title: '分类说明',
    placeholder: true,
  },
  {
    type: 'inline',
    title: '分类内容',
    colon: false,
    items: [
      {
        type: 'checkbox',
        key: 'hasTitle',
        label: '标题',
        // readonly: true
      },
      {
        type: 'checkbox',
        key: 'hasDesc',
        label: '描述',
        // readonly: true
      },
      {
        type: 'checkbox',
        key: 'hasImage',
        label: '图片',
        // readonly: true
      },
    ]
  }
]


export default {
  data () {
    return {
      definitions: DEFINITIONS,
      // 表头
      columns: [
        {
          title: '#',
          dataIndex: 'id',
          width: '40px',
        },
        {
          title: '分类',
          dataIndex: 'name',
          scopedSlots: { customRender: 'type' }
        },
        {
          title: '内容',
          dataIndex: 'hasTitle',
          scopedSlots: { customRender: 'content' }
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
      dataSource: [],
      pagination: {
        current: 1,
        pageSize: 50
      }
    }
  },
  created () {
    this.load()
  },
  methods: {
    load () {
      manage.linkType.list(this.pagination.page).then(data => {
        this.dataSource = data
      })
    },
    onDelete ({ id }) {
      manage.linkType.delete({ id }).then(data => {
        this.load()
      })
    },

    onSubmit (values, { id }, target) {
      manage.linkType.save({ id, ...values }).then(data => {
        target.visible = false
        this.$message.success(id > 0 ? '编辑成功' : '添加成功')
        this.load()
      })
    }
  }
}
</script>
