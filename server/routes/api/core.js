const sequelize = require('sequelize')
const axios = require('axios')
const models = require('../../models')
const { CRS_URL: crsUrl } = process.env
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

module.exports = (app) => {
  app.options('/api/core/client/:clientId', cors(corsOpts))
  app.get('/api/core/client/:clientId', cors(corsOpts), async (req, res) => {
    const { clientId } = req.params
    const client = await models.g5_updatable_client.findOne({
      where: {
        properties: { core_id: clientId }
      },
      attributes: [
        'urn',
        'name',
        [sequelize.json('properties.branded_name'), 'brandedName']
      ]
    })
    res.json({ clientUrn: client.dataValues.urn })
  })

  app.options('/api/core/services/:serviceId', cors(corsOpts))
  app.get('/api/core/services/:serviceId', cors(corsOpts), async (req, res) => {
    const { serviceId } = req.params
    const { data } = await axios.get(`${crsUrl}/api/core/services/${serviceId}`)
    const { urn, client_urn } = data
    res.json({ locationUrn: urn, clientUrn: client_urn })
  })

  app.options('/api/core/location/:locationId', cors(corsOpts))
  app.get('/api/core/location/:locationId', cors(corsOpts), async (req, res, err) => {
    const { locationId } = req.params
    const client = await models.g5_updatable_location.findOne({
      where: {
        properties: { core_store_id: locationId }
      }
    })
    if (client) {
      res.json({
        clientUrn: client.dataValues.client_urn,
        locationUrn: client.dataValues.urn
      })
    } else {
      res.sendStatus(500)
      throw err
    }
  })
}
