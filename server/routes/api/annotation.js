const models = require('../../models')
module.exports = (app) => {
  app.post('/api/note', async(req, res) => {
    const { body } = req
    const note = await models.annotation.create(body)
    res.json(note)
  })
  app.put('/api/note/:id', async (req, res) => {
    const { id } = req.params
    const { body } = req
    const note = await models.annotation.findOne({ where: { id } })
    await note.update(body)
    res.json(note)
  })
}
