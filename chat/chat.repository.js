// src/chat/chat.repository.js
// @ts-ignore
const { Message } = require('./models/chat.model');

exports.saveMessage = async (data) => {
  return await Message.create(data);
};

exports.getMessagesByRoom = async (roomId) => {
  return await Message.findAll({
    where: { roomId },
    order: [['createdAt', 'ASC']],
    limit: 50
  });
};
