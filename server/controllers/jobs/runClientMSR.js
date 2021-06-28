const Hashids = require('hashids/cjs')
const hashids = new Hashids('', 10, 'abcdefghijklmnopqrstuvwxyz1234567890')
const models = require('../../models/msr')
module.exports = async (job, sfApi, queue) => {
  try {
    if (!sfApi.isLoggedIn) {
      console.log('Signing In')
      await sfApi.signIn()
    }
    const { urn } = job.data
    const serviceLevels = await sfApi.getAccountByUrn(urn)
    const approvals = configureApprovals(serviceLevels)
    const { to, from } = getDates()
    const workQ = []
    createNewReport(to, from, workQ, urn, approvals)
  } catch (e) {
    console.log(e)
  }
}

function getDates () {
  const date = new Date()
  const month = date.getMonth()
  const isQ4Report = [1, 2, 3].includes(month)
  const year = date.getFullYear()
  const reportYear = isQ4Report ? year - 1 : year
  const dateRange = getToAndFrom(month, reportYear)
  return dateRange
}

function getToAndFrom (month, reportYear) {
  const monthToQuarterMap = {
    1: { start: '10-01', end: '12-31' },
    2: { start: '10-01', end: '12-31' },
    3: { start: '10-01', end: '12-31' },
    4: { start: '01-01', end: '03-31' },
    5: { start: '01-01', end: '03-31' },
    6: { start: '01-01', end: '03-31' },
    7: { start: '04-01', end: '06-30' },
    8: { start: '04-01', end: '06-30' },
    9: { start: '04-01', end: '06-30' },
    10: { start: '07-01', end: '09-30' },
    11: { start: '07-01', end: '09-30' },
    12: { start: '07-01', end: '09-30' }
  }
  return {
    from: `${reportYear}-${monthToQuarterMap[month].start}`,
    to: `${reportYear}-${monthToQuarterMap[month].end}`
  }
}

function configureApprovals (serviceLevels) {
  const approvals = {}
  return approvals
}
function createNewReport (to, from, workQ, clientUrn, approvals) {
  models.sequelize.transaction(async (t) => {
    const report = await models.report.create({
      to,
      from,
      workQ,
      clientUrn,
      approvals
    }, { transaction: t })
    const reportId = hashids.encode(report.dataValues.id)
    return report.update({ reportId }, { transaction: t })
  })
}
