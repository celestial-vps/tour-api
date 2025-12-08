const Joi = require('joi');
const { authSchema } = require('./base-dto');

const params = Joi.object({
    oid: Joi.string().uuid().required().example('room-uuid-123')
});

const query = Joi.object({
    pageIndex: Joi.number().integer().min(1).default(1),
    pageSize: Joi.number().integer().min(1).max(100).default(10)
});

const filterDto = Joi.object({
    name: Joi.string().optional().allow(null, '').example('Room 101'),
    departmentOid: Joi.string().uuid().optional().example('department-uuid-123')
});

const createDto = Joi.object({
    name: Joi.string().required().example('Room 101'),
    departmentOid: Joi.string().uuid().optional().example('department-uuid-123'),
    type: Joi.string().valid('General', 'ICU', 'Surgery', 'Maternity', 'Other').default('General'),
});

const updateDto = Joi.object({
    name: Joi.string().example('Room 102'),
    departmentOid: Joi.string().uuid().example('department-uuid-456'),
    type: Joi.string().valid('General', 'ICU', 'Surgery', 'Maternity', 'Other').example('ICU'),
});

const filterRoomDto = Joi.object({
    headers: authSchema,
    query,
    body: filterDto
});

const getRoomDto = Joi.object({
    headers: authSchema,
    params
});

const deleteRoomDto = Joi.object({
    headers: authSchema,
    params
});

const updateRoomDto = Joi.object({
    headers: authSchema,
    params,
    body: updateDto
});

const createRoomDto = Joi.object({
    headers: authSchema,
    body: createDto
});

const roomResponseDto = Joi.object({
    oid: Joi.string().required(),
    name: Joi.string().required().example('Room 101'),
    departmentOid: Joi.string().uuid().optional().example('department-uuid-123'),
    type: Joi.string().valid('General', 'ICU', 'Surgery', 'Maternity', 'Other').default('General'),
    createdBy: Joi.string().required(),
    updatedAt: Joi.date().iso().required(),
});


module.exports = {
    createRoomDto,
    updateRoomDto,
    deleteRoomDto,
    filterRoomDto,
    getRoomDto,
    roomResponseDto,
    createDto, updateDto, filterDto, params
};
