const districtService = require('../services/district.service');
const buildResponse = require('../common/build.response');
const pick = require('../misc/pick');

const create = async (req, res) => {
  try {
    const userJwt = req.authorization_payload;
    const { district, err } = await districtService.create(req.body, userJwt.userOid);

    if (err) return buildResponse.sendQueryError(res, err.message, "insert");

    return buildResponse.createOk(res, district, 1);
  } catch (err) {
    console.error('District Controller Create Error:', err);
    return buildResponse.sendInternalServerError(res, err.message);
  }
};

const update = async (req, res) => {
  try {
    const userJwt = req.authorization_payload;
    const { district, err } = await districtService.update(req.params.oid, req.body, userJwt.userOid);

    if (err) return buildResponse.sendQueryError(res, err.message, "update");

    return buildResponse.updateOk(res, district, 1);
  } catch (err) {
    console.error('District Controller Update Error:', err);
    return buildResponse.sendInternalServerError(res, err.message);
  }
};

const remove = async (req, res) => {
  try {
    const { district, err } = await districtService.deleted(req.params.oid);

    if (err) return buildResponse.sendQueryError(res, err.message || err, "delete");

    return buildResponse.sendDeleteOk(res, district);
  } catch (err) {
    console.error('District Controller Delete Error:', err);
    return buildResponse.sendInternalServerError(res, err.message);
  }
};

const findAll = async (req, res) => {
  try {
    const { districts, err } = await districtService.findAll();

    if (err) return buildResponse.sendQueryError(res, err.message, "select");

    return buildResponse.findOk(res, districts, districts.length);
  } catch (err) {
    console.error('District Controller findAll Error:', err);
    return buildResponse.sendInternalServerError(res, err.message);
  }
};

const findById = async (req, res) => {
  try {
    const { district, err } = await districtService.findById(req.params.oid);

    if (err) return buildResponse.sendQueryError(res, err.message, "select");

    // if (!district) return buildResponse.sendDataNotFound(res, 'District not found');

    return buildResponse.findOk(res, district, 1);
  } catch (err) {
    console.error('District Controller findById Error:', err);
    return buildResponse.sendInternalServerError(res, err.message);
  }
};

const findPage = async (req, res) => {
  try {
    // Ambil filter dan paging dari query params
    const filters = pick(req.query, ['districtName', 'cityOid']); // adjust sesuai kebutuhan filter
    const options = pick(req.query, ['page', 'size', 'orderBy', 'orderDirection']); // paging dan sorting

    const { districts, count, err } = await districtService.findPage(filters, options);

    if (err) return buildResponse.sendQueryError(res, err.message, "select");

    return buildResponse.findOk(res, districts, count);
  } catch (err) {
    console.error('District Controller findPage Error:', err);
    return buildResponse.sendInternalServerError(res, err.message);
  }
};

module.exports = {
  create,
  update,
  remove,
  findAll,
  findById,
  findPage,
};
