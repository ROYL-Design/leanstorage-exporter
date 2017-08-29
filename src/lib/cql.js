import operators from './operators'

function where (conditions) {
  var cql = ''
  conditions = conditions.filter(c => c.col)
  if (conditions.length) {
    conditions = conditions.map(condition => {
      return `${condition.col} ${operators[condition.id].template(condition.value)}`
    })
    cql += ` where ${conditions.join(' and ')}`
  }
  return cql
}

function search (classname, conditions, limit=100, skip=0) {
  var cql = `select * from ${classname}`
  cql += where(conditions)
  cql += ` limit ${skip},${limit}`
  return cql
}

function count (classname, conditions) {
  var cql = `select count(*) from ${classname}`
  cql += where(conditions)
  return cql
}

export default { search, count }
