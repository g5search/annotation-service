const fs = require('fs')
const path = require('path')
const Sequelize = require('sequelize')

const {
  MSR_DATABASE_URL: dbUrl,
  MSR_DATABASE_MAX_CONNECTIONS: max,
  MSR_DATABASE_MIN_CONNECTIONS: min,
  MSR_DATABASE_IDLE: idle,
  MSR_DATABASE_AQUIRE: acquire,
  MSR_DATABASE_EVICT: evict,
  MSR_DATABASE_SSL: ssl,
  MSR_DATABASE_LOGGING: logging,
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
  logging: (logging === 'true')
})

// NOT SURE THIS WILL WORK, BUT IT SEEMS LIKE WE WOULD WANT TO OPTIONALIZE THESE
// const db = {
//   ...includeAuth ? require('@getg5/g5-auth').models(sequelize) : {},
//   ...includeUpdatables ? require('@getg5/g5-updatable').models(sequelize) : {}
// }

const db = {}
// db.user.associate = (models) => {
//   models.user.hasMany(models.seoAssignment, { foreignKey: 'userId', sourceKey: 'id' })
// }

fs.readdirSync(__dirname)
  .filter(file => file.indexOf('.') !== 0 &&
                  file !== 'index.js' &&
                  file !== 'sync.js' &&
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

module.exports = {
  ...db,
  sequelize,
  Sequelize
}
