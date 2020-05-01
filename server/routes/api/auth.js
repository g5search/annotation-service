const jwt = require('jsonwebtoken')
const { JWT_SECRET } = process.env
const models = require('../../models')

module.exports = (app, passport) => {
  app.post('/api/v1/signup', passport.authenticate('signup', { session: false }), async (req, res) => {
    res.json({
      message: 'Signup successful',
      user: req.user
    })
  })

  app.post('/api/v1/login', async (req, res, next) => {
    passport.authenticate('login', async (err, user) => {
      try {
        if (err || !user) {
          return next(new Error('An Error Occurred'))
        }
        req.login(user, { session: false }, async (error) => {
          if (error) { return next(error) }
          const body = { _id: user.id, username: user.username }
          const token = jwt.sign({ user: body }, JWT_SECRET, { expiresIn: '24h' })
          return res.json({ token })
        })
      } catch (error) {
        return next(error)
      }
    })(req, res, next)
  })

  app.post('/api/v1/key', async (req, res) => {
    const { body } = req
    if (body.email && body.email.includes('@getg5.com')) {
      const [apiUser, created] = await models.apiKey.findOrCreate({
        where: { email: body.email },
        defaults: { email: body.email }
      })
      if (!created) {
        res.sendStatus(422)
      } else {
        res.json({ key: apiUser.dataValues.nonHashKey })
      }
    } else {
      res.sendStatus(401)
    }
  })
}
