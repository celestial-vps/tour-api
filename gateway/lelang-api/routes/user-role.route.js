const express = require("express");
const { roleGuard } = require("../middleware/role-guard");
const { validateRequest } = require("../misc/validation");
const userRoleController = require("../controllers/user-role.controller");
const j2s = require("joi-to-swagger");
const Joi = require("joi");

// Payload DTO
const {
  createUserRoleDto,
  updateUserRoleDto,
  deleteUserRoleDto,
  getUserRoleDto, filterUserRoleDto,filterUserQueryDto, userRoleResponseDto, createDto, updateDto, filterDto, params
} = require("../dtos/payload-user-role-dto");
 
// Response DTO
const { successResponse, errorResponse } = require("../dtos/response-dto");

// Message DTO
const { messageDto } = require("../dtos/message-dto");

// ---- Convert Joi to Swagger ----
const { swagger: CreateUserRolePayloadSchema } = j2s(createDto);
const { swagger: UpdateUserRolePayloadSchema } = j2s(updateDto);
const { swagger: DeleteUserRolePayloadSchema } = j2s(params);
const { swagger: FilterUserRolePayloadSchema } = j2s(filterDto);
const { swagger: UserRoleSuccessSchema } = j2s(successResponse(userRoleResponseDto));
const { swagger: UserRoleListSuccessSchema } = j2s(
  successResponse(Joi.array().items(userRoleResponseDto))
);


// Response Schema (success + error)

const { swagger: UserRoleSuccessCRUDSchema } = j2s(successResponse(messageDto));
const { swagger: ErrorSchema } = j2s(errorResponse);

// ---- Register to components (global) ----
global.swaggerComponents ??= {};
global.swaggerComponents.CreateUserRolePayloadDto = CreateUserRolePayloadSchema;
global.swaggerComponents.FilterUserRolePayloadDto = FilterUserRolePayloadSchema;
global.swaggerComponents.UpdateUserRolePayloadDto = UpdateUserRolePayloadSchema;
global.swaggerComponents.DeleteUserRolePayloadDto = DeleteUserRolePayloadSchema;
global.swaggerComponents.UserRoleListSuccessResponse = UserRoleListSuccessSchema;
global.swaggerComponents.UserRoleSuccessResponse = UserRoleSuccessSchema;
global.swaggerComponents.UserRoleSuccessCRUDResponse = UserRoleSuccessCRUDSchema;
global.swaggerComponents.ErrorResponse = ErrorSchema;

const router = express.Router();

/**
 * @openapi
 * /user-role/create:
 *   post:
 *     tags:
 *       - User Role
 *     summary: Create User Role
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/CreateUserRolePayloadDto"
 *     responses:
 *       201:
 *         description: Created Successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/UserRoleSuccessCRUDResponse"
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
  validateRequest(createUserRoleDto),
  roleGuard("Admin"),
  userRoleController.create
);


/**
 * @openapi
 * /user-role/{oid}:
 *   put:
 *     tags: [User Role]
 *     summary: Update User Role
 *     security:
 *       - BearerAuth: []
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
 *             $ref: "#/components/schemas/UpdateUserRolePayloadDto"
 *     responses:
 *       200:
 *         description: UserRole Updated Successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/UserRoleSuccessCRUDResponse"
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
  validateRequest(updateUserRoleDto),
  roleGuard("Admin"),
  userRoleController.update
);

/**
 * @openapi
 * /user-role/delete/{oid}:
 *   delete:
 *     tags: [User Role]
 *     summary: Delete User Role
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: oid
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: UserRole Deleted Successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/UserRoleSuccessCRUDResponse"
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
  validateRequest(deleteUserRoleDto),
  roleGuard("Admin"),
  userRoleController.remove
);

/**
 * @openapi
 * /user-role:
 *   get:
 *     tags: [User Role]
 *     summary: Get All User Roles
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *           enum: [search]
 *           default: gitar
 *         required: false
 *     responses:
 *       200:
 *         description: List of UserRoles
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/UserRoleListSuccessResponse"
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
  validateRequest(filterUserQueryDto),
  roleGuard("Admin"),
  userRoleController.findAll
);



/**
 * @openapi
 * /user-role//no-auth:
 *   get:
 *     tags: [User Role]
 *     summary: Get All User Roles No Auth
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *           enum: [search]
 *           default: gitar
 *         required: false
 *     responses:
 *       200:
 *         description: List of UserRoles
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/UserRoleListSuccessResponse"
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
  "/no-auth", 
  userRoleController.findAll
);

/**
 * @openapi
 * /user-role/q:
 *   post:
 *     tags: [User Role]
 *     summary: Paginated User Roles
 *     security:
 *       - BearerAuth: []
*     parameters:
 *       - in: query
 *         name: pageIndex
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         required: true
 *       - in: query
 *         name: pageSize
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         required: true
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [categoryName]
 *           default: categoryName
 *         required: false
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: asc
 *         required: false
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/FilterUserRolePayloadDto"
 *     responses:
 *       200:
 *         description: Paginated UserRoles List
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/UserRoleListSuccessResponse"
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
  validateRequest(filterUserRoleDto),
  roleGuard("Admin"),
  userRoleController.find
);

/**
 * @openapi
 * /user-role/{oid}:
 *   get:
 *     tags: [User Role]
 *     summary: Get User Role By ID
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: oid
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: UserRole Detail
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/UserRoleSuccessResponse"
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
  validateRequest(getUserRoleDto),
  roleGuard("Admin"),
  userRoleController.findById
);


module.exports = router;
