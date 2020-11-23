'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return Promise.all([
      await queryInterface.addColumn(
        'Chats',
        'lastChat',
        Sequelize.BOOLEAN
      ),
      await queryInterface.addColumn(
        'Chats',
        'unread',
        Sequelize.BOOLEAN
      )
    ])
  },

  down: async (queryInterface, Sequelize) => {
    return Promise.all([
      await queryInterface.removeColumn(
        'Chats',
        'lastChat'
      ),
      await queryInterface.removeColumn(
        'Chats',
        'unread'
      )
    ])
  }
}
