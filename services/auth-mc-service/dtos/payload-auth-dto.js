const Joi = require("joi");

// -------------------- Request DTOs --------------------

// Login request
const loginAuthDto = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

// Register request
const registerAuthDto = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

// Payload for Swagger conversion
const loginDto = loginAuthDto;
const registerDto = registerAuthDto;

// -------------------- Response DTO --------------------

// Auth response data
const authResponseDto = Joi.object({
  id: Joi.string().required(),
  email: Joi.string().required(),
  name: Joi.string().optional(),
  accessToken: Joi.string().required(),
  refreshToken: Joi.string().required(),
  accessExpiresAt: Joi.date().required(),
  refreshExpiresAt: Joi.date().required(),
});

module.exports = {
  loginAuthDto,
  registerAuthDto,
  loginDto,
  registerDto,
  authResponseDto,
};
