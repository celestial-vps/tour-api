const cron = require('node-cron');
const insertRegionToRedis = require('../../lib/redis/region.service'); // Ambil fungsinya

// Panggil langsung saat server start (opsional)
// @ts-ignore
insertRegionToRedis();

// Jalankan setiap 1 menit
cron.schedule('0 0 * * 6', () => {
  console.log('⏱️ Running insert redis weekly at Saturday 00:00');
  insertRegionToRedis();
});
