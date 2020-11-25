'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return await queryInterface.addColumn(
      'Friends',
      'name',
      Sequelize.STRING
    )
  },

  down: async (queryInterface, Sequelize) => {
    return await queryInterface.removeColumn(
      'Friends',
      'name'
    )
  }
}
