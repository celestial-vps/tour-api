const express = require("express");
const { roleGuard } = require("../middleware/role-guard");
const { validateRequest } = require("../misc/validation");
const userController = require("../controllers/user.controller");
const j2s = require("joi-to-swagger");
const Joi = require("joi");

// Payload DTO
const {
  createUserDto,
  updateUserDto,
  deleteUserDto,
  getUserDto, filterUserDto, userResponseDto, createDto, updateDto, filterDto, params
} = require("../dtos/payload-user-dto");
 
// Response DTO
const { successResponse, errorResponse } = require("../dtos/response-dto");

// Message DTO
const { messageDto } = require("../dtos/message-dto");

// ---- Convert Joi to Swagger ----
const { swagger: CreateUserPayloadSchema } = j2s(createDto);
const { swagger: UpdateUserPayloadSchema } = j2s(updateDto);
const { swagger: DeleteUserPayloadSchema } = j2s(params);
const { swagger: FilterUserPayloadSchema } = j2s(filterDto);
const { swagger: UserSuccessSchema } = j2s(successResponse(userResponseDto));
const { swagger: UserListSuccessSchema } = j2s(
  successResponse(Joi.array().items(userResponseDto))
);


// Response Schema (success + error)

const { swagger: UserSuccessCRUDSchema } = j2s(successResponse(messageDto));
const { swagger: ErrorSchema } = j2s(errorResponse);

// ---- Register to components (global) ----
global.swaggerComponents ??= {};
global.swaggerComponents.CreateUserPayloadDto = CreateUserPayloadSchema;
global.swaggerComponents.FilterUserPayloadDto = FilterUserPayloadSchema;
global.swaggerComponents.UpdateUserPayloadDto = UpdateUserPayloadSchema;
global.swaggerComponents.DeleteUserPayloadDto = DeleteUserPayloadSchema;
global.swaggerComponents.UserListSuccessResponse = UserListSuccessSchema;
global.swaggerComponents.UserSuccessResponse = UserSuccessSchema;
global.swaggerComponents.UserSuccessCRUDResponse = UserSuccessCRUDSchema;
global.swaggerComponents.ErrorResponse = ErrorSchema;

const router = express.Router();

/**
 * @openapi
 * /user/create:
 *   post:
 *     tags:
 *       - User
 *     summary: Create User
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/CreateUserPayloadDto"
 *     responses:
 *       201:
 *         description: Created Successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/UserSuccessCRUDResponse"
 *       400:
 *         description: Bad Request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 */
router.post(
  "/create",
  validateRequest(createUserDto),
  roleGuard("Admin"),
  userController.create
);


/**
 * @openapi
 * /user/{oid}:
 *   put:
 *     tags: [User]
 *     summary: Update User
 *     parameters:
 *       - name: oid
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/UpdateUserPayloadDto"
 *     responses:
 *       200:
 *         description: User Updated Successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/UserSuccessCRUDResponse"
 *       400:
 *         description: Bad Request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 */
router.put(
  "/:oid",
  validateRequest(updateUserDto),
  roleGuard("Admin"),
  userController.update
);

/**
 * @openapi
 * /user/delete/{oid}:
 *   delete:
 *     tags: [User]
 *     summary: Delete User
 *     parameters:
 *       - name: oid
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User Deleted Successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/UserSuccessCRUDResponse"
 *       400:
 *         description: Bad Request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 */
router.delete(
  "/delete/:oid",
  validateRequest(deleteUserDto),
  roleGuard("Admin"),
  userController.remove
);

/**
 * @openapi
 * /user:
 *   get:
 *     tags: [User]
 *     summary: Get All Users
 *     responses:
 *       200:
 *         description: List of Users
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/UserListSuccessResponse"
 *       400:
 *         description: Bad Request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 */
router.get(
  "/",
  validateRequest(filterUserDto),
  roleGuard("Admin"),
  userController.findAll
);

/**
 * @openapi
 * /user/q:
 *   post:
 *     tags: [User]
 *     summary: Paginated Users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/FilterUserPayloadDto"
 *     responses:
 *       200:
 *         description: Paginated Users List
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/UserListSuccessResponse"
 *       400:
 *         description: Bad Request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 */
router.post(
  "/q",
  validateRequest(filterUserDto),
  roleGuard("Admin"),
  userController.find
);

/**
 * @openapi
 * /user/{oid}:
 *   get:
 *     tags: [User]
 *     summary: Get User By ID
 *     parameters:
 *       - name: oid
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User Detail
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/UserSuccessResponse"
 *       400:
 *         description: Bad Request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 */
router.get(
  "/:oid",
  validateRequest(getUserDto),
  roleGuard("Admin"),
  userController.findById
);


module.exports = router;
