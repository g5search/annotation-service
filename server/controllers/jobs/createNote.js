const models = require('../../models')
const sfApi = require('../salesforce')
const {
  SALSEFORCE_USERNAME: sfUsername,
  SALSEFORCE_PASSWORD: sfPassword,
  SALSFORCE_TOKEN: token
} = process.env
module.exports = async function (job) {
  const { id } = job.data
  const dbAnnotation = await models.annotation.findOne({ where: { id }, includes: [{ model: models.g5_updatable_client }] })
  console.log({ dbAnnotation })
  const { html, annotation, internal, g5_updatable_client } = dbAnnotation.dataValues
  console.log({ internal })
  if (!internal) {
    console.log('logging in')
    await sfApi.login(sfUsername, sfPassword)
    console.log('logged in')
    const { Id } = sfApi.findAccount({ Client_URN__c: g5_updatable_client.urn }, ['Id'])
    await sfApi.createNote(Id, null, 'Specials/Promotions', 'Account Changes', false, html, '06-01-2020', '06-01-2020', '06-01-2020')
    await sfApi.logout()
    // send to SF
  }
}
