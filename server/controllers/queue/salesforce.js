const path = require('path')
const sfCreateNote = path.resolve('./server/controllers/jobs/createNote.js')
const sfRemoveNote = path.resolve('./server/controllers/jobs/removeNote')
const sfUpdateNote = path.resolve('./server/controllers/jobs/updateNote')
const { REDIS_URL } = process.env

module.exports = (Bull) => {
  const salesforce = new Bull('salesforce', REDIS_URL)
  salesforce.process('sync', 1, sfCreateNote)
  salesforce.process('remove', 1, sfRemoveNote)
  salesforce.process('update', 1, sfUpdateNote)
  return salesforce
}
