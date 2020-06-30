export default {
  methods: {
    getClients(activeDa = true, internal = false) {
      return this.$axios
        .$get(`api/hub/clients?activeDa=${activeDa}&internal=${internal}`)
    },
    getClientLocations(clientUrn) {
      return this.$axios.$get(`api/hub/clients/${clientUrn}/locations`)
    }
  }
}
