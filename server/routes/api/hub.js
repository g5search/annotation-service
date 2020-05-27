const cors = require('cors')
const sequelize = require('sequelize')
const axios = require('axios')
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
const { Op } = require('sequelize')
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
  app.get('/api/core/client/:clientId', async (req, res) => {
    const { clientId } = req.params
    const client = await models.g5_updatable_client.findOne({
      where: {
        properties: {
          core_id: clientId
        }
      },
      attributes: [
        'urn',
        'name',
        [sequelize.json('properties.branded_name'), 'brandedName']
      ]
    })
    res.json({ clientUrn: client.dataValues.urn })
  })
  app.get('/api/core/services/:serviceId', async (req, res) => {
    const { serviceId } = req.params
    // get location and client urn by service Id
  })
  app.get('/api/core/services/:serviceId', async (req, res) => {
    const { serviceId } = req.params
    // get location and client urn by service Id
  })
  app.get('api/core/location/:locationId', async (req, res) => {
    const { locationId } = req.params
    const client = await models.g5_updatable_location.findOne({
      where: {
        properties: {
          core_store_id: locationId
        }
      }
    })
    res.json({ clientUrn: client.dataValues.client_urn })
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
      clients = await models.g5_updatable_client.findAll({
        where,
        attributes: [
          'urn',
          'name',
          // [sequelize.json('properties.core_id'), 'clientId'],
          // [sequelize.json('properties.g5_internal'), 'g5Internal'],
          [sequelize.json('properties.branded_name'), 'brandedName']
          // [sequelize.json('properties.domain_type'), 'domainType'],
          // [sequelize.json('properties.vertical'), 'vertical'],
          // [sequelize.json('properties.search_analyst.name'), 'strategist']
        ],
        order: [
          ['name', 'asc']
        ]
      })
    } else {
      clients = await models.g5_updatable_client.getAllNonInternal(where)
    }
    res.json(clients)
  })
}
