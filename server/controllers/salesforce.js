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
  findAccount,
  findLocation
}

function createNote (WhatId, OwnerId, Task_Category__c, Task_Action_Type__c, Internal_Only__c, Description, ActivityDate, Status, Subject, Task_Types__c,) {
  return conn.sobject('Task').create({
    WhatId,
    OwnerId,
    Task_Category__c,
    Task_Action_Type__c,
    Internal_Only__c,
    Description,
    ActivityDate,
    Status,
    Subject,
    Task_Types__c
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

async function findLocation(where, attributes) {
  console.log({ where })
  const accounts = await conn.sobject('Location__c').find(where, attributes)
  console.log({ account: accounts[0] })
  return util.pick(accounts[0], attributes)
}
