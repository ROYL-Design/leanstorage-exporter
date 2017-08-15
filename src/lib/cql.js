import operators from './operators'

function generate (classname, conditions) {
  var cql = `select * from ${classname}`
  conditions = conditions.filter(c => c.col)
  if (conditions.length) {
    conditions = conditions.map(condition => {
      return `${condition.col} ${operators[condition.id].template(condition.value)}`
    })
    cql += ` where ${conditions.join(' and ')}`
  }
  return cql
}

export default { generate }
