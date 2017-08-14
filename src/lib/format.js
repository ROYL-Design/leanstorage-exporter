import moment from 'moment'

export default function (content, format) {
  if (format === 'Date') return moment(content).format('YYYY-MM-DD HH:mm:ss')
  else if (format === 'GeoPoint') return `${content.longitude},${content.latitude}`
  return content
}
