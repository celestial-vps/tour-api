const Joi = require('joi');
const { authSchema } = require('./base-dto');

const params = Joi.object({
    oid: Joi.string().uuid().required().example('appointment-uuid-123')
});

const query = Joi.object({
    pageIndex: Joi.number().integer().min(1).default(1),
    pageSize: Joi.number().integer().min(1).max(100).default(10),
    sortBy: Joi.string().valid('appointmentDate', 'status').default('appointmentDate'),
    sortOrder: Joi.string().valid('asc', 'desc').insensitive().default('asc')
});

const filterDto = Joi.object({
    patientOid: Joi.string().uuid().optional().example('patient-uuid-123'),
    doctorOid: Joi.string().uuid().optional().example('doctor-uuid-123'),
    status: Joi.string().valid('Scheduled', 'Completed', 'Cancelled').optional().example('Scheduled')
});

const createDto = Joi.object({
    patientOid: Joi.string().uuid().required().example('patient-uuid-123'),
    doctorOid: Joi.string().uuid().required().example('doctor-uuid-123'),
    departmentOid: Joi.string().uuid().optional().example('dept-uuid-123'),
    appointmentDate: Joi.date().required().example('2025-12-05T09:00:00Z'),
    status: Joi.string().valid('Scheduled', 'Completed', 'Cancelled').default('Scheduled')
});

const updateDto = Joi.object({
    doctorOid: Joi.string().uuid().example('doctor-uuid-456'),
    departmentOid: Joi.string().uuid().example('dept-uuid-456'),
    appointmentDate: Joi.date().example('2025-12-06T10:00:00Z'),
    status: Joi.string().valid('Scheduled', 'Completed', 'Cancelled').example('Completed')
});

const filterAppointmentDto = Joi.object({
    headers: authSchema,
    query,
    body: filterDto
});

const getAppointmentDto = Joi.object({
    headers: authSchema,
    params
});

const deleteAppointmentDto = Joi.object({
    headers: authSchema,
    params
});

const updateAppointmentDto = Joi.object({
    headers: authSchema,
    params,
    body: updateDto
});

const createAppointmentDto = Joi.object({
    headers: authSchema,
    body: createDto
});

const appointmentResponseDto = Joi.object({
    oid: Joi.string().required(),
    patientOid: Joi.string().uuid().required().example('patient-uuid-123'),
    doctorOid: Joi.string().uuid().required().example('doctor-uuid-123'),
    departmentOid: Joi.string().uuid().optional().example('dept-uuid-123'),
    appointmentDate: Joi.date().required().example('2025-12-05T09:00:00Z'),
    status: Joi.string().valid('Scheduled', 'Completed', 'Cancelled').default('Scheduled'),
    createdBy: Joi.string().required(),
    updatedAt: Joi.date().iso().required(),
});

module.exports = {
    createAppointmentDto,
    updateAppointmentDto,
    deleteAppointmentDto,
    filterAppointmentDto,
    getAppointmentDto,
    appointmentResponseDto,
    createDto, updateDto, filterDto, params
};
