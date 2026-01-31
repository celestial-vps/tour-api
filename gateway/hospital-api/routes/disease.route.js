const express = require("express");
const { roleGuard } = require("../middleware/role-guard");
const { validateRequest } = require("../misc/validation");
const diseaseController = require("../controllers/disease.controller");
const j2s = require("joi-to-swagger");
const Joi = require("joi");

// Payload DTO
const {
  createDiseaseDto,
  updateDiseaseDto,
  deleteDiseaseDto,
  getDiseaseDto, filterDiseaseDto, diseaseResponseDto, createDto, updateDto, filterDto, params
} = require("../dtos/payload-disease-dto");
 
// Response DTO
const { successResponse, errorResponse } = require("../dtos/response-dto");

// Message DTO
const { messageDto } = require("../dtos/message-dto");

// ---- Convert Joi to Swagger ----
const { swagger: CreateDiseasePayloadSchema } = j2s(createDto);
const { swagger: UpdateDiseasePayloadSchema } = j2s(updateDto);
const { swagger: DeleteDiseasePayloadSchema } = j2s(params);
const { swagger: FilterDiseasePayloadSchema } = j2s(filterDto);
const { swagger: DiseaseSuccessSchema } = j2s(successResponse(diseaseResponseDto));
const { swagger: DiseaseListSuccessSchema } = j2s(
  successResponse(Joi.array().items(diseaseResponseDto))
);


// Response Schema (success + error)

const { swagger: DiseaseSuccessCRUDSchema } = j2s(successResponse(messageDto));
const { swagger: ErrorSchema } = j2s(errorResponse);

// ---- Register to components (global) ----
global.swaggerComponents ??= {};
global.swaggerComponents.CreateDiseasePayloadDto = CreateDiseasePayloadSchema;
global.swaggerComponents.FilterDiseasePayloadDto = FilterDiseasePayloadSchema;
global.swaggerComponents.UpdateDiseasePayloadDto = UpdateDiseasePayloadSchema;
global.swaggerComponents.DeleteDiseasePayloadDto = DeleteDiseasePayloadSchema;
global.swaggerComponents.DiseaseListSuccessResponse = DiseaseListSuccessSchema;
global.swaggerComponents.DiseaseSuccessResponse = DiseaseSuccessSchema;
global.swaggerComponents.DiseaseSuccessCRUDResponse = DiseaseSuccessCRUDSchema;
global.swaggerComponents.ErrorResponse = ErrorSchema;

const router = express.Router();

/**
 * @openapi
 * /disease/create:
 *   post:
 *     tags:
 *       - Disease
 *     summary: Create Disease
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/CreateDiseasePayloadDto"
 *     responses:
 *       201:
 *         description: Created Successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/DiseaseSuccessCRUDResponse"
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
  validateRequest(createDiseaseDto),
  roleGuard("Admin"),
  diseaseController.create
);


/**
 * @openapi
 * /disease/{oid}:
 *   put:
 *     tags: [Disease]
 *     summary: Update Disease
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
 *             $ref: "#/components/schemas/UpdateDiseasePayloadDto"
 *     responses:
 *       200:
 *         description: Disease Updated Successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/DiseaseSuccessCRUDResponse"
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
  validateRequest(updateDiseaseDto),
  roleGuard("Admin"),
  diseaseController.update
);

/**
 * @openapi
 * /disease/delete/{oid}:
 *   delete:
 *     tags: [Disease]
 *     summary: Delete Disease
 *     parameters:
 *       - name: oid
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Disease Deleted Successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/DiseaseSuccessCRUDResponse"
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
  validateRequest(deleteDiseaseDto),
  roleGuard("Admin"),
  diseaseController.remove
);

/**
 * @openapi
 * /disease:
 *   get:
 *     tags: [Disease]
 *     summary: Get All Diseases
 *     responses:
 *       200:
 *         description: List of Diseases
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/DiseaseListSuccessResponse"
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
  validateRequest(filterDiseaseDto),
  roleGuard("Admin"),
  diseaseController.findAll
);

/**
 * @openapi
 * /disease/q:
 *   post:
 *     tags: [Disease]
 *     summary: Paginated Diseases
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/FilterDiseasePayloadDto"
 *     responses:
 *       200:
 *         description: Paginated Diseases List
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/DiseaseListSuccessResponse"
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
  validateRequest(filterDiseaseDto),
  roleGuard("Admin"),
  diseaseController.find
);

/**
 * @openapi
 * /disease/{oid}:
 *   get:
 *     tags: [Disease]
 *     summary: Get Disease By ID
 *     parameters:
 *       - name: oid
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Disease Detail
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/DiseaseSuccessResponse"
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
  validateRequest(getDiseaseDto),
  roleGuard("Admin"),
  diseaseController.findById
);


module.exports = router;
