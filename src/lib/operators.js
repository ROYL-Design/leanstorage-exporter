import moment from 'moment'

const equal = { id: 'equal', name: '=', template: val => `= '${val}'`, valueType: 'text' }
const notEqual = { id: 'notEqual', name: '!=', template: val => `!= '${val}'`, valueType: 'text' }
const lessThan = { id: 'lessThan', name: '<', template: val => `< '${val}'`, valueType: 'number' }
const greaterThan = { id: 'greaterThan', name: '>', template: val => `> '${val}'`, valueType: 'number' }
const lessThanOrEqual = { id: 'lessThanOrEqual', name: '<=', template: val => `<= '${val}'`, valueType: 'number' }
const greaterThanOrEqual = { id: 'greaterThanOrEqual', name: '>=', template: val => `>= '${val}'`, valueType: 'number' }
const before = { id: 'before', name: 'before', template: val => `< date('${moment(val).toISOString()}')`, valueType: 'date' }
const after = { id: 'after', name: 'after', template: val => `> date('${moment(val).toISOString()}')`, valueType: 'date' }
const contains = { id: 'contains', name: 'contains string', template: val => `= '${val}'`, valueType: 'text' }
const notContains = { id: 'notContains', name: 'not contains string', template: val => `!= '${val}'`, valueType: 'text' }
const containsNumber = { id: 'containsNumber', name: 'contains number', template: val => `= ${val}`, valueType: 'number' }
const notContainsNumber = { id: 'notContainsNumber', name: 'not contains number', template: val => `!= ${val}`, valueType: 'number' }
const exists = { id: 'exists', name: 'exists', template: val => `is exists`, valueType: null }
const notExists = { id: 'notExists', name: 'not exists', template: val => `is not exists`, valueType: null }

export default {
  equal,
  notEqual,
  lessThan,
  greaterThan,
  lessThanOrEqual,
  greaterThanOrEqual,
  before,
  after,
  contains,
  notContains,
  containsNumber,
  notContainsNumber,
  exists,
  notExists,
  types: {
    'String': [equal, notEqual, exists, notExists],
    'Number': [equal, notEqual, lessThan, greaterThan, lessThanOrEqual, greaterThanOrEqual, exists, notExists],
    'Boolean': [equal, exists, notExists],
    'Date': [before, after, exists, notExists],
    'Array': [contains, notContains, containsNumber, notContainsNumber, exists, notExists],
    'Object': [exists, notExists]
  }
}
