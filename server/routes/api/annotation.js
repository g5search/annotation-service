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

  // DUPLICATE ROUTE FOR SAME ORIGIN API (CORS is blocking this)
  app.post('/api/v1/new-note', async(req, res) => {
    let user = null
    let annotationUserId = null
    const { body } = req
    console.log({ body, user: req.user })
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
    console.log({ body })
    // client
    // locations
    // const [annotationUser] = await models.annotationUser.findOne({
    //   where: { email: body.user }
    // })
    const note = await models.annotation.findOne({ where: { id } })
    // TODO if client or locations change, preserve previous values to reassociate SF task.
    await note.update(body)
    res.json(note)
  })

  // returns simplified user to client-side
  app.get('/api/v1/whoami', async (req, res) => {
    if (req.user.email) {
      const { email, firstName, lastName } = req.user
      res.json({ email, firstName, lastName })
    } else {
      res.sendStatus(404)
    }
  })

  app.get('/api/v1/notes', async (req, res) => {
    const { query } = req
    const {
      categoryWhere,
      typeWhere,
      userWhere,
      clientWhere,
      noGroup: where
    } = objectUtil.group({
      categoryWhere: ['annotationName'],
      typeWhere: ['annotationType'],
      userWhere: ['email'],
      clientWhere: [['clientUrn', 'urn']],
      locationWhere: ['urn'],
      searchBy: ['searchBy']
    }, query)

    console.log({ userWhere, categoryWhere, where, typeWhere, clientWhere })
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
          // where: locationWhere,
          attributes: [
            'name',
            'display_name',
            'urn'
          ]
        }
      ]
    })
    console.log({ notes: notes.length })
    const mappedNotes = notes.map((note) => {
      const {
        id,
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
        id,
        internal,
        annotationCategory: annotationCategory ? { text: annotationCategory.name, value: annotationCategory.name } : null,
        annotationType: annotationType ? annotationType.name : null,
        annotationUser: (!annotationUser)
          ? null
          : `${annotationUser.first_name} ${annotationUser.last_name}`,
        user: (!annotationUser)
          ? null
          : {
            text: `${annotationUser.first_name} ${annotationUser.last_name}`,
            value: annotationUser.email
          },
        external_id,
        startDate,
        endDate,
        createdAt,
        updatedAt,
        salesforceSync,
        note: html,
        annotation,
        clientName: g5_updatable_client ? g5_updatable_client.name : null,
        locationNames: g5_updatable_locations.map(l => l.name),
        client: g5_updatable_client,
        locations: g5_updatable_locations
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
