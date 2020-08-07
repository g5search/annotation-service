const { salesforce } = require('../../../controllers/queue')
module.exports = (models) => {
  models.annotationLocation.addHook('beforeBulkDestroy', (options) => {
    options.individualHooks = true
  })
  models.annotationLocation.addHook('afterDestroy', async (instance, options) => {
    await salesforce.add('remove', instance.dataValues)
  })
}
