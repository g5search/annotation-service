const cors = require('cors')
const models = require('../../models')
const whitelist = [/chrome-extension:\/\/[a-z]*$/]
const objectUtil = require('../../controllers/utilities/object')
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

  app.put('/api/v1/note/:id', cors(corsOpts), async (req, res) => {
    const { id } = req.params
    const { body } = req
    const note = await models.annotation.findOne({ where: { id } })
    await note.update(body)
    res.json(note)
  })

  app.get('/api/v1/notes', async (req, res) => {
    const { query } = req
    let where = {}
    let categoryWhere = {}
    let typeWhere = {}
    let userWhere = {}
    let clientWhere = {}
    let locationWhere = {}
    if (Object.keys(query).length !== 0) {
      const { group1, group2 } = objectUtil.split(query, [
        'annotationName',
        'annotationType',
        'userEmail',
        'clients',
        'locations'
      ])
      categoryWhere = { name: group2.annotationName }
      typeWhere = { name: group2.annotationType }
      userWhere = { email: group2.userEmail }
      clientWhere = { urns: group2.clients }
      where = group1
    }
    const notes = await models.annotation.findAll({
      where,
      include: [
        {
          model: models.annotationCategory,
          where: categoryWhere
        },
        {
          model: models.annotationType,
          where: typeWhere
        },
        {
          model: models.annotationUser,
          where: userWhere
        },
        {
          model: models.g5_updatable_client,
          where: clientWhere,
          attributes: [
            'name',
            'urn'
          ]
        },
        {
          model: models.g5_updatable_location,
          where: locationWhere,
          attributes: [
            'name',
            'display_name',
            'urn'
          ]
        }
      ]
    })
    const mappedNotes = notes.map((note) => {
      const {
        internal,
        annotationCategory,
        annotationType,
        annotationUser,
        external_id,
        startDate,
        endDate,
        createdAt,
        updatedAt,
        salesforceSync,
        html,
        annotation,
        g5_updatable_client,
        g5_updatable_locations
      } = note.dataValues

      return {
        internal,
        annotationCategory: annotationCategory ? annotationCategory.name : null,
        annotationType: annotationType ? annotationType.name : null,
        annotationUser: (!annotationUser)
          ? null
          : `${annotationUser.first_name} ${annotationUser.last_name}`,
        external_id,
        startDate,
        endDate,
        createdAt,
        updatedAt,
        salesforceSync,
        note: html,
        annotation,
        client: g5_updatable_client.name,
        locations: g5_updatable_locations.map(l => l.name)
      }
    })
    res.json(mappedNotes)
  })

  app.get('/api/v1/strategists', async (req, res) => {
    const strategists = await models.annotationUser.findAll({
      attributes: ['first_name', 'last_name', 'email']
    })
    res.json(strategists)
  })
}
