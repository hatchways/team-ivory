'use strict';
module.exports = (sequelize, DataTypes) => {
  const messages = sequelize.define('messages', {
    receiverId: DataTypes.INTEGER,
    senderId: DataTypes.INTEGER,
    type: DataTypes.STRING,
    text: DataTypes.STRING
  }, {});
  messages.associate = function(models) {
    // associations can be defined here
  };
  return messages;
};