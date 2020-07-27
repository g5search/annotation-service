import Papa from 'papaparse'
export default {
  data() {
    return {
      csv: '',
      downloadCsv: ''
    }
  },
  methods: {
    unparse(items, columns = null) {
      this.csv = Papa.unparse(items, {
        header: true,
        columns
      })
      const csvData = new Blob([this.csv], {
        type: 'text/csv;charset=utf-8;'
      })
      this.downloadCsv = window.URL.createObjectURL(csvData)
    }
  }
}
