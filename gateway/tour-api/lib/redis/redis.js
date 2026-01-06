const { createClient } = require('redis');

if (!process.env.REDIS_URL) {
  console.error("❌ REDIS_URL tidak ditemukan");
  process.exit(1);
}

const redisClient = createClient({ url: process.env.REDIS_URL });

redisClient.on('connect', () => console.log('✅ Redis connected'));
redisClient.on('error', (err) => console.error('❌ Redis Error:', err));

(async () => { await redisClient.connect(); })();

module.exports = redisClient;


