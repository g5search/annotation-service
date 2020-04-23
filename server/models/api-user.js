const { INTEGER, STRING, DATE } = require('sequelize')

module.exports = sequelize => sequelize.define('apiUser', {
  id: {
    type: INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  username: {
    type: STRING,
    allowNull: false,
    unique: true
  },
  password: {
    type: STRING,
    allowNull: false
  },
  lastLogin: {
    type: DATE
  }
})
