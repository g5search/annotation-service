const { salesforce } = require('../../../controllers/queue')
const createNote = require('../../../controllers/jobs/createNote')
const { options } = require('../../../controllers/express')
module.exports = (models) => {
  models.annotation.addHook('beforeBulkDestroy', options => (options.individualHooks = true))
  models.annotation.addHook('afterCreate', (instance, options) => {
    if (options.transaction) {
      // Save done within a transaction, wait until transaction is committed to
      // notify listeners the instance has been saved
      try {
        options.transaction.afterCommit(() => salesforce.add('sync', instance.dataValues))
      } catch (error) {
        console.log({ error })
        return instance
      }
    }
  })
  models.annotation.addHook('afterUpdate', async (instance, options) => {
    console.log('updated')
    if (options.transaction) {
      // Save done within a transaction, wait until transaction is committed to
      // notify listeners the instance has been saved
      try {
        options.transaction.afterCommit(async () => {
          const reload = await instance.reload()
          await reload
          salesforce.add('update', reload)
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
        await salesforce.add('remove', annotationLocations[i].dataValues.annotationLocation)
      }
    } else {
      await salesforce.add('remove', instance.dataValues)
    }
  })
}
