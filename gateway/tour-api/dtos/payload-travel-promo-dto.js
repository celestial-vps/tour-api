const Joi = require('joi');
const { authSchema } = require('./base-dto');
 
const filterDto = Joi.object({
    search: Joi.string().optional().allow(null, ''),
    code: Joi.string().optional().allow(null, ''),
    discountType: Joi.string().optional().allow(null, ''),
    discountValue: Joi.string().optional().allow(null, ''),
    usageLimit: Joi.string().optional().allow(null, ''),
    usedCount: Joi.string().optional().allow(null, ''),
    validFrom: Joi.string().optional().allow(null, ''),
    validUntil: Joi.string().optional().allow(null, ''),
    isActive: Joi.string().optional().allow(null, ''),
    description: Joi.string().optional().allow(null, ''),
});
 
const createDto = Joi.object({
    code: Joi.string().required(),
    discountType: Joi.string().required(),
    discountValue: Joi.string().required(),
    usageLimit: Joi.string().required(),
    usedCount: Joi.string().required(),
    validFrom: Joi.string().required(),
    validUntil: Joi.string().required(),
    isActive: Joi.string().required(),
    description: Joi.string().required(),
});
 
const updateDto = Joi.object({
    code: Joi.string().required(),
    discountType: Joi.string().required(),
    discountValue: Joi.string().required(),
    usageLimit: Joi.string().required(),
    usedCount: Joi.string().required(),
    validFrom: Joi.string().required(),
    validUntil: Joi.string().required(),
    isActive: Joi.string().required(),
    description: Joi.string().required(),
});

const params = Joi.object({
    oid: Joi.string().uuid().required()
});

const query = Joi.object({
    pageIndex: Joi.number().integer().min(1).required(),
    pageSize: Joi.number().integer().min(1).max(100).required(),
    sortBy: Joi.string().valid('code', 'discountType', 'discountValue', 'usageLimit', 'usedCount', 'validFrom', 'validUntil', 'isActive', 'description').optional().default('discountType'),
    sortOrder: Joi.string().valid('asc', 'desc').insensitive().default('asc')
});

const filterTravelPromoDto = Joi.object({
    headers: authSchema,
    query,
    body: filterDto
});

const getTravelPromoDto = Joi.object({
    headers: authSchema,
    params: params,
});

const deleteTravelPromoDto = Joi.object({
    headers: authSchema,
    params: params,
});

const updateTravelPromoDto = Joi.object({
    headers: authSchema,
    params: params,
    body: updateDto
});

const createTravelPromoDto = Joi.object({
    headers: authSchema,
    body: createDto
});

module.exports = {
    createTravelPromoDto,
    updateTravelPromoDto,
    deleteTravelPromoDto,
    filterTravelPromoDto,
    getTravelPromoDto,
};
