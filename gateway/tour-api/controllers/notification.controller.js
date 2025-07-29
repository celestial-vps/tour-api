const notificationService = require('../gateway/services/notification.service');
const buildResponse = require('../common/build.response');
const pick = require('../misc/pick');
const { JwtMaker } = require('../middleware/jwt');

const jwtMaker = new JwtMaker();

const multipleNotification = async (req, res) => {
  try {
    const userJwt = req.authorization_payload;
    const { message, err } = await messageService.create(req.body, userJwt.userOid);

    if (err) {
      return buildResponse.sendQueryError(res, err.message, "insert");
    }

    return buildResponse.createOk(res, message, 1);
  } catch (err) {
    console.error('Controller Create Error:', err);
    return buildResponse.sendInternalServerError(res, err.message);
  }
};

const singleNotification = async (req, res) => {
  try {
    const userJwt = req.authorization_payload;
    const { message, err } = await messageService.update(req.params.oid, req.body, userJwt.userOid);

    if (err) {
      return buildResponse.sendQueryError(res, err.message, "update");
    }

    return buildResponse.updateOk(res, message, 1);
  } catch (err) {
    console.error('Controller Update Error:', err);
    return buildResponse.sendInternalServerError(res, err.message);
  }
};
 
module.exports = {
  multipleNotification,
  singleNotification, 
};
