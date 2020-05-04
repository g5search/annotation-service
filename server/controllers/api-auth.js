const models = require('../models')
module.exports = {
  authenticate
}

async function authenticate(apiKey, req, res, next) {
  const [id, key] = apiKey.split(':')
  const user = await models.apiKey.findOne({ where: { id } })
  if (user.isValidKey(key)) {
    next()
  } else {
    res.sendStatus(401)
  }
}
