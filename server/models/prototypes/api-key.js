const bcrypt = require('bcrypt')
module.exports = (models) => {
  models.apiKey.prototype.isValidKey = function (key) {
    return bcrypt.compare(key, this.key)
  }
}
