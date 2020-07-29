const bcrypt = require('bcrypt')
module.exports = (models) => {
  models.apiUser.prototype.isValidPassword = function (password) {
    return bcrypt.compare(password, this.password)
  }
}
