const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')
module.exports = (passport, models) => {
  passport.use('signup', new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password'
  }, async (username, password, done) => {
    try {
      // Save the information provided by the user to the the database
      const hash = await bcrypt.hash(password, 10)
      const user = await models.apiUser.create({ username, password: hash })
      // Send the user information to the next middleware
      return done(null, user)
    } catch (error) {
      done(error)
    }
  }))
}
