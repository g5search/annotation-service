const fs = require('fs')
const path = require('path')

function addPrototypes(models, Sequelize, sequelize) {
  fs.readdirSync(__dirname)
    .filter(file => file.indexOf('.') !== 0 && file !== 'index.js')
    .forEach((file) => {
      require(path.join(__dirname, file))(models, Sequelize, sequelize)
    })
}

module.exports = addPrototypes
