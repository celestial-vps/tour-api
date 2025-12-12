
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
		const { user, error } = await userService.login(condition, body);
		if (error) {
			return buildResponse.sendQueryError(res, error.message, "insert");
		}

		return buildResponse.findOk(res, user, 1)


	} catch (error) {
		console.error('Controller Create Error:', error);
		return buildResponse.sendInternalServerError(res, error.message);
	}
};

const register = async (req, res) => {
	try {

		const { user, error } = await userService.register(req.body);
		if (error) {
			return buildResponse.sendQueryError(res, error.message, "insert");
		}

		return buildResponse.createOk(res, user, 1);
	} catch (error) {
		console.error('Controller Create Error:', error);
		return buildResponse.sendInternalServerError(res, error.message);
	}
};

module.exports = {
	login,
	register,
};
