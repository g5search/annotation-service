export default {
  methods: {
    createQuery(evt = {}) {
      const endpoint = 'api/v1/notes?'
      const app = 'app=notesService&'
      const email = evt.userEmail ? `email=${evt.userEmail}&` : ''
      const clientUrn = evt.clientUrn ? `clientUrn=${evt.clientUrn}&` : ''
      const locationUrns = evt.locationUrns ? `locationUrns=${evt.locationUrns}&` : ''
      const searchBy = evt.searchBy ? `searchBy=${evt.searchBy}&` : 'searchBy=createdAt&'
      const fromDate = evt.from ? `from=${evt.from}&` : ''
      const toDate = evt.to ? `to=${evt.to}&` : ''
      const category = evt.annotationName ? `annotationName=${evt.annotationName}&` : ''
      const internal = (evt.isInternal !== null && evt.isInternal !== undefined) ? `internal=${evt.isInternal}&` : ''
      const type = evt.annotationType ? `annotationType=${evt.annotationType}` : ''

      const query = `${endpoint}${app}${email}${category}${clientUrn}${locationUrns}${searchBy}${fromDate}${toDate}${internal}${type}`
      this.$emit('REQUEST_TABLE', query)
      return query
    }
  }
}
