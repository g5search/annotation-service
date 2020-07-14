const path = require('path')
const sfSync = path.resolve('./server/controllers/jobs/createNote.js')
const { REDIS_URL } = process.env

module.exports = (Bull) => {
  const salesforce = new Bull('salesforce', REDIS_URL)
  salesforce.process('sync', 1, sfSync)
  return salesforce
}
