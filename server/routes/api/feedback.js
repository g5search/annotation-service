const models = require('../../models')

module.exports = (app) => {
  app.post('/api/v1/feedback', async (req, res) => {
    try {
      const { type, comments } = req.body
      const { firstName, lastName } = req.user
      await models.feedback.create({
        name: `${firstName} ${lastName}`,
        type,
        comments
      })
      res.sendStatus(201)
    } catch {
      res.sendStatus(500)
    }
  })
}
