const fs = require('fs')
const path = require('path')
const Sequelize = require('sequelize')

const {
  DATABASE_URL: dbUrl,
  DATABASE_MAX_CONNECTIONS: max,
  DATABASE_MIN_CONNECTIONS: min,
  DATABASE_IDLE: idle,
  DATABASE_AQUIRE: acquire,
  DATABASE_EVICT: evict,
  DATABASE_SSL: ssl,
  DATABASE_LOGGING: logging,
  DATABASE_CA: ca,
  DATABASE_CERT: cert,
  DATABASE_KEY: key
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
  logging: logging === 'true' ? console.log : false
})

const updatableModels = require('@getg5/g5-updatable').models(sequelize)
const authModels = require('@getg5/g5-auth').models(sequelize)

const db = {
  ...updatableModels,
  ...authModels
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
    const model = require(path.join(__dirname, file))(sequelize)
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
require('./hooks')(db)

module.exports = {
  ...db,
  sequelize,
  Sequelize
}
