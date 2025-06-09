// src/chat/chat.service.js
const repo = require('./chat.repository');

exports.saveChat = async ({ roomId, sender, message }) => {
  return await repo.saveMessage({ roomId, sender, message });
};

exports.getChatHistory = async (roomId) => {
  return await repo.getMessagesByRoom(roomId);
};
