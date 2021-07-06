const { crs } = require('../../controllers/queue')

module.exports = (app) => {
  app.post('/api/v1/crs/add', async (req, res) => {
    await crs.add('Import Notes from CRS', { notes: req.body.notes })
    res.sendStatus(201)
  })
}
