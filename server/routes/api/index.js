const fs = require('fs')
const path = require('path')

module.exports = (app) => {
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
