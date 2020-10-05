const { salesforce } = require('../../../controllers/queue')
module.exports = (models) => {
  models.annotationLocation.addHook('beforeBulkDestroy', (options) => {
    options.individualHooks = true
  })
  models.annotationLocation.addHook('afterDestroy', async (instance, options) => {
    await salesforce.add({ type: 'remove', ...instance.dataValues })
  })
  models.annotationLocation.addHook('afterCreate', async (instance, options) => {
    // create a job to sync the data to SF
    const { annotationId } = instance.dataValues
    const annotation = await models.annotation.findOne({ id: annotationId })
    await annotation.update({ salesforceSync: false })
    await salesforce.add({ type: 'sync', id: annotationId })
  })
}
