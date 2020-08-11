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

// eslint-disable-next-line camelcase
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
  return conn.query('SELECT AccountId, Account_Manager__c, CaseNumber, Case_Age__c, Case_Owner_Name__c, ClosedDate, CreatedDate, RecordTypeId, Request_Type__c, Subject FROM Case WHERE ClosedDate > 2020-01-01T00:00:00.000Z')
    .then(async(cases) => {
      const totalCases = [...cases.records]
      let done = cases.done
      let nextRecordsUrl = cases.nextRecordsUrl
      while (!done) {
        const query = await conn.queryMore(nextRecordsUrl)
        totalCases.push(...query.records)
        nextRecordsUrl = query.nextRecordsUrl
        done = query.done
      }
      return totalCases
    })
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
    .then(accounts => accounts.map((account) => {
      if (account) { return util.pick(account, attributes) }
    }).filter(account => account))
}
