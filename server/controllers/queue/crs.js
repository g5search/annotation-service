const path = require('path')
const crsSync = path.resolve('./server/controllers/jobs/crsSync.js')

module.exports = {
  bullConfig,
  arenaConfig
}

function bullConfig (Bull) {
  const queue = new Bull('CRS', process.env.REDIS_URL, { prefix: 'notes' })
  queue.process('Import Notes from CRS', 1, (job, done) => crsSync(job, done))
  return queue
}

function arenaConfig () {
  return {
    name: 'CRS',
    hostId: 'notes',
    prefix: 'notes',
    url: process.env.REDIS_URL
  }
}
