<template>
    <div ref="jsoneditor" />
</template>

<script>
// import JSONEditor from 'jsoneditor'
import JSONEditor from 'jsoneditor/dist/jsoneditor-minimalist.js'
import 'jsoneditor/dist/jsoneditor.min.css'

export default {
  name: 'ZJsonTree',
  data () {
    return {
      editor: null
    }
  },
  props: {
    data: {
      required: true
    },
    options: {
      type: Object,
      default: () => {
        return {
          mainMenuBar: false,
          indentation: 2
        }
      }
    },
    onChange: {
      type: Function
    }
  },
  watch: {
    data: {
      handler (val) {
        if (this.editor) {
          this.editor.set(val)
        }
      },
      deep: true
    }
  },
  methods: {
    onChange (e) {
      if (this.editor) {
        this.onChange(this.editor.get())
      }
    }
  },
  mounted () {
    const options = { onChange: this.onChange, ...this.options }
    this.editor = new JSONEditor(this.$refs.jsoneditor, options)
    this.editor.set(this.data)
  },
  beforeDestroy () {
    if (this.editor) {
      this.editor.destroy()
      this.editor = null
    }
  }
}
</script>

<style>
</style>