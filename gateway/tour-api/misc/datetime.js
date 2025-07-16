const moment = require('moment');

/**
 * @returns {string} - UTC-formatted date (e.g. "2025-06-20 15:00:00")
 */
// @ts-ignore
Date.prototype.formatUTC = function () {
  return moment(this).utc().format('YYYY-MM-DD HH:mm:ss');
};
