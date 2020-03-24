<template>
  <a-modal :width="width"
           :visible="visible"
           :title="title"
           @cancel="visible = false">
    <z-form ref="form"
            @submit="onSubmit"
            :definitions="definitions"
            :state="state"
            :collapsed="collapsed"
            :labelSpan="labelSpan"
            :wrapperSpan="wrapperSpan" />

    <div slot="footer">
      <a type="link"
         v-if="collapsible"
         :style="{ marginRight: '16px' }"
         @click="collapsed = !collapsed">
        {{ collapsed ? '显示所有字段' : '隐藏可选字段' }}
        <a-icon :type="collapsed ? 'down' : 'up'" />
      </a>

      <a-button v-if="cancelBtn"
                @click="visible = false">取 消</a-button>
      <a-button type="primary"
                @click="onSubmit()">{{submitBtnText}}</a-button>
    </div>
  </a-modal>
</template>

<script>

import ZForm from './Form'

export default {
  name: 'FormModal',
  components: {
    ZForm
  },
  props: {
    cancelBtn: { type: Boolean, default: true },
    submitBtnText: { type: String, default: "确 定" },
    definitions: { type: Array, required: true },
    state: { type: Object, default: () => ({}) },
    width: { type: Number, default: () => 640 },
    labelSpan: { type: Number, default: 7 },
    wrapperSpan: { type: Number, default: 13 }
  },
  data () {
    return {
      collapsed: true,
      collapsible: false,
      title: '',
      visible: false
    }
  },
  updated () {
    if (this.$refs.form && this.$refs.form.collapsible !== this.collapsible) {
      this.collapsible = this.$refs.form.collapsible
    }
  },
  methods: {
    edit (title, model) {
      this.show(title, model, true)
    },
    show (title, model, edit = false) {
      this.visible = true
      this.title = title

      this.$nextTick(() => {
        this.$refs.form.update(model, !!edit)
      })
    },

    onSubmit () {
      this.visible = true
      this.$refs.form.validate((values, model) => {
        this.$emit('submit', values, model, this)
      })
    }
  }
}
</script>
