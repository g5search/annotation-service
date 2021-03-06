const jwt = require('jsonwebtoken')
const { JWT_SECRET } = process.env
const cors = require('cors')
const models = require('../../models/primary')
const whitelist = [
  /chrome-extension:\/\/[a-z]*$/
]
const corsOpts = {
  origin: (origin, callback) => {
    if (whitelist.some(pattern => pattern.test(origin)) || !origin) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
  preflightContinue: true,
  methods: 'POST'
}

module.exports = (app, passport) => {
  app.post('/api/v1/signup', passport.authenticate('signup', { session: false }), (req, res) => {
    res.json({
      message: 'Signup successful',
      user: req.user
    })
  })

  app.post('/api/v1/login', (req, res, next) => {
    passport.authenticate('login', (err, user) => {
      console.log(user)
      try {
        if (err || !user) {
          return next(new Error('An Error Occurred'))
        }
        req.login(user, { session: false }, (error) => {
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

  app.options('/api/v1/key', cors(corsOpts))
  app.post('/api/v1/key', cors(corsOpts), async (req, res) => {
    const { body } = req
    if (body.email && body.email.includes('@getg5.com')) {
      const [apiUser, created] = await models.apiKey.findOrCreate({
        where: { email: body.email },
        defaults: { email: body.email }
      })
      if (!created) {
        res.sendStatus(422)
      } else {
        const { hash, key } = await apiUser.generateKey()
        await apiUser.update({ key: hash })
        res.json({ key })
      }
    } else {
      res.sendStatus(401)
    }
  })
  // returns simplified user to client-side
  app.get('/api/v1/me', (req, res) => {
    if (req.user.email) {
      const { email, firstName, lastName } = req.user
      res.json({ email, firstName, lastName })
    } else {
      res.sendStatus(404)
    }
  })
}
