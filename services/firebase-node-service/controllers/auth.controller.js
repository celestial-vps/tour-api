// controllers/auth.controller.js
const authService = require('../services/auth.service');
const buildResponse = require('../common/build.response');

const loginWithGoogle = async (req, res) => {
  try {
    console.log("📩 Incoming Google Login:", req.body);

    const { user, token, err } = await authService.loginWithGoogle(req.body);

    if (err) {
      return buildResponse.sendQueryError(res, err, "loginWithGoogle");
    }

    return buildResponse.createOk(res, { user, token }, 1);

  } catch (error) {
    console.error("Controller Error:", error);
    return buildResponse.sendInternalServerError(res, error.message);
  }
};

module.exports = {
  loginWithGoogle
};
