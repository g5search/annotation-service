const path = require('path')
const Bull = require('bull')
const sfSync = path.resolve('./server/controllers/jobs/createNote.js')
const { setQueues } = require('bull-board')
const { REDIS_URL } = process.env
const api = new Bull('api', REDIS_URL)
const salesforce = new Bull('salesforce', REDIS_URL)

salesforce.process('sync', 1, sfSync)
setQueues([api, salesforce])

module.exports = {
  api,
  salesforce
}
