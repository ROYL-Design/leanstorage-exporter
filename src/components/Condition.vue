<style lang="sass" scoped>
.condition
  margin-bottom: 10px
  &>*
    display: inline-block
    margin-right: 10px
    width: auto
    vertical-align: middle
</style>

<template lang="pug">
.condition
  .select
    select(v-model="col")
      option(value="") Select a Column
      option(v-for="column in queryColumns") {{column}}
  .select(v-if="selectedClass && col")
    select(v-model="id")
      option(v-for="operator in operators.types[type]", :value="operator.id") {{ operator.name }}
  input.input(v-if="valueType === 'text'", placeholder="Value", v-model="value")
  input.input(v-if="valueType === 'number'", placeholder="Value", v-model.number="value", type="number")
  input.input(v-if="valueType === 'date'", placeholder="Value", v-model="value", type="datetime-local")
  .delete.is-medium(@click="removeCondition")
</template>

<script>
import operators from '../lib/operators'
import { mapGetters, mapState } from 'vuex'

export default {
  data () {
    return {
      operators
    }
  },
  computed: {
    col: {
      get () { return this.$store.state.conditions[this.index].col },
      set (col) { this.updateCondition({ col }) }
    },
    id: {
      get () { return this.$store.state.conditions[this.index].id },
      set (id) { this.updateCondition({ id }) }
    },
    value: {
      get () { return this.$store.state.conditions[this.index].value },
      set (value) { this.updateCondition({ value }) }
    },
    type () {
      if (!this.selectedClass || !this.col) return null
      return this.classes[this.selectedClass][this.col].type
    },
    valueType () {
      if (!this.id) return null
      return operators[this.id].valueType
    },
    ...mapState(['classes', 'selectedClass']),
    ...mapGetters(['queryColumns'])
  },
  methods: {
    removeCondition () {
      this.$store.commit('removeCondition', this.index)
    },
    updateCondition (condition) {
      this.$store.commit('updateCondition', {
        index: this.index,
        ...condition
      })
    }
  },
  props: ['index']
}
</script>
