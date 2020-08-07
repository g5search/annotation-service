module.exports = (models, Sequelize, sequelize) => {
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
}
