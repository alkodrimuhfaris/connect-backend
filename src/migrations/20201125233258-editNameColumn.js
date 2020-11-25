'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return Promise.all([
      await queryInterface.changeColumn('Users', 'name', {
        type: Sequelize.STRING,
        defaultValue: ''
      }),
      await queryInterface.changeColumn('Friends', 'name', {
        type: Sequelize.STRING,
        defaultValue: ''
      })
    ])
  },

  down: async (queryInterface, Sequelize) => {
    return Promise.all([
      await queryInterface.changeColumn('Users', 'name', {
        type: Sequelize.STRING,
        allowNull: true
      }),
      await queryInterface.changeColumn('Friends', 'name', {
        type: Sequelize.STRING,
        allowNull: true
      })
    ])
  }
}
