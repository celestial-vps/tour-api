// lib/redis.js
const { createClient } = require('redis');

// const redisClient = createClient();
const redisClient = createClient({
  url: process.env.REDIS_URL || 'redis://127.0.0.1:6379'
});
redisClient.connect().catch(console.error);

module.exports = redisClient;
