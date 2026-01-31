const dotenv = require('dotenv');

// LOAD ENV PALING AWAL
const envFile = `.env.${process.env.NODE_ENV || 'development'}`;
dotenv.config({ path: envFile });

console.log(`Environment loaded from: ${envFile}`);

require('./misc/datetime');

const http = require('http');
const app = require('./app'); // ← Baru load app SETELAH dotenv

const PORT = process.env.PORT || 5103;

const server = http.createServer(app);

server.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
