const LocalStrategy = require('passport-local').Strategy
module.exports = (passport, models) => {
  passport.use('login', new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password'
  }, async (username, password, done) => {
    try {
      //  Find the user associated with the email provided by the user
      const user = await models.apiUser.findOne({ where: { username } })
      console.log({ user })
      if (!user) {
      //  If the user isn't found in the database, return a message
        return done(null, false, { message: 'User not found' })
      }
      //  Validate password and make sure it matches with the corresponding hash stored in the database
      //  If the passwords match, it returns a value of true.
      const validate = await user.isValidPassword(password)
      console.log(validate)
      user.update({ lastLogin: new Date() })
      if (!validate) {
        return done(null, false, { message: 'Wrong Password' })
      }
      //  Send the user information to the next middleware
      return done(null, user, { message: 'Logged in Successfully' })
    } catch (error) {
      return done(error)
    }
  }))
}
