const path = require('path')
const sfCreateNote = path.resolve('./server/controllers/jobs/createNote.js')
const sfRemoveNote = path.resolve('./server/controllers/jobs/removeNote')
const sfUpdateNote = path.resolve('./server/controllers/jobs/updateNote')
const sfCreateClosedCase = path.resolve('./server/controllers/jobs/createClosedCase')
const sfImportClosedCases = path.resolve('./server/controllers/jobs/importClosedCases')
const sfFindMissingSyncs = path.resolve('./server/controllers/jobs/findMissedSync')

const { REDIS_URL } = process.env
const sfApi = require('../salesforce')
module.exports = {
  bullConfig,
  arenaConfig
}

const jobType = {
  sync: sfCreateNote,
  remove: sfRemoveNote,
  update: sfUpdateNote,
  createClosedCase: sfCreateClosedCase,
  importClosedCases: sfImportClosedCases,
  findMissingSyncs: sfFindMissingSyncs
}

function bullConfig (Bull) {
  const salesforce = new Bull('salesforce', REDIS_URL)
  salesforce.process(1, (job) => {
    const { type } = job.data
    return require(jobType[type])(job, sfApi)
  })
  salesforce.on('completed', checkForSignout)
  salesforce.on('failed', checkForSignout)

  async function checkForSignout(job, res) {
    const waiting = await salesforce.getWaitingCount()
    const active = await salesforce.getActiveCount()
    if (waiting === 0 && active === 0) {
      console.log('Signing Out')
      await sfApi.signOut()
    }
  }
  // salesforce.whenCurrentJobsFinished()
  //   .then(() => {
  //     console.log('all done')
  //   }).catch(console.log('failed'))
  // salesforce.process('remove', sfRemoveNote)
  // salesforce.process('update', sfUpdateNote)
  // salesforce.process('createClosedCase', sfCreateClosedCase)
  // salesforce.process('importClosedCases', sfImportClosedCases)
  return salesforce
}

function arenaConfig () {
  return {
    name: 'salesforce',
    hostId: 'notes',
    url: REDIS_URL
  }
}
