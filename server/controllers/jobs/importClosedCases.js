const moment = require('moment')
const models = require('../../models/primary')
const sfApi = require('../salesforce')
const {
  SF_USERNAME: sfUsername,
  SF_PASSWORD: sfPassword,
  SF_TOKEN: sfToken
} = process.env

module.exports = async (job, sfApi) => {
  if (!sfApi.isLoggedIn) {
    await sfApi.signIn()
  }
  const cases = await sfApi.getCases()
  await addCaseProperties(cases)
  // await models.case.saveAndAssociate(cases)
}

// adds clientUrn and recordType to objects in cases arr
async function addCaseProperties(cases) {
  const recordTypeIds = [...new Set(cases.map(ticket => ticket.RecordTypeId))]
  const accountIds = [...new Set(cases.map(ticket => ticket.AccountId))]
  const recordTypes = await sfApi.getRecordTypes(recordTypeIds, ['Id', 'Name'])
  console.log({ recordTypes })
  const accounts = await sfApi.getAccounts(accountIds, ['Id', 'Client_URN__c'])
  cases.forEach((ticket) => {
    const client = accounts.find(account => account.Id === ticket.AccountId)
    const recordType = recordTypes.find(recordType => recordType.Id === ticket.RecordTypeId)
    console.log(recordType)
    ticket.clientUrn = client ? client.Client_URN__c : null
    ticket.recordType = recordType ? recordType.Name : null
  })
}
