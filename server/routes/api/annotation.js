const cors = require('cors')
const models = require('../../models')
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
  }
}
module.exports = (app) => {
  app.options('/api/note', cors(corsOpts))
  app.post('/api/note', cors(corsOpts), async(req, res) => {
    console.log(req.user)
    const user = await models.annotationUser.findOne({ where: { email: req.user.email } })
    console.log(user)
    const { body } = req
    const note = await models.annotation.create({ ...body, annotationUserId: user.dataValues.id })
    res.json(note)
  })
  app.put('/api/note/:id', cors(corsOpts), async (req, res) => {
    const { id } = req.params
    const { body } = req
    const note = await models.annotation.findOne({ where: { id } })
    await note.update(body)
    res.json(note)
  })
}
