'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  User.init({
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    name: DataTypes.STRING,
    idName: DataTypes.STRING,
    status: DataTypes.TEXT,
    phone: DataTypes.STRING,
    ava: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};