const sequelize = require('sequelize')
const axios = require('axios')
const models = require('../../models')
const {
  CRS_URL: crsUrl
} = process.env
module.exports = (app, passport) => {
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
    const { data } = await axios.get(`${crsUrl}/api/core/services/${serviceId}`)
    const { urn, client_urn } = data
    console.log(data)
    // res.json(data)
    res.json({ locationUrn: urn, clientUrn: client_urn })
  })
  app.get('/api/core/location/:locationId', async (req, res) => {
    const { locationId } = req.params
    const client = await models.g5_updatable_location.findOne({
      where: {
        properties: {
          core_store_id: locationId
        }
      }
    })
    res.json({ clientUrn: client.dataValues.client_urn, locationUrn: client.dataValues.urn })
  })
}
