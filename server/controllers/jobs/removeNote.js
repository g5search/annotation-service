const sfApi = require('../salesforce')
const {
  SF_USERNAME: sfUsername,
  SF_PASSWORD: sfPassword,
  SF_TOKEN: sfToken
} = process.env
module.exports = async function (job, sfApi) {
  const { salesforce_id: sfId } = job.data
  if (!sfApi.isLoggedIn) {
    console.log('Signing In')
    await sfApi.signIn()
  }
  await sfApi.deleteNote(sfId)
}
