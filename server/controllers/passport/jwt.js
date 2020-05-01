const JWTstrategy = require('passport-jwt').Strategy
const ExtractJWT = require('passport-jwt').ExtractJwt
const { JWT_SECRET } = process.env

module.exports = (passport, models) => {
  passport.use(new JWTstrategy({
    secretOrKey: JWT_SECRET,
    jwtFromRequest: ExtractJWT.fromUrlQueryParameter('access_token')
  }, async (token, done) => {
    try {
      return done(null, token.user)
    } catch (err) {
      done(err)
    }
  }))
}
