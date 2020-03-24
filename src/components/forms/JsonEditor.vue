<template>
    <div>
      <z-ace-editor
        :fontSize="14"
        :showPrintMargin="false"
        :showGutter="true"
        :highlightActiveLine="true"
        :editorProps="{$blockScrolling: Infinity}"
        :onChange="onChange"
        :onPaste="onPaste"
        v-model="value"
        width="auto"
        height="300px"
        mode="json"
        theme="xcode"
        :name="name"
        style="background-color: #f5f5f5"
      />
    </div>
</template>

<script>

import ZAceEditor from './AceEditor'
import 'brace/mode/json';
import 'brace/theme/xcode';
import _ from 'lodash';

function normalize (json) {
  return new Function('return ' + json)()
}

export default {
  name: 'ZJsonEditor',
  components: {
    ZAceEditor
  },
  props: {
    value: String, 
    name: { type:String, default: () => 'jsoneditor' + _.random(10000) }
  },
  methods: {
    pretty (json) {
      try {
        return JSON.stringify(normalize(json), null, 2)
      } catch (e) {
        
      }
      return json
    },
    onChange (value) {
      // console.log('change', value)
      this.$emit('change', value)
    },
    onPaste (e) {
      e.text = this.pretty(e.text)
    }
  }
}
</script>