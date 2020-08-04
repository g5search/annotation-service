const cors = require('cors')
const axios = require('axios')
const { Op } = require('sequelize')
const models = require('../../models/primary')
const whitelist = [
  /chrome-extension:\/\/[a-z]*$/,
  /http:\/\/localhost:[\d]*/,
  /https:\/\/notes\.g5marketingcloud\.com/
]
const objectUtil = require('../../controllers/utilities/object')
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

  app.put('/api/v1/note/:id', (req, res) => {
    const { id } = req.params
    const { body } = req
    console.log({ body })
    models.sequelize.transaction(async (t) => {
      t.afterCommit(async () => {
        const reload = await note.reload()
        console.log({ reload: reload.dataValues })
        res.json(reload)
      })
      const note = await models.annotation.findOne(
        {
          where: { id },
          include: [
            {
              model: models.g5_updatable_location
            },
            {
              model: models.g5_updatable_client
            },
            {
              model: models.annotationCategory
            },
            {
              model: models.annotationType
            }
          ]
        },
        { transaction: t }
      )
      const [category] = await models.annotationCategory.findOrCreate({
        defaults: { name: body.annotationCategory },
        where: { name: body.annotationCategory }
      })
      const [actionType] = await models.annotationType.findOrCreate({
        defaults: { name: body.annotationType },
        where: { name: body.annotationType }
      })
      const locations = await models.g5_updatable_location.findAll({
        where: {
          urn: {
            [Op.in]: body.locationUrns
          }
        }
      }, { transaction: t })
      await note.setG5_updatable_locations(locations, { transaction: t })
      await note.setAnnotationType(actionType, { transaction: t })
      await note.setAnnotationCategory(category, { transaction: t })
      return note.update(body, { transaction: t })
    })
    // console.log('Sending Results', result)
    // res.json(result)
  })

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

function whereCheck(includesArray) {
  return includesArray.map((mod) => {
    if (Object.keys(mod.where).length === 0) {
      delete mod.where
    }
    return mod
  })
}
