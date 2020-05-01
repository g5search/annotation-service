const fs = require('fs')
const path = require('path')
const health = require('@cloudnative/health-connect')
const healthcheck = new health.HealthChecker()
const pingcheck = new health.PingCheck('google.com')

healthcheck.registerReadinessCheck(pingcheck)

module.exports = (app, passport) => {
  // app.use('/live', health.LivenessEndpoint(healthcheck))
  // app.use('/ready', health.ReadinessEndpoint(healthcheck))
  const routes = {}
  fs.readdirSync(__dirname)
    .filter(file => file.indexOf('.') !== 0 &&
                    file !== 'index.js' &&
                    file !== 'README.md')
    .forEach((file) => {
      const routeName = file.replace('.js', '')
      require(path.join(__dirname, file))(app, passport)
      routes[routeName] = routes
    })
  return Object.assign(routes)
}
