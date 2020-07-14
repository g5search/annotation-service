const { INTEGER, STRING, JSONB, BOOLEAN, DATEONLY } = require('sequelize')

module.exports = sequelize => sequelize.define('annotationLocation', {
  salesforce_id: {
    type: STRING
  }
})
