const jsforce = require('jsforce')
const util = require('../controllers/util')
const {
  SF_USERNAME: username,
  SF_PASSWORD: password,
  SF_TOKEN: token
} = process.env

/**
 * Salesforce connection class
 * @class SfApi
 * @extends {jsforce.Connection}
 */
class SfApi extends jsforce.Connection {
  /**
   *Creates an instance of SfApi.
   * @param { Object } params
   *  @param { string } params.username
   *  @param { string } params.password
   *  @param { string } params.token
   *  @param { string } params.loginUrl
   * @memberof SfApi
   */
  constructor(params) {
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

  /**
   * Signs into SF
   * @returns { Promise }
   * @memberof SfApi
   */
  signIn() {
    return this.login(this.username, `${this.password}${this.token}`).then(() => { this.loggedIn = true })
  }

  /**
   * Signs into SF
   * @returns { Promise }
   * @memberof SfApi
   */
  signOut() {
    return this.logout().then(() => { this.loggedIn = false })
  }

  /**
   * Getter for Instance property loggedIn
   * @returns { Boolean }
   * @memberof SfApi
   */
  get isLoggedIn() {
    return this.loggedIn
  }

  /**
   * Setter for Instance property loggedIn
   * @param { Boolean }
   * @memberof SfApi
   */
  set isLoggedIn(param) {
    this.loggedIn = param
  }

  /**
   *
   * @param {*} WhatId
   * @param {*} OwnerId
   * @param {*} Task_Category__c
   * @param {*} Task_Action_Type__c
   * @param {*} Internal_Only__c
   * @param {*} Description
   * @param {*} ActivityDate
   * @param {*} Status
   * @param {*} Subject
   * @param {*} Task_Types__c
   * @returns
   * @memberof SfApi
   */
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
    ).catch((err) => {
      console.log(err)
      console.log(this.isLoggedIn)
      throw new Error(err)
    })
  }

  /**
   * Returns total case count
   * @param {String} where
   * @returns { Number } Number of total closed cases in 2020
   * @memberof SfApi
   */
  getTotalCases(where) {
    return this.query('SELECT count() FROM Case WHERE ClosedDate > 2020-01-01T00:00:00.000Z')
      .catch((err) => {
        console.log(err)
        console.log(this.isLoggedIn)
        throw new Error(err)
      })
  }

  /**
   * Gets user ID matching where param and attributes param
   * @param { Object } where Object holding email as prop
   * @param { Array } attributes Aray of attributes to match
   * @returns { Object } Has property ID
   * @memberof SfApi
   */
  getUserId(where, attributes) {
    return this.sobject('User').find(where, attributes)
      .then(accounts => util.pick(accounts[0], attributes))
      .catch((err) => {
        console.log(err)
        console.log(this.isLoggedIn)
        throw new Error(err)
      })
  }

  /**
   * Deletes Note in Salesforce
   * @param { String } id
   * @returns { Promise }
   * @memberof SfApi
   */
  deleteNote(id) {
    return this.sobject('Task').destroy(id)
      .catch((err) => {
        console.log(err)
        console.log(this.isLoggedIn)
        throw new Error(err)
      })
  }

  /**
   * Updates not in Salesforce
   * @param { String } Id
   * @param { Object } update
   *  Holds props WhatId,OwnerId,Task_Category__c,Task_Action_Type__c,
   *  Internal_Only__c,Description,ActivityDate,Subject
   * @returns { Promise }
   * @memberof SfApi
   */
  updateNote(Id, update) {
    return this.sobject('Task').update({
      Id,
      ...update
    })
      .catch((err) => {
        console.log(err)
        console.log(this.isLoggedIn)
        throw new Error(err)
      })
  }

  /**
   * Returns account that matches where statement and attributes Array
   * @param { Object } where
   * @param { Array } attributes Array of attributes to match
   * @returns { Object }
   * @memberof SfApi
   */
  findAccount(where, attributes) {
    return this.sobject('Account').find(where, attributes)
      .then(accounts => util.pick(accounts[0], attributes))
      .catch((err) => {
        console.log(err)
        console.log(this.isLoggedIn)
        throw new Error(err)
      })
  }

  /**
   * Returns location that matches where statement and attributes Array
   * @param { Object } where
   * @param { Array } attributes Array of attributes to match
   * @returns { Object }
   * @memberof SfApi
   */
  findLocation(where, attributes) {
    return this.sobject('Location__c').find(where, attributes)
      .then((accounts) => {
        if (accounts.length > 0) {
          return util.pick(accounts[0], attributes)
        } else {
          throw new Error(`Cant find location with ${where}`)
        }
      })
      .catch((err) => {
        console.log(err)
        console.log(this.isLoggedIn)
        throw new Error(err)
      })
  }

  /**
   * Gets closed cases in SF after Jan 1, 2020
   * @returns { Object }
   * @memberof SfApi
   */
  getCases(where, attributes) {
    return this.query('SELECT AccountId, Account_Manager__c, CaseNumber, Case_Age__c, Case_Owner_Name__c, ClosedDate, CreatedDate, RecordTypeId, Request_Type__c, Subject FROM Case WHERE ClosedDate > 2020-01-01T00:00:00.000Z')
      .then(async (cases) => {
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
      .catch((err) => {
        console.log(err)
        console.log(this.isLoggedIn)
        throw new Error(err)
      })
  }

  /**
   * Returns record types that matche where statement and attributes Array
   * @param { Object } where
   * @param { Array } attributes Array of attributes to match
   * @returns { Object }
   * @memberof SfApi
   */
  getRecordTypes(ids, attributes) {
    return this.sobject('recordType').retrieve(ids)
      .then(recordTypes => recordTypes.map(recordType => util.pick(recordType, attributes)))
      .catch((err) => {
        console.log(err)
        console.log(this.isLoggedIn)
        throw new Error(err)
      })
  }

  /**
   * Returns account that matche where statement and attributes Array
   * @param { Object } where
   * @param { Array } attributes Array of attributes to match
   * @returns { Object }
   * @memberof SfApi
   */
  getAccounts(ids, attributes) {
    return this.sobject('Account').retrieve(ids)
      .then(accounts => accounts.map((account) => {
        if (account) { return util.pick(account, attributes) }
      }).filter(account => account))
      .catch((err) => {
        console.log(err)
        console.log(this.isLoggedIn)
        throw new Error(err)
      })
  }
}

// module.exports = new SfApi({ username, password, token, loginUrl: 'https://test.salesforce.com' })
module.exports = new SfApi({ username, password, token })
