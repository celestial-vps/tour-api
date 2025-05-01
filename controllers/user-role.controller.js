// controllers/userRoleController.js
const userRoleService = require('../services/user-role.service');
const buildBesponse = require('../common/build.response');
const validateRequest = require('../misc/validation');
const { createBUserRoleDto, updateBUserRoleDto,filterBUserRoleDto,params,querySchema } = require('../dtos/payload-user-role-dto');
const { JwtMaker } = require('../middleware/jwt'); // Adjust the path accordingly
const jwtMaker = new JwtMaker();

const create = async (req, res) => {
	try {
		const token = req.headers['authorization'];		
		const accessToken = token.split(' ')[1]; // Assuming "Bearer <token>" 
		const userJwt = await jwtMaker.getClaimsByOid(accessToken); // Await the promise

		const { isValid, message } = validateRequest(null, createBUserRoleDto,null, req, false);
		if (!isValid) {
			const response = buildBesponse.responseFinValidatorError(message);
			return res.status(400).json(response); // Return 400 Bad Request for validation errors
		}

		const { userRole, err } = await userRoleService.create(req.body,userJwt.userOid);
		if (err !== null) {
			response = buildBesponse.responseErrorInserted(err.message)
		} else {
			response = buildBesponse.responseOk(userRole, 1)
		}

		res.status(201).json(response);
	} catch (err) {
		response = buildBesponse.responseInternalServerError(err.message)
		res.status(500).json(response);
	}
};

const update = async (req, res) => {
	try {
		const token = req.headers['authorization'];		
		const accessToken = token.split(' ')[1]; // Assuming "Bearer <token>" 
		const userJwt = await jwtMaker.getClaimsByOid(accessToken); // Await the promise

		const { isValid, message } = validateRequest(paramsSchema, updateBUserRoleDto,null, req, true);
		if (!isValid) {
			const response = buildBesponse.responseFinValidatorError(message);
			return res.status(400).json(response); // Return 400 Bad Request for validation errors
		}

		const { userRole, err } = await userRoleService.update(req.params.oid, req.body,userJwt.userOid);
		if (err !== null) {
			response = buildBesponse.responseErrorUpdate(err.message)
		} else {
			response = buildBesponse.responseOk(userRole, 1)
		}
		res.status(201).json(response);
	} catch (err) {
		response = buildBesponse.responseInternalServerError(err.message)
		res.status(500).json(response);
	}
};

const deleted = async (req, res) => {
	try {
		const { isValid, message } = validateRequest(params,null, null, req, true);
		if (!isValid) {
			const response = buildBesponse.responseFinValidatorError(message);
			return res.status(400).json(response); // Return 400 Bad Request for validation errors
		}

		const err = await userRoleService.deleted(req.params.oid);
		if (err !== null) {
			response = buildBesponse.responseErrorDelete(err.message === undefined ? err : err.message)
		} else {
			response = buildBesponse.responseDeleteOk(req.params.oid)

		}
		res.status(201).json(response);
	} catch (err) {
		response = buildBesponse.responseInternalServerError(err.message)
		res.status(500).json(response);
	}
};

const findAll = async (req, res) => {
	try {
		const { userRoles, err } = await userRoleService.findAll();
		if (err !== null) {
			response = buildBesponse.responseErrorGet(err.message)
		} else {
			response = buildBesponse.responseOk(userRoles, userRoles.length)
		}
		res.status(200).json(response);
	} catch (err) {
		response = buildBesponse.responseInternalServerError(err.message)
		res.status(500).json(response);
	}
};

const findById = async (req, res) => {
	try {
		const { isValid, message } = validateRequest(params, null,null, req, true);
		if (!isValid) {
			const response = buildBesponse.responseFinValidatorError(message);
			return res.status(400).json(response); // Return 400 Bad Request for validation errors
		}
		
		const { userRole, err } = await userRoleService.findById(req.params.oid);
		if (err !== null) {
			response = buildBesponse.responseErrorGet(err.message)
			return res.status(200).json(response);
		}

		if (userRole) {
			response = buildBesponse.responseOk(userRole, 1)
			return res.status(200).json(response);
		} else {
			response = buildBesponse.responseDataNotFound("")
			return res.status(404).json(response);
		}
	} catch (err) {
		response = buildBesponse.responseInternalServerError(err.message)
		res.status(500).json(response);
	}
};
const find = async (req, res) => {
	const pageIndexStr = req.query.pageIndex;
	const pageSizeStr = req.query.pageSize;
	const userRoleDto = req.body;  // Assuming request body contains the filter details
	let pageIndex = 0;
	let pageSize = 10;

	try {
		const { isValid, message } = validateRequest(null, filterBUserRoleDto,querySchema, req, true);
		if (!isValid) {
			const response = buildBesponse.responseFinValidatorError(message);
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
			userRoleCode: userRoleDto.userRoleCode,
			userRoleName: userRoleDto.userRoleName
		};

		const { userRoles, count } = await userRoleService.findPage(condition, pageIndex, pageSize);
		response = buildBesponse.responseOk(userRoles, count)
		res.status(200).json(response);
	} catch (err) {
		response = buildBesponse.responseInternalServerError(err.message)
		res.status(500).json(response);
	}
};


module.exports = {
	create,
	update,
	deleted,
	findAll,
	findById,
	find,
};
