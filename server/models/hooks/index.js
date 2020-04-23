const fs = require('fs')
const path = require('path')
function addPrototypes(models) {
  fs.readdirSync(__dirname)
    .filter(file => file.indexOf('.') !== 0 && file !== 'index.js') // get all the model files
    .forEach((file) => {
      require(path.join(__dirname, file))(models)
    })
}

module.exports = addPrototypes
