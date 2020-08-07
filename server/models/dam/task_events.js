const { BIGINT, TEXT, STRING, DATEONLY, INTEGER } = require('sequelize')

module.exports = (sequelize) => {
  const taskEvent = sequelize.define('task_event', {
    id: {
      type: BIGINT,
      autoIncrement: true,
      primaryKey: true
    },
    rule_id: {
      type: BIGINT
    },
    text: {
      type: TEXT
    },
    item_id: {
      type: BIGINT
    },
    item_type: {
      type: STRING
    },
    priority: {
      type: INTEGER
    },
    client_urn: {
      type: STRING
    },
    location_urn: {
      type: STRING
    },
    action: {
      type: INTEGER
    },
    by: {
      type: STRING
    },
    until_at: {
      type: DATEONLY
    },
    created_at: {
      type: INTEGER
    },
    updated_at: {
      type: STRING
    },
    identifier: {
      type: DATEONLY
    },
    campaign_name: {
      type: STRING
    },
    granularity: {
      type: DATEONLY
    }
  }, {
    underscored: true,
    timestamps: false
  })
  taskEvent.associate = (models) => {
    models.task_event.belongsTo(models.rule)
  }
  return taskEvent
}
