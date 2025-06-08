
const userService = require('../services/user.service');
const buildResponse = require('../common/build.response');
const validateRequest = require('../misc/validation');
const { loginDto, registerDto } = require('../dtos/payload-user-dto');

const login = async (req, res) => {
	try {
		const condition = {
			email: req.body.email,
			password: req.body.password
		};

		const { user, err } = await userService.login(condition);
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
