const cors = require('cors')
const models = require('../../models')
const whitelist = [/chrome-extension:\/\/[a-z]*$/]
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
  app.post('/api/v1/note', cors(corsOpts), async(req, res) => {
    let user = null
    let annotationUserId = null
    if (req.user.email) {
      user = await models.annotationUser.findOne({ where: { email: req.user.email } })
      annotationUserId = user.dataValues.id
    }
    const { body } = req
    const note = await models.annotation.createAndAssociate({ ...body, annotationUserId })
    res.json(note)
  })
  app.put('/api/note/:id', cors(corsOpts), async (req, res) => {
    const { id } = req.params
    const { body } = req
    const note = await models.annotation.findOne({ where: { id } })
    await note.update(body)
    res.json(note)
  })
  app.get('/api/v1/notes', async (req, res) => {
    const notes = await models.annotation.findAll({
      include: [
        {
          model: models.annotationCategory
        },
        {
          model: models.annotationType
        },
        {
          model: models.annotationUser
        }
      ]
    })
    const mappedNotes = notes.map((note) => {
      const { internal, annotationCategory, annotationType, annotationUser, external_id, startDate, endDate, html, annotation } = note.dataValues
      return {
        internal,
        annotationCategory: annotationCategory ? annotationCategory.name : null,
        annotationType: annotationType ? annotationType.name : null,
        annotationUser: `${annotationUser.first_name} ${annotationUser.last_name}`,
        external_id,
        startDate,
        endDate,
        html,
        annotation
      }
    })
    res.json(mappedNotes)
  })
}
