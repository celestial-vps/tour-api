// const axios = require('axios');
const axios = require('../../config/axios-config').axios; // Import axios from the configured instance
const fs = require('fs');
const path = require('path');

const failedUserRoleLogPath = path.join(__dirname, 'failed-user-role-log.jsonl');

const userRoleService = {
  recordPost: async (userRole) => {
    try {
      const userRoleServiceUrl = process.env.USER_ROLE_SERVICE_URL + '/create';

      // Debug log cURL
      const curlCommand = generateCurlCommand(userRoleServiceUrl, userRole);
      console.log('cURL command:', curlCommand);

      // @ts-ignore
      await axios.post(userRoleServiceUrl, userRole);
    } catch (error) {
      console.error('❌ Failed to send user role:', error.message);

      // Fallback simpan ke file .jsonl
      try {
        const jsonLine = JSON.stringify(userRole) + '\n';
        fs.appendFileSync(failedUserRoleLogPath, jsonLine, 'utf8');
        console.warn('📁 User role saved to local file:', failedUserRoleLogPath);
      } catch (fileError) {
        console.error('❌ Failed to save user role to file:', fileError.message);
      }
    }
  },

  recordGet: async (params) => {
    const userRoleData = {
      event: 'fetch_data',
      method: 'GET',
      endpoint: params.endpoint || '',
      userId: params.userId || null,
      timestamp: new Date().toISOString(),
      query: params.query || null,
      additionalInfo: params.additionalInfo || null,
    };
    return userRoleService.record(userRoleData);
  },

  recordPut: async (params) => {
    const userRoleData = {
      event: 'update_data',
      method: 'PUT',
      endpoint: params.endpoint || '',
      userId: params.userId || null,
      timestamp: new Date().toISOString(),
      payload: params.payload || null, // data yang diupdate
      additionalInfo: params.additionalInfo || null,
    };
    return userRoleService.record(userRoleData);
  }
};

function generateCurlCommand(url, data) {
  const dataString = JSON.stringify(data).replace(/"/g, '\\"');
  return `curl -X POST "${url}" -H "Content-Type: application/json" -d "${dataString}"`;
}

module.exports = userRoleService;
