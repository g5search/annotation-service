const models = require('../../models/primary')

/*
1.Schedule job to run once per quarter
2.Access all clients from g5_updatable_clients table
3.Loop through clients
4.Create report in runClientMSR job and write to msr reports db
*/
module.exports = async (job, sfApi, queue) => {
  if (!sfApi.isLoggedIn) {
    console.log('Signing In')
    await sfApi.signIn()
  }
  try {
    const clients = await getActiveClients()
    clients.forEach((client) => {
      const { urn } = client
      queue.add({ type: 'runClientMSR', urn })
    })
  } catch (e) {
    console.log(e)
  }
}

async function getActiveClients () {
  const clients = await models.g5_updatable_client.findAll({
    where: {
      properties: {
        status: {
          [models.Sequelize.Op.not]: 'Deleted'
        },
        g5_internal: false
      }
    }
  })
  return clients
}
