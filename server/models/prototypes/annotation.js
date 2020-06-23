const sequelize = require('sequelize')
const createNote = require('../../controllers/jobs/createNote')
const { Op } = sequelize
module.exports = (models, Sequelize) => {
  models.annotation.createAndAssociate = async (params) => {
    // const t = await Sequelize.transaction()
    const { clientUrn, internal, locationUrns, category: noteCategory, actionType: type, annotation, html, startDate, endDate, user } = params
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
    const result = await Sequelize.transaction(async (t) => {
      const note = await models.annotation.create({
        html,
        startDate,
        endDate,
        annotation,
        internal,
        annotationUserId,
        g5UpdatableClientId: client.dataValues.id
      }, { transaction: t })
      await note.addG5_updatable_locations(locations, { transaction: t })
      await note.setAnnotationType(actionType, { transaction: t })
      await note.setAnnotationCategory(category, { transaction: t })
      return note
    })

    return result
  }
}
