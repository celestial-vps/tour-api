'use strict';

const subjectCategoryService = require('../services/subject-category.service');
const buildResponse = require('../common/build.response');
const { JwtMaker } = require('../middleware/jwt');
const pick = require('../misc/pick');
const { recordAuditTrail } = require('../middleware/audit-trail/with-audit-trail-midleware');

const jwtMaker = new JwtMaker();

const create = async (req, res) => {
  try {
    const userJwt = req.authorization_payload;
    const { subjectCategory, err } = await subjectCategoryService.create(req.body, userJwt.userOid);

    if (err) {
      await recordAuditTrail("CREATE", "subject_category", err, req, 'FAILED', err.message);
      return buildResponse.sendQueryError(res, err.message, "insert");
    }
    await recordAuditTrail("CREATE", "subject_category", subjectCategory, req, 'SUCCESS', 'Create  Subject Category success');
    return buildResponse.createOk(res, subjectCategory, 1);
  } catch (err) {
    await recordAuditTrail("CREATE", "subject_category", err, req, 'ERROR', err.message);
    return buildResponse.sendInternalServerError(res, err.message);
  }
};

const update = async (req, res) => {
  try {
    const userJwt = req.authorization_payload;
    const { subjectCategory, err } = await subjectCategoryService.update(req.params.oid, req.body, userJwt.userOid);

    if (err) {
      await recordAuditTrail("UPDATE", "subject_category", err, req, 'FAILED', err.message);
      return buildResponse.sendQueryError(res, err.message, "update");
    }
    await recordAuditTrail("UPDATE", "subject_category", subjectCategory, req, 'SUCCESS', 'Update  Subject Category success');
    return buildResponse.updateOk(res, subjectCategory, 1);
  } catch (err) {
    await recordAuditTrail("UPDATE", "subject_category", err, req, 'ERROR', err.message);
    return buildResponse.sendInternalServerError(res, err.message);
  }
};

const remove = async (req, res) => {
  try {
    const { subjectCategory, err } = await subjectCategoryService.deleted(req.params.oid);

    if (err) {
      await recordAuditTrail("DELETE", "subject_category", err, req, 'FAILED', err.message);
      return buildResponse.sendQueryError(res, err.message || err, "delete");
    }
    await recordAuditTrail("DELETE", "subject_category", subjectCategory, req, 'SUCCESS', 'Delete  Subject Category success');
    return buildResponse.sendDeleteOk(res, subjectCategory);
  } catch (err) {
    await recordAuditTrail("DELETE", "subject_category", err, req, 'ERROR', err.message);
    return buildResponse.sendInternalServerError(res, err.message);
  }
};

const findAll = async (req, res) => {
  try {
    const { subjectCategories, err } = await subjectCategoryService.findAll();

    if (err) {
      await recordAuditTrail("READ", "subject_category", err, req, 'FAILED', err.message);
      return buildResponse.sendQueryError(res, err.message, "get all");
    }
    await recordAuditTrail("READ", "subject_category", subjectCategories, req, 'SUCCESS', 'Get all  Subject Categories success');
    return buildResponse.findOk(res, subjectCategories, subjectCategories.length);
  } catch (err) {
    await recordAuditTrail("READ", "subject_category", err, req, 'ERROR', err.message);
    return buildResponse.sendInternalServerError(res, err.message);
  }
};

const find = async (req, res) => {
  try {
    const filters = pick(req.body, ['categoryName', 'search']);
    const options = {
      sortBy: req.query.sortBy,
      sortOrder: req.query.sortOrder,
      pageIndex: parseInt(req.query.pageIndex, 10) || 1,
      pageSize: parseInt(req.query.pageSize, 10) || 10,
    };

    const result = await subjectCategoryService.findPage(filters, options);

    if (result.err) {
      await recordAuditTrail("READ", "subject_category", result.err, req, 'FAILED', result.err.message);
      return buildResponse.sendInternalServerError(res, result.err.message);
    }
    await recordAuditTrail("READ", "subject_category", result.subjectCategories, req, 'SUCCESS', 'Get  Subject Categories with filters success');
    return buildResponse.sendPagination(res, result.subjectCategories, result.count, options.pageIndex, options.pageSize);
  } catch (error) {
    await recordAuditTrail("READ", "subject_category", error, req, 'ERROR', error.message);
    return buildResponse.sendInternalServerError(res, error.message);
  }
};

const findById = async (req, res) => {
  try {
    const { subjectCategory, err } = await subjectCategoryService.findById(req.params.oid, { include: [] });

    if (err) {
      await recordAuditTrail("READ", "subject_category", err, req, 'FAILED', err.message);
      return buildResponse.sendQueryError(res, err.message, "get by id");
    }

    if (!subjectCategory) return buildResponse.sendDataNotFound(res);
    await recordAuditTrail("READ", "subject_category", subjectCategory, req, 'SUCCESS', 'Get  Subject Category by ID success');
    return buildResponse.findOk(res, subjectCategory);
  } catch (err) {
    await recordAuditTrail("READ", "subject_category", err, req, 'ERROR', err.message);
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
