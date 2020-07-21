const { INTEGER, STRING } = require('sequelize')

module.exports = sequelize => sequelize.define('team', {
  id: {
    type: INTEGER,
    autoIncrement: false,
    primaryKey: true
  },
  name: {
    type: STRING
  }
})
