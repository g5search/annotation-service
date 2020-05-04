module.exports = (models) => {
  models.apiKey.addHook('afterCreate', async (instance, options) => {
    // create the api user
    const { email } = instance.dataValues
    const [firstLast] = email.split('@')
    const [first_name, last_name] = firstLast.split('.')

    await models.annotationUser.findOrCreate({
      where: { email },
      defaults: { email, first_name, last_name }
    })
  })
}
