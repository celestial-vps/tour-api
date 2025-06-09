const provinceService = require('../services/province.service');
const buildResponse = require('../common/build.response');
const pick = require('../misc/pick');

const create = async (req, res) => {
  try {
    const userJwt = req.authorization_payload;
    const { province, err } = await provinceService.create(req.body, userJwt.userOid);

    if (err) return buildResponse.sendQueryError(res, err.message, "insert");
    return buildResponse.createOk(res, province, 1);
  } catch (err) {
    return buildResponse.sendInternalServerError(res, err.message);
  }
};

const update = async (req, res) => {
  try {
    const userJwt = req.authorization_payload;
    const { province, err } = await provinceService.update(req.params.oid, req.body, userJwt.userOid);

    if (err) return buildResponse.sendQueryError(res, err.message, "update");
    return buildResponse.updateOk(res, province, 1);
  } catch (err) {
    return buildResponse.sendInternalServerError(res, err.message);
  }
};

const remove = async (req, res) => {
  try {
    const { province, err } = await provinceService.deleted(req.params.oid);
    if (err) return buildResponse.sendQueryError(res, err.message || err, "delete");

    return buildResponse.sendDeleteOk(res, province);
  } catch (err) {
    return buildResponse.sendInternalServerError(res, err.message);
  }
};

const findAll = async (req, res) => {
  try {
    const { provinces, err } = await provinceService.findAll();
    if (err) return buildResponse.sendQueryError(res, err.message, "get all");

    return buildResponse.findOk(res, provinces, provinces.length);
  } catch (err) {
    return buildResponse.sendInternalServerError(res, err.message);
  }
};

const find = async (req, res) => {
  try {
    const filters = pick(req.body, ['provinceName', 'countryOid']);
    const options = {
      sortBy: req.query.sortBy,
      sortOrder: req.query.sortOrder,
      pageIndex: parseInt(req.query.pageIndex, 10) || 1,
      pageSize: parseInt(req.query.pageSize, 10) || 10,
    };

    const result = await provinceService.findPage(filters, options);
    if (result.err) return buildResponse.sendInternalServerError(res, result.err.message);

    return buildResponse.sendPagination(res, result.provinces, result.count, options.pageIndex, options.pageSize);
  } catch (err) {
    return buildResponse.sendInternalServerError(res, err.message);
  }
};

const findById = async (req, res) => {
  try {
    const { province, err } = await provinceService.findById(req.params.oid);
    if (err) return buildResponse.sendQueryError(res, err.message, "get by id");
    if (!province) return buildResponse.sendDataNotFound(res);

    return buildResponse.findOk(res, province);
  } catch (err) {
    return buildResponse.sendInternalServerError(res, err.message);
  }
};

module.exports = {
  create,
  update,
  remove,
  findAll,
  find,
  findById,
};
