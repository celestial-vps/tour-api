const bankService = require('../services/bank.service');
const buildResponse = require('../common/build.response');
const { JwtMaker } = require('../middleware/jwt');
const pick = require('../misc/pick');

const jwtMaker = new JwtMaker();

const create = async (req, res) => {
  try {
    const userJwt = req.authorization_payload;
    const { bank, err } = await bankService.create(req.body, userJwt.userOid);

    if (err) {
      return buildResponse.sendQueryError(res, err.message, "insert");
    }

    return buildResponse.createOk(res, bank, 1);
  } catch (err) {
    console.error('Controller Create Error:', err);
    return buildResponse.sendInternalServerError(res, err.message);
  }
};

const update = async (req, res) => {
  try {
    const userJwt = req.authorization_payload;
    const { bank, err } = await bankService.update(req.params.oid, req.body, userJwt.userOid);

    if (err) {
      return buildResponse.sendQueryError(res, err.message, "update");
    }

    return buildResponse.updateOk(res, bank, 1);
  } catch (err) {
    console.error('Controller Update Error:', err);
    return buildResponse.sendInternalServerError(res, err.message);
  }
};

const remove = async (req, res) => {
  try {
    const { bank, err } = await bankService.deleted(req.params.oid);

    if (err) {
      return buildResponse.sendQueryError(res, err.message || err, "delete");
    }

    return buildResponse.sendDeleteOk(res, bank);
  } catch (err) {
    console.error('Controller Delete Error:', err);
    return buildResponse.sendInternalServerError(res, err.message);
  }
};

const findAll = async (req, res) => {
  try {
    const { banks, err } = await bankService.findAll();

    if (err) {
      return buildResponse.sendQueryError(res, err.message, "get all");
    }

    return buildResponse.findOk(res, banks, banks.length);
  } catch (err) {
    return buildResponse.sendInternalServerError(res, err.message);
  }
};

const find = async (req, res) => {
  try {
    const filters = pick(req.body, ['bankCode', 'bankName','search' ]);

    const options = {
      sortBy: req.query.sortBy,
      sortOrder: req.query.sortOrder,
      pageIndex: parseInt(req.query.pageIndex, 10) || 1,
      pageSize: parseInt(req.query.pageSize, 10) || 10,
    };

    const result = await bankService.findPage(filters, options);

    if (result.err) {
      return buildResponse.sendInternalServerError(res, result.err.message);
    }

    return buildResponse.sendPagination(res, result.banks, result.count, options.pageIndex, options.pageSize);
  } catch (error) {
    console.error('Controller error:', error);
    return buildResponse.sendInternalServerError(res, error.message);
  }
};

const findById = async (req, res) => {
  try {
    const options = {
      include: [], // bisa ditambahkan jika ada relasi
    };

    const { bank, err } = await bankService.findById(req.params.oid, options);

    if (err) {
      return buildResponse.sendQueryError(res, err.message, "get by id");
    }

    if (!bank) return buildResponse.sendDataNotFound(res);

    return buildResponse.findOk(res, bank);
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
