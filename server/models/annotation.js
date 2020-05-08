const { INTEGER, STRING, JSONB, BOOLEAN, DATEONLY } = require('sequelize')

module.exports = (sequelize) => {
  const annotation = sequelize.define('annotation', {
    id: {
      type: INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    external_id: {
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
      type: STRING
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
    models.annotation.belongsToMany(models.g5_updatable_location, { through: 'annotationLocation' })
  }
  return annotation
}
