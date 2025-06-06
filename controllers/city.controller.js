const cityService = require('../services/city.service');
const buildResponse = require('../common/build.response');
const { JwtMaker } = require('../middleware/jwt');
const jwtMaker = new JwtMaker();
const pick = require('../misc/pick');

const DEFAULT_PAGE = 1;
const DEFAULT_PAGE_SIZE = 10;

const create = async (req, res) => {
    try {
        const userJwt = req.authorization_payload;
        const { city, err } = await cityService.create(req.body, userJwt.userOid);

        let response;
        if (err !== null) {
            response = buildResponse.responseErrorInserted(err.message);
            return res.status(400).json(response);
        }

        response = buildResponse.responseOk(city, 1);
        return res.status(201).json(response);
    } catch (err) {
        const response = buildResponse.responseInternalServerError(err.message);
        return res.status(500).json(response);
    }
};

const update = async (req, res) => {
    try {
        const userJwt = req.authorization_payload;
        const { city, err } = await cityService.update(req.params.oid, req.body, userJwt.userOid);

        let response;
        if (err !== null) {
            response = buildResponse.responseErrorUpdate(err.message);
        } else {
            response = buildResponse.responseOk(city, 1);
        }

        res.status(200).json(response);
    } catch (err) {
        const response = buildResponse.responseInternalServerError(err.message);
        res.status(500).json(response);
    }
};

const deleted = async (req, res) => {
    try {
        const { city, err } = await cityService.deleted(req.params.oid);

        let response;
        if (err !== null) {
            response = buildResponse.responseErrorDelete(err.message || err);
        } else {
            response = buildResponse.responseDeleteOk(city);
        }

        res.status(200).json(response);
    } catch (err) {
        const response = buildResponse.responseInternalServerError(err.message);
        res.status(500).json(response);
    }
};

const findAll = async (req, res) => {
    try {
        const { cities, err } = await cityService.findAll();

        let response;
        if (err !== null) {
            response = buildResponse.responseErrorGet(err.message);
        } else {
            response = buildResponse.responseOk(cities, cities.length);
        }

        res.status(200).json(response);
    } catch (err) {
        const response = buildResponse.responseInternalServerError(err.message);
        res.status(500).json(response);
    }
};

const find = async (req, res) => {
    try {
        const options = pick(req.query, ['sortBy', 'fieldName', 'sortOrder', 'pageSize', 'pageIndex']);
        const filters = pick(req.body, ['provinceOid', 'cityName']);

        const pageIndex = parseInt(options.pageIndex) || DEFAULT_PAGE;
        const pageSize = parseInt(options.pageSize) || DEFAULT_PAGE_SIZE;

        const { cities, count } = await cityService.findPage(filters, options);

        const response = buildResponse.responsePaggination(cities, count, pageIndex, pageSize);
        res.status(200).json(response);
    } catch (err) {
        const response = buildResponse.responseInternalServerError(err.message);
        res.status(500).json(response);
    }
};

const findById = async (req, res) => {
    try {
        const { city, err } = await cityService.findById(req.params.oid);

        let response;
        if (err !== null) {
            response = buildResponse.responseErrorGet(err.message);
            return res.status(400).json(response);
        }

        if (city) {
            response = buildResponse.responseOk(city, 1);
            return res.status(200).json(response);
        } else {
            response = buildResponse.responseDataNotFound("City not found.");
            return res.status(404).json(response);
        }
    } catch (err) {
        const response = buildResponse.responseInternalServerError(err.message);
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
