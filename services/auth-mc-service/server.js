const dotenv = require('dotenv');
const envFile = `.env.${process.env.NODE_ENV || 'development'}`;
dotenv.config({ path: envFile });

const app = require('./app');  
const http = require('http');

console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('Dialect:', process.env.dialect);

require('./misc/datetime'); 

const server = http.createServer(app);

console.log(`Environment loaded from ${envFile}`);

const PORT = process.env.PORT || 5102;
server.listen(PORT, () => {
  console.log(`🚀 Server + WebSocket running on port ${PORT}`);
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