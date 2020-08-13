const moment = require('moment')
const models = require('../../models/primary')

module.exports = async function (job, sfApi) {
  if (!sfApi.isLoggedIn) {
    console.log('Signing In')
    await sfApi.signIn()
  }
  const whatId = null
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
  const locationUrns = dbAnnotation.dataValues.g5_updatable_locations.map(location => location.dataValues.urn)
  const {
    html,
    annotation,
    internal,
    g5_updatable_client,
    annotationCategory,
    annotationType,
    annotationUser
  } = dbAnnotation.dataValues

  const { Id: userId } = await sfApi.getUserId({ email: annotationUser.dataValues.email }, ['Id'])
  console.log({ userId })
  const text = html.replace(/<\/p>|<\/li>/g, '\n')
    .replace(/<[^>]*>/g, ' ')
    .replace(/[\r\t\f\v ]{2,}/g, '').trim()
  if (locationUrns.length > 0) {
    for (let i = 0; i < locationUrns.length; i++) {
      console.log(locationUrns[i])
      const { Id } = await sfApi.findLocation({ Location_URN__c: locationUrns[i] }, ['Id'])
      const { id: noteId } = await sfApi.createNote(Id, userId, annotationCategory.dataValues.name, annotationType ? annotationType.dataValues.name : null, internal, text, moment().format('YYYY-MM-DD'), 'Completed', annotationCategory.dataValues.name, 'DA Task')
      await dbAnnotation.g5_updatable_locations[i].annotationLocation.update({ salesforce_id: noteId })
    }
  } else {
    const { Id } = await sfApi.findAccount({ Client_URN__c: g5_updatable_client.dataValues.urn }, ['Id'])
    const { id: noteId } = await sfApi.createNote(Id, userId, annotationCategory.dataValues.name, annotationType ? annotationType.dataValues.name : null, internal, text, moment().format('YYYY-MM-DD'), 'Completed', annotationCategory.dataValues.name, 'DA Task')
    await dbAnnotation.update({ salesforce_id: noteId })
  }
  await dbAnnotation.update({ salesforceSync: true })
}
