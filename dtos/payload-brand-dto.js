const Joi = require('joi');
const { authSchema } = require('./base-dto');

// Schema untuk membuat brand
const createBrandDto = Joi.object({
    brandName: Joi.string().required(),
});

// Schema untuk memperbarui brand
const updateBrandDto = Joi.object({
    brandName: Joi.string().required(),
});

// Parameter (misalnya untuk mengambil, menghapus brand berdasarkan oid)
const params = Joi.object({
    oid: Joi.string().uuid().required()
});

// Query untuk pagination
const query = Joi.object({
    pageIndex: Joi.number().integer().min(1).required(),
    pageSize: Joi.number().integer().min(1).max(100).required(),
});

// Filter DTO (misalnya untuk pencarian dan sort)
const filterDto = Joi.object({
    brandName: Joi.string().optional().allow(null, ''),
    fieldName: Joi.string().optional().allow(null, ''),
    sortOrder: Joi.number().integer().valid(-1, 0, 1).optional().allow(null, 0)
});

// --- DTO untuk setiap endpoint ---

// DTO untuk membuat brand
const createBrandRequestDto = Joi.object({
    headers: authSchema,
    body: createBrandDto
});

// DTO untuk memperbarui brand
const updateBrandRequestDto = Joi.object({
    headers: authSchema,
    params: params,
    body: updateBrandDto
});

// DTO untuk menghapus brand
const deleteBrandDto = Joi.object({
    headers: authSchema,
    params: params
});

// DTO untuk mendapatkan brand by oid
const getBrandDto = Joi.object({
    headers: authSchema,
    params: params
});

// DTO untuk filter + pagination
const filterBrandDto = Joi.object({
    headers: authSchema,
    query: query,
    body: filterDto
});

module.exports = {
    createBrandRequestDto,
    updateBrandRequestDto,
    deleteBrandDto,
    getBrandDto,
    filterBrandDto
};
