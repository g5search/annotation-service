require('dotenv').config()
const fs = require('fs')
const path = require('path')
function connectionInfo() {
  const {
    DATABASE_URL: dbUrl,
    DATABASE_SSL: ssl,
    DATABASE_CA: ca,
    DATABASE_CERT: cert,
    DATABASE_KEY: key
  } = process.env
  const [, dialect, username, password, host, port, database] = dbUrl.match(/(.*|\G):\/\/(.*?|\G):(.*?|\G)@(.*?|\G):(.*?|\G)\/(.*)/)
  return {
    development: {
      username,
      password,
      database,
      host,
      dialect,
      port
    },
    production: {
      username,
      password,
      database,
      host,
      dialect,
      port,
      dialectOptions: {
        ssl: (ssl === 'true') ? {
          ca: fs.readFileSync(path.join(__dirname, ca)),
          cert: fs.readFileSync(path.join(__dirname, cert)),
          key: fs.readFileSync(path.join(__dirname, key))
        } : false
      }
    }
  }
}
module.exports = connectionInfo
