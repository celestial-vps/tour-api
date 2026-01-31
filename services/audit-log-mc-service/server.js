const app = require('./app'); // Express app
const http = require('http');

const server = http.createServer(app); 

const PORT = 5001;
server.listen(PORT, () => {
  console.log(`🚀 Server + WebSocket running on port ${PORT}`);
});
server.on('error', (err) => {
  console.error('Server error:', err);
});