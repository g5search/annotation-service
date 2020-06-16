const cors = require('cors')
const models = require('../../models')
const whitelist = [/chrome-extension:\/\/[a-z]*$/]
const corsOpts = {
  origin: (origin, callback) => {
    if (whitelist.some(pattern => pattern.test(origin)) || !origin) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  }
}

module.exports = (app) => {
  app.options('/api/v1/facebook/campaign/:campaignId', cors(corsOpts))
  app.get('/api/v1/facebook/campaign/:campaignId', cors(corsOpts), async (req, res) => {
    res.sendStatus(200)
  })

  app.options('/api/v1/facebook/account/:accountId', cors(corsOpts))
  app.get('/api/v1/facebook/account/:accountId', cors(corsOpts), async (req, res) => {
    res.sendStatus(200)
  })
}
