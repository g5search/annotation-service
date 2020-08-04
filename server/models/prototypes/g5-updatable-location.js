module.exports = (models, Sequelize, sequelize) => {
  models.g5_updatable_location.getByClientUrn = client_urn => models.g5_updatable_location.findAll({
    where: { client_urn },
    attributes: [
      'urn',
      ['display_name', 'displayName'],
      'name',
      [Sequelize.json('properties.home_page_url'), 'domain'],
      [Sequelize.json('properties.status'), 'status'],
      [Sequelize.json('properties.off_platform'), 'offPlatform']
    ],
    order: [
      ['display_name', 'asc']
    ]
  })
}
