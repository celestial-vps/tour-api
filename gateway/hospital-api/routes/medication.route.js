const express = require("express");
const { roleGuard } = require("../middleware/role-guard");
const { validateRequest } = require("../misc/validation");
const medicationController = require("../controllers/medication.controller");
const j2s = require("joi-to-swagger");
const Joi = require("joi");

// Payload DTO
const {
  createMedicationDto,
  updateMedicationDto,
  deleteMedicationDto,
  getMedicationDto, filterMedicationDto, medicationResponseDto, createDto, updateDto, filterDto, params
} = require("../dtos/payload-medication-dto");
 
// Response DTO
const { successResponse, errorResponse } = require("../dtos/response-dto");

// Message DTO
const { messageDto } = require("../dtos/message-dto");

// ---- Convert Joi to Swagger ----
const { swagger: CreateMedicationPayloadSchema } = j2s(createDto);
const { swagger: UpdateMedicationPayloadSchema } = j2s(updateDto);
const { swagger: DeleteMedicationPayloadSchema } = j2s(params);
const { swagger: FilterMedicationPayloadSchema } = j2s(filterDto);
const { swagger: MedicationSuccessSchema } = j2s(successResponse(medicationResponseDto));
const { swagger: MedicationListSuccessSchema } = j2s(
  successResponse(Joi.array().items(medicationResponseDto))
);


// Response Schema (success + error)

const { swagger: MedicationSuccessCRUDSchema } = j2s(successResponse(messageDto));
const { swagger: ErrorSchema } = j2s(errorResponse);

// ---- Register to components (global) ----
global.swaggerComponents ??= {};
global.swaggerComponents.CreateMedicationPayloadDto = CreateMedicationPayloadSchema;
global.swaggerComponents.FilterMedicationPayloadDto = FilterMedicationPayloadSchema;
global.swaggerComponents.UpdateMedicationPayloadDto = UpdateMedicationPayloadSchema;
global.swaggerComponents.DeleteMedicationPayloadDto = DeleteMedicationPayloadSchema;
global.swaggerComponents.MedicationListSuccessResponse = MedicationListSuccessSchema;
global.swaggerComponents.MedicationSuccessResponse = MedicationSuccessSchema;
global.swaggerComponents.MedicationSuccessCRUDResponse = MedicationSuccessCRUDSchema;
global.swaggerComponents.ErrorResponse = ErrorSchema;

const router = express.Router();

/**
 * @openapi
 * /medication/create:
 *   post:
 *     tags:
 *       - Medication
 *     summary: Create Medication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/CreateMedicationPayloadDto"
 *     responses:
 *       201:
 *         description: Created Successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/MedicationSuccessCRUDResponse"
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
  validateRequest(createMedicationDto),
  roleGuard("Admin"),
  medicationController.create
);


/**
 * @openapi
 * /medication/{oid}:
 *   put:
 *     tags: [Medication]
 *     summary: Update Medication
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
 *             $ref: "#/components/schemas/UpdateMedicationPayloadDto"
 *     responses:
 *       200:
 *         description: Medication Updated Successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/MedicationSuccessCRUDResponse"
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
  validateRequest(updateMedicationDto),
  roleGuard("Admin"),
  medicationController.update
);

/**
 * @openapi
 * /medication/delete/{oid}:
 *   delete:
 *     tags: [Medication]
 *     summary: Delete Medication
 *     parameters:
 *       - name: oid
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Medication Deleted Successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/MedicationSuccessCRUDResponse"
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
  validateRequest(deleteMedicationDto),
  roleGuard("Admin"),
  medicationController.remove
);

/**
 * @openapi
 * /medication:
 *   get:
 *     tags: [Medication]
 *     summary: Get All Medications
 *     responses:
 *       200:
 *         description: List of Medications
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/MedicationListSuccessResponse"
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
  validateRequest(filterMedicationDto),
  roleGuard("Admin"),
  medicationController.findAll
);

/**
 * @openapi
 * /medication/q:
 *   post:
 *     tags: [Medication]
 *     summary: Paginated Medications
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/FilterMedicationPayloadDto"
 *     responses:
 *       200:
 *         description: Paginated Medications List
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/MedicationListSuccessResponse"
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
  validateRequest(filterMedicationDto),
  roleGuard("Admin"),
  medicationController.find
);

/**
 * @openapi
 * /medication/{oid}:
 *   get:
 *     tags: [Medication]
 *     summary: Get Medication By ID
 *     parameters:
 *       - name: oid
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Medication Detail
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/MedicationSuccessResponse"
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
  validateRequest(getMedicationDto),
  roleGuard("Admin"),
  medicationController.findById
);


module.exports = router;
