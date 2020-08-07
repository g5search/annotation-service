const sfApi = require('../../controllers/salesforce')
const { salesforce } = require('../../controllers/queue')
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
    // const recordTypeIds = cases.map(ticket => ticket.RecordTypeId)
    // const accountIds = cases.map(ticket => ticket.AccountId)
    // const recordTypes = await sfApi.getRecordTypes(recordTypeIds, ['Id', 'Name'])
    // const accounts = await sfApi.getAccounts(accountIds, ['Id', 'Client_URN__c'])
    await sfApi.logout()
    console.log(cases.length)
    // takes cases missing client urn and record type id
    res.json({ cases })
    // cases.map((ticket) => {
    //   const client = accounts.find(account => account.Id === ticket.AccountId)
    //   const recordType = recordTypes.find(recordType => recordType.id === ticket.RecordTypeId)
    //   ticket.clientUrn = client ? client.Client_URN__c : null
    //   ticket.recordType = recordType ? recordType.name : null
    // })
    // if (Object.prototype.hasOwnProperty.call(req.query, 'clientUrn')) {
    //   const filtered = cases.filter(ticket => ticket.clientUrn == req.query.clientUrn)
    //   res.json(filtered)
    // } else {
    res.json(cases)
    // }
  })
  app.get('/api/v1/cases/import', async (req, res) => {
    await salesforce.add('importClosedCases', null)
    res.sendStatus(201)
  })
  app.post('/api/v1/xml/cases', async (req, res) => {
    const { body } = req
    await salesforce.add('createClosedCase', body)
    res.set('Content-Type', 'text/xml')
    res.send(`
      <soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
        <soap:Body>
          <notificationsResponse 
            xmlns:ns2="urn:sobject.enterprise.soap.sforce.com" 
            xmlns="http://soap.sforce.com/2005/09/outbound"
          >
            <Ack>true</Ack>
          </notificationsResponse>
        </soap:Body>
      </soap:Envelope>
    `)
  })
  // test route for cases
  app.post('/api/test', async (req, res) => {
    const { body } = req
    await salesforce.add('createClosedCase', body)
    res.sendStatus(201)
  })
}
