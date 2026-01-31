'use strict';

const driverService = require('../services/driver.service');
const buildResponse = require('../common/build.response');
const { JwtMaker } = require('../middleware/jwt');
const pick = require('../misc/pick');
const { recordAuditTrail } = require('../middleware/audit-trail/with-audit-trail-midleware');

const jwtMaker = new JwtMaker();

const create = async (req, res) => {
  try {
    const userJwt = req.authorization_payload;
    const { driver, err } = await driverService.create(req.body, userJwt.userOid);

    if (err) {
      await recordAuditTrail("CREATE", "driver", err, req, 'FAILED', err.message);
      return buildResponse.sendQueryError(res, err.message, "insert");
    }
    await recordAuditTrail("CREATE", "driver", driver, req, 'SUCCESS', 'Create Driver success');
    return buildResponse.createOk(res, driver, 1);
  } catch (err) {
    await recordAuditTrail("CREATE", "driver", err, req, 'ERROR', err.message);
    return buildResponse.sendInternalServerError(res, err.message);
  }
};

const update = async (req, res) => {
  try {
    const userJwt = req.authorization_payload;
    const { driver, err } = await driverService.update(req.params.oid, req.body, userJwt.userOid);

    if (err) {
      await recordAuditTrail("UPDATE", "driver", err, req, 'FAILED', err.message);
      return buildResponse.sendQueryError(res, err.message, "update");
    }
    await recordAuditTrail("UPDATE", "driver", driver, req, 'SUCCESS', 'Update Driver success');
    return buildResponse.updateOk(res, driver, 1);
  } catch (err) {
    await recordAuditTrail("UPDATE", "driver", err, req, 'ERROR', err.message);
    return buildResponse.sendInternalServerError(res, err.message);
  }
};

const remove = async (req, res) => {
  try {
    const { driver, err } = await driverService.deleted(req.params.oid);

    if (err) {
      await recordAuditTrail("DELETE", "driver", err, req, 'FAILED', err.message);
      return buildResponse.sendQueryError(res, err.message || err, "delete");
    }
    await recordAuditTrail("DELETE", "driver", driver, req, 'SUCCESS', 'Delete Driver success');
    return buildResponse.sendDeleteOk(res, driver);
  } catch (err) {
    await recordAuditTrail("DELETE", "driver", err, req, 'ERROR', err.message);
    return buildResponse.sendInternalServerError(res, err.message);
  }
};

const findAll = async (req, res) => {
  try {
    const { drivers, err } = await driverService.findAll();

    if (err) {
      await recordAuditTrail("READ", "driver", err, req, 'FAILED', err.message);
      return buildResponse.sendQueryError(res, err.message, "get all");
    }
    await recordAuditTrail("READ", "driver", drivers, req, 'SUCCESS', 'Get all Drivers success');
    return buildResponse.findOk(res, drivers, drivers.length);
  } catch (err) {
    await recordAuditTrail("READ", "driver", err, req, 'ERROR', err.message);
    return buildResponse.sendInternalServerError(res, err.message);
  }
};

const find = async (req, res) => {
  try {
    const filters = pick(req.body, ['userOid', 'licenseNumber', 'search']);
    const options = {
      sortBy: req.query.sortBy,
      sortOrder: req.query.sortOrder,
      pageIndex: parseInt(req.query.pageIndex, 10) || 1,
      pageSize: parseInt(req.query.pageSize, 10) || 10,
    };

    const result = await driverService.findPage(filters, options);

    if (result.err) {
      await recordAuditTrail("READ", "driver", result.err, req, 'FAILED', result.err.message);
      return buildResponse.sendInternalServerError(res, result.err.message);
    }
    await recordAuditTrail("READ", "driver", result.drivers, req, 'SUCCESS', 'Get Drivers with filters success');
    return buildResponse.sendPagination(res, result.drivers, result.count, options.pageIndex, options.pageSize);
  } catch (error) {
    await recordAuditTrail("READ", "driver", error, req, 'ERROR', error.message);
    return buildResponse.sendInternalServerError(res, error.message);
  }
};

const findById = async (req, res) => {
  try {
    const { driver, err } = await driverService.findById(req.params.oid, { include: [] });

    if (err) {
      await recordAuditTrail("READ", "driver", err, req, 'FAILED', err.message);
      return buildResponse.sendQueryError(res, err.message, "get by id");
    }

    if (!driver) return buildResponse.sendDataNotFound(res);
    await recordAuditTrail("READ", "driver", driver, req, 'SUCCESS', 'Get Driver by ID success');
    return buildResponse.findOk(res, driver);
  } catch (err) {
    await recordAuditTrail("READ", "driver", err, req, 'ERROR', err.message);
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
