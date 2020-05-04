const models = require('../models')
module.exports = {
  authenticate
}

async function authenticate(apiKey, req, res, next) {
  const [key, id] = apiKey.split(':')
  const user = await models.apiKey.findOne({ where: { id } })
  if (user.isValidKey(key)) {
    req.user = { email: user.dataValues.email }
    next()
  } else {
    res.sendStatus(401)
  }
}
