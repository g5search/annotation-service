const { INTEGER, STRING, JSONB } = require('sequelize')

module.exports = (sequelize) => {
  const annotation = sequelize.define('annotation', {
  id: {
    type: INTEGER,
    autoIncrement: false,
    primaryKey: true
  },
  external_id: {
    type: STRING
  },
  annotation: {
    type: JSONB
  }
}, {
  paranoid: true
})
annotation.associate = (models) => {
  models.annotation.belongsTo(models.annotationUser)
  models.annotation.belongsTo(models.app)
  // models.annotation.belongsToMany(models.location, { through: 'annotationLocation'})
}
return annotation
}
