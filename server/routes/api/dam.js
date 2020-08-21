const damModels = require('../../models/dam')
module.exports = (app) => {
  app.get('/api/v1/dam/workq/:clientUrn', async (req, res) => {
    const { clientUrn: client_urn } = req.params
    const clientItems = await damModels.task_event.findByQuery({ client_urn, ...req.query })
    res.json(clientItems)
  })
}
