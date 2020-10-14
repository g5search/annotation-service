module.exports = (models, Sequelize, sequelize) => {
  models.g5_updatable_client.getAllNonInternal = where => models.g5_updatable_client.findAll({
    where: {
      'properties.g5_internal': false,
      ...where
    },
    attributes: [
      'urn',
      'name',
      [Sequelize.json('properties.branded_name'), 'brandedName']
    ],
    order: [
      ['name', 'asc']
    ]
  })
}
