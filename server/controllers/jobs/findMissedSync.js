const models = require('../../models/primary')
const { salesforce } = require('../queue')
const { create } = require('../salesforce')
module.exports = async (job, sfApi) => {
  const { data } = job
  // if (!sfApi.isLoggedIn) {
  //   console.log('Signing In')
  //   await sfApi.signIn()
  // }
  console.log('here')
  const dbAnnotations = await models.annotation.findAll({
    where: { salesforceSync: null },
    include: [
      { model: models.g5_updatable_client },
      { model: models.annotationCategory },
      { model: models.annotationType },
      { model: models.annotationUser },
      { model: models.g5_updatable_location }
    ]
  })
  for (let i = 0; i < dbAnnotations.length; i++) {
    let createJob = false
    const dbAnnotation = dbAnnotations[i]
    if (dbAnnotation.dataValues.g5_updatable_locations.length > 0) {
      for (let j = 0; j < dbAnnotation.dataValues.g5_updatable_locations.length; j++) {
        const location = dbAnnotation.dataValues.g5_updatable_locations[j].dataValues
        const { annotationLocation } = location
        if (!annotationLocation.dataValues.salesforce_id) {
          createJob = true
        }
      }
    } else if (dbAnnotation.dataValues.salesforce_id) {
      createJob = true
    }
    if (createJob) {
      // console.log(dbAnnotation.dataValues.id)
      await salesforce.add({ type: 'sync', ...dbAnnotation.dataValues })
    }
  }
}
