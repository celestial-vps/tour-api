const Joi = require('joi');
const { authSchema } = require('./base-dto');

// Params
const params = Joi.object({
    oid: Joi.string().uuid().required().example('123e4567-e89b-12d3-a456-426614174000')
});

// Query for pagination
const query = Joi.object({
    pageIndex: Joi.number().integer().min(1).required().default(1).example(1),
    pageSize: Joi.number().integer().min(1).max(100).required().default(10).example(10),
});

// Filter DTO (Body)
const filterDto = Joi.object({
    email: Joi.string().optional().allow(null, '').example('user@example.com'),
});

// Page DTO (Body)
const pageUserDto = Joi.object({
    email: Joi.string().optional().allow(null, '').example('user@example.com'),
});

// Register DTO (Body)
const registerDto = Joi.object({
    email: Joi.string().email().required().example('newuser@example.com'),
    password: Joi.string().min(6).required().example('password123'),
});

// Login DTO (Body)
const loginDto = Joi.object({
    email: Joi.string().email().required().example('login@example.com'),
    password: Joi.string().min(6).required().example('password123'),
});

// CreateUserDto
const createDto = Joi.object({
    email: Joi.string().email().required().example('user@example.com'),
    password: Joi.string().min(6).required().example('securePass123'),
    androidToken: Joi.string().optional().example('ANDROID_TOKEN_123'),
    roleOid: Joi.string().required().example('f47ac10b-58cc-4372-a567-0e02b2c3d479'),
});

// UpdateUserDto
const updateDto = Joi.object({
    email: Joi.string().email().required().example('updated@example.com'),
    password: Joi.string().min(6).required().example('newPassword123'),
    androidToken: Joi.string().optional().example('UPDATED_ANDROID_TOKEN'),
    roleOid: Joi.string().required().example('d290f1ee-6c54-4b01-90e6-d701748f0851'),
});


// ----- COMPLETE DTO ----- //

// Filter User
const filterUserDto = Joi.object({
    headers: authSchema,
    query,
    body: filterDto
});

// Get User by ID
const getUserDto = Joi.object({
    headers: authSchema,
    params
});

// Delete User
const deleteUserDto = Joi.object({
    headers: authSchema,
    params
});

// Update User
const updateUserDto = Joi.object({
    headers: authSchema,
    params,
    body: updateDto
});

// Create User
const createUserDto = Joi.object({
    headers: authSchema,
    body: createDto
});

// Response DTO
const userResponseDto = Joi.object({
    oid: Joi.string().required().example('550e8400-e29b-41d4-a716-446655440000'),
    email: Joi.string().email().required().example('user@example.com'),
    androidToken: Joi.string().allow(null).example('ANDROID_TOKEN'),
    roleOid: Joi.string().required().example('f47ac10b-58cc-4372-a567-0e02b2c3d479'),
    createdAt: Joi.date().iso().required(),
    updatedAt: Joi.date().iso().required(),
});

module.exports = {
    // Complete DTO
    filterUserDto,
    getUserDto,
    deleteUserDto,
    updateUserDto,
    createUserDto,

    // Base schemas
    registerDto,
    loginDto,
    filterDto,
    pageUserDto,
    createDto,
    updateDto,
    params,
    query,

    // Response
    userResponseDto
};
