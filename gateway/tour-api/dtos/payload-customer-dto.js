const Joi = require('joi');
const { authSchema } = require('./base-dto');

// Define the schema for FilterCustomerDto
const filterDto = Joi.object({
    search: Joi.string().optional().allow(null, ''),
    customerName: Joi.string().optional().allow(null, ''),  
});

// Define the schema for CreateCustomerDto
const createDto = Joi.object({
    customerName: Joi.string().required(),
    customerPhone: Joi.string().required(),
    customerEmail: Joi.string().required(),
    customerPostalCode: Joi.string().required(),
    bankOid: Joi.string().required(),
});

// Define the schema for UpdateCustomerDto
const updateDto = Joi.object({
    customerName: Joi.string().required(),
    customerPhone: Joi.string().required(),
    customerEmail: Joi.string().required(),
    customerPostalCode: Joi.string().required(),
    bankOid: Joi.string().required(),
});

const params = Joi.object({
    oid: Joi.string().uuid().required()
});

const query = Joi.object({
    pageIndex: Joi.number().integer().min(1).required(),
    pageSize: Joi.number().integer().min(1).max(100).required(),
    sortBy: Joi.string().valid('customerName', 'customerPhone', 'customerEmail', 'customerPostalCode', 'bankOid').optional().default('customerPhone'),
    sortOrder: Joi.string().valid('asc', 'desc').insensitive().default('asc')
});

const filterCustomerDto = Joi.object({
    headers: authSchema,
    query,
    body: filterDto
});

const getCustomerDto = Joi.object({
    headers: authSchema,
    params: params,
});

const deleteCustomerDto = Joi.object({
    headers: authSchema,
    params: params,
});

const updateCustomerDto = Joi.object({
    headers: authSchema,
    params: params,
    body: updateDto
});

const createCustomerDto = Joi.object({
    headers: authSchema,
    body: createDto
});

module.exports = {
    createCustomerDto,
    updateCustomerDto,
    deleteCustomerDto,
    filterCustomerDto,
    getCustomerDto,
};
