import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import CQL from '../lib/cql'
import operators from '../lib/operators'
import xlsx from '../lib/xlsx'
import format from '../lib/format'

Vue.use(Vuex)
var api = {}

function getColumns (state) {
  if (!state.selectedClass) return []
  var keys = Object.keys(state.classes[state.selectedClass])
  keys.sort((a, b) => {
    if (a === 'objectId') return -1
    else if (b === 'objectId') return 1
    else if (a === 'createdAt' || a === 'updatedAt') return 1
    else if (b === 'createdAt' || b === 'updatedAt') return -1
    else return 0
  })
  return keys
}

var store = new Vuex.Store({
  state: {
    classes: {},
    selectedClass: '',
    loading: false,
    count: 0,
    results: [],
    conditions: [
      { col: '', id: 'equal', value: '' }
    ]
  },
  getters: {
    columns: getColumns,
    queryColumns (state) {
      if (!state.selectedClass) return []
      const allowedTypes = Object.keys(operators.types)
      return getColumns(state).filter(col => allowedTypes.includes(state.classes[state.selectedClass][col].type))
    }
  },
  mutations: {
    addNewCondition (state) {
      state.conditions.push({ col: '', id: 'equal', value: '' })
    },
    updateCondition (state, payload) {
      const index = payload.index
      delete payload.index
      Object.assign(state.conditions[index], payload)
    },
    removeCondition (state, i) {
      state.conditions.splice(i, 1)
    },
    resetCondition (state) {
      state.conditions = [{ col: '', id: 'equal', value: '' }]
    },
    selectClass (state, className) {
      state.selectedClass = className
    },
    initKeys (state, {appId, appKey, domain}) {
      api = axios.create({
        baseURL: `https://${domain}/1.1`,
        headers: {
          'X-LC-Id': appId,
          'X-LC-Key': appKey + ',master'
        }
      })
    },
    clearResults (state) {
      state.results = []
    }
  },
  actions: {
    getClasses (context) {
      return api.get('/schemas').then(result => {
        context.state.classes = _.pickBy(result.data, (val, key) => key.indexOf('_'))
      })
    },
    search (context) {
      context.state.loading = true
      return Promise.all([
        api.get('/cloudQuery', { params: { cql: CQL.search(context.state.selectedClass, context.state.conditions) } }),
        api.get('/cloudQuery', { params: { cql: CQL.count(context.state.selectedClass, context.state.conditions) } })
      ]).then(result => {
        context.state.results = result[0].data.results
        context.state.count = result[1].data.count
        context.state.loading = false
      }).catch(err => {
        context.state.loading = false
        throw err
      })
    },
    exportToFile (context, fileType) {
      context.state.loading = true
      var results = []
      api.get('/cloudQuery', { params: { cql: CQL.count(context.state.selectedClass, context.state.conditions) } })
      .then(result => {
        var count = result.data.count
        var p = Promise.resolve()
        const per = 1000
        var times = Math.ceil(count / per)
        for (let i = 0; i < times; i++) {
          p = p.then(function () {
            return api.get('/cloudQuery', {
              params: {
                cql: CQL.search(context.state.selectedClass, context.state.conditions, per, per * i)
              }
            }).then(result => {
              results = results.concat(result.data.results)
            })
          })
        }
        return p
      })
      .then(() => {
        results.forEach(line => {
          for (var key in line) {
            line[key] = format.asFile(line[key], context.state.classes[context.state.selectedClass][key].type)
          }
        })
        xlsx.exportToFile(results, getColumns(context.state), fileType)
        context.state.loading = false
      }).catch(err => {
        context.state.loading = false
        throw err
      })
    }
  }
})

export default store
