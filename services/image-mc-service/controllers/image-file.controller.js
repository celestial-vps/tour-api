const imageFileService = require('../services/image-file.service');
const buildResponse = require('../common/build.response');
const { JwtMaker } = require('../middleware/jwt');
const pick = require('../misc/pick');
const { recordAuditTrail } = require('../middleware/audit-trail/with-audit-trail-midleware');


const jwtMaker = new JwtMaker();

const uploadImage = async (req, res) => { 
  try {
    // const userJwt = req.authorization_payload;
    const { imageFile, err } = await imageFileService.create(req.file);

    if (err) {
      await recordAuditTrail("CREATE", "image_files", err, req, 'FAILED', err.message);
      return buildResponse.sendQueryError(res, err.message, "insert");
    }
    await recordAuditTrail("CREATE", "image_files", imageFile, req, 'SUCCESS', 'Create ImageFile success');
    return buildResponse.createOk(res, imageFile, 1);

  } catch (err) {
    await recordAuditTrail("CREATE", "image_files", err, req, 'ERROR', err.message);
    console.error('Controller Create Error:', err);
    return buildResponse.sendInternalServerError(res, err.message);
  }
};

 

const remove = async (req, res) => {
  try {
    const { imageFile, err } = await imageFileService.deleted(req.params.oid);

    if (err) {
      await recordAuditTrail("DELETE", "image_files", err, req, 'FAILED', err.message);
      return buildResponse.sendQueryError(res, err.message || err, "delete");
    }
    await recordAuditTrail("DELETE", "image_files", imageFile, req, 'SUCCESS', 'Delete ImageFile success');
    return buildResponse.sendDeleteOk(res, imageFile);
  } catch (err) {
    await recordAuditTrail("DELETE", "image_files", err, req, 'ERROR', err.message);
    console.error('Controller Delete Error:', err);
    return buildResponse.sendInternalServerError(res, err.message);
  }
};
 

const getImageMetadata = async (req, res) => {
  try {
    const options = {
      include: [], // bisa ditambahkan jika ada relasi
    };

    const { imageFile, err } = await imageFileService.findById(req.params.oid, options);

    if (err) {
      await recordAuditTrail("READ", "image_files", err, req, 'FAILED', err.message);
      return buildResponse.sendQueryError(res, err.message, "get by id");
    }

    if (!imageFile) return buildResponse.sendDataNotFound(res);
    await recordAuditTrail("READ", "image_files", imageFile, req, 'SUCCESS', 'Get ImageFile by ID success');
    return buildResponse.findOk(res, imageFile);
  } catch (err) {
    await recordAuditTrail("READ", "image_files", err, req, 'ERROR', err.message);
    return buildResponse.sendInternalServerError(res, err.message);
  }
};

const viewImage = async (req, res) => {
  try {
    const options = {
      include: [], // bisa ditambahkan jika ada relasi
    };

    const { imageFile, err } = await imageFileService.findById(req.params.oid, options);

    if (err) {
      await recordAuditTrail("READ", "image_files", err, req, 'FAILED', err.message);
      return buildResponse.sendQueryError(res, err.message, "get by id");
    }

    if (!imageFile) return buildResponse.sendDataNotFound(res);
    await recordAuditTrail("READ", "image_files", imageFile, req, 'SUCCESS', 'Get ImageFile by ID success');
    return buildResponse.findOk(res, imageFile);
  } catch (err) {
    await recordAuditTrail("READ", "image_files", err, req, 'ERROR', err.message);
    return buildResponse.sendInternalServerError(res, err.message);
  }
};

module.exports = {
  uploadImage,
  getImageMetadata,
  viewImage,
  remove, 
};
