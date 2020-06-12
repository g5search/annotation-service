const jsforce = require('jsforce')
const util = require('../controllers/util')
const conn = new jsforce.Connection({
  loginUrl: 'https://test.salesforce.com'
})
// const conn = new jsforce.Connection()

module.exports = {
  createNote,
  login,
  logout,
  getUserId,
  updateNote,
  findAccount
}

function createNote (AccountId, OwnerId, Task_Categories__c, Task_Action_Type__c, Internal_Only__c, Description, ActivityDate, CreatedDate, LastModifiedDate) {
  return conn.sobject('Task').create({
    AccountId,
    OwnerId,
    Task_Categories__c,
    Task_Action_Type__c,
    Internal_Only__c,
    Description,
    ActivityDate,
    CreatedDate,
    LastModifiedDate
  })
}

function getUserId(where, attributes) {
  return conn.sobject('User').find(where, attributes)
    .then(accounts => util.pick(accounts[0], attributes))
}

function updateNote(Id, update) {
  return conn.sobject('Task').update({
    Id,
    ...update
  })
}

function login(username, password) {
  return conn.login(username, password)
}

function logout() {
  return conn.logout()
}

/**
 *
 * @param {Object} where
 * @param {Array} attributes
 */
async function findAccount(where, attributes) {
  const accounts = await conn.sobject('Account').find(where, attributes)
  return util.pick(accounts[0], attributes)
}