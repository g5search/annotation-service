module.exports = (models, Sequelize, sequelize) => {
  models.g5_updatable_client.getAllNonInternal = (where) => {
    const clients = models.g5_updatable_client.findAll({
      where: {
        properties: {
          status: {
            [Sequelize.Op.not]: 'Deleted'
          },
          g5_internal: false
        }
      },
      attributes: [
        'urn',
        'name',
        [sequelize.json('properties.branded_name'), 'brandedName']
      ]
    })
    return clients
  }
}
