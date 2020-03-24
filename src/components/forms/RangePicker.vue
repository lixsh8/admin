<template>
    <div>
      <a-range-picker show-time v-model="momentRange" format="YYYY-MM-DD HH:mm" @change="onChange" />
    </div>
</template>

<script>
import moment from 'moment'

function now () {
  const time = moment().millisecond(0).second(0).minute(0)
  return [time, time.clone().add(2, 'days')]
}

export default {
  name: 'ZRangePicker',
  props: { 
    value: { type: Array, default: null },
    format: { type: String, default: 'YYYY-MM-DD HH:mm' } 
  },
  data () {
    return {
      momentRange: this.update(this.value)
    }
  },
  watch: {
    value: function (val, oldVal) {
      this.momentRange = this.update(val)
    }
  },
  methods: {
    update (dates)  {
      if (Array.isArray(dates)) {
        if (dates.length > 0) {
          return dates.map(it => moment(it))
        } else {
          return this.momentRange
        }
      }
      const m = now()
      this.onChange(m)
      return m
    },
    onChange (value) { 
      this.$emit('change', value.map(it => it.format('YYYY-MM-DD HH:mm:ss')))
    }
  }
}
</script>