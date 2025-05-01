
const userService = require('../services/user.service');
const buildBesponse = require('../common/build.response');
const validateRequest = require('../misc/validation');
const { loginDto, registerDto } = require('../dtos/payload-user-dto');

const login = async (req, res) => {
	try {
		// const { isValid, message } = validateRequest(null, loginDto, null,req, false);
		// if (!isValid) {
		// 	const response = buildBesponse.responseFinValidatorError(message);
		// 	return res.status(400).json(response); // Return 400 Bad Request for validation errors
		// }
        const condition = {
			email: req.body.email,
			password: req.body.password
		};

		const { user, err } = await userService.login(condition);
		if (err !== null) {
			response = buildBesponse.responseErrorInserted(err.message)
		} else {
			response = buildBesponse.responseOk(user, 1)
		}

		res.status(201).json(response);
	} catch (err) {
		response = buildBesponse.responseInternalServerError(err.message)
		res.status(500).json(response);
	}
};

const register = async (req, res) => {
	try {
		const { isValid, message } = validateRequest(null, registerDto, null,req, false);
		if (!isValid) {
			const response = buildBesponse.responseFinValidatorError(message);
			return res.status(400).json(response); // Return 400 Bad Request for validation errors
		}

		const { user, err } = await userService.register(req.body);
		if (err !== null) {
			response = buildBesponse.responseErrorInserted(err.message)
		} else {
			response = buildBesponse.responseOk(user, 1)
		}

		res.status(201).json(response);
	} catch (err) {
		response = buildBesponse.responseInternalServerError(err.message)
		res.status(500).json(response);
	}
};

module.exports = {
	login,
	register,
};
