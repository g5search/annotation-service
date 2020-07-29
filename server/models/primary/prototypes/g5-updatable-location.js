const sequelize = require('sequelize')
module.exports = (models) => {
  models.g5_updatable_location.getByClientUrn = client_urn => models.g5_updatable_location.findAll({
    where: { client_urn },
    attributes: [
      'urn',
      ['display_name', 'displayName'],
      'name',
      [sequelize.json('properties.home_page_url'), 'domain'],
      [sequelize.json('properties.status'), 'status'],
      [sequelize.json('properties.off_platform'), 'offPlatform']
    ],
    order: [
      ['display_name', 'asc']
    ]
  })
}
