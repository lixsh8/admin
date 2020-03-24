<template>
  <div>
    <a-input :value="icon" @change="onChange">
      <a-popover
        slot="addonBefore"
        placement="right"
        @visibleChange="visible => selectorVisible = visible"
        :visible="selectorVisible">
        <template slot="content">
          <icon-selector @change="onSelect" :value="icon" style="width: 500px;"/>
        </template>
        <a-icon :type="icon" style="width: 16px"/>
      </a-popover>
    </a-input>
  </div>
</template>

<script>

import IconSelector from '@/components/widgets/IconSelector'

export default {
  name: 'ZIconPicker',
  components: {
    IconSelector
  },
  props: {
    value: String,
  },
  data () {
    return {
      icon: this.value,
      selectorVisible: false,
    }
  },
  watch: {
    value (val, old) {
      this.icon = val
    }
  },
  methods: {
    onSelect (icon) {
      this.selectorVisible = false
      console.log('select', icon)
      this.$emit('change', icon)
    },
    onChange (e) {
      console.log('change', e.target.value)
      this.$emit('change', e.target.value)
    }
  }
}
</script>