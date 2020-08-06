const jsforce = require('jsforce')
const util = require('../controllers/util')
const conn = new jsforce.Connection({
  loginUrl: 'https://test.salesforce.com'
})
// const conn = new jsforce.Connection()

module.exports = {
  createNote,
  deleteNote,
  updateNote,
  login,
  logout,
  getUserId,
  findAccount,
  findLocation,
  getCases,
  getRecordTypes,
  getAccounts,
  getTotalCases
}

function createNote(WhatId, OwnerId, Task_Category__c, Task_Action_Type__c, Internal_Only__c, Description, ActivityDate, Status, Subject, Task_Types__c) {
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
function deleteNote(id) {
  return conn.sobject('Task').destroy(id)
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
  const accounts = await conn.sobject('Location__c').find(where, attributes)
  return util.pick(accounts[0], attributes)
}

function getCases(where, attributes) {
  return conn.sobject('Case').find()
  // .then(tickets => tickets.map(ticket => util.pick(ticket, attributes)))
}
function getTotalCases(where) {
  return conn.query('SELECT count() FROM Case WHERE ClosedDate > 2020-01-01T00:00:00.000Z')
}

function getRecordTypes(ids, attributes) {
  return conn.sobject('recordType').retrieve(ids)
    .then(recordTypes => recordTypes.map(recordType => util.pick(recordType, attributes)))
}

function getAccounts(ids, attributes) {
  return conn.sobject('Account').retrieve(ids)
    .then(recordTypes => recordTypes.map(recordType => util.pick(recordType, attributes)))
}
