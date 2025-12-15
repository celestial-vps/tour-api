const doctorService = require('../services/doctor.service');
const buildResponse = require('../common/build.response');
const pick = require('../misc/pick');
const { recordAuditTrail } = require('../middleware/audit-trail/with-audit-trail-midleware');

/**
 * Create Doctor
 */
const create = async (req, res) => {
  try {
    const userJwt = req.authorization_payload;

    const { doctor, err } = await doctorService.create(req.body, userJwt.userOid);

    if (err) {
      await recordAuditTrail("CREATE", "doctors", err, req, 'FAILED', err.message);
      return buildResponse.sendQueryError(res, err.message, 'insert');
    }

    await recordAuditTrail("CREATE", "doctors", doctor, req, 'SUCCESS', 'Create Doctor success');
    return buildResponse.createOk(res, doctor, 1);
  } catch (err) {
    await recordAuditTrail("CREATE", "doctors", err, req, 'ERROR', err.message);
    console.error('Doctor Controller Create Error:', err);
    return buildResponse.sendInternalServerError(res, err.message);
  }
};

/**
 * Update Doctor
 */
const update = async (req, res) => {
  try {
    const userJwt = req.authorization_payload;

    const { doctor, err } = await doctorService.update(req.params.oid, req.body, userJwt.userOid);

    if (err) {
      await recordAuditTrail("UPDATE", "doctors", err, req, 'FAILED', err.message);
      return buildResponse.sendQueryError(res, err.message, 'update');
    }

    await recordAuditTrail("UPDATE", "doctors", doctor, req, 'SUCCESS', 'Update Doctor success');
    return buildResponse.updateOk(res, doctor, 1);
  } catch (err) {
    await recordAuditTrail("UPDATE", "doctors", err, req, 'ERROR', err.message);
    console.error('Doctor Controller Update Error:', err);
    return buildResponse.sendInternalServerError(res, err.message);
  }
};

/**
 * Delete Doctor
 */
const remove = async (req, res) => {
  try {
    const { doctor, err } = await doctorService.deleted(req.params.oid);

    if (err) {
      await recordAuditTrail("DELETE", "doctors", err, req, 'FAILED', err.message);
      return buildResponse.sendQueryError(res, err.message, 'delete');
    }

    await recordAuditTrail("DELETE", "doctors", doctor, req, 'SUCCESS', 'Delete Doctor success');
    return buildResponse.sendDeleteOk(res, doctor);

  } catch (err) {
    await recordAuditTrail("DELETE", "doctors", err, req, 'ERROR', err.message);
    console.error('Doctor Controller Delete Error:', err);
    return buildResponse.sendInternalServerError(res, err.message);
  }
};

/**
 * Get All Doctors
 */
const findAll = async (req, res) => {
  try {
    const { doctors, err } = await doctorService.findAll();

    if (err) {
      await recordAuditTrail("READ", "doctors", err, req, 'FAILED', err.message);
      return buildResponse.sendQueryError(res, err.message, 'get all');
    }

    await recordAuditTrail("READ", "doctors", doctors, req, 'SUCCESS', 'Get All Doctors success');
    return buildResponse.findOk(res, doctors, doctors.length);

  } catch (err) {
    await recordAuditTrail("READ", "doctors", err, req, 'ERROR', err.message);
    console.error('Doctor Controller FindAll Error:', err);
    return buildResponse.sendInternalServerError(res, err.message);
  }
};

/**
 * Paginated Search
 */
const find = async (req, res) => {
  try {
    const filters = pick(req.body, ['fullName', 'specializationOid', 'phone', 'search']);

    const options = {
      sortBy: req.query.sortBy || 'fullName',
      sortOrder: req.query.sortOrder || 'asc',
      pageIndex: parseInt(req.query.pageIndex, 10),
      pageSize: parseInt(req.query.pageSize, 10),
    };

    const result = await doctorService.findPage(filters, options);

    if (result.err) {
      await recordAuditTrail("READ", "doctors", result.err, req, 'FAILED', result.err.message);
      return buildResponse.sendInternalServerError(res, result.err.message);
    }

    await recordAuditTrail("READ", "doctors", result.doctors, req, 'SUCCESS', 'Search Doctors success');

    return buildResponse.sendPagination(
      res,
      result.doctors,
      result.count,
      options.pageIndex,
      options.pageSize
    );
  } catch (error) {
    await recordAuditTrail("READ", "doctors", error, req, 'ERROR', error.message);
    console.error('Doctor Controller Pagination Error:', error);
    return buildResponse.sendInternalServerError(res, error.message);
  }
};

/**
 * Find Doctor by ID
 */
const findById = async (req, res) => {
  try {
    const { doctor, err } = await doctorService.findById(req.params.oid);

    if (err) {
      await recordAuditTrail("READ", "doctors", err, req, 'FAILED', err.message);
      return buildResponse.sendQueryError(res, err.message, 'get by id');
    }

    if (!doctor) return buildResponse.sendDataNotFound(res);

    await recordAuditTrail("READ", "doctors", doctor, req, 'SUCCESS', 'Get Doctor by ID success');
    return buildResponse.findOk(res, doctor);

  } catch (err) {
    await recordAuditTrail("READ", "doctors", err, req, 'ERROR', err.message);
    return buildResponse.sendInternalServerError(res, err.message);
  }
};

module.exports = {
  create,
  update,
  remove,
  findAll,
  find,
  findById
};
