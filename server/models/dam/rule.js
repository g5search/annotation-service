const { BIGINT, STRING, JSON, JSONB, BOOLEAN, DATEONLY } = require('sequelize')

module.exports = sequelize => sequelize.define('rule', {
  id: {
    type: BIGINT,
    autoIncrement: true,
    primaryKey: true
  },
  description: {
    type: BIGINT
  },
  class_name: {
    type: BIGINT
  },
  frequency: {
    type: BIGINT
  },
  enabled: {
    type: BOOLEAN
  },
  args: {
    type: JSON
  },
  created_at: {
    type: DATEONLY
  },
  updated_at: {
    type: DATEONLY
  },
  name: {
    type: STRING
  },
  text: {
    type: JSONB
  }
}, {
  underscored: true,
  timestamps: false
})
