const { salesforce } = require('../../../controllers/queue')
module.exports = (models) => {
  models.annotation.addHook('beforeBulkDestroy', options => (options.individualHooks = true))
  models.annotation.addHook('afterCreate', (instance, options) => {
    if (options.transaction) {
      // Save done within a transaction, wait until transaction is committed to
      // notify listeners the instance has been saved
      try {
        options.transaction.afterCommit(() => salesforce.add({ type: 'sync', ...instance.dataValues }))
      } catch (error) {
        console.log({ error })
        return instance
      }
    }
  })
  models.annotation.addHook('afterUpdate', async (instance, options) => {
    if (options.transaction) {
      // Save done within a transaction, wait until transaction is committed to
      // notify listeners the instance has been saved
      try {
        options.transaction.afterCommit(async () => {
          const reload = await instance.reload()
          await reload
          salesforce.add({ type: 'update', ...reload })
          return instance
        })
      } catch (error) {
        console.log({ error })
      }
    }
  })

  models.annotation.addHook('afterDestroy', async (instance, options) => {
    const annotationLocations = await instance.getG5_updatable_locations()
    if (annotationLocations.length > 0) {
      for (let i = 0; i < annotationLocations.length; i++) {
        await salesforce.add({ type: 'remove', ...annotationLocations[i].dataValues.annotationLocation })
      }
    } else {
      await salesforce.add({ type: 'remove', ...instance.dataValues })
    }
  })
}
