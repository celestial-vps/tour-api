const app = require('./app'); // Express app
const http = require('http');
// const { Server } = require('socket.io');
// const chatGateway = require('../chat/chat.gateway');
// const initSocketServer = require('./lib/socket/socket-server');
const dotenv = require('dotenv');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('Dialect:', process.env.dialect);

require('./misc/datetime'); 

const server = http.createServer(app);
// const io = new Server(server, {
//   cors: {
//     origin: '*', // sesuaikan origin kalau perlu
//   }
// });
    
const envFile = `.env.${process.env.NODE_ENV || 'development'}`;

dotenv.config({ path: envFile });

console.log(`Environment loaded from ${envFile}`);

const PORT = process.env.PORT || 5103;
server.listen(PORT, () => {
  console.log(`🚀 Server + WebSocket running on port ${PORT}`);
  // require('./middleware/cron-job/cron-job-redis-region');
  // require('./middleware/audit-trail/schedule-resend-audit'); // Mulai cron job untuk resend audit log
});
// 🛑 Graceful shutdown handler
const shutdown = () => {
  console.log('\n🛑 SIGINT/SIGTERM received. Shutting down gracefully...');

  // 🛑 Close HTTP server
  server.close(() => {
    console.log('✅ HTTP server closed');
    process.exit(0);
  });

  // ⏱️ Force exit jika ada proses yang belum selesai
  setTimeout(() => {
    console.error('❌ Force shutdown due to timeout');
    process.exit(1);
  }, 10000); // 10 detik
};

// 🔌 Tangkap sinyal dari OS
process.on('SIGINT', shutdown);   // Ctrl+C