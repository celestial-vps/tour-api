const countryService = require('../services/country.service');
const buildResponse = require('../common/build.response');
const { createCountryDto, updateCountryDto, filterCountryDto } = require('../dtos/payload-country-dto');
const { JwtMaker } = require('../middleware/jwt');
const pick = require('../misc/pick');

const jwtMaker = new JwtMaker();

const create = async (req, res) => {
	try {
		const userJwt = req.authorization_payload;
		const { country, err } = await countryService.create(req.body, userJwt.userOid);

		if (err) {
			return buildResponse.sendQueryError(res, err.message, "insert");
		}

		return buildResponse.createOk(res, country, 1);
	} catch (err) {
		console.error('Controller Create Error:', err);
		return buildResponse.sendInternalServerError(res, err.message);
	}
};

const update = async (req, res) => {
	try {
		const userJwt = req.authorization_payload;
		const { country, err } = await countryService.update(req.params.oid, req.body, userJwt.userOid);

		if (err) {
			return buildResponse.sendQueryError(res, err.message, "update");
		}
		return buildResponse.updateOk(res, country, 1);
	} catch (err) {
		return buildResponse.sendInternalServerError(res, err.message);
	}
};

const deleted = async (req, res) => {
	try {
		const { country, err } = await countryService.deleted(req.params.oid);

		if (err) {
			return buildResponse.sendQueryError(res, err.message || err, "delete");
		}

		return buildResponse.sendDeleteOk(res, country);
	} catch (err) {
		return buildResponse.sendInternalServerError(res, err.message);
	}
};

const findAll = async (req, res) => {
	try {
		const { countries, err } = await countryService.findAll();

		if (err) {
			return buildResponse.sendQueryError(res, err.message, "get all");
		}

		return buildResponse.findOk(res, countries, countries.length);
	} catch (err) {
		return buildResponse.sendInternalServerError(res, err.message);
	}
};

const find = async (req, res) => {
	try {
		const options = pick(req.query, ['sortBy', 'fieldName', 'sortOrder', 'pageSize', 'pageIndex']);
		const filters = pick(req.body, ['countryCode', 'countryName']);

		const pageIndex = parseInt(options.pageIndex) || 1;
		const pageSize = parseInt(options.pageSize) || 10;

		const { countries, count } = await countryService.findPage(filters, options);

		return buildResponse.sendPagination(res, countries, count, pageIndex, pageSize);
	} catch (err) {
		return buildResponse.sendInternalServerError(res, err.message);
	}
};

const findById = async (req, res) => {
	try {
		const options = {
			include: [], // misal: ['provinces'] atau []
		};

		const { country, err } = await countryService.findById(req.params.oid, options);

		if (err) {
			return buildResponse.sendQueryError(res, err.message, "get by id");
		}

		if (!country) {
			return buildResponse.sendDataNotFound(res);
		}

		return buildResponse.findOk(res, country);
	} catch (err) {
		return buildResponse.sendInternalServerError(res, err.message);
	}
};

module.exports = {
	create,
	update,
	deleted,
	findAll,
	find,
	findById,
};
