const Bull = require('bull')
const { setQueues } = require('bull-board')
const models = require('../models')
const { REDIS_URL } = process.env
const api = new Bull('api', REDIS_URL)
api.process('create', 1, (job) => {
  const { data } = job
  return models.annotation.create(data)
})
const salesforce = new Bull('salesforce', REDIS_URL)
salesforce.process('sync', 1, async (job) => {
  const { id } = job.data
  const dbAnnotation = await models.annotation.findOne({ where: { id } })
  const { html, annotation, internal } = dbAnnotation
  if (!internal) {
    // send to SF
  }
})
setQueues([api, salesforce])

module.exports = {
  api,
  salesforce
}
