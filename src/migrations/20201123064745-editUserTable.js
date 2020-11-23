'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return Promise.all([
      await queryInterface.changeColumn('Users', 'idName', {
        type: Sequelize.STRING,
        allowNull: true,
        unique: true
      }),
      await queryInterface.changeColumn('Users', 'email', {
        type: Sequelize.STRING,
        allowNull: true,
        unique: true
      }),
      await queryInterface.changeColumn('Users', 'phone', {
        type: Sequelize.STRING,
        allowNull: true,
        unique: true
      })
    ])
  },

  down: async (queryInterface, Sequelize) => {
    return Promise.all([
      await queryInterface.changeColumn('Users', 'idName', {
        type: Sequelize.STRING,
        allowNull: true,
      }),
      await queryInterface.changeColumn('Users', 'email', {
        type: Sequelize.STRING,
        allowNull: true,
      }),
      await queryInterface.changeColumn('Users', 'phone', {
        type: Sequelize.STRING,
        allowNull: true,
      }),
    ])
  }
};
