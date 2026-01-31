// axios-config.js
const axios = require('axios');
const axiosRetry = require('axios-retry').default; // Make sure to use `.default`!

// Apply retry to the axios instance
// @ts-ignore
axiosRetry(axios, {
  retries: 3,
  retryDelay: (retryCount) => retryCount * 1000,
  retryCondition: (error) =>
    axiosRetry.isNetworkOrIdempotentRequestError(error),
});

module.exports = { axios };
