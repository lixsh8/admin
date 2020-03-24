<template>
  <div class="wrapper">
    <a-card title="">
      <a-form :layout="formLayout">
        <a-form-item label="是否开启机器人："
                     :label-col="formItemLayout.labelCol">
          <a-switch v-model="formData.useRobot"
                    :disabled="disabled"
                    checkedChildren="是"
                    unCheckedChildren="否" />
        </a-form-item>

        <a-form-item label="安卓审核版本："
                     :label-col="formItemLayout.labelCol"
                     :wrapper-col="formItemLayout.wrapperCol"
                     required>
          <a-textarea :disabled="disabled"
                      v-model="formData.androidAuditVersion"
                      placeholder="请输入安卓审核版本"
                      :autosize="{ minRows: 2, maxRows: 6 }" />
        </a-form-item>

        <a-form-item label="苹果审核版本："
                     :label-col="formItemLayout.labelCol"
                     :wrapper-col="formItemLayout.wrapperCol">
          <a-input v-model="formData.iosAuditVersion"
                   placeholder="请输入苹果审核版本"
                   :disabled="disabled" />
        </a-form-item>

        <a-form-item label="是否开启隐私："
                     :label-col="formItemLayout.labelCol">
          <a-switch v-model="formData.privacySwitch"
                    :disabled="disabled"
                    checkedChildren="是"
                    unCheckedChildren="否" />
        </a-form-item>

        <a-form-item label="IOS推送更新版本："
                     required
                     :label-col="formItemLayout.labelCol"
                     :wrapper-col="formItemLayout.wrapperCol">
          <a-input v-model="formData.updateVersion"
                   placeholder="请输入IOS推送更新版本"
                   :disabled="disabled" />
        </a-form-item>

        <a-form-item label="IOS推送更新内容："
                     required
                     :label-col="formItemLayout.labelCol"
                     :wrapper-col="formItemLayout.wrapperCol">
          <a-textarea v-model="formData.updateContent"
                      placeholder="请输入IOS推送更新内容"
                      :disabled="disabled" />
        </a-form-item>

        <a-form-item label="是否强制更新："
                     :label-col="formItemLayout.labelCol">
          <a-switch v-model="formData.updateIsForce"
                    :disabled="disabled"
                    checkedChildren="是"
                    unCheckedChildren="否" />
        </a-form-item>
        <a-form-item :wrapper-col="buttonItemLayout.wrapperCol">
          <a-button type="primary"
                    @click="save">
            {{ disabled ? '编辑' : '保存' }}
          </a-button>
        </a-form-item>
      </a-form>
    </a-card>
  </div>
</template>

<script>
import app from '@/api/app'
export default {
  components: {},
  props: {},
  data () {
    return {
      formLayout: 'vertical',
      formItemLayout: {},
      buttonItemLayout: {},
      disabled: true,
      formData: {
        testUserId: '',
        version: ''
      }
    }
  },
  computed: {},
  created () {
    this.loadData()
  },
  mounted () { },
  methods: {
    loadData () {
      app.config.list().then((res) => {
        this.formData = res
      })
    },
    save () {
      var that = this
      if (that.disabled) {
        that.disabled = false
      } else {
        that.$confirm({
          title: '确认保存?',
          content: '',
          onOk () {
            app.config.save(that.formData).then(() => {
              that.disabled = true
              that.$message.success('保存成功')
            })
          },
          onCancel () { }
        })
      }
    }
  }
}
</script>

<style lang="less" scoped>
</style>
