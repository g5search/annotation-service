module.exports = async function (job, sfApi) {
  const { salesforce_id: sfId } = job.data
  if (!sfApi.isLoggedIn) {
    console.log('Signing In')
    await sfApi.signIn()
  }
  await sfApi.deleteNote(sfId)
}
