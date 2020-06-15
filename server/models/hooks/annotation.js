const { salesforce } = require('../../controllers/queue')
const createNote = require('../../controllers/jobs/createNote')
module.exports = (models) => {
  models.annotation.addHook('afterCreate', (instance, options) => {
    // return salesforce.add('sync', instance.dataValues)
    return createNote({ data: instance.dataValues }, models)
  })
}
