<template>
  <a-card :bordered="false"
          style="min-width: 770px;">
    <a-row :gutter="24">
      <a-col :lg="9"
             :xl="8"
             :xxl="6">
        <a-list bordered
                :dataSource="faqTypes">
          <a-list-item slot="renderItem"
                       slot-scope="item"
                       :class="selectedTypeId == item.id ? 'selected' : ''"
                       @click="onTypeClick(item)">
            <a slot="actions"
               @click="$refs.typeModal.edit('编辑分类', item)">
              <a-icon type="edit"></a-icon>
            </a>
            <a slot="actions"
               @click="$refs.questionModal.show('添加问题', { typeId: item.id })">
              <a-icon type="plus"></a-icon>
            </a>

            <div style="vertical-align: middle; word-wrap: nowrap; width: 100%">
              <img v-if="item.icon"
                   alt="icon"
                   :src="item.icon"
                   width="30"
                   height="30" />
              {{ item.name }}
            </div>

          </a-list-item>
          <div slot="header">
            <a-row>
              <a-col :span="12">
                <h3>问题分类</h3>
              </a-col>
              <a-col :span="12"
                     align="right">
                <a-button type="primary"
                          icon="plus"
                          @click="$refs.typeModal.show('新建分类', { id: 0 })">新建分类</a-button>
              </a-col>
            </a-row>
          </div>
        </a-list>
      </a-col>
      <a-col :lg="15"
             :xl="16"
             :xxl="18">
        <a-table ref="table"
                 rowKey="id"
                 :scroll="{x: 900}"
                 :columns="columns"
                 :dataSource="faqQuestions">
          <div slot="faq"
               slot-scope="text, it">
            <h3>{{ it.id }} - {{ it.title }}</h3>
            <div style="white-space: pre-line">{{ it.content }}</div>
          </div>

          <div slot="status"
               slot-scope="text, it"
               style="white-space: nowrap">
            <div>
              {{ it.visible ? '可见' : '可见' }}
              <span v-if="it.isHot">| 热门</span>
            </div>
          </div>

          <span slot="action"
                slot-scope="text, it"
                style="white-space: nowrap">
            <template>
              <a @click="$refs.questionModal.edit('编辑问题', it)">编辑</a>
              <a-divider type="vertical" />
              <a-popconfirm title="确认删除？"
                            @confirm="deleteQuestion(it)"><a>删除</a></a-popconfirm>
            </template>
          </span>

        </a-table>
      </a-col>
    </a-row>

    <form-modal ref="typeModal"
                :definitions="faqTypeDefinitions"
                @submit="onSubmitType" />
    <form-modal ref="questionModal"
                :definitions="faqQuestionDefinitions"
                @submit="onSubmitQuestion" />
  </a-card>
</template>

<script>
import manage from '@/api/manage'

const TYPE_DEFINITIONS = [
  {
    type: 'text',
    key: 'name',
    title: '分类名称',
    required: true,
    placeholder: true
  },
  {
    type: 'image',
    key: 'icon',
    title: '分类图标',
    imagePath: 'faqtype'
  },
  {
    type: 'number',
    key: 'sort',
    title: '分类排序'
  }
]

const QUESTUON_DEFINITIONS = [
  {
    type: 'text',
    key: 'title',
    title: '标题',
    required: true,
    placeholder: '请输入标题'
  },
  {
    type: 'textarea',
    key: 'content',
    title: '内容',
    required: true,
    placeholder: '请输入内容'
  },
  {
    type: 'number',
    key: 'sort',
    title: '排序'
  },
  {
    type: 'inline',
    title: ' ',
    colon: false,
    items: [
      {
        type: 'checkbox',
        key: 'visible',
        label: '是否可见'
      },
      {
        type: 'checkbox',
        key: 'isHot',
        label: '设为热门'
      }
    ]
  }
]

export default {
  data () {
    return {
      // 表头
      columns: [
        {
          title: '问题',
          dataIndex: 'title',
          scopedSlots: { customRender: 'faq' }
        },
        {
          title: '状态',
          width: '130px',
          scopedSlots: { customRender: 'status' }
        },
        {
          title: '阅读量',
          dataIndex: 'readCount'
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
          fixed: 'right',
          scopedSlots: { customRender: 'action' }
        }
      ],
      faqTypeDefinitions: TYPE_DEFINITIONS,
      faqQuestionDefinitions: QUESTUON_DEFINITIONS,
      faqTypes: [],
      faqQuestions: [],
      selectedTypeId: 0
    }
  },
  created () {
    this.loadTypes()
  },
  methods: {
    loadTypes () {
      manage.faqType.list().then(data => {
        this.faqTypes = data
        if (this.selectedTypeId <= 0 && Array.isArray(data) && data.length > 0) {
          this.loadQuestions(data[0].id)
        }
      })
    },
    loadQuestions (type) {
      this.selectedTypeId = type
      manage.faqQuestion.list(type).then(data => {
        this.faqQuestions = data
      })
    },
    deleteType ({ id }) {
      manage.faqType.delete({ id }).then(data => {
        this.loadQuestions(this.selectedTypeId)
      })
    },
    deleteQuestion ({ id }) {
      manage.faqQuestion.delete({ id }).then(data => {
        this.loadQuestions(this.selectedTypeId)
      })
    },

    onSubmitType (values, { id }, target) {
      manage.faqType.save({ id, ...values }).then(data => {
        target.visible = false
        this.$message.success(id > 0 ? '编辑成功' : '添加成功')
        this.loadTypes()
        // this.loadQuestions(this.selectedTypeId)
      })
    },

    onSubmitQuestion (values, model, target) {
      const { id, typeId } = model
      manage.faqQuestion.save({ id, typeId, ...values }).then(data => {
        target.visible = false
        this.$message.success(id > 0 ? '编辑成功' : '添加成功')
        if (this.selectedTypeId === typeId) {
          this.loadQuestions(typeId)
        }
      })
    },

    onTypeClick (item) {
      // console.log('onTypeClick => ', item)
      this.loadQuestions(item.id)
    }
  }
}
</script>

<style lang="less" scoped>
.ant-table td {
  white-space: nowrap;
}
</style>
