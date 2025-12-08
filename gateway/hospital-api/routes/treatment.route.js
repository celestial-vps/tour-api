const express = require("express");
const { roleGuard } = require("../middleware/role-guard");
const { validateRequest } = require("../misc/validation");
const treatmentController = require("../controllers/treatment.controller");
const j2s = require("joi-to-swagger");
const Joi = require("joi");

// Payload DTO
const {
  createTreatmentDto,
  updateTreatmentDto,
  deleteTreatmentDto,
  getTreatmentDto, filterTreatmentDto, treatmentResponseDto, createDto, updateDto, filterDto, params
} = require("../dtos/payload-treatment-dto");
 
// Response DTO
const { successResponse, errorResponse } = require("../dtos/response-dto");

// Message DTO
const { messageDto } = require("../dtos/message-dto");

// ---- Convert Joi to Swagger ----
const { swagger: CreateTreatmentPayloadSchema } = j2s(createDto);
const { swagger: UpdateTreatmentPayloadSchema } = j2s(updateDto);
const { swagger: DeleteTreatmentPayloadSchema } = j2s(params);
const { swagger: FilterTreatmentPayloadSchema } = j2s(filterDto);
const { swagger: TreatmentSuccessSchema } = j2s(successResponse(treatmentResponseDto));
const { swagger: TreatmentListSuccessSchema } = j2s(
  successResponse(Joi.array().items(treatmentResponseDto))
);


// Response Schema (success + error)

const { swagger: TreatmentSuccessCRUDSchema } = j2s(successResponse(messageDto));
const { swagger: ErrorSchema } = j2s(errorResponse);

// ---- Register to components (global) ----
global.swaggerComponents ??= {};
global.swaggerComponents.CreateTreatmentPayloadDto = CreateTreatmentPayloadSchema;
global.swaggerComponents.FilterTreatmentPayloadDto = FilterTreatmentPayloadSchema;
global.swaggerComponents.UpdateTreatmentPayloadDto = UpdateTreatmentPayloadSchema;
global.swaggerComponents.DeleteTreatmentPayloadDto = DeleteTreatmentPayloadSchema;
global.swaggerComponents.TreatmentListSuccessResponse = TreatmentListSuccessSchema;
global.swaggerComponents.TreatmentSuccessResponse = TreatmentSuccessSchema;
global.swaggerComponents.TreatmentSuccessCRUDResponse = TreatmentSuccessCRUDSchema;
global.swaggerComponents.ErrorResponse = ErrorSchema;

const router = express.Router();

/**
 * @openapi
 * /treatment/create:
 *   post:
 *     tags:
 *       - Treatment
 *     summary: Create Treatment
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/CreateTreatmentPayloadDto"
 *     responses:
 *       201:
 *         description: Created Successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/TreatmentSuccessCRUDResponse"
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
  validateRequest(createTreatmentDto),
  roleGuard("Admin"),
  treatmentController.create
);


/**
 * @openapi
 * /treatment/{oid}:
 *   put:
 *     tags: [Treatment]
 *     summary: Update Treatment
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
 *             $ref: "#/components/schemas/UpdateTreatmentPayloadDto"
 *     responses:
 *       200:
 *         description: Treatment Updated Successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/TreatmentSuccessCRUDResponse"
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
  validateRequest(updateTreatmentDto),
  roleGuard("Admin"),
  treatmentController.update
);

/**
 * @openapi
 * /treatment/delete/{oid}:
 *   delete:
 *     tags: [Treatment]
 *     summary: Delete Treatment
 *     parameters:
 *       - name: oid
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Treatment Deleted Successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/TreatmentSuccessCRUDResponse"
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
  validateRequest(deleteTreatmentDto),
  roleGuard("Admin"),
  treatmentController.remove
);

/**
 * @openapi
 * /treatment:
 *   get:
 *     tags: [Treatment]
 *     summary: Get All Treatments
 *     responses:
 *       200:
 *         description: List of Treatments
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/TreatmentListSuccessResponse"
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
  validateRequest(filterTreatmentDto),
  roleGuard("Admin"),
  treatmentController.findAll
);

/**
 * @openapi
 * /treatment/q:
 *   post:
 *     tags: [Treatment]
 *     summary: Paginated Treatments
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/FilterTreatmentPayloadDto"
 *     responses:
 *       200:
 *         description: Paginated Treatments List
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/TreatmentListSuccessResponse"
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
  validateRequest(filterTreatmentDto),
  roleGuard("Admin"),
  treatmentController.find
);

/**
 * @openapi
 * /treatment/{oid}:
 *   get:
 *     tags: [Treatment]
 *     summary: Get Treatment By ID
 *     parameters:
 *       - name: oid
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Treatment Detail
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/TreatmentSuccessResponse"
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
  validateRequest(getTreatmentDto),
  roleGuard("Admin"),
  treatmentController.findById
);


module.exports = router;
