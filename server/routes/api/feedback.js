const axios = require('axios')
const { SLACK_FEEDBACK_URL } = process.env
const models = require('../../models')

module.exports = (app) => {
  app.post('/api/v1/feedback', async (req, res) => {
    try {
      const { type, comments } = req.body
      const { firstName, lastName } = req.user
      await models.feedback.create({
        name: `${firstName} ${lastName}`,
        type,
        comments
      })
      axios
        .post(SLACK_FEEDBACK_URL, {
          text: `${firstName} ${lastName} says: ${comments}\n File Under: ${type}`,
          username: 'Notes Service',
          icon_emoji: ':clippy:'
        })
        .then(() => console.log('Posted Feedback to #dept-operational-excellence'))
      res.sendStatus(201)
    } catch {
      res.sendStatus(500)
    }
  })
}
