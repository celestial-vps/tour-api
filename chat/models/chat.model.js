// src/chat/chat.model.js
module.exports = (sequelize, DataTypes) => {
  const Message = sequelize.define('Message', {
    roomId: DataTypes.STRING,
    sender: DataTypes.STRING,
    message: DataTypes.TEXT,
  });

  return Message;
};
