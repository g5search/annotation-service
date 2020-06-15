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

function createNote (WhatId, OwnerId, Task_Category__c, Task_Action_Type__c, Internal_Only__c, Description, ActivityDate, Status, Subject) {
  return conn.sobject('Task').create({
    WhatId,
    OwnerId,
    Task_Category__c,
    Task_Action_Type__c,
    Internal_Only__c,
    Description,
    ActivityDate,
    Status,
    Subject
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

function login(username, password, token) {
  return conn.login(username, `${password}${token}`)
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