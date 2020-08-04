const createNote = require('../../controllers/jobs/createNote')
const objectUtil = require('../../controllers/utilities/object')
module.exports = (models, Sequelize, sequelize) => {
  const { Op } = Sequelize
  models.annotation.createAndAssociate = async (params) => {
    const { clientUrn, internal, locationUrns, category: noteCategory, actionType: type, annotation, html, startDate, endDate, user, createdAt } = params
    let { annotationUserId } = params
    let actionType = null
    if (type) {
      [actionType] = await models.annotationType.findOrCreate({
        defaults: { name: type },
        where: { name: type }
      })
    }
    if (user) {
      const [annotationUser] = await models.annotationUser.findOrCreate({
        where: { email: user.email },
        defaults: {
          email: user.email,
          first_name: user.firstName,
          last_name: user.lastNae
        }
      })
      annotationUserId = annotationUser.dataValues.id
    }
    let category = null
    if (noteCategory) {
      [category] = await models.annotationCategory.findOrCreate({
        defaults: { name: noteCategory },
        where: { name: noteCategory }
      })
    }
    // console.log({ locationUrns })
    const locations = await models.g5_updatable_location.findAll({
      where: {
        urn: {
          [Op.in]: locationUrns
        }
      }
    })
    const client = await models.g5_updatable_client.findOne({
      where: {
        urn: clientUrn
      }
    })
    const result = await sequelize.transaction(async (t) => {
      const update = {
        html,
        startDate,
        endDate,
        annotation,
        internal,
        annotationUserId,
        g5UpdatableClientId: client.dataValues.id,
        appId: 1,
        teamId: 1
      }
      if (createdAt) {
        update.createdAt = createdAt
      }
      const note = await models.annotation.create(update, { transaction: t })
      await note.addG5_updatable_locations(locations, { transaction: t })
      await note.setAnnotationType(actionType, { transaction: t, hooks: false })
      await note.setAnnotationCategory(category, { transaction: t, hooks: false })
      return note
    })

    return result
  }
  models.annotation.findByQuery = (params) => {
    const whereGroups = objectUtil.group({
      categoryWhere: [['annotationName', 'name']],
      typeWhere: [['annotationType', 'name']],
      userWhere: ['email'],
      clientWhere: [['clientUrn', 'urn']],
      locationWhere: [['locationUrns', 'urn']],
      searchBy: [['searchBy', 'column']],
      dates: ['to', 'from'],
      teamWhere: [['team', 'name']],
      appWhere: [['app', 'name']]
    }, params)
    return models.annotation.getAllNotes(whereGroups)
  }
  models.annotation.getAllNotes = async (params) => {
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
    } = params
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
    return notes.map((note) => {
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
  }
  models.annotation.updateNote = (id, body) => {
    return new Promise((resolve, reject) => {
      try {
        sequelize.transaction(async (t) => {
          t.afterCommit(async () => {
            const reload = await note.reload()
            resolve(reload)
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
      } catch (error) {
        reject(Error(error))
      }
    })
  }
}
function whereCheck(includesArray) {
  return includesArray.map((mod) => {
    if (Object.keys(mod.where).length === 0) {
      delete mod.where
    }
    return mod
  })
}
