const cors = require('cors')
const axios = require('axios')
const models = require('../../models')
const whitelist = [
  /chrome-extension:\/\/[a-z]*$/,
  /http:\/\/localhost:[\d]*/,
  /https:\/\/notes\.g5marketingcloud\.com/
]
const crsSync = require('../../controllers/jobs/crsSync')
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
  app.options('/api/v1/note', cors(corsOpts))
  app.post('/api/v1/note', cors(corsOpts), async (req, res) => {
    let user = null
    let annotationUserId = null
    const { body } = req
    if (req.user.email) {
      user = await models.annotationUser.findOne({ where: { email: req.user.email } })
      annotationUserId = user.dataValues.id
    } else if (body.user) {
      const [annotationUser] = await models.annotationUser.findOrCreate({
        where: {
          email: body.user.email
        },
        defaults: {
          email: body.user.email,
          first_name: body.user.firstName,
          last_name: body.user.lastName
        }
      })
      user = annotationUser
      annotationUserId = annotationUser.dataValues.id
    }
    const note = await models.annotation.createAndAssociate({ ...body, annotationUserId })
    res.json(note)
  })

  app.put('/api/v1/note/:id', async (req, res) => {
    const { id } = req.params
    const { body } = req
    const update = await models.annotation.updateNote(id, body)
    res.json(update)
  })

  app.get('/api/v1/notes', async (req, res) => {
    const { query } = req
    const notes = await models.annotation.findByQuery(query)
    res.json(notes)
  })

  app.delete('/api/v1/notes/:id', async (req, res) => {
    await models.annotation.destroy({
      where: {
        id: req.params.id
      }
    })
    res.sendStatus(200)
  })

  app.get('/api/v1/strategists', async (req, res) => {
    const strategists = await models.annotationUser.findAll({
      attributes: ['first_name', 'last_name', 'email']
    })
    res.json(strategists)
  })

  app.get('/api/v1/crs/sync', async (req, res) => {
    const response = await axios.get('http://localhost:9541/api/annotation')
    crsSync(response.data)
    res.json(response.data)
  })
}
