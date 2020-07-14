const { salesforce } = require('../../controllers/queue')
const createNote = require('../../controllers/jobs/createNote')
console.log('importing')
module.exports = (models) => {
  models.annotation.addHook('afterCreate', (instance, options) => {
    console.log(salesforce)
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
}
