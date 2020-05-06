const jsforce = require('jsforce')
const util = require('../../utilities/util')
const conn = new jsforce.Connection({
  loginUrl: 'https://test.salesforce.com'
})

module.exports = {
  login,
  logout
}

function login(username, password) {
  return conn.login(username, password)
}

function logout() {
  return conn.logout()
}
