<template>
  <a-card :bordered="false" :style="{ height: '100%' }">

    <z-form ref="form" :definitions="definitions" :labelSpan="24" :wrapperSpan="24" >
      <a-button type="primary" icon="save" @click="save()">保存</a-button>
    </z-form>
  </a-card>
</template>

<script>
import config from '@/api/config'

const DEFINITIONS = [
  {
    type: 'text',
    key: 'inviter1',
    title: '用户看广告收益分成比例（给上级邀请者）',
    required: true,
    placeholder: true,
  },
  {
    type: 'text',
    key: 'inviter2',
    title: '用户看广告收益分成比例（给上上级邀请者）',
    required: true,
    placeholder: true,
  },
  {
    type: 'text',
    key: 'agent',
    title: '用户看广告收益分成比例（给代理）',
    required: true,
    placeholder: true,
  }
]

export default {
  data () {
    return {
      definitions: DEFINITIONS
    }
  },
  created () {
    this.load()
  },
  methods: {
    load () {
      config.advertRate.get().then(data => { 
        this.$nextTick(() => {
          this.$refs.form.update(data, true)
        })
      })
    },
    save () {
      this.$refs.form.validate((values) => {

        config.advertRate.save(values).then(data => {
          this.$message.success('编辑成功')
        })
      })
    }
  }
}
</script>
