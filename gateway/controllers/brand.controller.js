'use strict';

const brandService = require('../services/brand.service');
const buildResponse = require('../common/build.response');
const imageFileService = require('../middleware/image-file/image-file-mc.service');
// const messageMaps = require('../mappings/message.vm');
const { JwtMaker } = require('../middleware/jwt');
const pick = require('../misc/pick');
const { recordAuditTrail } = require('../middleware/audit-trail/with-audit-trail-midleware');

const jwtMaker = new JwtMaker();

const create = async (req, res) => { 
  try {
    const userJwt = req.authorization_payload;
    //  let imageFileOid = null;
    //  if (req.file) {
    //   const uploadedImage = await uploadFileToMicroservice(req.file);
    //   imageFileOid = uploadedImage.oid; // atau `uploadedImage.imageFile.oid` sesuai strukturmu
    // }
    const { brand, err } = await brandService.create(req.body, userJwt.userOid);

    if (err) {
      await recordAuditTrail("CREATE", "brands", err, req, 'FAILED', err.message);
      return buildResponse.sendQueryError(res, err.message, "insert");
    }
    await recordAuditTrail("CREATE", "brands", brand, req, 'SUCCESS', 'Create Brand success');
    return buildResponse.createOk(res, brand, 1);
  } catch (err) {
    await recordAuditTrail("CREATE", "brands", err, req, 'ERROR', err.message);
    return buildResponse.sendInternalServerError(res, err.message);
  }
};

const update = async (req, res) => {
  try {
    const userJwt = req.authorization_payload;
    const { brand, err } = await brandService.update(req.params.oid, req.body, userJwt.userOid);

    if (err) {
      await recordAuditTrail("UPDATE", "brands", err, req, 'FAILED', err.message);
      return buildResponse.sendQueryError(res, err.message, "update");
    }
    await recordAuditTrail("UPDATE", "brands", brand, req, 'SUCCESS', 'Update Brand success');
    return buildResponse.updateOk(res, brand, 1);
  } catch (err) {
    await recordAuditTrail("UPDATE", "brands", err, req, 'ERROR', err.message);
    return buildResponse.sendInternalServerError(res, err.message);
  }
};

const remove = async (req, res) => {
  try {
    const { brand, err } = await brandService.deleted(req.params.oid);

    if (err) {
      await recordAuditTrail("DELETE", "brands", err, req, 'FAILED', err.message);
      return buildResponse.sendQueryError(res, err.message || err, "delete");
    }
    await recordAuditTrail("DELETE", "brands", brand, req, 'SUCCESS', 'Delete Brand success');
    return buildResponse.sendDeleteOk(res, brand);
  } catch (err) {
    await recordAuditTrail("DELETE", "brands", err, req, 'ERROR', err.message);
    return buildResponse.sendInternalServerError(res, err.message);
  }
};

const findAll = async (req, res) => {
  try {
    const { brands, err } = await brandService.findAll();

    if (err) {
      await recordAuditTrail("READ", "brands", err, req, 'FAILED', err.message);
      return buildResponse.sendQueryError(res, err.message, "get all");
    }
    await recordAuditTrail("READ", "brands", brands, req, 'SUCCESS', 'Get all Brands success');
    return buildResponse.findOk(res, brands, brands.length);
  } catch (err) {
    await recordAuditTrail("READ", "brands", err, req, 'ERROR', err.message);
    return buildResponse.sendInternalServerError(res, err.message);
  }
};

const find = async (req, res) => {
  try {
    const filters = pick(req.body, ['brandName', 'search']);
    const options = {
      sortBy: req.query.sortBy,
      sortOrder: req.query.sortOrder,
      pageIndex: parseInt(req.query.pageIndex, 10) || 1,
      pageSize: parseInt(req.query.pageSize, 10) || 10,
    };

    const result = await brandService.findPage(filters, options);

    if (result.err) {
      await recordAuditTrail("READ", "brands", result.err, req, 'FAILED', result.err.message);
      return buildResponse.sendInternalServerError(res, result.err.message);
    }
    await recordAuditTrail("READ", "brands", result.brands, req, 'SUCCESS', 'Get Brands with filters success');
    return buildResponse.sendPagination(res, result.brands, result.count, options.pageIndex, options.pageSize);
  } catch (error) {
    await recordAuditTrail("READ", "brands", error, req, 'ERROR', error.message);
    return buildResponse.sendInternalServerError(res, error.message);
  }
};

const findById = async (req, res) => {
  try {


    //  const fileUrl = response?.data?.fileUrl || null;

    const { brand, err } = await brandService.findById(req.params.oid, { include: [] });

    if (err) {
      await recordAuditTrail("READ", "brands", err, req, 'FAILED', err.message);
      return buildResponse.sendQueryError(res, err.message, "get by id");
    }

    if (!brand) return buildResponse.sendDataNotFound(res);
    await recordAuditTrail("READ", "brands", brand, req, 'SUCCESS', 'Get Brand by ID success');
    return buildResponse.findOk(res, brand);
  } catch (err) {
    await recordAuditTrail("READ", "brands", err, req, 'ERROR', err.message);
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
