const SequelizeMock = require('sequelize-mock')

const dbMock = new SequelizeMock()

module.exports = dbMock.define('annotation', {
  id: 1,
  salesforce_id: null,
  annotation: { type: 'doc', content: [{ type: 'paragraph', content: [{ text: 'Testing Note Update', type: 'text' }] }] },
  internal: false,
  startDate: null,
  endDate: null,
  html: '<p>Testing Note Update</p>',
  salesforceSync: false
}, {
  paranoid: true,
  instanceMethods: {
    getFullName () {
      return this.get('firstName') + ' ' + this.get('lastName')
    }
  }
})
