const app = require('./app'); // Express app
const http = require('http');
const { Server } = require('socket.io');
const chatGateway = require('../chat/chat.gateway');

const server = http.createServer(app); 

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`🚀 Server + WebSocket running on port ${PORT}`);
});
