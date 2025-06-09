const cityService = require('../services/city.service');
const buildResponse = require('../common/build.response');
const pick = require('../misc/pick');

const create = async (req, res) => {
  try {
    const userJwt = req.authorization_payload;
    const { city, err } = await cityService.create(req.body, userJwt.userOid);

    if (err) {
      return buildResponse.sendQueryError(res, err.message, 'insert');
    }

    return buildResponse.createOk(res, city, 1);
  } catch (err) {
    console.error('Controller Create Error:', err);
    return buildResponse.sendInternalServerError(res, err.message);
  }
};

const update = async (req, res) => {
  try {
    const userJwt = req.authorization_payload;
    const { city, err } = await cityService.update(req.params.oid, req.body, userJwt.userOid);

    if (err) {
      return buildResponse.sendQueryError(res, err.message, 'update');
    }

    return buildResponse.updateOk(res, city, 1);
  } catch (err) {
    console.error('Controller Update Error:', err);
    return buildResponse.sendInternalServerError(res, err.message);
  }
};

const remove = async (req, res) => {
  try {
    const { city, err } = await cityService.deleted(req.params.oid);

    if (err) {
      return buildResponse.sendQueryError(res, err.message || err, 'delete');
    }

    return buildResponse.sendDeleteOk(res, city);
  } catch (err) {
    console.error('Controller Delete Error:', err);
    return buildResponse.sendInternalServerError(res, err.message);
  }
};

const findAll = async (req, res) => {
  try {
    const { cities, err } = await cityService.findAll();

    if (err) {
      return buildResponse.sendQueryError(res, err.message, 'get all');
    }

    return buildResponse.findOk(res, cities, cities.length);
  } catch (err) {
    return buildResponse.sendInternalServerError(res, err.message);
  }
};

const find = async (req, res) => {
  try {
    const filters = pick(req.body, ['provinceOid', 'cityName']);

    const options = {
      sortBy: req.query.sortBy,
      sortOrder: req.query.sortOrder,
      pageIndex: parseInt(req.query.pageIndex, 10) || 1,
      pageSize: parseInt(req.query.pageSize, 10) || 10,
    };

    const result = await cityService.findPage(filters, options);

    if (result.err) {
      return buildResponse.sendInternalServerError(res, result.err.message);
    }

    return buildResponse.sendPagination(res, result.cities, result.count, options.pageIndex, options.pageSize);
  } catch (error) {
    console.error('Controller Find Error:', error);
    return buildResponse.sendInternalServerError(res, error.message);
  }
};

const findById = async (req, res) => {
  try {
    const options = {
      include: ['province', 'districts'], // sesuaikan include kalau perlu
    };

    const { city, err } = await cityService.findById(req.params.oid, options);

    if (err) {
      return buildResponse.sendQueryError(res, err.message, 'get by id');
    }

    if (!city) {
      return buildResponse.sendDataNotFound(res);
    }

    return buildResponse.findOk(res, city);
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
