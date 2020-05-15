const cors = require('cors')
const whitelist = [
  /chrome-extension:\/\/[a-z]*$/
]
const corsOpts = {
  origin: (origin, callback) => {
    if (whitelist.some(pattern => pattern.test(origin)) || !origin) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
  preflightContinue: true,
  methods: 'GET'
}
const models = require('../../models')
const { Op } = require('sequelize')
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
    const { internal, activeDa } = req.query
    let clients
    let where = {}
    if (activeDa) {
      where = {
        properties: {
          search_analyst: {
            [Op.not]: null
          }
        }
      }
    }
    if (internal) {
      clients = await models.g5_updatable_client.findAll({ where })
    } else {
      clients = await models.g5_updatable_client.getAllNonInternal(where)
    }
    res.json(clients)
  })
}
