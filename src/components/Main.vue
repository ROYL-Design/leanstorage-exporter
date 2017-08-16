<style lang="sass" scoped>
.container
  padding: 20px 0
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
      Condition(v-for="(condition, i) in conditions", :index="i", :key="i")
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
import _ from 'lodash'
import format from '../lib/format'
import operators from '../lib/operators'
import Condition from './Condition'
import store from '../store'
import { mapGetters, mapState } from 'vuex'

export default {
  data () {
    return {
      operators,
      options: {
        showObjectId: false
      }
    }
  },
  computed: {
    ...mapState(['classes', 'conditions', 'loading', 'results']),
    ...mapGetters(['queryColumns']),
    columns () {
      var columns = this.$store.getters.columns
      if (!this.options.showObjectId) columns = columns.filter(col => col !== 'objectId')
      return columns
    },
    selectedClass: {
      get () {
        return this.$store.state.selectedClass
      },
      set (value) {
        this.$store.commit('selectClass', value)
      }
    }
  },
  watch: {
    selectedClass (val) {
      this.$store.commit('resetCondition')
      if (val) this.search()
    }
  },
  methods: {
    addCondition () {
      this.$store.commit('addNewCondition')
    },
    search () {
      if (this.loading) return
      if (!this.selectedClass) return window.alert('Please select a LeanStorage Class')
      this.$store.dispatch('search').catch(err => {
        window.alert(err)
      })
    },
    display: format,
    disconnect () {
      this.$router.push('/connect')
    }
  },
  mounted () {
    this.$store.dispatch('getClasses')
  },
  beforeRouteEnter (to, from, next) {
    var appId = window.localStorage.getItem('lse_app_id')
    var appKey = window.localStorage.getItem('lse_app_key')
    if (!appId || !appKey) return next('/connect')
    store.commit('initKeys', { appId, appKey })
    next()
  },
  components: { Condition }
}
</script>
