const damModels = require('../../models/dam')
const { Op } = damModels.Sequelize
module.exports = (app) => {
  app.get('/api/v1/dam/workq/:clientUrn', async (req, res) => {
    const { clientUrn: client_urn } = req.params
    const { startDate, endDate } = req.query
    const startTime = new Date()
    const clientItems = await damModels.task_event.findAll({
      where: {
        client_urn,
        // created_at: {
        //   [Op.between]: [startDate, endDate]
        // },
        action: 3,
        by: {
          [Op.and]: [
            { [Op.not]: null },
            { [Op.notIn]: ['DAM'] }
          ]
        }
      },
      include: [
        {
          model: damModels.rule,
          where: {
            id: {
              [Op.lt]: 4
            }
          }
        }
      ]
    })
    const endtime = new Date()
    const seconds = Math.abs(startTime - endtime) / 1000
    console.log(seconds)
    res.json(clientItems)
  })
}
