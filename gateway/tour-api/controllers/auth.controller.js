
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

// // Di controller
// const payload = await verifyGoogleToken(idToken);
// const email = payload.email;

// // Validasi email kamu sendiri di database
// const user = await db.User.findOne({ where: { email } });
// if (!user) throw new Error("Email belum terdaftar");

const login = async (req, res) => {
	try {
		console.error('Controller Create:');
		const condition = {
			email: req.body.email,
			password: req.body.password
		};

		const { user, err } = await userService.login(condition);
		console.error('Controller Create err 1:',err);
		if (err) {
			return buildResponse.sendQueryError(res, err.message, "insert");
		}

		return buildResponse.findOk(res,user, 1)


		// const { user, err } = await userService.login(condition);
		// if (err !== null) {
		// 	response = buildBesponse.responseErrorInserted(err.message)
		// } else {
		// 	response = buildBesponse.responseOk(user, 1)
		// }

		// res.status(201).json(response);

	} catch (err) {
		console.error('Controller Create Error:', err);
		return buildResponse.sendInternalServerError(res, err.message);
	}
};

const register = async (req, res) => {
	try {
		// const { isValid, message } = validateRequest(null, registerDto, null,req, false);
		// if (!isValid) {
		// 	const response = buildResponse.responseFinValidatorError(message);
		// 	return res.status(400).json(response); // Return 400 Bad Request for validation errors
		// }

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
