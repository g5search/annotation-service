const moment = require('moment')
const models = require('../../models/primary')
const sfApi = require('../salesforce')
const {
  SF_USERNAME: sfUsername,
  SF_PASSWORD: sfPassword,
  SF_TOKEN: sfToken
} = process.env

module.exports = async (job) => {
  await sfApi.login(sfUsername, sfPassword, sfToken)
  const cases = await sfApi.getCases()
  await addCaseProperties(cases)
  await sfApi.logout()
  await writeToDb(cases)
}

// adds clientUrn and recordType to objects in cases arr
async function addCaseProperties(cases) {
  const recordTypeIds = [...new Set(cases.map(ticket => ticket.RecordTypeId))]
  const accountIds = [...new Set(cases.map(ticket => ticket.AccountId))]
  const recordTypes = await sfApi.getRecordTypes(recordTypeIds, ['Id', 'Name'])
  const accounts = await sfApi.getAccounts(accountIds, ['Id', 'Client_URN__c'])
  cases.forEach((ticket) => {
    const client = accounts.find(account => account.Id === ticket.AccountId)
    const recordType = recordTypes.find(recordType => recordType.id === ticket.RecordTypeId)
    ticket.clientUrn = client ? client.Client_URN__c : null
    ticket.recordType = recordType ? recordType.name : null
  })
}

async function writeToDb(cases) {
  for (let i = 0; i < cases.length; i++) {
    await models.sequelize.transaction(async(t) => {
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
