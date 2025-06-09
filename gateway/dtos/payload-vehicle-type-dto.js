const Joi = require('joi');
const { authSchema } = require('./base-dto');

// Body schemas
const createVehicleTypeBody = Joi.object({
  vehicleType: Joi.string().required()
});

const updateVehicleTypeBody = Joi.object({
  vehicleType: Joi.string().required()
});

// Params schema
const params = Joi.object({
  oid: Joi.string().uuid().required()
});

// Query schema
const query = Joi.object({
  pageIndex: Joi.number().integer().min(1).required(),
  pageSize: Joi.number().integer().min(1).max(100).required(),
});

// Filter body
const filterDto = Joi.object({
  vehicleType: Joi.string().optional().allow(null, ''),
  fieldName: Joi.string().optional().allow(null, ''),
  sortOrder: Joi.number().integer().valid(-1, 0, 1).optional().allow(null, 0)
});

// Request DTOs
const createVehicleTypeDto = Joi.object({
  headers: authSchema,
  body: createVehicleTypeBody
});

const updateVehicleTypeDto = Joi.object({
  headers: authSchema,
  params,
  body: updateVehicleTypeBody
});

const deleteVehicleTypeDto = Joi.object({
  headers: authSchema,
  params
});

const getVehicleTypeDto = Joi.object({
  headers: authSchema,
  params
});

const filterVehicleTypeDto = Joi.object({
  headers: authSchema,
  query,
  body: filterDto
});

module.exports = {
  createVehicleTypeDto,
  updateVehicleTypeDto,
  deleteVehicleTypeDto,
  getVehicleTypeDto,
  filterVehicleTypeDto
};
