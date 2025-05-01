// controllers/countryController.js
const countryService = require('../services/country.service');
const buildBesponse = require('../common/build.response');
const validateRequest = require('../misc/validation');
const { createCountryDto, updateCountryDto, filterCountryDto, params, querySchema } = require('../dtos/payload-country-dto');
const { JwtMaker } = require('../middleware/jwt'); // Adjust the path accordingly
const jwtMaker = new JwtMaker();
const pick = require('../misc/pick')

const DEFAULT_PAGE = 1;
const DEFAULT_PAGE_SIZE = 10;
const MAX_PAGE_SIZE = 100;

const create = async (req, res) => {
	try {
		const token = req.headers['authorization'];
		const accessToken = token.split(' ')[1]; // Assuming "Bearer <token>" 
		const userJwt = await jwtMaker.getClaimsByOid(accessToken); // Await the promise


		const { isValid, message } = validateRequest(null, createCountryDto, null, req, true);
		if (!isValid) {
			const response = buildBesponse.responseFinValidatorError(message);
			return res.status(400).json(response); // Return 400 Bad Request for validation errors
		}

		const { country, err } = await countryService.create(req.body, userJwt.userOid);
		if (err !== null) {
			response = buildBesponse.responseErrorInserted(err.message)
		} else {
			response = buildBesponse.responseOk(country, 1)
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


		const { isValid, message } = validateRequest(params, updateCountryDto, null, req, true);
		if (!isValid) {
			const response = buildBesponse.responseFinValidatorError(message);
			return res.status(400).json(response); // Return 400 Bad Request for validation errors
		}

		const { country, err } = await countryService.update(req.params.oid, req.body, userJwt.userOid);
		if (err !== null) {
			response = buildBesponse.responseErrorUpdate(err.message)
		} else {
			response = buildBesponse.responseOk(country, 1)
		}
		res.status(201).json(response);
	} catch (err) {
		response = buildBesponse.responseInternalServerError(err.message)
		res.status(500).json(response);
	}
};

const deleted = async (req, res) => {
	try {
		const { isValid, message } = validateRequest(params, null, null, req, true);
		if (!isValid) {
			const response = buildBesponse.responseFinValidatorError(message);
			return res.status(400).json(response); // Return 400 Bad Request for validation errors
		}

		const { country, err } = await countryService.deleted(req.params.oid);
		if (err !== null) {
			response = buildBesponse.responseErrorDelete(err.message === undefined ? err : err.message)
		} else {
			response = buildBesponse.responseDeleteOk(country)

		}
		res.status(201).json(response);
	} catch (err) {
		response = buildBesponse.responseInternalServerError(err.message)
		res.status(500).json(response);
	}
};

const findAll = async (req, res) => {
	try {
		const { countrys, err } = await countryService.findAll();
		if (err !== null) {
			response = buildBesponse.responseErrorGet(err.message)
		} else {
			response = buildBesponse.responseOk(countrys, countrys.length)
		}
		res.status(200).json(response);
	} catch (err) {
		response = buildBesponse.responseInternalServerError(err.message)
		res.status(500).json(response);
	}
};

const find = async (req, res) => {

	try {
		const options = pick(req.query, ['sortBy', 'fieldName', 'sortOrder', 'pageSize', 'pageIndex']);
		const filters = pick(req.body, ['countryCode', 'countryName']);

		// Set default values
		const pageIndex = parseInt(options.pageIndex) || 1;
		const pageSize = parseInt(options.pageSize) || 10;

		const { countries, count } = await countryService.findPage(filters, options);

		response = buildBesponse.responsePaggination(countries, count, pageIndex, pageSize)
		res.status(200).json(response);
	} catch (err) {
		response = buildBesponse.responseInternalServerError(err.message)
		res.status(500).json(response);
	}
};

const findById = async (req, res) => {
	try {
		const { isValid, message } = validateRequest(params, null, null, req, true);
		if (!isValid) {
			const response = buildBesponse.responseFinValidatorError(message);
			return res.status(400).json(response); // Return 400 Bad Request for validation errors
		}

		const { country, err } = await countryService.findById(req.params.oid);
		if (err !== null) {
			response = buildBesponse.responseErrorGet(err.message)
			return res.status(200).json(response);
		}

		if (country) {
			response = buildBesponse.responseOk(country, 1)
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

// Helper functions
function parsePositiveInteger(value, defaultValue) {
	const parsed = parseInt(value, 10);
	return isNaN(parsed) || parsed < 1 ? defaultValue : parsed;
}

function buildFilterConditions(body, allowedFields) {
	return allowedFields.reduce((acc, field) => {
		if (body[field] !== undefined && body[field] !== null && body[field] !== '') {
			acc[field] = body[field];
		}
		return acc;
	}, {});
}


module.exports = {
	create,
	update,
	deleted,
	findAll,
	findById,
	find,

};
