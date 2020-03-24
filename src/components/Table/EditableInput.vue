<template>
  <div class="editable-cell">
    <div class="editable-cell-input-wrapper">
      <a-input :value="value" @change="handleChange" @pressEnter="check" @blur="check"/>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    text: String
  },
  data () {
    return {
      value: this.text,
      editable: true
    }
  },
  watch: {
    text: function (val, oldVal) {
      this.value = val
    }
  },
  methods: {
    handleChange (e) {
      const value = e.target.value
      this.value = value
    },
    check (e) {
      const value = e.target.value
      this.editable = true
      this.value = value
      console.log(this.value)
      this.$emit('change', this.value)
    },
    edit () {
      this.editable = true
    }
  }
}
</script>
