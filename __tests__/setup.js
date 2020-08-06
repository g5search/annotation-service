require('dotenv').config()
module.exports = async function() {
  var SequelizeMock = require('sequelize-mock');
  var dbMock = new SequelizeMock()
  const models = require('../server/models')
  models.sequelize.$overrideImport('../server/models', './config/models/annotation.js')
}
