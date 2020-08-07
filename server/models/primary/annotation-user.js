const { INTEGER, STRING } = require('sequelize')

module.exports = sequelize => sequelize.define('annotationUser', {
  id: {
    type: INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  first_name: {
    type: STRING
  },
  last_name: {
    type: STRING
  },
  email: {
    type: STRING
  }
})
