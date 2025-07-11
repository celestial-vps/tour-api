const cron = require('node-cron');
const resendFailedAuditLogs = require('../audit-trail/resend-failed-audit'); // Ambil fungsinya

// Panggil langsung saat server start (opsional)
// @ts-ignore
resendFailedAuditLogs();

// Jalankan setiap 1 menit
cron.schedule('*/1 * * * *', () => {
  console.log('⏱️ Running resend audit log...');
  // @ts-ignore
  resendFailedAuditLogs();
});
