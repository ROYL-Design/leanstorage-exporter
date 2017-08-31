import XLSX from 'xlsx'
import types from './types'
import download from 'downloadjs'

function exportToFile (data, header, fileType = 'xlsx', fileName = 'Data') {
  var type = types.filter(type => type.name === fileType)[0]
  var ws = XLSX.utils.json_to_sheet(data, { header, cellDates: true })
  var wb = { SheetNames: ['data'], Sheets: { data: ws } }
  var wbout = XLSX.write(wb, {
    bookType: fileType,
    type: 'binary'
  })
  // Add a BOM to make sure the file opened correctly by Excel
  // https://github.com/eligrey/FileSaver.js/issues/28
  if (fileType === 'csv') wbout = '\uFEFF' + wbout
  download(wbout, fileName + type.extension, 'application/octet-stream')
}

export default {
  exportToFile
}
