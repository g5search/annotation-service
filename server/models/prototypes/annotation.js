const { Op } = require('sequelize')
module.exports = (models) => {
  models.annotation.createAndAssociate = async (params) => {
    const { clientUrn, internal, locationUrns, category: noteCategory, actionType: type, annotation, html, startDate, endDate, annotationUserId } = params
    const [actionType] = await models.annotationType.findOrCreate({
      defaults: { name: type },
      where: { name: type }
    })
    const [category] = await models.annotationCategory.findOrCreate({
      defaults: { name: noteCategory },
      where: { name: noteCategory }
    })
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
      annotationUserId
    })
    await note.setAnnotationType(actionType)
    await note.setAnnotationCategory(category)
    await note.addG5_updatable_locations(locations)
    await note.setG5_updatable_client(client)
    return note
  }
}
