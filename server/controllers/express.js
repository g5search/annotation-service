const express = require('express')
const app = express()
const bodyParser = require('body-parser')
// const { UI } = require('bull-board')
const models = require('../models')
app.use(bodyParser.json({ limit: '1000kb' }))
// app.use('/admin/queues', UI)
const passport = require('./auth')(app, models)

// app.use(checkAuth)
require('../routes')(app, passport)

const g5AuthOnly = [
  '/api/signup'
]
const jwtOnly = [
]
const noAuth = [
  '/api/login'
]
function checkAuth(req, res, next) {
  const { path } = req
  const { access_token: accessToken } = req.query
  if (noAuth.includes(path)) {
    next()
  } else if (!accessToken && !jwtOnly.includes(path)) {
    if (req.isAuthenticated()) {
      next()
    } else {
      res.redirect('/g5_auth/users/auth/g5')
    }
  } else if (g5AuthOnly.includes(path)) {
    res.sendStatus(401)
  } else {
    passport.authenticate('jwt', { session: false })(req, res, next)
  }
}
module.exports = app
