const Joi = require('joi');
const { authSchema } = require('./base-dto');

const params = Joi.object({
    oid: Joi.string().uuid().required().example('patient-uuid-123')
});

const query = Joi.object({
    pageIndex: Joi.number().integer().min(1).default(1),
    pageSize: Joi.number().integer().min(1).max(100).default(10),
    sortBy: Joi.string().valid('fullName','birthDate').default('fullName'),
    sortOrder: Joi.string().valid('asc','desc').insensitive().default('asc')
});

const filterDto = Joi.object({
    fullName: Joi.string().optional().allow(null,'').example('John Doe'),
    gender: Joi.string().valid('Male','Female','Other').optional().example('Male')
});

const createDto = Joi.object({
    fullName: Joi.string().required().example('John Doe'),
    gender: Joi.string().valid('Male','Female','Other').default('Other'),
    birthDate: Joi.date().optional().example('1990-01-01'),
    phone: Joi.string().optional().example('081234567890'),
    address: Joi.string().optional().example('Jl. Example No.123')
});

const updateDto = Joi.object({
    fullName: Joi.string().example('John Doe Updated'),
    gender: Joi.string().valid('Male','Female','Other').example('Male'),
    birthDate: Joi.date().example('1990-01-01'),
    phone: Joi.string().example('081234567891'),
    address: Joi.string().example('Jl. Updated No.123')
});

const filterPatientDto = Joi.object({
    headers: authSchema,
    query,
    body: filterDto
});

const getPatientDto = Joi.object({
    headers: authSchema,
    params
});

const deletePatientDto = Joi.object({
    headers: authSchema,
    params
});

const updatePatientDto = Joi.object({
    headers: authSchema,
    params,
    body: updateDto
});

const createPatientDto = Joi.object({
    headers: authSchema,
    body: createDto
});

module.exports = {
    createPatientDto,
    updatePatientDto,
    deletePatientDto,
    filterPatientDto,
    getPatientDto
};
