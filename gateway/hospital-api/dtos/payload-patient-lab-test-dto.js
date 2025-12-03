const Joi = require('joi');
const { authSchema } = require('./base-dto'); // pastikan ini valid

const params = Joi.object({
  oid: Joi.string().uuid().required()
});

const query = Joi.object({
  pageIndex: Joi.number().integer().min(1).default(1),
  pageSize: Joi.number().integer().min(1).max(100).default(10)
});

const filterDto = Joi.object({
  patientOid: Joi.string().uuid().optional(),
  labTestOid: Joi.string().uuid().optional(),
  doctorOid: Joi.string().uuid().optional()
});

const createDto = Joi.object({
  patientOid: Joi.string().uuid().required(),
  labTestOid: Joi.string().uuid().required(),
  doctorOid: Joi.string().uuid().optional(),
  result: Joi.string().optional(),
  testDate: Joi.date().default(() => new Date(), 'current date')
});

const updateDto = Joi.object({
  doctorOid: Joi.string().uuid().optional(),
  result: Joi.string().optional(),
  testDate: Joi.date().default(() => new Date(), 'current date')
});

const filterPatientLabTestDto = Joi.object({
  headers: authSchema,
  query,
  body: filterDto
});

const getPatientLabTestDto = Joi.object({
  headers: authSchema,
  params
});

const deletePatientLabTestDto = Joi.object({
  headers: authSchema,
  params
});

const updatePatientLabTestDto = Joi.object({
  headers: authSchema,
  params,
  body: updateDto
});

const createPatientLabTestDto = Joi.object({
  headers: authSchema,
  body: createDto
});

module.exports = {
  createPatientLabTestDto,
  updatePatientLabTestDto,
  deletePatientLabTestDto,
  filterPatientLabTestDto,
  getPatientLabTestDto
};
