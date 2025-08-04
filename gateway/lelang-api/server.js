const app = require('./app'); // Express app
const http = require('http');
// const { Server } = require('socket.io');
// const chatGateway = require('../chat/chat.gateway');
// const initSocketServer = require('./lib/socket/socket-server');
const dotenv = require('dotenv');
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

const PORT = process.env.PORT || 3103;
server.listen(PORT, () => {
  console.log(`🚀 Server + WebSocket running on port ${PORT}`);
  // require('./middleware/cron-job/cron-job-redis-region');
  // require('./middleware/audit-trail/schedule-resend-audit'); // Mulai cron job untuk resend audit log
});
