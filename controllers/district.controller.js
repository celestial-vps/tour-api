const districtService = require('../services/district.service');
const buildResponse = require('../common/build.response');
const { JwtMaker } = require('../middleware/jwt');
const jwtMaker = new JwtMaker();
const pick = require('../misc/pick');

const DEFAULT_PAGE = 1;
const DEFAULT_PAGE_SIZE = 10;

const create = async (req, res) => {
  try {
    const userJwt = req.authorization_payload;
    const { district, err } = await districtService.create(req.body, userJwt.userOid);

    let response;
    if (err !== null) {
      response = buildResponse.responseErrorInserted(err.message);
      return res.status(400).json(response);
    }

    response = buildResponse.responseOk(district, 1);
    return res.status(201).json(response);
  } catch (err) {
    const response = buildResponse.responseInternalServerError(err.message);
    return res.status(500).json(response);
  }
};

const update = async (req, res) => {
  try {
    const userJwt = req.authorization_payload;
    const { district, err } = await districtService.update(req.params.oid, req.body, userJwt.userOid);

    let response;
    if (err !== null) {
      response = buildResponse.responseErrorUpdate(err.message);
    } else {
      response = buildResponse.responseOk(district, 1);
    }

    res.status(200).json(response);
  } catch (err) {
    const response = buildResponse.responseInternalServerError(err.message);
    res.status(500).json(response);
  }
};

const deleted = async (req, res) => {
  try {
    const { district, err } = await districtService.deleted(req.params.oid);

    let response;
    if (err !== null) {
      response = buildResponse.responseErrorDelete(err.message || err);
    } else {
      response = buildResponse.responseDeleteOk(district);
    }

    res.status(200).json(response);
  } catch (err) {
    const response = buildResponse.responseInternalServerError(err.message);
    res.status(500).json(response);
  }
};

const findAll = async (req, res) => {
  try {
    const { districts, err } = await districtService.findAll();

    let response;
    if (err !== null) {
      response = buildResponse.responseErrorGet(err.message);
    } else {
      response = buildResponse.responseOk(districts, districts.length);
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
    const filters = pick(req.body, ['cityOid', 'districtName']);

    const pageIndex = parseInt(options.pageIndex) || DEFAULT_PAGE;
    const pageSize = parseInt(options.pageSize) || DEFAULT_PAGE_SIZE;

    const { districts, count } = await districtService.findPage(filters, options);

    const response = buildResponse.responsePaggination(districts, count, pageIndex, pageSize);
    res.status(200).json(response);
  } catch (err) {
    const response = buildResponse.responseInternalServerError(err.message);
    res.status(500).json(response);
  }
};

const findById = async (req, res) => {
  try {
    const { district, err } = await districtService.findById(req.params.oid);

    let response;
    if (err !== null) {
      response = buildResponse.responseErrorGet(err.message);
      return res.status(400).json(response);
    }

    if (district) {
      response = buildResponse.responseOk(district, 1);
      return res.status(200).json(response);
    } else {
      response = buildResponse.responseDataNotFound("District not found.");
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
