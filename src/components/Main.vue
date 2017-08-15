<style lang="sass" scoped>
.container
  padding: 20px 0
.query
  .condition
    margin-bottom: 10px
    &>*
      display: inline-block
      margin-right: 10px
      width: auto
      vertical-align: middle
.results
  table
    width: 100%
</style>

<template lang="pug">
.container
  .query.box
    .field
      .label LeanStorage Class
      .select.mgb-10
        select(v-model="selectedClass")
          option(value="") Select a Class
          option(v-for="(c, key) in classes") {{ key }}
    .field(v-if="conditions.length")
      .label Conditions
      .condition(v-for="(condition, i) in conditions")
        .select
          select(v-model="condition.col")
            option(value="") Select a Column
            option(v-for="column in queryColumns") {{column}}
        .select(v-if="selectedClass && condition.col")
          select(v-model="condition.id")
            option(v-for="operator in operators.types[classes[selectedClass][condition.col].type]", :value="operator.id") {{ operator.name }}
        input.input(placeholder="Value", v-model="condition.value")
        .delete.is-medium(@click="conditions.splice(i, 1)")
    .field
      .label Options
      label.checkbox
        input(type="checkbox", v-model="options.showObjectId")
        |  Show objectId
    .toolbar
      .button.is-primary.mgr-10(@click="search", :disabled="!selectedClass", :class="{'is-loading': loading}") Search
      .button.is-info(@click="addCondition") Add a condition
      .button.is-warning.is-pulled-right(@click="disconnect") Disconnect
  .results.box
    table.table(v-if="results.length")
      thead
        tr
          th(v-for="col in columns") {{ col }}
      tbody
        tr(v-for="line in results")
          td(v-for="col in columns") {{ display(line[col], classes[selectedClass][col].type) }}
    .message(v-else)
      .message-body No Data
</template>

<script>
import axios from 'axios'
import _ from 'lodash'
import format from '../lib/format'
import CQL from '../lib/cql'
import operators from '../lib/operators'

var api = {}

export default {
  data () {
    return {
      classes: {},
      selectedClass: '',
      conditions: [
        { col: '', id: 'equal', value: '' }
      ],
      operators,
      loading: false,
      results: [],
      options: {
        showObjectId: false
      }
    }
  },
  computed: {
    columns () {
      if (!this.selectedClass) return []
      var keys = Object.keys(this.classes[this.selectedClass])
      if (!this.options.showObjectId) keys = keys.filter(key => key !== 'objectId')
      keys.sort((a, b) => {
        if (a === 'objectId') return -1
        else if (b === 'objectId') return 1
        else if (a === 'createdAt' || a === 'updatedAt') return 1
        else if (b === 'createdAt' || b === 'updatedAt') return -1
        else return 0
      })
      return keys
    },
    queryColumns () {
      if (!this.selectedClass) return []
      const allowedTypes = Object.keys(operators.types)
      return this.columns.filter(col => allowedTypes.includes(this.classes[this.selectedClass][col].type))
    }
  },
  watch: {
    selectedClass (val) {
      this.conditions = [{ col: '', id: 'equal', value: '' }]
      if (val) this.search()
    }
  },
  methods: {
    getSchema () {
      return api.get('/schemas').then(result => {
        this.classes = _.pickBy(result.data, (val, key) => key.indexOf('_'))
      })
    },
    addCondition () {
      this.conditions.push({ col: '', id: 'equal', value: '' })
    },
    search () {
      if (this.loading) return
      if (!this.selectedClass) return window.alert('Please select a LeanStorage Class')
      var cql = CQL.generate(this.selectedClass, this.conditions)
      this.loading = true
      api.get('/cloudQuery', {
        params: { cql }
      }).then(result => {
        this.results = result.data.results
      }).catch(err => {
        window.alert(err)
      }).then(() => {
        this.loading = false
      })
    },
    display: format,
    disconnect () {
      this.$router.push('/connect')
    }
  },
  mounted () {
    this.getSchema()
  },
  beforeRouteEnter (to, from, next) {
    var appId = window.localStorage.getItem('lse_app_id')
    var appKey = window.localStorage.getItem('lse_app_key')
    if (!appId || !appKey) return next('/connect')
    api = axios.create({
      baseURL: 'https://api.leancloud.cn/1.1',
      headers: {
        'X-LC-Id': appId,
        'X-LC-Key': appKey + ',master'
      }
    })
    next()
  }
}
</script>
