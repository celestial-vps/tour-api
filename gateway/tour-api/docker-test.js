// test.js
const sequelize = require('./config/sequelize');
const { createClient } = require('redis');

// Test Postgres
sequelize.authenticate()
  .then(() => console.log('Postgres OK!'))
  .catch(err => console.error('Postgres ERROR:', err));

// Test Redis
const redisClient = createClient({
  socket: {
    host: process.env.REDIS_HOST || 'redis-server', // pastikan sesuai container
    port: parseInt(process.env.REDIS_PORT) || 6379,
  },
  password: process.env.REDIS_PASSWORD || 'Serverh5n&*#',
});

redisClient.connect()
  .then(() => console.log('Redis OK!'))
  .catch(err => console.error('Redis ERROR:', err))
  .finally(() => redisClient.quit());
