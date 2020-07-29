const bcrypt = require('bcrypt')
const Hashids = require('hashids/cjs')
const hashids = new Hashids('', 15, 'abcdefghijklmnopqrstuvwxyz1234567890')
module.exports = (models) => {
  models.apiKey.prototype.isValidKey = function (key) {
    return bcrypt.compare(key, this.key)
  }
  models.apiKey.prototype.generateKey = async function() {
    const key = hashids.encode(this.id)
    const hash = await bcrypt.hash(key, 10)
    return { hash, key: `${key}:${this.id}` }
  }
}
