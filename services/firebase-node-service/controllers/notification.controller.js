
const notificationService = require('../services/notification.service');
const buildResponse = require('../common/build.response');

const sendNotification = async (req, res) => {
  try {
    console.log("📩 Incoming Notification Request:", req.body);

    const { notification, err } = await notificationService.sendNotification(req.body);

    if (err) {
      return buildResponse.sendQueryError(res, err, "sendNotification");
    }

    return buildResponse.createOk(res, notification, 1);

  } catch (err) {
    console.error("Controller Error:", err);
    return buildResponse.sendInternalServerError(res, err.message);
  }
};

module.exports = {
  sendNotification
};
