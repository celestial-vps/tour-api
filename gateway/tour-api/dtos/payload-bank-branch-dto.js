const Joi = require('joi');
const { authSchema } = require('./base-dto');

// DTO schema for BankBranch creation
const createBankBranchDto = Joi.object({
    bankOid: Joi.string().uuid().required(),
    branchName: Joi.string().required(),
    bankAddress: Joi.string().required(),
});

// DTO schema for BankBranch update
const updateBankBranchDto = Joi.object({
    bankOid: Joi.string().uuid().required(),
    branchName: Joi.string().required(),
    bankAddress: Joi.string().required(),
});

// DTO schema for query parameters (pagination)
const query = Joi.object({
    pageIndex: Joi.number().integer().min(1).required(),
    pageSize: Joi.number().integer().min(1).max(100).required(),
});

// Filter DTO (optional search fields)
const filterDto = Joi.object({
    bankOid: Joi.string().uuid().optional().allow(null, ''),
    branchName: Joi.string().optional().allow(null, ''),
    bankAddress: Joi.string().optional().allow(null, ''),
    fieldName: Joi.string().optional().allow(null, ''),
    sortOrder: Joi.number().integer().valid(-1, 0, 1).optional().allow(null, 0)
});

// URL parameter schema (for endpoints that require oid)
const params = Joi.object({
    oid: Joi.string().uuid().required()
});

// Wrapper DTOs for API endpoints

const filterBankBranchDto = Joi.object({
    headers: authSchema,
    query: query,
    body: filterDto
});

const getBankBranchDto = Joi.object({
    headers: authSchema,
    params: params
});

const deleteBankBranchDto = Joi.object({
    headers: authSchema,
    params: params
});

const updateBankBranchRequestDto = Joi.object({
    headers: authSchema,
    params: params,
    body: updateBankBranchDto
});

const createBankBranchRequestDto = Joi.object({
    headers: authSchema,
    body: createBankBranchDto
});

module.exports = {
    createBankBranchRequestDto,
    updateBankBranchRequestDto,
    deleteBankBranchDto,
    filterBankBranchDto,
    getBankBranchDto,
};
