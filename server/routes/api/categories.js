const models = require('../../models/primary')
module.exports = (app) => {
  app.get('/api/v1/categories', async (req, res) => {
    const categories = await models.annotationCategory.findAll()
    res.json(categories)
  })
}
