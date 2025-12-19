const Joi = require('joi');
const { authSchema } = require('./base-dto');

const params = Joi.object({
    oid: Joi.string().uuid().required().example('doctor-uuid-123')
});

const query = Joi.object({
    pageIndex: Joi.number().integer().min(1).default(1),
    pageSize: Joi.number().integer().min(1).max(100).default(10)
});

const filterDto = Joi.object({
     search: Joi.string().optional().allow(null, '').example('Cardiology')
});

const createDto = Joi.object({ 
    specializationOid: Joi.string().uuid().optional().example('specialization-uuid-123'),
    phone: Joi.string().optional().example('081234567890')
});

const updateDto = Joi.object({
    specializationOid: Joi.string().uuid().example('specialization-uuid-456'),
    phone: Joi.string().example('081234567891')
});

const filterDoctorDto = Joi.object({
    headers: authSchema,
    query,
    body: filterDto
});

const getDoctorDto = Joi.object({
    headers: authSchema,
    params
});

const deleteDoctorDto = Joi.object({
    headers: authSchema,
    params
});

const updateDoctorDto = Joi.object({
    headers: authSchema,
    params,
    body: updateDto
});

const createDoctorDto = Joi.object({
    headers: authSchema,
    body: createDto
});

const doctorResponseDto = Joi.object({
    oid: Joi.string().required(),
    userOid: Joi.string().uuid().optional().example('user-uuid-123'),
    specializationOid: Joi.string().uuid().optional().example('specialization-uuid-123'),
    createdBy: Joi.string().required(),
    updatedAt: Joi.date().iso().required(),
});

module.exports = {
    createDoctorDto,
    updateDoctorDto,
    deleteDoctorDto,
    filterDoctorDto,
    getDoctorDto,
    doctorResponseDto,
    createDto, updateDto, filterDto, params
};
