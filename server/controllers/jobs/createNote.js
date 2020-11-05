const moment = require('moment')
const models = require('../../models/primary')

module.exports = async function (job, sfApi) {
  if (!sfApi.isLoggedIn) {
    console.log('Signing In')
    await sfApi.signIn()
  }
  const { id } = job.data
  const dbAnnotation = await models.annotation.findOne({
    where: { id },
    include: [
      { model: models.g5_updatable_client },
      { model: models.annotationCategory },
      { model: models.annotationType },
      { model: models.annotationUser },
      { model: models.g5_updatable_location }
    ]
  })
  console.log(dbAnnotation)
  await job.log(dbAnnotation)
  const locationUrns = dbAnnotation.dataValues.g5_updatable_locations.map(location => location.dataValues.urn)
  const {
    html,
    annotation,
    internal,
    g5_updatable_client,
    annotationCategory,
    annotationType,
    annotationUser,
    createdAt,
    teamId
  } = dbAnnotation.dataValues

  const taskType = teamId === 1 ? 'DA Task' : 'SEO Task'
  const { Id: userId } = await sfApi.getUserId({ email: annotationUser.dataValues.email }, ['Id'])
  const text = html.replace(/<\/p>/gm, '\n')
    .replace(/<li><p>/g, '-')
    .replace(/<[^>]*>/g, ' ')
    .replace(/[\r\t\f\v ]{2,}/g, '').trim()
  if (locationUrns.length > 0) {
    for (let i = 0; i < locationUrns.length; i++) {
      if (!dbAnnotation.g5_updatable_locations[i].annotationLocation.salesforce_id) {
        console.log(locationUrns[i])
        const { Id } = await sfApi.findLocation({ Location_URN__c: locationUrns[i] }, ['Id'])
        const { id: noteId } = await sfApi.createNote(Id, userId, annotationCategory.dataValues.name, annotationType ? annotationType.dataValues.name : null, internal, text, moment(createdAt).format('YYYY-MM-DD'), 'Completed', annotationCategory.dataValues.name, taskType)
        await dbAnnotation.g5_updatable_locations[i].annotationLocation.update({ salesforce_id: noteId })
      }
    }
  } else {
    const { Id } = await sfApi.findAccount({ Client_URN__c: g5_updatable_client.dataValues.urn }, ['Id'])
    const { id: noteId } = await sfApi.createNote(Id, userId, annotationCategory.dataValues.name, annotationType ? annotationType.dataValues.name : null, internal, text, moment(createdAt).format('YYYY-MM-DD'), 'Completed', annotationCategory.dataValues.name, taskType)
    await dbAnnotation.update({ salesforce_id: noteId })
  }
  await dbAnnotation.update({ salesforceSync: true })
}
