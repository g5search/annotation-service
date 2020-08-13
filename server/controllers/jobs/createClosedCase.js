const models = require('../../models/primary')
const sfApi = require('../salesforce')
const {
  SF_USERNAME: sfUsername,
  SF_PASSWORD: sfPassword,
  SF_TOKEN: sfToken
} = process.env

module.exports = async (job, sfApi) => {
  if (!sfApi.isLoggedIn) {
    console.log('Signing In')
    await sfApi.signIn()
  }
  const ticketData = job.data['soapenv:envelope']['soapenv:body'][0].notifications[0].notification[0].sobject[0]
  const ticket = {
    AccountId: ticketData['sf:accountid'][0],
    CaseNumber: ticketData['sf:casenumber'][0],
    ClosedDate: ticketData['sf:closeddate'][0],
    CreatedDate: ticketData['sf:createddate'][0],
    RecordTypeId: ticketData['sf:recordtypeid'][0],
    Request_Type__c: ticketData['sf:request_type__c'][0]
  }
  const recordTypes = await sfApi.getRecordTypes([ticket.RecordTypeId], ['Id', 'Name'])
  const accounts = await sfApi.getAccounts([ticket.AccountId], ['Id', 'Client_URN__c'])
  const client = accounts.find(account => account.Id === ticket.AccountId)
  const recordType = recordTypes.find(recordType => recordType.Id === ticket.RecordTypeId)
  ticket.clientUrn = client ? client.Client_URN__c : null
  ticket.recordType = recordType ? recordType.Name : null
  await models.case.saveAndAssociate([ticket])
}
