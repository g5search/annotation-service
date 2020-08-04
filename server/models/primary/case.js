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
    }
  })

  sfCase.associate = (models) => {
    models.case.belongsTo(models.g5_updatable_client)
    models.case.belongsTo(models.requestType)
    models.case.belongsTo(models.recordType)
  }
  return sfCase
}
