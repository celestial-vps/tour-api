const express = require("express");
const { roleGuard } = require("../middleware/role-guard");
const { validateRequest } = require("../misc/validation");
const specializationController = require("../controllers/specialization.controller");
const j2s = require("joi-to-swagger");
const Joi = require("joi");

// Payload DTO
const {
  createSpecializationDto,
  updateSpecializationDto,
  deleteSpecializationDto,
  getSpecializationDto, filterSpecializationDto, specializationResponseDto, createDto, updateDto, filterDto, params
} = require("../dtos/payload-specialization-dto");
 
// Response DTO
const { successResponse, errorResponse } = require("../dtos/response-dto");

// Message DTO
const { messageDto } = require("../dtos/message-dto");

// ---- Convert Joi to Swagger ----
const { swagger: CreateSpecializationPayloadSchema } = j2s(createDto);
const { swagger: UpdateSpecializationPayloadSchema } = j2s(updateDto);
const { swagger: DeleteSpecializationPayloadSchema } = j2s(params);
const { swagger: FilterSpecializationPayloadSchema } = j2s(filterDto);
const { swagger: SpecializationSuccessSchema } = j2s(successResponse(specializationResponseDto));
const { swagger: SpecializationListSuccessSchema } = j2s(
  successResponse(Joi.array().items(specializationResponseDto))
);


// Response Schema (success + error)

const { swagger: SpecializationSuccessCRUDSchema } = j2s(successResponse(messageDto));
const { swagger: ErrorSchema } = j2s(errorResponse);

// ---- Register to components (global) ----
global.swaggerComponents ??= {};
global.swaggerComponents.CreateSpecializationPayloadDto = CreateSpecializationPayloadSchema;
global.swaggerComponents.FilterSpecializationPayloadDto = FilterSpecializationPayloadSchema;
global.swaggerComponents.UpdateSpecializationPayloadDto = UpdateSpecializationPayloadSchema;
global.swaggerComponents.DeleteSpecializationPayloadDto = DeleteSpecializationPayloadSchema;
global.swaggerComponents.SpecializationListSuccessResponse = SpecializationListSuccessSchema;
global.swaggerComponents.SpecializationSuccessResponse = SpecializationSuccessSchema;
global.swaggerComponents.SpecializationSuccessCRUDResponse = SpecializationSuccessCRUDSchema;
global.swaggerComponents.ErrorResponse = ErrorSchema;

const router = express.Router();

/**
 * @openapi
 * /specialization/create:
 *   post:
 *     tags:
 *       - Specialization
 *     summary: Create Specialization
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/CreateSpecializationPayloadDto"
 *     responses:
 *       201:
 *         description: Created Successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/SpecializationSuccessCRUDResponse"
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
  validateRequest(createSpecializationDto),
  roleGuard("Admin"),
  specializationController.create
);


/**
 * @openapi
 * /specialization/{oid}:
 *   put:
 *     tags: [Specialization]
 *     summary: Update Specialization
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
 *             $ref: "#/components/schemas/UpdateSpecializationPayloadDto"
 *     responses:
 *       200:
 *         description: Specialization Updated Successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/SpecializationSuccessCRUDResponse"
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
  validateRequest(updateSpecializationDto),
  roleGuard("Admin"),
  specializationController.update
);

/**
 * @openapi
 * /specialization/delete/{oid}:
 *   delete:
 *     tags: [Specialization]
 *     summary: Delete Specialization
 *     parameters:
 *       - name: oid
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Specialization Deleted Successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/SpecializationSuccessCRUDResponse"
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
  validateRequest(deleteSpecializationDto),
  roleGuard("Admin"),
  specializationController.remove
);

/**
 * @openapi
 * /specialization:
 *   get:
 *     tags: [Specialization]
 *     summary: Get All Specializations
 *     responses:
 *       200:
 *         description: List of Specializations
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/SpecializationListSuccessResponse"
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
  validateRequest(filterSpecializationDto),
  roleGuard("Admin"),
  specializationController.findAll
);

/**
 * @openapi
 * /specialization/q:
 *   post:
 *     tags: [Specialization]
 *     summary: Paginated Specializations
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/FilterSpecializationPayloadDto"
 *     responses:
 *       200:
 *         description: Paginated Specializations List
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/SpecializationListSuccessResponse"
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
  validateRequest(filterSpecializationDto),
  roleGuard("Admin"),
  specializationController.find
);

/**
 * @openapi
 * /specialization/{oid}:
 *   get:
 *     tags: [Specialization]
 *     summary: Get Specialization By ID
 *     parameters:
 *       - name: oid
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Specialization Detail
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/SpecializationSuccessResponse"
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
  validateRequest(getSpecializationDto),
  roleGuard("Admin"),
  specializationController.findById
);


module.exports = router;
