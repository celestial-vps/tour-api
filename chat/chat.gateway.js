// src/chat/chat.gateway.js
const chatService = require('./chat.service');

function chatGateway(io) {
  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    socket.on('joinRoom', async (roomId) => {
      socket.join(roomId);
      const history = await chatService.getChatHistory(roomId);
      socket.emit('chat history', history);
    });

    socket.on('chat message', async ({ roomId, sender, message }) => {
      await chatService.saveChat({ roomId, sender, message });
      io.to(roomId).emit('chat message', { sender, message });
    });

    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
    });
  });
}

module.exports = chatGateway;
