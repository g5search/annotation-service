const { INTEGER, STRING, JSONB, BOOLEAN, DATEONLY } = require('sequelize')

module.exports = (sequelize) => {
  const annotation = sequelize.define('annotation', {
    id: {
      type: INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    salesforce_id: {
      type: STRING
    },
    annotation: {
      type: JSONB
    },
    internal: {
      type: BOOLEAN
    },
    startDate: {
      type: DATEONLY
    },
    endDate: {
      type: DATEONLY
    },
    html: {
      type: STRING(1000)
    },
    salesforceSync: {
      type: BOOLEAN
    },
    promoted: {
      type: BOOLEAN,
      defaultValue: false
    }
  }, {
    paranoid: true
  })
  annotation.associate = (models) => {
    models.annotation.belongsTo(models.annotationUser)
    models.annotation.belongsTo(models.annotationCategory)
    models.annotation.belongsTo(models.annotationType)
    models.annotation.belongsTo(models.app)
    models.annotation.belongsTo(models.g5_updatable_client)
    models.annotation.belongsTo(models.team)
    models.annotation.belongsToMany(models.g5_updatable_location, { through: 'annotationLocation' })
  }
  return annotation
}
