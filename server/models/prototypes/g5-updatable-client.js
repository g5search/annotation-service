module.exports = (models) => {
  models.g5_updatable_location.getAllNonInternal = () => models.g5_updatable_client.findAll({
    where: {
      'properties.g5_internal': false
    },
    attributes: [
      'urn',
      'name',
      [models.sequelize.json('properties.core_id'), 'clientId'],
      [models.sequelize.json('properties.g5_internal'), 'g5Internal'],
      [models.sequelize.json('properties.branded_name'), 'brandedName'],
      [models.sequelize.json('properties.domain_type'), 'domainType'],
      [models.sequelize.json('properties.vertical'), 'vertical'],
      [models.sequelize.json('properties.search_analyst.name'), 'strategist']
    ],
    order: [
      ['name', 'asc']
    ]
  })
}
