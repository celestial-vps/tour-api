const customerService = require('../services/customer.service');
const buildResponse = require('../common/build.response');
const { JwtMaker } = require('../middleware/jwt');
const jwtMaker = new JwtMaker();
const pick = require('../misc/pick');

const DEFAULT_PAGE = 1;
const DEFAULT_PAGE_SIZE = 10;

const create = async (req, res) => {
  try {
    const userJwt = req.authorization_payload;
    const { customer, err } = await customerService.create(req.body, userJwt.userOid);

    let response;
    if (err !== null) {
      response = buildResponse.responseErrorInserted(err.message);
      return res.status(400).json(response);
    }

    response = buildResponse.responseOk(customer, 1);
    return res.status(201).json(response);
  } catch (err) {
    const response = buildResponse.responseInternalServerError(err.message);
    return res.status(500).json(response);
  }
};

const update = async (req, res) => {
  try {
    const userJwt = req.authorization_payload;
    const { customer, err } = await customerService.update(req.params.oid, req.body, userJwt.userOid);

    let response;
    if (err !== null) {
      response = buildResponse.responseErrorUpdate(err.message);
    } else {
      response = buildResponse.responseOk(customer, 1);
    }

    res.status(200).json(response);
  } catch (err) {
    const response = buildResponse.responseInternalServerError(err.message);
    res.status(500).json(response);
  }
};

const deleted = async (req, res) => {
  try {
    const { customer, err } = await customerService.deleted(req.params.oid);

    let response;
    if (err !== null) {
      response = buildResponse.responseErrorDelete(err.message || err);
    } else {
      response = buildResponse.responseDeleteOk(customer);
    }

    res.status(200).json(response);
  } catch (err) {
    const response = buildResponse.responseInternalServerError(err.message);
    res.status(500).json(response);
  }
};

const findAll = async (req, res) => {
  try {
    const { customers, err } = await customerService.findAll();

    let response;
    if (err !== null) {
      response = buildResponse.responseErrorGet(err.message);
    } else {
      response = buildResponse.responseOk(customers, customers.length);
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
    const filters = pick(req.body, [
      'customerName',
      'customerPhone',
      'customerEmail',
      'customerPostalCode',
      'bankOid',
      'subDistrictOid'
    ]);

    const pageIndex = parseInt(options.pageIndex) || DEFAULT_PAGE;
    const pageSize = parseInt(options.pageSize) || DEFAULT_PAGE_SIZE;

    const { customers, count } = await customerService.findPage(filters, options);

    const response = buildResponse.responsePaggination(customers, count, pageIndex, pageSize);
    res.status(200).json(response);
  } catch (err) {
    const response = buildResponse.responseInternalServerError(err.message);
    res.status(500).json(response);
  }
};

const findById = async (req, res) => {
  try {
    const { customer, err } = await customerService.findById(req.params.oid);

    let response;
    if (err !== null) {
      response = buildResponse.responseErrorGet(err.message);
      return res.status(400).json(response);
    }

    if (customer) {
      response = buildResponse.responseOk(customer, 1);
      return res.status(200).json(response);
    } else {
      response = buildResponse.responseDataNotFound("Customer not found.");
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
  find
};
