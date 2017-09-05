import moment from 'moment'

function display (content, format) {
  if (content === undefined) return ''
  else if (format === 'Date') return moment(content).format('YYYY-MM-DD HH:mm:ss')
  else if (format === 'GeoPoint') return `${content.longitude},${content.latitude}`
  return content
}
function asFile (content, format) {
  if (content === undefined) return ''
  else if (format === 'Date') return new Date(content)
  else if (format === 'GeoPoint') return `${content.longitude},${content.latitude}`
  return content
}

export default { display, asFile }
