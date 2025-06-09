// controllers/subdistrictController.js

const subdistrictService = require('../services/subdistrict.service');
const buildResponse = require('../common/build.response');
const { JwtMaker } = require('../middleware/jwt');
const jwtMaker = new JwtMaker();
const pick = require('../misc/pick');

const DEFAULT_PAGE = 1;
const DEFAULT_PAGE_SIZE = 10;

const create = async (req, res) => {
  try {
    const userJwt = req.authorization_payload;
    const { subdistrict, err } = await subdistrictService.create(req.body, userJwt.userOid);

    if (err !== null) {
      const response = buildResponse.responseErrorInserted(err.message);
      return res.status(400).json(response);
    }

    const response = buildResponse.responseOk(subdistrict, 1);
    return res.status(201).json(response);
  } catch (err) {
    const response = buildResponse.responseInternalServerError(err.message);
    return res.status(500).json(response);
  }
};

const update = async (req, res) => {
  try {
    const userJwt = req.authorization_payload;
    const { subdistrict, err } = await subdistrictService.update(req.params.oid, req.body, userJwt.userOid);

    let response;
    if (err !== null) {
      response = buildResponse.responseErrorUpdate(err.message);
    } else {
      response = buildResponse.responseOk(subdistrict, 1);
    }

    res.status(200).json(response);
  } catch (err) {
    const response = buildResponse.responseInternalServerError(err.message);
    res.status(500).json(response);
  }
};

const deleted = async (req, res) => {
  try {
    const { subdistrict, err } = await subdistrictService.deleted(req.params.oid);

    let response;
    if (err !== null) {
      response = buildResponse.responseErrorDelete(err.message || err);
    } else {
      response = buildResponse.responseDeleteOk(subdistrict);
    }

    res.status(200).json(response);
  } catch (err) {
    const response = buildResponse.responseInternalServerError(err.message);
    res.status(500).json(response);
  }
};

const findAll = async (req, res) => {
  try {
    const { subdistricts, err } = await subdistrictService.findAll();

    let response;
    if (err !== null) {
      response = buildResponse.responseErrorGet(err.message);
    } else {
      response = buildResponse.responseOk(subdistricts, subdistricts.length);
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
    const filters = pick(req.body, ['districtOid', 'subDistrictName', 'postalCode']);

    const pageIndex = parseInt(options.pageIndex) || DEFAULT_PAGE;
    const pageSize = parseInt(options.pageSize) || DEFAULT_PAGE_SIZE;

    const { subdistricts, count } = await subdistrictService.findPage(filters, options);

    const response = buildResponse.responsePaggination(subdistricts, count, pageIndex, pageSize);
    res.status(200).json(response);
  } catch (err) {
    const response = buildResponse.responseInternalServerError(err.message);
    res.status(500).json(response);
  }
};

const findById = async (req, res) => {
  try {
    const { subdistrict, err } = await subdistrictService.findById(req.params.oid);

    if (err !== null) {
      const response = buildResponse.responseErrorGet(err.message);
      return res.status(400).json(response);
    }

    if (subdistrict) {
      const response = buildResponse.responseOk(subdistrict, 1);
      return res.status(200).json(response);
    } else {
      const response = buildResponse.responseDataNotFound("Subdistrict not found.");
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
