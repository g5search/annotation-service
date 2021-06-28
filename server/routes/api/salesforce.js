const xmlparser = require('express-xml-bodyparser')
const sfApi = require('../../controllers/salesforce')
const { salesforce } = require('../../controllers/queue')
const models = require('../../models/primary')
const {
  SF_USERNAME: sfUsername,
  SF_PASSWORD: sfPassword,
  SF_TOKEN: sfToken
} = process.env
module.exports = (app) => {
  app.get('/api/v1/cases', async (req, res) => {
    const cases = await models.case.findByQuery(req.query)
    res.json(cases)
  })
  app.get('/api/v1/cases/import', async (req, res) => {
    await salesforce.add({ type: 'importClosedCases' })
    res.sendStatus(201)
  })
  app.use('/api/v1/xml/cases', xmlparser())
  app.post('/api/v1/xml/cases', async (req, res) => {
    const { body } = req
    await salesforce.add({ type: 'createClosedCase', body })
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
  // test route for msr
  app.get('/api/msr', async (req, res) => {
    await salesforce.add({ type: 'runQuarterlyMSR' })
    res.sendStatus(201)
  })

  // test route for cases
  app.get('/api/test', async (req, res) => {
    const { body } = req
    await salesforce.add({ type: 'createClosedCase', body })
    res.sendStatus(201)
  })

  app.get('/api/test/findMissing', async (req, res) => {
    await salesforce.add({ type: 'findMissingSyncs' })
    res.sendStatus(201)
  })
}
