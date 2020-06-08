const jsforce = require('jsforce')
const util = require('../../util')
// const conn = new jsforce.Connection({
//   loginUrl: 'https://test.salesforce.com'
// })
const conn = new jsforce.Connection()

module.exports = {
  createNote,
  login,
  logout,
  getUserId,
  updateNote
}

function createNote (subject, accountId, status, summary, ContactId, Request_Type__c) {
  return conn.sobject('Case').create({
    Subject: subject,
    AccountId: accountId,
    Status: status,
    Summary_of_Request__c: summary,
    ContactId,
    RecordTypeId: '0121N000000U4oUQAS',
    Request_Type__c
  })
}

function getUserId(where, attributes) {
  return conn.sobject('User').find(where, attributes)
    .then(accounts => util.pick(accounts[0], attributes))
}

function updateNote(Id, update) {
  return conn.sobject('Case').update({
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
