
const userService = require('../services/user.service');
const buildResponse = require('../common/build.response');
const validateRequest = require('../misc/validation');
const { loginDto, registerDto } = require('../dtos/payload-user-dto');
const { OAuth2Client } = require('google-auth-library');
const { JwtMaker } = require('../middleware/jwt');

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
			password: req.body.password,
		};

		const { user, err } = await userService.login(condition);

		console.error('Controller Create err 1:', err);
		if (err) {
			return buildResponse.sendQueryError(res, err.message, "insert");
		}
		const { _user, err: errUpdate } = await userService.update(user.oid, req.body, user.oid);
		if (errUpdate) {
			return buildResponse.sendQueryError(res, err.message, "insert");
		}
		return buildResponse.findOk(res, user, 1)


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

const registerAdmin = async (req, res) => {
	try {
		// const { isValid, message } = validateRequest(null, registerDto, null,req, false);
		// if (!isValid) {
		// 	const response = buildResponse.responseFinValidatorError(message);
		// 	return res.status(400).json(response); // Return 400 Bad Request for validation errors
		// }

		const { user, err } = await userService.registerAdmin(req.body);
		if (err) {
			return buildResponse.sendQueryError(res, err.message, "insert");
		}

		return buildResponse.createOk(res, user, 1);
	} catch (err) {
		console.error('Controller Create Error:', err);
		return buildResponse.sendInternalServerError(res, err.message);
	}
};

const refreshToken = async (req, res) => {
	try {
		const { refreshToken } = req.body;
		if (!refreshToken) {
			return buildResponse.sendQueryError(res, 'Refresh token missing', 'insert');
		}

		const jwtMaker = new JwtMaker();
		const payload = await jwtMaker.verifyToken(refreshToken);

		// Pastikan token benar-benar refresh token
		if (payload.type !== 'refresh') {
			return buildResponse.sendQueryError(res, 'Invalid token type', 'insert');
		}

		// Generate access token baru
		const newAccessToken = await jwtMaker.createToken(
			payload.userOid,
			payload.username || '',
			payload.role || ''
		);

		// Ambil data user terbaru (misal untuk update lastLogin atau info lain)
		// const { result: user, err: errUpdate } = await userService.update(
		// 	payload.userOid, 
		// 	payload.userOid
		// );

		// if (errUpdate) {
		// 	return buildResponse.sendQueryError(res, errUpdate.message, 'insert');
		// }

		// Sertakan token baru dalam response user
		const responseUser = {
			// ...user,
			token: newAccessToken
		};

		return buildResponse.findOk(res, responseUser, 1);

	} catch (err) {
		console.error('Refresh Token Error:', err);
		return buildResponse.sendInternalServerError(res, err.message);
	}
};


module.exports = {
	login,
	register,
	registerAdmin,
	refreshToken
};
