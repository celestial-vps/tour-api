// @ts-nocheck
const fs = require('fs');
const path = require('path');
const axios = require('axios');

const logFilePath = path.join(__dirname, 'failed-audit-log.jsonl');
const tempFilePath = path.join(__dirname, 'temp-failed-audit-log.jsonl');
const auditServiceUrl = process.env.AUDIT_TRAIL_SERVICE_URL + '/create';

console.log('[Audit Retry] Module loaded'); // Ini akan muncul saat pertama kali require

async function resendFailedAuditLogs() {
  console.log('[Audit Retry] Running resendFailedAuditLogs...');

  if (!fs.existsSync(logFilePath)) {
    console.log('✅ No failed audit log file found. Nothing to resend.');
    return;
  }

  const lines = fs.readFileSync(logFilePath, 'utf8').split('\n').filter(Boolean);
  if (lines.length === 0) {
    console.log('✅ No failed audit logs to resend.');
    return;
  }

  const failedToResend = [];

  for (const line of lines) {
    try {
      const auditData = JSON.parse(line);
      await axios.post(auditServiceUrl, auditData);
      console.log(`✅ Resent audit log: [${auditData.action}] ${auditData.tableName}`);
    } catch (err) {
      console.error('❌ Failed to resend audit log:', err.message);
      failedToResend.push(line);
    }
  }

  if (failedToResend.length > 0) {
    fs.writeFileSync(tempFilePath, failedToResend.join('\n') + '\n', 'utf8');
    fs.renameSync(tempFilePath, logFilePath);
    console.log(`⚠️ ${failedToResend.length} entries saved back to failed-audit-log.jsonl`);
  } else {
    fs.unlinkSync(logFilePath);
    console.log('✅ All audit logs successfully resent. Log file removed.');
  }
}

// Jangan langsung dipanggil di sini
// Export agar bisa dipakai dari cron
module.exports = resendFailedAuditLogs;
