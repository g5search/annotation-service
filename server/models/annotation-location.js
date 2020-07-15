const { STRING } = require('sequelize')

module.exports = sequelize => sequelize.define('annotationLocation', {
  salesforce_id: {
    type: STRING
  }
})
