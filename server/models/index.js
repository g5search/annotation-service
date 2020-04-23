const fs = require('fs')
const path = require('path')
const Sequelize = require('sequelize')

const {
  INCLUDE_G5_AUTH: includeAuth,
  INCLUDE_G5_UPDATABLES: includeUpdatables,
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
  logging: (logging === 'true')
})

// NOT SURE THIS WILL WORK, BUT IT SEEMS LIKE WE WOULD WANT TO OPTIONALIZE THESE
const db = {
  ...includeAuth ? require('@getg5/g5-auth').models(sequelize) : {},
  ...includeUpdatables ? require('@getg5/g5-updatable').models(sequelize) : {}
}

// db.user.associate = (models) => {
//   models.user.hasMany(models.seoAssignment, { foreignKey: 'userId', sourceKey: 'id' })
// }

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

require('./prototypes')(db)
require('./hooks')(db)

module.exports = {
  ...db,
  sequelize,
  Sequelize
}
