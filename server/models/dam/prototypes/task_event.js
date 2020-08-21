const objectUtil = require('../../../controllers/utilities/object')
module.exports = (models, Sequelize, sequelize) => {
  const { Op } = Sequelize
  models.task_event.findByQuery = (params) => {
    const where = {}
    const whereGroups = objectUtil.group({
      searchBy: [['searchBy', 'column']],
      dates: ['to', 'from'],
      skip: ['access_token']
    }, params)
    if (whereGroups.dates.to && whereGroups.dates.from) {
      where[whereGroups.searchBy.column] = { [Op.between]: [whereGroups.dates.from, whereGroups.dates.to] }
    } else if (whereGroups.dates.to) {
      where[whereGroups.searchBy.column] = { [Op.lte]: whereGroups.dates.to }
    } else if (whereGroups.dates.from) {
      where[whereGroups.searchBy.column] = { [Op.gte]: whereGroups.dates.from }
    }

    return models.task_event.findAll({
      where: {
        client_urn: params.client_urn,
        action: 3,
        by: {
          [Op.and]: [
            { [Op.not]: null },
            { [Op.notIn]: ['DAM'] }
          ]
        },
        ...where
      },
      include: [
        {
          model: models.rule,
          where: {
            id: {
              [Op.lt]: 4
            }
          }
        }
      ]
    })
  }
}
