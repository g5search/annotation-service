const { INTEGER, STRING } = require('sequelize')

module.exports = sequelize => sequelize.define('recordType', {
  id: {
    type: INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: STRING
  }
})
