const moment = require('moment')
// const models = require('../../models')
const sfApi = require('../salesforce')
const {
  SF_USERNAME: sfUsername,
  SF_PASSWORD: sfPassword,
  SF_TOKEN: sfToken
} = process.env

module.exports = async function (job, models) {
  const { id } = job.data
  const dbAnnotation = await models.annotation.findOne({
    where: { id },
    include: [
      { model: models.g5_updatable_client },
      { model: models.annotationCategory },
      { model: models.annotationType }
    ]
  })
  const { html, annotation, internal, g5_updatable_client, annotationCategory, annotationType } = dbAnnotation.dataValues
  if (!internal) {
    await sfApi.login(sfUsername, sfPassword, sfToken)
    const { Id } = await sfApi.findAccount({ Client_URN__c: g5_updatable_client.dataValues.urn }, ['Id'])
    await sfApi.createNote(Id, '0051N000006K50qQAC', annotationCategory.dataValues.name, annotationType.dataValues.name, false, html, moment().format('YYYY-MM-DD'), 'Completed', annotationCategory.dataValues.name)
    await sfApi.logout()
    // send to SF
  }
}
