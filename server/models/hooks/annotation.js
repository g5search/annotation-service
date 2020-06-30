const { salesforce } = require('../../controllers/queue')
const createNote = require('../../controllers/jobs/createNote')
module.exports = (models) => {
  models.annotation.addHook('afterCreate', (instance, options) => {
    if (options.transaction) {
      // Save done within a transaction, wait until transaction is committed to
      // notify listeners the instance has been saved
      try {
        options.transaction.afterCommit(() => createNote({ data: instance.dataValues }, models))
      } catch (error) {
        console.log({ error })
        return instance
      }
    }
    // return salesforce.add('sync', instance.dataValues)
  })
}
