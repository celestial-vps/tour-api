const express = require("express");
const { roleGuard } = require("../middleware/role-guard");
const { validateRequest } = require("../misc/validation");
const prescriptionController = require("../controllers/prescription.controller");
const j2s = require("joi-to-swagger");
const Joi = require("joi");

// Payload DTO
const {
  createPrescriptionDto,
  updatePrescriptionDto,
  deletePrescriptionDto,
  getPrescriptionDto, filterPrescriptionDto, prescriptionResponseDto, createDto, updateDto, filterDto, params
} = require("../dtos/payload-prescription-dto");
 
// Response DTO
const { successResponse, errorResponse } = require("../dtos/response-dto");

// Message DTO
const { messageDto } = require("../dtos/message-dto");

// ---- Convert Joi to Swagger ----
const { swagger: CreatePrescriptionPayloadSchema } = j2s(createDto);
const { swagger: UpdatePrescriptionPayloadSchema } = j2s(updateDto);
const { swagger: DeletePrescriptionPayloadSchema } = j2s(params);
const { swagger: FilterPrescriptionPayloadSchema } = j2s(filterDto);
const { swagger: PrescriptionSuccessSchema } = j2s(successResponse(prescriptionResponseDto));
const { swagger: PrescriptionListSuccessSchema } = j2s(
  successResponse(Joi.array().items(prescriptionResponseDto))
);


// Response Schema (success + error)

const { swagger: PrescriptionSuccessCRUDSchema } = j2s(successResponse(messageDto));
const { swagger: ErrorSchema } = j2s(errorResponse);

// ---- Register to components (global) ----
global.swaggerComponents ??= {};
global.swaggerComponents.CreatePrescriptionPayloadDto = CreatePrescriptionPayloadSchema;
global.swaggerComponents.FilterPrescriptionPayloadDto = FilterPrescriptionPayloadSchema;
global.swaggerComponents.UpdatePrescriptionPayloadDto = UpdatePrescriptionPayloadSchema;
global.swaggerComponents.DeletePrescriptionPayloadDto = DeletePrescriptionPayloadSchema;
global.swaggerComponents.PrescriptionListSuccessResponse = PrescriptionListSuccessSchema;
global.swaggerComponents.PrescriptionSuccessResponse = PrescriptionSuccessSchema;
global.swaggerComponents.PrescriptionSuccessCRUDResponse = PrescriptionSuccessCRUDSchema;
global.swaggerComponents.ErrorResponse = ErrorSchema;

const router = express.Router();

/**
 * @openapi
 * /prescription/create:
 *   post:
 *     tags:
 *       - Prescription
 *     summary: Create Prescription
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/CreatePrescriptionPayloadDto"
 *     responses:
 *       201:
 *         description: Created Successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/PrescriptionSuccessCRUDResponse"
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
  validateRequest(createPrescriptionDto),
  roleGuard("Admin"),
  prescriptionController.create
);


/**
 * @openapi
 * /prescription/{oid}:
 *   put:
 *     tags: [Prescription]
 *     summary: Update Prescription
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
 *             $ref: "#/components/schemas/UpdatePrescriptionPayloadDto"
 *     responses:
 *       200:
 *         description: Prescription Updated Successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/PrescriptionSuccessCRUDResponse"
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
  validateRequest(updatePrescriptionDto),
  roleGuard("Admin"),
  prescriptionController.update
);

/**
 * @openapi
 * /prescription/delete/{oid}:
 *   delete:
 *     tags: [Prescription]
 *     summary: Delete Prescription
 *     parameters:
 *       - name: oid
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Prescription Deleted Successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/PrescriptionSuccessCRUDResponse"
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
  validateRequest(deletePrescriptionDto),
  roleGuard("Admin"),
  prescriptionController.remove
);

/**
 * @openapi
 * /prescription:
 *   get:
 *     tags: [Prescription]
 *     summary: Get All Prescriptions
 *     responses:
 *       200:
 *         description: List of Prescriptions
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/PrescriptionListSuccessResponse"
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
  validateRequest(filterPrescriptionDto),
  roleGuard("Admin"),
  prescriptionController.findAll
);

/**
 * @openapi
 * /prescription/q:
 *   post:
 *     tags: [Prescription]
 *     summary: Paginated Prescriptions
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/FilterPrescriptionPayloadDto"
 *     responses:
 *       200:
 *         description: Paginated Prescriptions List
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/PrescriptionListSuccessResponse"
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
  validateRequest(filterPrescriptionDto),
  roleGuard("Admin"),
  prescriptionController.find
);

/**
 * @openapi
 * /prescription/{oid}:
 *   get:
 *     tags: [Prescription]
 *     summary: Get Prescription By ID
 *     parameters:
 *       - name: oid
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Prescription Detail
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/PrescriptionSuccessResponse"
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
  validateRequest(getPrescriptionDto),
  roleGuard("Admin"),
  prescriptionController.findById
);


module.exports = router;
