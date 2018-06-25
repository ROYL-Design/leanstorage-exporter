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
    .field
      .label Conditions
      Condition(v-for="(condition, i) in conditions", :index="i", :key="i")
      .button.is-light.is-small(@click="addCondition") Add a condition
    .field
      .label Options
      label.checkbox
        input(type="checkbox", v-model="options.showObjectId")
        |  Show objectId
    .toolbar
      .button.is-info.mgr-10(@click="search", :disabled="!selectedClass", :class="{'is-loading': loading}") Search
      .select.mgr-10
        select(v-model="options.exportFileType")
          option(v-for="type in fileTypes", :value="type.name") {{ type.extension }} | {{ type.description }}
      .button.is-success(@click="exportToFile", :disabled="!selectedClass || loading") Export
      .button.is-warning.is-pulled-right(@click="disconnect") Disconnect
  .results.box
    .title.is-6(v-if="results.length") Total: {{ count }}{{ count > 100 ? ' (showing top 100)' : '' }}
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
import Condition from './Condition'
import store from '../store'
import { mapGetters, mapState } from 'vuex'
import fileTypes from '../lib/types'

export default {
  data () {
    return {
      options: {
        showObjectId: false,
        exportFileType: 'xlsx'
      },
      fileTypes
    }
  },
  computed: {
    ...mapState(['classes', 'conditions', 'loading', 'results', 'count']),
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
        this.$store.commit('clearResults')
        this.$store.commit('resetCondition')
        this.$store.commit('selectClass', value)
        if (value) this.search()
      }
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
    exportToFile () {
      if (this.loading) return
      if (!this.selectedClass) return window.alert('Please select a LeanStorage Class')
      this.$store.dispatch('exportToFile', this.options.exportFileType).catch(err => {
        window.alert(err)
      })
    },
    display: format.display,
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
    var domain = window.localStorage.getItem('lse_domain')
    if (!appId || !appKey || !domain) return next('/connect')
    store.commit('initKeys', { appId, appKey, domain })
    next()
  },
  components: { Condition }
}
</script>
