const equal = { id: 'equal', name: '=', template: val => `= '${val}'` }
const notEqual = { id: 'notEqual', name: '!=', template: val => `!= '${val}'` }
const lessThan = { id: 'lessThan', name: '<', template: val => `< '${val}'` }
const greaterThan = { id: 'greaterThan', name: '>', template: val => `> '${val}'` }
const lessThanOrEqual = { id: 'lessThanOrEqual', name: '<=', template: val => `<= '${val}'` }
const greaterThanOrEqual = { id: 'greaterThanOrEqual', name: '>=', template: val => `>= '${val}'` }
const before = { id: 'before', name: 'before', template: val => `< date(${val})` }
const after = { id: 'after', name: 'after', template: val => `> date(${val})` }
const contains = { id: 'contains', name: 'contains string', template: val => `= '${val}'` }
const notContains = { id: 'notContains', name: 'not contains string', template: val => `!= '${val}'` }
const containsNumber = { id: 'containsNumber', name: 'contains number', template: val => `= ${val}` }
const notContainsNumber = { id: 'notContainsNumber', name: 'not contains number', template: val => `!= ${val}` }
const exists = { id: 'exists', name: 'exists', template: val => `is exists` }
const notExists = { id: 'notExists', name: 'not exists', template: val => `is not exists` }

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
