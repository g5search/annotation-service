const LocalStrategy = require('passport-local').Strategy
module.exports = (passport, models) => {
  passport.use('signup', new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password'
  }, async (username, password, done) => {
    try {
      // Save the information provided by the user to the the database
      const user = await models.apiUser.create({ username, password })
      // Send the user information to the next middleware
      return done(null, user)
    } catch (error) {
      done(error)
    }
  }))
}
