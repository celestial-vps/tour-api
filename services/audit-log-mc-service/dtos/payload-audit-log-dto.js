const Joi = require('joi');
const { authSchema } = require('./base-dto'); 

// Define the schema for FilterAuditLogDto
const filterDto = Joi.object({
    search: Joi.string().optional().allow(null, ''),
    tableName: Joi.string().optional().allow(null, ''),
    recordOid: Joi.string().optional().allow(null, ''),
});

// Define the schema for CreateAuditLogDto
const createDto = Joi.object({
    tableName: Joi.string().required(),
    recordOid: Joi.string()
        .guid({ version: ['uuidv4'] })
        .allow(null)
        .optional(),
    action: Joi.string()
        .valid(
            'CREATE',
            'UPDATE',
            'DELETE',
            'READ',
            'LOGIN',
            'LOGOUT',
            'APPROVE',
            'REJECT',
            'IMPORT',
            'EXPORT'
        )
        .required(),
    status: Joi.string()
        .valid('SUCCESS', 'FAILED', 'ERROR')
        .default('SUCCESS'),
    message: Joi.string().required(),
    previousData: Joi.object().allow(null).optional(),
    newData: Joi.object().optional(),
    changedFields: Joi.array().items(Joi.string()).optional(),
    userOid: Joi.string()
        .guid({ version: ['uuidv4'] }) // validasi UUID v4
        .optional(),
    ipAddress: Joi.string()
        .ip({ version: ['ipv4', 'ipv6'], cidr: 'forbidden' })
        .optional(),
    userAgent: Joi.string().optional()
});

// Define the schema for UpdateAuditLogDto
const updateDto = Joi.object({
    tableName: Joi.string().required(),
    recordOid: Joi.string()
        .guid({ version: ['uuidv4'] })
        .allow(null)
        .optional(),
    action: Joi.string()
        .valid(
            'CREATE',
            'UPDATE',
            'DELETE',
            'READ',
            'LOGIN',
            'LOGOUT',
            'APPROVE',
            'REJECT',
            'IMPORT',
            'EXPORT'
        )
        .required(),
    status: Joi.string()
        .valid('SUCCESS', 'FAILED', 'ERROR')
        .default('SUCCESS'),
    message: Joi.string().required(),
    previousData: Joi.object().optional(), // bisa null / undefined
    newData: Joi.object().optional(),
    changedFields: Joi.array().items(Joi.string()).optional(),
    userOid: Joi.string()
        .guid({ version: ['uuidv4'] }) // validasi UUID v4
        .optional(),
    ipAddress: Joi.string()
        .ip({ version: ['ipv4', 'ipv6'], cidr: 'forbidden' })
        .optional(),
    userAgent: Joi.string().optional()
});

const params = Joi.object({
    oid: Joi.string().uuid().required()
});

const query = Joi.object({
    pageIndex: Joi.number().integer().min(1).required(),
    pageSize: Joi.number().integer().min(1).max(100).required(),
    sortBy: Joi.string().valid('tableName', 'recordOid', 'bankCurrency').optional().default('recordOid'),
    sortOrder: Joi.string().valid('asc', 'desc').insensitive().default('asc')
});

const filterAuditLogDto = Joi.object({
    headers: authSchema,
    query,
    body: filterDto
});

const getAuditLogDto = Joi.object({
    headers: authSchema,
    params: params,
});

const deleteAuditLogDto = Joi.object({
    headers: authSchema,
    params: params,
});

const updateAuditLogDto = Joi.object({
    headers: authSchema,
    params: params,
    body: updateDto
});

const createAuditLogDto = Joi.object({
    // headers: authSchema,
    body: createDto
});

module.exports = {
    createAuditLogDto,
    updateAuditLogDto,
    deleteAuditLogDto,
    filterAuditLogDto,
    getAuditLogDto,
};