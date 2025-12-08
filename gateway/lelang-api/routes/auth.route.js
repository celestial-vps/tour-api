const express = require("express");
const authController = require("../controllers/auth.controller");
const { validateRequest } = require("../misc/validation");
const j2s = require("joi-to-swagger");

// DTOs
const {
  loginAuthDto,
  registerAuthDto,
  loginDto,
  registerDto,
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

/**
 * @swagger
 * tags:
 *   - name: Auth
 *     description: Auth management operations
 */

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: User login
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/AuthLoginPayloadDto"
 *     responses:
 *       200:
 *         description: Successful login
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/AuthSuccessResponse"
 *       400:
 *         description: Bad Request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 */
router.post(
  "/login",
  validateRequest(loginAuthDto),
  authController.login
);

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/AuthRegisterPayloadDto"
 *     responses:
 *       200:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/AuthSuccessResponse"
 *       400:
 *         description: Bad Request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 */
router.post(
  "/register",
  validateRequest(registerAuthDto),
  authController.register
);

module.exports = router;
