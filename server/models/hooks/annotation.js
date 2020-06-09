const { salesforce } = require('../../controllers/queue')
module.exports = (models) => {
  models.annotation.addHook('afterCreate', (instance, options) => {
    return salesforce.add('sync', instance.dataValues)
  })
}
