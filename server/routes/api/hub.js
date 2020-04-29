const cors = require('cors')
const corsOpts = {
  origin: ['chrome-extension://ameopebgldmglpdalapgpnpelbmoochc'],
  preflightContinue: true,
  methods: 'GET'
}
const models = require('../../models')
module.exports = (app) => {
  // single route exception
  app.options('/api/hub/clients', cors(corsOpts))
  app.options('/api/hub/clients/:clientUrn/locations', cors(corsOpts))

  app.get('/api/hub/clients/:clientUrn/locations', cors(corsOpts), async (req, res) => {
    const { clientUrn } = req.params
    const locations = await models.g5_updatable_location.getByClientUrn(clientUrn)
    res.json(locations)
  })

  app.get('/api/hub/clients', cors(corsOpts), async (req, res) => {
    const { internal } = req.query
    let clients
    if (internal) {
      clients = await models.g5_updatable_client.findAll()
    } else {
      clients = await models.g5_updatable_client.getAllNonInternal()
    }
    res.json(clients)
  })
}
