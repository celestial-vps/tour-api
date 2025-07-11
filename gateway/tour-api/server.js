const app = require('./app'); // Express app
const http = require('http');
const { Server } = require('socket.io');
const chatGateway = require('../chat/chat.gateway');
const initSocketServer = require('./lib/socket/socket-server');
const dotenv = require('dotenv');
require('./misc/datetime'); 

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*', // sesuaikan origin kalau perlu
  }
});

// io.on('connection', (socket) => {
//   console.log('User connected:', socket.id);

//   // User join room dengan id user (bisa user id atau admin id)
//   socket.on('joinRoom', (roomId) => {
//     socket.join(roomId);
//     console.log(`Socket ${socket.id} joined room ${roomId}`);
//   });

//   // Terima pesan chat, kirim ke room tertentu
//   socket.on('chat message', ({ roomId, sender, message }) => {
//     console.log(`Message from ${sender} in room ${roomId}: ${message}`);

//     // Kirim pesan ke semua yang di room (termasuk sender)
//     io.to(roomId).emit('chat message', { sender, message });
//   });

//   socket.on('disconnect', () => {
//     console.log('User disconnected:', socket.id);
//   });
// });
// chatGateway(io);


// Inisialisasi socket handler
initSocketServer(io);
// Ambil env name, default ke `.env` jika tidak ada
const envFile = `.env.${process.env.NODE_ENV || 'development'}`;

dotenv.config({ path: envFile });

console.log(`Environment loaded from ${envFile}`);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`🚀 Server + WebSocket running on port ${PORT}`);
  require('./middleware/cron-job/cron-job-redis-region');
  // require('./middleware/audit-trail/schedule-resend-audit'); // Mulai cron job untuk resend audit log
});
