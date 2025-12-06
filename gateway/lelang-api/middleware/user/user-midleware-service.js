// const axios = require('axios');
const axios = require('../../config/axios-config').axios; // Import axios from the configured instance
const fs = require('fs');
const path = require('path');

const failedUserRoleLogPath = path.join(__dirname, 'failed-user.jsonl');

const userService = {
  recordPost: async (userDate) => {
    try {
      const userServiceUrl = process.env.AUDIT_TRAIL_SERVICE_URL + '/create';

      // Debug log cURL
      const curlCommand = generateCurlCommand(userServiceUrl, userDate);
      console.log('cURL command:', curlCommand);

      // @ts-ignore
      await axios.post(userServiceUrl, userDate);
    } catch (error) {
      console.error('❌ Failed to send user:', error.message);

      // Fallback simpan ke file .jsonl
      try {
        const jsonLine = JSON.stringify(userDate) + '\n';
        fs.appendFileSync(failedUserRoleLogPath, jsonLine, 'utf8');
        console.warn('📁 User saved to local file:', failedUserRoleLogPath);
      } catch (fileError) {
        console.error('❌ Failed to save user to file:', fileError.message);
      }
    }
  },

  recordGet: async (params) => {
    const userDate = {
      event: 'fetch_data',
      method: 'GET',
      endpoint: params.endpoint || '',
      userId: params.userId || null,
      timestamp: new Date().toISOString(),
      query: params.query || null,
      additionalInfo: params.additionalInfo || null,
    };
    return userService.record(userDate);
  },

  recordPut: async (params) => {
    const userDate = {
      event: 'update_data',
      method: 'PUT',
      endpoint: params.endpoint || '',
      userId: params.userId || null,
      timestamp: new Date().toISOString(),
      payload: params.payload || null, // data yang diupdate
      additionalInfo: params.additionalInfo || null,
    };
    return userService.record(userDate);
  }
};

function generateCurlCommand(url, data) {
  const dataString = JSON.stringify(data).replace(/"/g, '\\"');
  return `curl -X POST "${url}" -H "Content-Type: application/json" -d "${dataString}"`;
}

module.exports = userService;
