const models = require('../../models/primary')

module.exports = async (job, done) => {
  try {
    const { notes } = job.data
    const mappedNotes = notes.filter(n => n !== null)
    const teamId = 2
    const appId = 2
    const added = []
    const duplicates = []
    for (let i = 0; i < mappedNotes.length; i++) {
      const note = mappedNotes[i]
      await models.sequelize.transaction(async (t) => {
        if (note.user) {
          const [user] = await models.annotationUser.findOrCreate({
            where: {
              email: note.user.email
            },
            transaction: t,
            defaults: {
              email: note.user.email,
              first_name: note.user.firstName,
              last_name: note.user.lastName
            }
          })

          const typeName = convertName(note.fixReason, note.auditName)
          const [type] = await models.annotationType.findOrCreate({
            where: { name: typeName },
            defaults: { name: typeName },
            transaction: t
          })

          const client = await models.g5_updatable_client.findOne({
            where: { urn: note.clientUrn }
          })

          const location = await models.g5_updatable_location.findOne({
            where: { urn: note.locationUrn }
          })

          const [annotation, isCreated] = await models.annotation.findOrCreate({
            where: { check_id: note.checkId },
            defaults: {
              check_id: note.checkId,
              internal: true,
              html: note.annotation,
              g5UpdatableClientId: client ? client.id : null,
              annotationUserId: user ? user.id : null,
              annotationCategoryId: 8,
              teamId,
              appId,
              createdAt: note.createdAt
            },
            transaction: t,
            hooks: false
          })

          if (isCreated) {
            if (location && location.length > 0) {
              await annotation.addG5_updatable_locations([location], {
                transaction: t,
                hooks: false
              })
            }
            await annotation.setAnnotationType(type, { transaction: t, hooks: false })
            added.push(annotation.dataValues)
          } else {
            duplicates.push(annotation.dataValues)
          }
        }
      })
    }
    done(null, { added, duplicates })
  } catch (error) {
    done(error)
  }
}

function convertName (name, audit) {
  console.log({ name, audit })
  let newName = null
  switch (name) {
    case 'Missing':
      newName = 'Added'
      break
    case 'Missing Alt Text':
      newName = 'Missing'
      break
    case 'Excessive Characters':
      newName = 'Updated'
      break
    case 'Insufficient Characters':
      newName = 'Updated'
      break
    case 'Multiple':
      newName = 'Updated'
      break
    case 'Duplicate':
      newName = 'Updated'
      break
    case 'Internal Redirect':
      newName = 'Internal Redirect Updated'
      break
    case 'Broken Off-Page Link':
      newName = 'Broken Off-Page Link Updated'
      break
    case 'Broken Link':
      newName = 'Updated'
      break
    case 'Off-Page Link Redirect':
      newName = 'Off-Page Link Redirect Updated'
      break
    default:
      newName = ''
  }
  console.log(`${newName} ${audit}`)
  return `${newName} ${audit}`
}
