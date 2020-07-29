const sequelize = require('sequelize')
module.exports = (models) => {
  models.g5_updatable_client.getAllNonInternal = where => models.g5_updatable_client.findAll({
    where: {
      'properties.g5_internal': false,
      ...where
    },
    attributes: [
      'urn',
      'name',
      // [sequelize.json('properties.core_id'), 'clientId'],
      // [sequelize.json('properties.g5_internal'), 'g5Internal'],
      [sequelize.json('properties.branded_name'), 'brandedName']
      // [sequelize.json('properties.domain_type'), 'domainType'],
      // [sequelize.json('properties.vertical'), 'vertical'],
      // [sequelize.json('properties.search_analyst.name'), 'strategist']
    ],
    order: [
      ['name', 'asc']
    ]
  })
}
