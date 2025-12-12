
const userService = require('../services/user.service');
const buildResponse = require('../common/build.response');
const validateRequest = require('../misc/validation');
const { loginDto, registerDto } = require('../dtos/payload-user-dto');
const { OAuth2Client } = require('google-auth-library');

// const client = new OAuth2Client(GOOGLE_CLIENT_ID);

// const verifyGoogleToken = async (idToken) => {
//   const ticket = await client.verifyIdToken({
//     idToken,
//     audience: GOOGLE_CLIENT_ID,
//   });
//   const payload = ticket.getPayload();
//   return payload; // berisi email, name, sub (userId Google), dll.
// };

const login = async (req, res) => {
	try {
		const condition = {
			email: req.body.email,
			password: req.body.password,
		};

		const body = { 
			androidToken: req.body.androidToken,
			iosToken: req.body.iosToken,
			webToken: req.body.webToken,
			desktopToken: req.body.desktopToken,
		};
		const { user, err } = await userService.login(condition, body);
		if (err) {
			return buildResponse.sendQueryError(res, err.message, "insert");
		}

		return buildResponse.findOk(res, user, 1)


	} catch (err) {
		console.error('Controller Create Error:', err);
		return buildResponse.sendInternalServerError(res, err.message);
	}
};

const register = async (req, res) => {
	try {

		const { user, err } = await userService.register(req.body);
		if (err) {
			return buildResponse.sendQueryError(res, err.message, "insert");
		}

		return buildResponse.createOk(res, user, 1);
	} catch (err) {
		console.error('Controller Create Error:', err);
		return buildResponse.sendInternalServerError(res, err.message);
	}
};

module.exports = {
	login,
	register,
};
