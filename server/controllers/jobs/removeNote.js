const sfApi = require('../salesforce')
const {
  SF_USERNAME: sfUsername,
  SF_PASSWORD: sfPassword,
  SF_TOKEN: sfToken
} = process.env
module.exports = async function (job) {
  const { salesforce_id: sfId } = job.data
  await sfApi.login(sfUsername, sfPassword, sfToken)
  await sfApi.deleteNote(sfId)
  await sfApi.logout()
}
