// validations/customer.validation.js
const Joi = require('joi');

const createCustomerSchema = Joi.object({
  name: Joi.string().required(),
  address: Joi.string().required(),
  meterNumber: Joi.string().required(),
  category: Joi.string().valid('A', 'B', 'C').required(),
  phone: Joi.string().optional(),
  email: Joi.string().email().optional(),
  status: Joi.string().valid('aktif', 'nonaktif', 'blokir').optional(),
  installationDate: Joi.date().optional(),
  region: Joi.string().optional(),
  note: Joi.string().optional(),
  location: Joi.object({
    lat: Joi.number().optional(),
    lng: Joi.number().optional()
  }).optional()
});

const updateCustomerSchema = createCustomerSchema; // bisa disesuaikan

module.exports = {
  createCustomerSchema,
  updateCustomerSchema
};
