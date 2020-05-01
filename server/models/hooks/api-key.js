const bcrypt = require('bcrypt')
const Hashids = require('hashids/cjs')
const hashids = new Hashids('', 15, 'abcdefghijklmnopqrstuvwxyz1234567890')
module.exports = (models) => {
  models.apiKey.addHook('afterCreate', async (user, options) => {
    user.dataValues.nonHashKey = hashids.encode(user.dataValues.id)
    const hash = await bcrypt.hash(user.dataValues.nonHashKey, 10)
    return user.update({ key: hash })
  })
}
