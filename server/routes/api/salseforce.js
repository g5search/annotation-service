const sfApi = require('../../controllers/salesforce')
const {
  SF_USERNAME: sfUsername,
  SF_PASSWORD: sfPassword,
  SF_TOKEN: sfToken
} = process.env
module.exports = (app) => {
  app.get('/api/v1/cases', async (req, res) => {
    await sfApi.login(sfUsername, sfPassword, sfToken)
    const cases = await sfApi.getCases(null,
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
    const recordTypeIds = cases.map(ticket => ticket.RecordTypeId)
    const accountIds = cases.map(ticket => ticket.AccountId)
    const recordTypes = await sfApi.getRecordTypes(recordTypeIds, ['Id', 'Name'])
    const accounts = await sfApi.getAccounts(accountIds, ['Id', 'Client_URN__c'])
    cases.map((ticket) => {
      const client = accounts.find(account => account.Id === ticket.AccountId)
      const recordType = recordTypes.find(recordType => recordType.id === ticket.RecordTypeId)
      ticket.clientUrn = client ? client.Client_URN__c : null
      ticket.recordType = recordType ? recordType.name : null
      return ticket
    })
    await sfApi.logout()
    res.json(cases)
  })
}
