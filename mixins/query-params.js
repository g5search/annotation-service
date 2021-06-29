export default {
  data () {
    return {}
  },
  computed: {
  },
  methods: {
    updateQueryParams (data) {
      const currentQuery = JSON.parse(JSON.stringify(this.$route.query))
      const query = this.getQuery(data, currentQuery)
      this.$router.push({ path: this.$route.path, query })
    },
    getQuery (data, currentQuery) {
      for (const prop in data) {
        if (data[prop] === null || data[prop] === undefined) {
          delete currentQuery[prop]
        } else {
          currentQuery[prop] = data[prop]
        }
      }
      return Object.keys(currentQuery).length > 0 ? currentQuery : null
    }
  }
}
