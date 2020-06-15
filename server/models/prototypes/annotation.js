const { Op } = require('sequelize')
module.exports = (models) => {
  models.annotation.createAndAssociate = async (params) => {
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
    const note = await models.annotation.create({
      html,
      startDate,
      endDate,
      annotation,
      internal,
      annotationUserId,
      annotationCategoryId: category.dataValues.id,
      annotationTypeId: actionType.dataValues.id,
      g5UpdatableClientId: client.dataValues.id
    })
    // await note.setAnnotationType(actionType)
    // await note.setAnnotationCategory(category)
    await note.addG5_updatable_locations(locations)
    // await note.setG5_updatable_client(client)
    return note
  }
}
