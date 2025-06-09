require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const redis = require('redis');
const { createAdapter } = require('@socket.io/redis-adapter');
const sequelize = require('./config/database');
const ChatMessage = require('./models/ChatMessage');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*' }
});

// Setup Redis clients for adapter
const pubClient = redis.createClient({ host: process.env.REDIS_HOST, port: process.env.REDIS_PORT });
const subClient = pubClient.duplicate();

io.adapter(createAdapter(pubClient, subClient));

// Middleware to parse JSON (untuk API REST)
app.use(express.json());

// Simple REST API to get chat history between two users
app.get('/history/:user1/:user2', async (req, res) => {
  const { user1, user2 } = req.params;
  try {
    const messages = await ChatMessage.findAll({
      where: {
        [sequelize.Op.or]: [
          { senderId: user1, receiverId: user2 },
          { senderId: user2, receiverId: user1 },
        ]
      },
      order: [['createdAt', 'ASC']],
    });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Socket.IO connection
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Join room for userId (client harus emit 'join' dengan userId)
  socket.on('join', (userId) => {
    socket.join(`user_${userId}`);
    console.log(`Socket ${socket.id} joined room user_${userId}`);
  });

  // Handle sending message
  socket.on('send_message', async ({ senderId, receiverId, message }) => {
    try {
      // Simpan ke DB
      const chatMessage = await ChatMessage.create({ senderId, receiverId, message });

      // Kirim pesan ke receiver room
      io.to(`user_${receiverId}`).emit('receive_message', chatMessage);

      // (Opsional) Kirim echo ke sender juga
      socket.emit('receive_message', chatMessage);
    } catch (error) {
      console.error('Error saving message:', error);
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Start server & DB connection
const start = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync();
    server.listen(process.env.PORT, () => {
      console.log(`Chat service running on port ${process.env.PORT}`);
    });
  } catch (error) {
    console.error('Unable to start server:', error);
  }
};

start();
