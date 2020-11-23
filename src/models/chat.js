'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Chat extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate (models) {
      Chat.belongsTo(models.User, { as: 'senderProfile', foreignKey: 'sender' })
      Chat.belongsTo(models.User, { as: 'recieverProfile', foreignKey: 'reciever' })
    }
  };
  Chat.init({
    sender: DataTypes.INTEGER,
    reciever: DataTypes.INTEGER,
    chat: DataTypes.TEXT,
    lastChat: DataTypes.BOOLEAN,
    unread: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'Chat'
  })
  return Chat
}
