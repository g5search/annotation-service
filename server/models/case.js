const { INTEGER, STRING, DATE } = require('sequelize')

module.exports = (sequelize) => {
  const sfCase = sequelize.define('case', {
    id: {
      type: INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    accountId: {
      type: STRING
    },
    caseNumber: {
      type: STRING
    },
    closedDate: {
      type: DATE
    },
    createdDate: {
      type: DATE
    },
    recordType: {
      type: STRING
    },
    requestType: {
      type: STRING
    }
  })

  sfCase.associate = (models) => {
    models.annotation.belongsTo(models.g5_updatable_client)
  }
  return sfCase
}
