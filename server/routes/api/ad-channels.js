const cors = require('cors')
const axios = require('axios')
const { CRS_URL: crsUrl } = process.env
// const models = require('../../models')
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
    const { campaignId } = req.params
    const { data } = await axios.get(`${crsUrl}/api/dam/code_campaign/${campaignId}`)
    res.json(data)
  })

  app.options('/api/v1/facebook/account/:accountId', cors(corsOpts))
  app.get('/api/v1/facebook/account/:accountId', cors(corsOpts), async (req, res) => {
    const { accountId } = req.params
    const { data } = await axios.get(`${crsUrl}/api/dam/code_account/${accountId}`)
    res.json(data)
  })
  app.options('/api/v1/google-ads/:accountId', cors(corsOpts))
  app.get('/api/v1/google-ads/:accountId', cors(corsOpts), async (req, res) => {
    const { accountId } = req.params
    const { data } = await axios.get(`${crsUrl}/api/dam/code_account/${accountId}`)
    res.json(data)
  })
}
