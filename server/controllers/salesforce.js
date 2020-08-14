const jsforce = require('jsforce')
const util = require('../controllers/util')
const {
  SF_USERNAME: username,
  SF_PASSWORD: password,
  SF_TOKEN: token
} = process.env

class SfApi extends jsforce.Connection {
  constructor (params) {
    if (SfApi._instance) {
      throw new Error('SfApi already has an instance!!!')
    }
    super(params)
    this.username = params.username
    this.password = params.password
    this.token = params.token
    this.loggedIn = false
    SfApi._instance = this
  }

  signIn() {
    return this.login(this.username, `${this.password}${this.token}`).then(() => { this.loggedIn = true })
  }

  signOut() {
    return this.logout().then(() => { this.loggedIn = false })
  }

  get isLoggedIn() {
    return this.loggedIn
  }

  set isLoggedIn(param) {
    this.loggedIn = param
  }

  createNote(WhatId, OwnerId, Task_Category__c, Task_Action_Type__c, Internal_Only__c, Description, ActivityDate, Status, Subject, Task_Types__c) {
    return this.sobject('Task').create(
      {
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
      }
    )
  }

  getTotalCases(where) {
    return this.query('SELECT count() FROM Case WHERE ClosedDate > 2020-01-01T00:00:00.000Z')
  }

  getUserId (where, attributes) {
    return this.sobject('User').find(where, attributes)
      .then(accounts => util.pick(accounts[0], attributes))
  }

  deleteNote(id) {
    return this.sobject('Task').destroy(id)
  }

  updateNote(Id, update) {
    return this.sobject('Task').update({
      Id,
      ...update
    })
  }

  async findAccount(where, attributes) {
    const accounts = await this.sobject('Account').find(where, attributes)
    return util.pick(accounts[0], attributes)
  }

  async findLocation(where, attributes) {
    const accounts = await this.sobject('Location__c').find(where, attributes)
    return util.pick(accounts[0], attributes)
  }

  getCases(where, attributes) {
    return this.query('SELECT AccountId, Account_Manager__c, CaseNumber, Case_Age__c, Case_Owner_Name__c, ClosedDate, CreatedDate, RecordTypeId, Request_Type__c, Subject FROM Case WHERE ClosedDate > 2020-01-01T00:00:00.000Z')
      .then(async(cases) => {
        const totalCases = [...cases.records]
        let done = cases.done
        let nextRecordsUrl = cases.nextRecordsUrl
        while (!done) {
          const query = await this.queryMore(nextRecordsUrl)
          totalCases.push(...query.records)
          nextRecordsUrl = query.nextRecordsUrl
          done = query.done
        }
        return totalCases
      })
  }

  getRecordTypes(ids, attributes) {
    return this.sobject('recordType').retrieve(ids)
      .then(recordTypes => recordTypes.map(recordType => util.pick(recordType, attributes)))
  }

  getAccounts(ids, attributes) {
    return this.sobject('Account').retrieve(ids)
      .then(accounts => accounts.map((account) => {
        if (account) { return util.pick(account, attributes) }
      }).filter(account => account))
  }
}

// module.exports = new SfApi({ username, password, token, loginUrl: 'https://test.salesforce.com' })
module.exports = new SfApi({ username, password, token })
