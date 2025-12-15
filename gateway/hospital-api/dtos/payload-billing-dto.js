const Joi = require('joi');
const { authSchema } = require('./base-dto');

const params = Joi.object({
    oid: Joi.string().uuid().required().example('billing-uuid-123')
});

const query = Joi.object({
    pageIndex: Joi.number().integer().min(1).required().default(1),
    pageSize: Joi.number().integer().min(1).max(100).required().default(10),
    sortBy: Joi.string().valid('totalAmount', 'status').optional().default('totalAmount'),
    sortOrder: Joi.string().valid('asc', 'desc').insensitive().default('asc')
});

const filterDto = Joi.object({
    status: Joi.string().valid('Pending', 'Paid', 'Cancelled').optional().example('Pending')
});

const createDto = Joi.object({
    patientOid: Joi.string().uuid().required().example('patient-uuid-123'),
    totalAmount: Joi.number().precision(2).default(0).example(500000.00),
    status: Joi.string().valid('Pending', 'Paid', 'Cancelled').default('Pending')
});

const updateDto = Joi.object({
    patientOid: Joi.string().uuid().example('patient-uuid-123'),
    totalAmount: Joi.number().precision(2).example(500000.00),
    status: Joi.string().valid('Pending', 'Paid', 'Cancelled').example('Paid')
});

const filterBillingDto = Joi.object({
    headers: authSchema,
    query,
    body: filterDto
});

const getBillingDto = Joi.object({
    headers: authSchema,
    params
});

const deleteBillingDto = Joi.object({
    headers: authSchema,
    params
});

const updateBillingDto = Joi.object({
    headers: authSchema,
    params,
    body: updateDto
});

const createBillingDto = Joi.object({
    headers: authSchema,
    body: createDto
});

const billingResponseDto = Joi.object({
    oid: Joi.string().required(),
    patientOid: Joi.string().uuid().required().example('patient-uuid-123'),
    totalAmount: Joi.number().precision(2).default(0).example(500000.00),
    status: Joi.string().valid('Pending', 'Paid', 'Cancelled').default('Pending'),
    createdBy: Joi.string().required(),
    updatedAt: Joi.date().iso().required(),
});

module.exports = {
    createBillingDto,
    updateBillingDto,
    deleteBillingDto,
    filterBillingDto,
    getBillingDto,
    billingResponseDto,
    createDto, updateDto, filterDto, params
};
