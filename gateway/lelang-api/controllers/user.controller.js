// controllers/userController.js
const userService = require('../services/user.service');
const { responseFinValidatorError, responseErrorInserted, responseOk, responseInternalServerError, responseDeleteOk, responseDataNotFound, responseErrorGet } = require('../common/build.response');
const validateRequest = require('../misc/validation');
const { createUserDto, updateUserDto, filterUserDto, params, querySchema } = require('../dtos/payload-user-dto');
const { JwtMaker } = require('../middleware/jwt'); // Adjust the path accordingly
const jwtMaker = new JwtMaker();
const buildBesponse = require('../common/build.response');

const create = async (req, res) => {
	try {
		const token = req.headers['authorization'];
		const accessToken = token.split(' ')[1]; // Assuming "Bearer <token>" 
		const userJwt = await jwtMaker.getClaimsByOid(accessToken); // Await the promise

		const { isValid, message } = validateRequest(null, createUserDto, null, req, true);
		if (!isValid) {
			const response = responseFinValidatorError(message);
			return res.status(400).json(response); // Return 400 Bad Request for validation errors
		}

		const { user, error } = await userService.create(req.body, userJwt.userOid);
		if (error !== null) {
			response = buildBesponse.responseError(error.httpStatus)
		} else {
			response = responseOk(user, 1)
		}

		res.status(201).json(response);
	} catch (error) {
		response = responseInternalServerError(error.message)
		res.status(500).json(response);
	}
};

const update = async (req, res) => {
	try {
		const token = req.headers['authorization'];
		const accessToken = token.split(' ')[1]; // Assuming "Bearer <token>" 
		const userJwt = await jwtMaker.getClaimsByOid(accessToken); // Await the promise

		const { isValid, message } = validateRequest(params, updateUserDto, null, req, true);
		if (!isValid) {
			const response = responseFinValidatorError(message);
			return res.status(400).json(response); // Return 400 Bad Request for validation errors
		}

		const { user, error } = await userService.update(req.params.oid, req.body, userJwt.userOid);
		if (error !== null) {
			response = buildBesponse.responseError(error.httpStatus)
		} else {
			response = responseOk(user, 1)
		}

		res.status(201).json(response);
	} catch (error) {
		response = responseInternalServerError(error.message)
		res.status(500).json(response);
	}
};

const remove = async (req, res) => {
	try {
		const { isValid, message } = validateRequest(params, null, null, req, true);
		if (!isValid) {
			const response = responseFinValidatorError(message);
			return res.status(400).json(response); // Return 400 Bad Request for validation errors
		}

		const { user, error } = await userService.deleted(req.params.oid);
		if (error !== null) {
			response = buildBesponse.responseError(error.httpStatus)
		} else {
			response = responseDeleteOk(user)
		}

		res.status(201).json(response);
	} catch (error) {
		response = responseInternalServerError(error.message)
		res.status(500).json(response);
	}
};

const findAll = async (req, res) => {
	try {
		const { users, error } = await userService.findAll();
		if (error !== null) {
			response = buildBesponse.responseError(error.httpStatus)
		} else {
			response = responseOk(users, users.length)
		}
		res.status(200).json(response);
	} catch (error) {
		response = responseInternalServerError(error.message)
		res.status(500).json(response);
	}
};

const findById = async (req, res) => {
	try {
		const { isValid, message } = validateRequest(params, null, null, req, true);
		if (!isValid) {
			const response = responseFinValidatorError(message);
			return res.status(400).json(response); // Return 400 Bad Request for validation errors
		}

		const { user, error } = await userService.findById(req.params.oid);
		if (error !== null) {
			response = buildBesponse.responseError(error.httpStatus)
		} else if (user === null) {
			response = responseDataNotFound(error.message)
		} else {
			response = responseOk(user, 1)
		}

		res.status(201).json(response);
	} catch (error) {
		response = responseInternalServerError(error.message)
		res.status(500).json(response);
	}
};

const find = async (req, res) => {
	const pageIndexStr = req.query.pageIndex;
	const pageSizeStr = req.query.pageSize;
	const userDto = req.body;  // Assuming request body contains the filter details
	let pageIndex = 0;
	let pageSize = 10;

	try {
		const { isValid, message } = validateRequest(null, filterUserDto, querySchema, req, true);
		if (!isValid) {
			const response = responseFinValidatorError(message);
			return res.status(400).json(response); // Return 400 Bad Request for validation errors
		}

		if (pageIndexStr) {
			pageIndex = parseInt(pageIndexStr, 10);
			if (isNaN(pageIndex)) {
				return res.status(400).json(common.responseForbidden('Invalid pageIndex format'));
			}
		}

		if (pageSizeStr) {
			pageSize = parseInt(pageSizeStr, 10);
			if (isNaN(pageSize)) {
				return res.status(400).json(common.responseForbidden('Invalid pageSize format'));
			}
		}
		const condition = {
			name: userDto.name,
			email: userDto.email
		};

		const { users, count } = await userService.findPage(condition, pageIndex, pageSize);
		const totalPage = Math.ceil(count / pageSize);
		const pagging = {
			page: pageIndex,
			size: pageSize,
			totalItem: count,
			totalPage: totalPage, // Correctly calculates total pages			
		};
		response = buildBesponse.ResponseOkWithPaggination(users,pagging )
		res.status(200).json(response);
	} catch (error) {
		response = responseInternalServerError(error.message)
		res.status(500).json(response);
	}
};



module.exports = {
	create,
	update,
	remove,
	findAll,
	findById,
	find,
};