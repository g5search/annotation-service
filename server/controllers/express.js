const express = require('express')
const models = require('../models/primary')
const queue = require('./queue')

const app = express()

app.use(express.json({ limit: '1000kb' }))
queue.init(app)

const passport = require('./auth')(app, models)
const api = require('./api-auth')

require('@getg5/g5-updatable').init(app, models)

app.use(checkAuth)

require('../routes')(app, passport)

const g5AuthOnly = []
const jwtOnly = []
const noAuth = [
  '/api/v1/crs/add',
  '/api/v1/login',
  '/api/hub/clients',
  '/api/v1/signup',
  '/api/v1/key',
  '/api/v1/xml/cases',
  '/api/v1/signup'
]
const whitelistRegex = [
  /\/api\/hub\/clients\/\S*\/locations/
]

function checkAuth (req, res, next) {
  const { path } = req
  const { access_token: accessToken, key: apiKey } = req.query
  if (noAuth.includes(path) || whitelistRegex.some(reg => reg.test(path))) {
    next()
  } else if (!accessToken && !jwtOnly.includes(path) && !apiKey) {
    if (req.isAuthenticated()) {
      next()
    } else {
      res.redirect('/g5_auth/users/auth/g5')
    }
  } else if (g5AuthOnly.includes(path)) {
    res.sendStatus(401)
  } else if (accessToken) {
    passport.authenticate('jwt', { session: false })(req, res, next)
  } else if (apiKey) {
    api.authenticate(apiKey, req, res, next)
  }
}

module.exports = app
