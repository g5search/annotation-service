const express = require('express')
const app = express()
const bodyParser = require('body-parser')
// const { UI } = require('bull-board')
const models = require('../models')
app.use(bodyParser.json({ limit: '1000kb' }))
// app.use('/admin/queues', UI)
const passport = require('./auth')(app, models)
const api = require('./api-auth')
app.use(checkAuth)
require('../routes')(app, passport)

const g5AuthOnly = [
  '/api/v1/signup'
]
const jwtOnly = [
]
const noAuth = [
  '/api/v1/login',
  '/api/v1/key'
]
const apiKeyPath = [
  '/api/v1/key'
]
function checkAuth (req, res, next) {
  const { path } = req
  console.log(path)
  const { access_token: accessToken, key: apiKey } = req.query
  if (noAuth.includes(path)) {
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
