// // controllers/vehicleTypeController.js

// const vehicleTypeService = require('../services/vehicleType.service');
// const buildResponse = require('../common/build.response');
// const pick = require('../misc/pick');

// const DEFAULT_PAGE = 1;
// const DEFAULT_PAGE_SIZE = 10;

// const create = async (req, res) => {
//   try {
//     const userJwt = req.authorization_payload;
//     const { vehicleType, err } = await vehicleTypeService.create(req.body, userJwt.userOid);

//     if (err !== null) {
//       return res.status(400).json(buildResponse.responseErrorInserted(err.message));
//     }

//     return res.status(201).json(buildResponse.responseOk(vehicleType, 1));
//   } catch (err) {
//     return res.status(500).json(buildResponse.responseInternalServerError(err.message));
//   }
// };

// const update = async (req, res) => {
//   try {
//     const userJwt = req.authorization_payload;
//     const { vehicleType, err } = await vehicleTypeService.update(req.params.oid, req.body, userJwt.userOid);

//     if (err !== null) {
//       return res.status(400).json(buildResponse.responseErrorUpdate(err.message));
//     }

//     return res.status(200).json(buildResponse.responseOk(vehicleType, 1));
//   } catch (err) {
//     return res.status(500).json(buildResponse.responseInternalServerError(err.message));
//   }
// };

// const deleted = async (req, res) => {
//   try {
//     const { vehicleType, err } = await vehicleTypeService.deleted(req.params.oid);

//     if (err !== null) {
//       return res.status(400).json(buildResponse.responseErrorDelete(err.message));
//     }

//     return res.status(200).json(buildResponse.responseDeleteOk(vehicleType));
//   } catch (err) {
//     return res.status(500).json(buildResponse.responseInternalServerError(err.message));
//   }
// };

// const findById = async (req, res) => {
//   try {
//     const { vehicleType, err } = await vehicleTypeService.findById(req.params.oid);

//     if (err !== null) {
//       return res.status(400).json(buildResponse.responseErrorGet(err.message));
//     }

//     if (!vehicleType) {
//       return res.status(404).json(buildResponse.responseDataNotFound("VehicleType not found."));
//     }

//     return res.status(200).json(buildResponse.responseOk(vehicleType, 1));
//   } catch (err) {
//     return res.status(500).json(buildResponse.responseInternalServerError(err.message));
//   }
// };

// const find = async (req, res) => {
//   try {
//     const filters = pick(req.body, ['vehicleType']);
//     const options = pick(req.query, ['fieldName', 'sortOrder', 'pageIndex', 'pageSize']);

//     // Set default paging if not provided
//     const pageIndex = parseInt(options.pageIndex) || DEFAULT_PAGE;
//     const pageSize = parseInt(options.pageSize) || DEFAULT_PAGE_SIZE;

//     const { vehicleTypes, count } = await vehicleTypeService.findPage(filters, options);

//     return res.status(200).json(buildResponse.responsePaggination(vehicleTypes, count, pageIndex, pageSize));
//   } catch (err) {
//     return res.status(500).json(buildResponse.responseInternalServerError(err.message));
//   }
// };

// module.exports = {
//   create,
//   update,
//   deleted,
//   findById,
//   find,
// };
