'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('team', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      name: Sequelize.STRING
    })
    await queryInterface.addColumn('annotations', 'teamId', {
      type: Sequelize.INTEGER,
      references: {
        model: 'team', // name of Target model
        key: 'id' // key in Target model that we're referencing
      }
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('annotations', 'teamId')
    await queryInterface.dropTable('team')
  }
}
