const { INTEGER, STRING, DATE } = require('sequelize')

module.exports = sequelize => sequelize.define('apiKey', {
  id: {
    type: INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  email: {
    type: STRING,
    allowNull: false,
    unique: true
  },
  key: {
    type: STRING
  },
  lastUse: {
    type: DATE
  }
})
