const fs = require('fs')
const path = require('path')
const Sequelize = require('sequelize')
const {
  DAM_DATABASE_URL: dbUrl,
  DAM_DATABASE_MAX_CONNECTIONS: max,
  DAM_DATABASE_MIN_CONNECTIONS: min,
  DAM_DATABASE_IDLE: idle,
  DAM_DATABASE_AQUIRE: acquire,
  DAM_DATABASE_EVICT: evict,
  DAM_DATABASE_SSL: ssl,
  DAM_DATABASE_LOGGING: logging,
  DAM_DATABASE_CA: ca,
  DAM_DATABASE_CERT: cert,
  DAM_DATABASE_KEY: key
} = process.env

const minTest = parseInt(min)
const maxTest = parseInt(max)
const idleTest = parseInt(idle)
const acquireTest = parseInt(acquire)
const evictTest = parseInt(evict)

const sequelize = new Sequelize(dbUrl, {
  pool: {
    max: maxTest,
    min: minTest,
    idle: idleTest,
    acquire: acquireTest,
    evict: evictTest
  },
  dialectOptions: {
    ssl: (ssl === 'true') ? { ca, cert, key } : false
  },
  logging: (logging === 'true')
})

const db = {
}

fs.readdirSync(__dirname)
  .filter(file => file.indexOf('.') !== 0 &&
                  file !== 'index.js' &&
                  file !== 'sync.js' &&
                  file !== 'prototypes' &&
                  file !== 'hooks' &&
                  file !== 'README.md'
  )
  .forEach((file) => {
    const model = sequelize.import(path.join(__dirname, file))
    const { name } = model
    db[name] = model
  })

Object.keys(db)
  .forEach((modelName) => {
    if ('associate' in db[modelName]) {
      db[modelName].associate(db)
    }
  })
require('./prototypes')(db, Sequelize, sequelize)
// require('./hooks')(db)
module.exports = {
  ...db,
  sequelize,
  Sequelize
}
