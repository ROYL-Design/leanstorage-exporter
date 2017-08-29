import XLSX from 'xlsx'
import FileSaver from 'file-saver'

function s2ab (s) {
  var buf = new ArrayBuffer(s.length)
  var view = new Uint8Array(buf)
  for (var i=0; i!=s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF
  return buf
}

function exportToFile (data, header, fileName = 'Data.xlsx') {
  var ws = XLSX.utils.json_to_sheet(data, { header, cellDates: true })
  var wb = { SheetNames: ['data'], Sheets: { data: ws } }
  var wopts = { bookType: 'xlsx', bookSST: false, type: 'binary' }
  var wbout = XLSX.write(wb, wopts)
  FileSaver.saveAs(new Blob([s2ab(wbout)], { type: 'application/octet-stream' }), fileName)
}

export default {
  exportToFile
}
