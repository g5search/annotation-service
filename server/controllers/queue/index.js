const path = require('path')
const fs = require('fs')
const Bull = require('bull')
const Arena = require('bull-arena')
function init (app) {
  const queues = []
  fs.readdirSync(__dirname)
    .filter(file => file.indexOf('.') !== 0 && file !== 'index.js' && file !== 'README.md') // get all the model files
    .forEach((file) => {
      const queue = require(path.join(__dirname, file))
      const fileName = file.replace('.js', '')
      module.exports[fileName] = queue.bullConfig(Bull)
      queues.push(queue.arenaConfig())
    })

  const arenaConfigs = Arena({
    queues
  },
  {
    basePath: '/admin/queues',
    disableListen: true
  })
  app.use('/', arenaConfigs)
}

module.exports = {
  init
}
