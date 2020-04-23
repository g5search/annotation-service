const fs = require('fs')
const path = require('path')
const health = require('@cloudnative/health-connect')
const healthcheck = new health.HealthChecker()
const pingcheck = new health.PingCheck('google.com')

healthcheck.registerReadinessCheck(pingcheck)

module.exports = (app) => {
  // app.use('/live', health.LivenessEndpoint(healthcheck))
  // app.use('/ready', health.ReadinessEndpoint(healthcheck))
  app.get('/api/testing', (req, res) => {
    res.json({
      TEST_VAR: process.env.TEST_VAR,
      DATABASE_URL: process.env.DATABASE_URL
    })
  })
  const routes = {}
  fs.readdirSync(__dirname)
    .filter(file => file.indexOf('.') !== 0 &&
                    file !== 'index.js' &&
                    file !== 'README.md')
    .forEach((file) => {
      const routeName = file.replace('.js', '')
      require(path.join(__dirname, file))(app)
      routes[routeName] = routes
    })
  return Object.assign(routes)
}
