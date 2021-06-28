const { INTEGER, STRING, JSON, JSONB, DATEONLY } = require('sequelize')

module.exports = sequelize => sequelize.define('report', {
  id: {
    type: INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false
  },
  reportId: {
    type: STRING
  },
  workQ: {
    type: JSON
  },
  approvals: {
    type: JSONB,
    defaultValue:
      [
        {
          id: 'da',
          approved: false
        },
        {
          id: 'seo',
          approved: false
        },
        {
          id: 'cc',
          approved: true
        }
      ]
  },
  from: {
    type: DATEONLY
  },
  to: {
    type: DATEONLY
  },
  clientUrn: {
    type: STRING
  }
})
