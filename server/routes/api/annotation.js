const cors = require('cors')
const axios = require('axios')
const { Op } = require('sequelize')
const models = require('../../models/primary')
const objectUtil = require('../../controllers/utilities/object')
const whitelist = [
  /chrome-extension:\/\/[a-z]*$/,
  /http:\/\/localhost:[\d]*/,
  /https:\/\/notes\.g5marketingcloud\.com/
]
const crsSync = require('../../controllers/jobs/crsSync')
const annCntlr = require('../../controllers/annotation')
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

  // Creates Note
  app.post('/api/v1/note', cors(corsOpts), async (req, res) => {
    try {
      const note = await annCntlr.createNote(req)
      res.json(note)
    } catch (e) {
      res.status(500).send(e.message)
    }
  })

  app.put('/api/v1/note/:id', async (req, res) => {
    const { id } = req.params
    const { body } = req
    const update = await models.annotation.updateNote(id, body)
    res.json(update)
  })

  // Gets Users Notes
  app.get('/api/v1/notes', async (req, res) => {
    const { query } = req

    const {
      categoryWhere,
      typeWhere,
      userWhere,
      clientWhere,
      noGroup: where,
      locationWhere,
      appWhere,
      teamWhere,
      dates,
      searchBy
    } = objectUtil.group({
      categoryWhere: [['annotationName', 'name']],
      typeWhere: [['annotationType', 'name']],
      userWhere: ['email'],
      clientWhere: [['clientUrn', 'urn']],
      locationWhere: [['locationUrns', 'urn']],
      searchBy: [['searchBy', 'column']],
      dates: ['to', 'from'],
      teamWhere: [['team', 'name']],
      appWhere: [['app', 'name']],
      skip: ['access_token']
    }, query)

    if (dates.to && dates.from) {
      where[searchBy.column] = { [Op.between]: [dates.from, dates.to] }
    } else if (dates.to) {
      where[searchBy.column] = { [Op.lte]: dates.to }
    } else if (dates.from) {
      where[searchBy.column] = { [Op.gte]: dates.from }
    }
    const includeArray = [
      {
        model: models.annotationCategory,
        where: categoryWhere
      },
      {
        model: models.annotationType,
        where: typeWhere,
        required: false
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
        required: false,
        attributes: [
          'name',
          'display_name',
          'urn'
        ]
      },
      {
        model: models.app,
        where: appWhere
      },
      {
        model: models.team,
        where: teamWhere
      }
    ]
    const include = whereCheck(includeArray)
    const notes = await models.annotation.findAll({
      where,
      include
    })
    const mappedNotes = notes.map((note) => {
      const {
        id,
        internal,
        annotationCategory,
        annotationType,
        annotationUser,
        salesforce_id,
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
      // TODO remove reducing functions duplicate data in the return. We need to full objects on the front-end
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
        salesforce_id,
        startDate,
        endDate,
        createdAt,
        updatedAt,
        salesforceSync,
        note: html,
        annotation,
        clientName: g5_updatable_client ? g5_updatable_client.name : null,
        locationNames: g5_updatable_locations.map((l) => {
          return l.display_name ? l.display_name : l.name
        }),
        client: g5_updatable_client,
        locations: g5_updatable_locations
      }
    })
    res.json(mappedNotes)
  })

  // Deletes Notes
  app.delete('/api/v1/notes/:id', async (req, res) => {
    try {
      await models.annotation.destroy({
        where: {
          id: req.params.id
        }
      })
      res.sendStatus(200)
    } catch (e) {
      res.status(500).send(e.message)
    }
  })

  // Gets Strategists
  app.get('/api/v1/strategists', async (req, res) => {
    try {
      const strategists = await annCntlr.getStrategists()
      res.json(strategists)
    } catch (e) {
      res.status(400).send(e.message)
    }
  })

  app.get('/api/v1/crs/sync', async (req, res) => {
    const response = await axios.get('http://localhost:9541/api/annotation')
    crsSync(response.data)
    res.json(response.data)
  })
}
