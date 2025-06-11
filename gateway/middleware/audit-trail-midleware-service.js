const axios = require('axios');

const auditTrailService = {
  record: async (auditData) => {
    try {
      const auditServiceUrl = process.env.AUDIT_TRAIL_SERVICE_URL;
      // @ts-ignore
      await axios.post(auditServiceUrl, auditData);
    } catch (error) {
      console.error('Failed to send audit trail:', error.message);
    }
  }
};

module.exports = auditTrailService;
