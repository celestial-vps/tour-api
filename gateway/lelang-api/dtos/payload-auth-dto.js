const Joi = require("joi");
const { authSchema } = require("./base-dto");

// -------------------- BODY SCHEMAS -------------------- //

// Register DTO
const registerDto = Joi.object({
  email: Joi.string().email().required().example("weslyaioria@gmail.com"),
  password: Joi.string().min(6).required().example("serverh5n"),
  roleOid: Joi.string().optional().example("123"),
  androidToken: Joi.string().optional().example("123"),
  iosToken: Joi.string().optional().example("123"),
  webToken: Joi.string().optional().example("123"),
  desktopToken: Joi.string().optional().example("123")
});

// Login DTO
const loginDto = Joi.object({
  email: Joi.string().email().required().example("weslyaioria@gmail.com"),
  password: Joi.string().required().example("serverh5n"),
  androidToken: Joi.string().optional().example("123"),
  iosToken: Joi.string().optional().example("123"),
  webToken: Joi.string().optional().example("123"),
  desktopToken: Joi.string().optional().example("123")
});

// -------------------- COMPLETE DTO WRAPPER -------------------- //

const registerAuthDto = Joi.object({
  body: registerDto
});

const loginAuthDto = Joi.object({
  body: loginDto
});

// -------------------- RESPONSE DTO -------------------- //

const authResponseDto = Joi.object({
  oid: Joi.string().uuid().example("80366f9e-8600-4e37-867f-2e687f5ed14a"),
  name: Joi.string().example("John Doe"),
  email: Joi.string().email().example("user@example.com"),
  token: Joi.string().example("eyJhbGciOi..."),
  refreshToken: Joi.string().example("eyJhbGciOi..."),
  isActive: Joi.boolean().example(true),
  createdAt: Joi.date().iso(),
  updatedAt: Joi.date().iso()
});

module.exports = {
  // Full DTO
  loginAuthDto,
  registerAuthDto,

  // Base body schemas
  loginDto,
  registerDto,

  // Response
  authResponseDto
};
