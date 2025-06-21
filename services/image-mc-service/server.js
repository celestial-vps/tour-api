const app = require('./app'); // Express app
const http = require('http'); 
const dotenv = require('dotenv');
require('./misc/datetime'); 

// Load env file berdasarkan NODE_ENV
const envFile = `.env.${process.env.NODE_ENV || 'development'}`;
dotenv.config({ path: envFile });

console.log(`Environment loaded from ${envFile}`);

const PORT = process.env.PORT || 3000;

const server = http.createServer(app);

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  // require('./middleware/cron-job/cron-job-redis-region');
  // require('./middleware/audit-trail/schedule-resend-audit'); // Mulai cron job untuk resend audit log
});
