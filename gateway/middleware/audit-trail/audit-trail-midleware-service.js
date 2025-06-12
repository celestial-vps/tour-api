const axios = require('axios');
const fs = require('fs');
const path = require('path');

const failedAuditLogPath = path.join(__dirname, 'failed-audit-log.jsonl');

const auditTrailService = {
  record: async (auditData) => {
    try {
      const auditServiceUrl = process.env.AUDIT_TRAIL_SERVICE_URL + '/create';

      // Debug log cURL
      const curlCommand = generateCurlCommand(auditServiceUrl, auditData);
      console.log('cURL command:', curlCommand);

      // @ts-ignore
      await axios.post(auditServiceUrl, auditData);
    } catch (error) {
      console.error('❌ Failed to send audit trail:', error.message);

      // Fallback simpan ke file .jsonl
      try {
        const jsonLine = JSON.stringify(auditData) + '\n';
        fs.appendFileSync(failedAuditLogPath, jsonLine, 'utf8');
        console.warn('📁 Audit trail saved to local file:', failedAuditLogPath);
      } catch (fileError) {
        console.error('❌ Failed to save audit trail to file:', fileError.message);
      }
    }
  }
};

function generateCurlCommand(url, data) {
  const dataString = JSON.stringify(data).replace(/"/g, '\\"');
  return `curl -X POST "${url}" -H "Content-Type: application/json" -d "${dataString}"`;
}

module.exports = auditTrailService;
