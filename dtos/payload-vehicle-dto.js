const Joi = require('joi');
const { authSchema } = require('./base-dto');

// --- Body Schemas ---
const createVehicleBody = Joi.object({
  vehicleTypeOid: Joi.string().uuid().required(),
  year: Joi.number().integer().min(1900).max(new Date().getFullYear()).required(),
  color: Joi.string().max(20).required(),
  status: Joi.string().valid('available', 'rented', 'service').optional(),
  price_per_day: Joi.number().precision(2).min(0).required(),
});

const updateVehicleBody = Joi.object({
  vehicleTypeOid: Joi.string().uuid().required(),
  year: Joi.number().integer().min(1900).max(new Date().getFullYear()).required(),
  color: Joi.string().max(20).required(),
  status: Joi.string().valid('available', 'rented', 'service').required(),
  price_per_day: Joi.number().precision(2).min(0).required(),
});

// --- Params & Query ---
const params = Joi.object({
  oid: Joi.string().uuid().required(),
});

const query = Joi.object({
  pageIndex: Joi.number().integer().min(1).required(),
  pageSize: Joi.number().integer().min(1).max(100).required(),
});

const filterDto = Joi.object({
  vehicleTypeOid: Joi.string().uuid().optional().allow(null, ''),
  status: Joi.string().valid('available', 'rented', 'service').optional().allow(null, ''),
  color: Joi.string().optional().allow(null, ''),
  fieldName: Joi.string().optional().allow(null, ''),
  sortOrder: Joi.number().integer().valid(-1, 0, 1).optional().allow(null, 0),
});

// --- Endpoint DTOs ---
const createVehicleDto = Joi.object({
  headers: authSchema,
  body: createVehicleBody
});

const updateVehicleDto = Joi.object({
  headers: authSchema,
  params,
  body: updateVehicleBody
});

const deleteVehicleDto = Joi.object({
  headers: authSchema,
  params
});

const getVehicleDto = Joi.object({
  headers: authSchema,
  params
});

const filterVehicleDto = Joi.object({
  headers: authSchema,
  query,
  body: filterDto
});

module.exports = {
  createVehicleDto,
  updateVehicleDto,
  deleteVehicleDto,
  getVehicleDto,
  filterVehicleDto
};
