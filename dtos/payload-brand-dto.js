const Joi = require('joi');

const filterBrandDto = Joi.object({
    bankName: Joi.string().optional().allow(null, '')
});

const pageBrandDto = Joi.object({    
    bankName: Joi.string().optional().allow(null, '')
});

const createBrandDto = Joi.object({    
    bankName: Joi.string().required(),    
});

const updateBrandDto = Joi.object({
    bankName: Joi.string().required(),    
});

const params = Joi.object({
    oid: Joi.string().uuid().required()
});

const querySchema = Joi.object({
    pageIndex: Joi.number().integer().min(1).required(),
    pageSize: Joi.number().integer().min(1).max(100).required(),
});

module.exports = {
    filterBrandDto,
    pageBrandDto,
    createBrandDto,
    updateBrandDto,
    querySchema,
    params
};
