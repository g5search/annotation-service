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
  const cases = []
  let i = 0
  const totalCases = sfApi.getTotalCases()
  while (i < totalCases) {
    const queryCases = await sfApi.getCases({ closedDate: { $gte: '2020-01-01T00:00:00.000Z' } },
      [
        'AccountId',
        'Account_Manager__c',
        'CaseNumber',
        'Case_Age__c',
        'Case_Owner_Name__c',
        'ClosedDate',
        'CreatedDate',
        'RecordTypeId',
        'Request_Type__c',
        'Subject'
      ])
      .skip(i)
    cases.push(queryCases)
    i += cases.length
    console.log(i)
  }
  console.log(cases.length)
  // const recordTypeIds = cases.map(ticket => ticket.RecordTypeId)
  // const accountIds = cases.map(ticket => ticket.AccountId)
  // const recordTypes = await sfApi.getRecordTypes(recordTypeIds, ['Id', 'Name'])
  // const accounts = await sfApi.getAccounts(accountIds, ['Id', 'Client_URN__c'])
  await sfApi.logout()
}
