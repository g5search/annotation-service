module.exports = (models) => {
  models.g5_updatable_location.getByClientUrn = client_urn => models.g5_updatable_location.findAll({
    where: { client_urn },
    attributes: [
      'urn',
      ['display_name', 'displayName'],
      'name',
      [models.sequelize.json('properties.home_page_url'), 'domain'],
      [models.sequelize.json('properties.status'), 'status'],
      [models.sequelize.json('properties.off_platform'), 'offPlatform']
    ],
    order: [
      ['display_name', 'asc']
    ]
  })
}
