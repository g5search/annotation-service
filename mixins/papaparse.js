import Papa from 'papaparse'
export default {
  data() {
    return {
      csv: '',
      downloadCsv: ''
    }
  },
  methods: {
    unparse(items) {
      this.csv = Papa.unparse(items)
      const csvData = new Blob([this.csv], {
        type: 'text/csv;charset=utf-8;'
      })
      this.downloadCsv = window.URL.createObjectURL(csvData)
    }
  }
}
