const objectUtil = require('../../../controllers/utilities/object')
module.exports = (models, Sequelize, sequelize) => {
  const { Op } = Sequelize
  models.case.saveAndAssociate = async(cases) => {
    for (let i = 0; i < cases.length; i++) {
      await sequelize.transaction(async(t) => {
        const [ticket] = await models.case.findOrCreate({
          where: {
            caseNumber: cases[i].CaseNumber
          },
          defaults: {
            accountId: cases[i].AccountId,
            caseNumber: cases[i].CaseNumber,
            closedDate: cases[i].ClosedDate,
            createdDate: cases[i].CreatedDate
          },
          transaction: t
        })
        if (cases[i].clientUrn) {
          const client = await models.g5_updatable_client.findOne({
            where: {
              urn: cases[i].clientUrn
            }
          })
          await ticket.setG5_updatable_client(client, {
            transaction: t
          })
        }
        const [recordType] = await models.recordType.findOrCreate({
          where: {
            name: cases[i].recordType
          },
          defaults: {
            name: cases[i].recordType
          },
          transaction: t
        })
        await ticket.setRecordType(recordType, {
          transaction: t
        })
        const [requestType] = await models.requestType.findOrCreate({
          where: {
            name: cases[i].Request_Type__c
          },
          defaults: {
            name: cases[i].Request_Type__c
          },
          transaction: t
        })
        await ticket.setRequestType(requestType, {
          transaction: t
        })
      })
    }
  }
  models.case.findByQuery = (params) => {
    const whereGroups = objectUtil.group({
      searchBy: [['searchBy', 'column']],
      clientWhere: [['clientUrn', 'urn']],
      dates: ['to', 'from']
    }, params)
    const where = {}
    if (whereGroups.dates.to && whereGroups.dates.from) {
      where[whereGroups.searchBy.column] = { [Op.between]: [whereGroups.dates.from, whereGroups.dates.to] }
    } else if (whereGroups.dates.to) {
      where[whereGroups.searchBy.column] = { [Op.lte]: whereGroups.dates.to }
    } else if (whereGroups.dates.from) {
      where[whereGroups.searchBy.column] = { [Op.gte]: whereGroups.dates.from }
    }
    return models.case.findAll({
      where,
      include: [
        {
          model: models.g5_updatable_client,
          where: whereGroups.clientWhere
        },
        {
          model: models.requestType
        },
        {
          model: models.recordType
        }
      ]
    })
  }
}
