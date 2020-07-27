const models = require('../../models')
module.exports = async (notes) => {
  try {
    const mappedNotes = notes.filter(n => n !== null)
    const teamId = 2
    const appId = 2
    console.log(mappedNotes.length)
    for (let i = 0; i < mappedNotes.length; i++) {
      console.log([i])
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
          const [category] = await models.annotationCategory.findOrCreate({
            where: {
              name: note.auditName
            },
            defaults: {
              name: note.auditName
            },
            transaction: t
          })
          const typeName = convertName(note.fixReason)
          const [type] = await models.annotationType.findOrCreate({
            where: {
              name: typeName
            },
            defaults: {
              name: note.auditName
            },
            transaction: t
          })
          const client = await models.g5_updatable_client.findOne({
            where: {
              urn: note.clientUrn
            }
          })
          const location = await models.g5_updatable_location.findOne({
            where: {
              urn: note.locationUrn
            }
          })
          const annotation = await models.annotation.create({
            internal: true,
            html: note.annotation,
            g5UpdatableClientId: client ? client.id : null,
            annotationUserId: user ? user.id : null,
            teamId,
            appId
          }, { transaction: t, hooks: false })
          if (location && location.length > 0) {
            await annotation.addG5_updatable_locations([location], { transaction: t, hooks: false })
          }
          await annotation.setAnnotationType(type, { transaction: t, hooks: false })
          await annotation.setAnnotationCategory(category, { transaction: t, hooks: false })
          return note
        }
      })
    }
  } catch (error) {
    console.log(error)
  }
}

function convertName(name) {
  let newName = null
  switch (name) {
    case 'Missing':
      // code block
      newName = 'Added'
      break
    case 'Excessive Characters':
      // code block
      newName = 'Updated'
      break
    case 'Insufficient Characters':
      // code block
      newName = 'Updated'
      break
    case 'Multiple':
      // code block
      newName = 'Updated'
      break
    case 'Duplicate':
      // code block
      newName = 'Updated'
      break
    case 'Internal Redirect':
      // code block
      newName = 'Internal Redirect Updated'
      break
    case 'Broken Off-Page Link':
      // code block
      newName = 'Broken Off-Page Link Updated'
      break
    case 'Broken Link':
      // code block
      newName = 'Broken Link Updated'
      break
    case 'Off-Page Link Redirect':
      // code block
      newName = 'Off-Page Link Redirect Updated'
      break
    default:
    // code block
  }
  return newName
}
