const express = require("express");
const { roleGuard } = require("../middleware/role-guard");
const { validateRequest } = require("../misc/validation");
const diseasesController = require("../controllers/diseases.controller");
const j2s = require("joi-to-swagger");
const Joi = require("joi");

// Payload DTO
const {
  createDiseasesDto,
  updateDiseasesDto,
  deleteDiseasesDto,
  getDiseasesDto, filterDiseasesDto, diseasesResponseDto, createDto, updateDto, filterDto, params
} = require("../dtos/payload-diseases-dto");
 
// Response DTO
const { successResponse, errorResponse } = require("../dtos/response-dto");

// Message DTO
const { messageDto } = require("../dtos/message-dto");

// ---- Convert Joi to Swagger ----
const { swagger: CreateDiseasesPayloadSchema } = j2s(createDto);
const { swagger: UpdateDiseasesPayloadSchema } = j2s(updateDto);
const { swagger: DeleteDiseasesPayloadSchema } = j2s(params);
const { swagger: FilterDiseasesPayloadSchema } = j2s(filterDto);
const { swagger: DiseasesSuccessSchema } = j2s(successResponse(diseasesResponseDto));
const { swagger: DiseasesListSuccessSchema } = j2s(
  successResponse(Joi.array().items(diseasesResponseDto))
);


// Response Schema (success + error)

const { swagger: DiseasesSuccessCRUDSchema } = j2s(successResponse(messageDto));
const { swagger: ErrorSchema } = j2s(errorResponse);

// ---- Register to components (global) ----
global.swaggerComponents ??= {};
global.swaggerComponents.CreateDiseasesPayloadDto = CreateDiseasesPayloadSchema;
global.swaggerComponents.FilterDiseasesPayloadDto = FilterDiseasesPayloadSchema;
global.swaggerComponents.UpdateDiseasesPayloadDto = UpdateDiseasesPayloadSchema;
global.swaggerComponents.DeleteDiseasesPayloadDto = DeleteDiseasesPayloadSchema;
global.swaggerComponents.DiseasesListSuccessResponse = DiseasesListSuccessSchema;
global.swaggerComponents.DiseasesSuccessResponse = DiseasesSuccessSchema;
global.swaggerComponents.DiseasesSuccessCRUDResponse = DiseasesSuccessCRUDSchema;
global.swaggerComponents.ErrorResponse = ErrorSchema;

const router = express.Router();

/**
 * @openapi
 * /diseases/create:
 *   post:
 *     tags:
 *       - Diseases
 *     summary: Create Diseases
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/CreateDiseasesPayloadDto"
 *     responses:
 *       201:
 *         description: Created Successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/DiseasesSuccessCRUDResponse"
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
  validateRequest(createDiseasesDto),
  roleGuard("Admin"),
  diseasesController.create
);


/**
 * @openapi
 * /diseases/{oid}:
 *   put:
 *     tags: [Diseases]
 *     summary: Update Diseases
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
 *             $ref: "#/components/schemas/UpdateDiseasesPayloadDto"
 *     responses:
 *       200:
 *         description: Diseases Updated Successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/DiseasesSuccessCRUDResponse"
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
  validateRequest(updateDiseasesDto),
  roleGuard("Admin"),
  diseasesController.update
);

/**
 * @openapi
 * /diseases/delete/{oid}:
 *   delete:
 *     tags: [Diseases]
 *     summary: Delete Diseases
 *     parameters:
 *       - name: oid
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Diseases Deleted Successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/DiseasesSuccessCRUDResponse"
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
  validateRequest(deleteDiseasesDto),
  roleGuard("Admin"),
  diseasesController.remove
);

/**
 * @openapi
 * /diseases:
 *   get:
 *     tags: [Diseases]
 *     summary: Get All Diseasess
 *     responses:
 *       200:
 *         description: List of Diseasess
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/DiseasesListSuccessResponse"
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
  validateRequest(filterDiseasesDto),
  roleGuard("Admin"),
  diseasesController.findAll
);

/**
 * @openapi
 * /diseases/q:
 *   post:
 *     tags: [Diseases]
 *     summary: Paginated Diseasess
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/FilterDiseasesPayloadDto"
 *     responses:
 *       200:
 *         description: Paginated Diseasess List
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/DiseasesListSuccessResponse"
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
  validateRequest(filterDiseasesDto),
  roleGuard("Admin"),
  diseasesController.find
);

/**
 * @openapi
 * /diseases/{oid}:
 *   get:
 *     tags: [Diseases]
 *     summary: Get Diseases By ID
 *     parameters:
 *       - name: oid
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Diseases Detail
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/DiseasesSuccessResponse"
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
  validateRequest(getDiseasesDto),
  roleGuard("Admin"),
  diseasesController.findById
);


module.exports = router;
