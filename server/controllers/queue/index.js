const path = require('path')
const fs = require('fs')
const Bull = require('bull')
const { setQueues, UI } = require('bull-board')

function init(app) {
  const queues = []
  fs.readdirSync(__dirname)
    .filter(file => file.indexOf('.') !== 0 && file !== 'index.js' && file !== 'README.md')
    .forEach((file) => {
      const queue = require(path.join(__dirname, file))
      const fileName = file.replace('.js', '')
      const queueFile = queue(Bull)
      console.log({ fileName })
      module.exports[fileName] = queueFile
      queues.push(queueFile)
    })

  setQueues(queues)
  app.use('/admin/queues', UI)
}

module.exports = {
  init
}
