const express = require("express");
const authController = require("../controllers/auth.controller");
const { validateRequest } = require("../misc/validation");
const j2s = require("joi-to-swagger");

// DTOs
const {
  loginDto,
  registerDto,
  loginAuthDto,
  registerAuthDto,
  authResponseDto
} = require("../dtos/payload-auth-dto");

// Response DTO
const { successResponse, errorResponse } = require("../dtos/response-dto");

const router = express.Router();

// -------------------- Joi → Swagger Conversion -------------------- //
const { swagger: LoginPayloadSchema } = j2s(loginDto);
const { swagger: RegisterPayloadSchema } = j2s(registerDto);
const { swagger: AuthSuccessSchema } = j2s(successResponse(authResponseDto));
const { swagger: ErrorSchema } = j2s(errorResponse);

// Register Swagger components globally
global.swaggerComponents ??= {};
global.swaggerComponents.AuthLoginPayloadDto = LoginPayloadSchema;
global.swaggerComponents.AuthRegisterPayloadDto = RegisterPayloadSchema;
global.swaggerComponents.AuthSuccessResponse = AuthSuccessSchema;
global.swaggerComponents.ErrorResponse = ErrorSchema;

// -------------------- Routes -------------------- //
router.post("/login", validateRequest(loginAuthDto), authController.login);
router.post("/register", validateRequest(registerAuthDto), authController.register);

module.exports = router;
