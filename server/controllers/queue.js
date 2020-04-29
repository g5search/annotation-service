const Bull = require('bull')
const { setQueues } = require('bull-board')
const models = require('../models')
const api = new Bull('api', process.env.REDIS_URL)
api.process('create', 1, (job) => {
  const { data } = job
  return models.annotation.create(data)
})

setQueues([api])

module.exports = {
  api
}
