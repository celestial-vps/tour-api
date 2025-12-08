const express = require("express");
const { roleGuard } = require("../middleware/role-guard");
const { validateRequest } = require("../misc/validation");
const patientController = require("../controllers/patient.controller");
const j2s = require("joi-to-swagger");
const Joi = require("joi");

// Payload DTO
const {
  createPatientDto,
  updatePatientDto,
  deletePatientDto,
  getPatientDto, filterPatientDto, patientResponseDto, createDto, updateDto, filterDto, params
} = require("../dtos/payload-patient-dto");
 
// Response DTO
const { successResponse, errorResponse } = require("../dtos/response-dto");

// Message DTO
const { messageDto } = require("../dtos/message-dto");

// ---- Convert Joi to Swagger ----
const { swagger: CreatePatientPayloadSchema } = j2s(createDto);
const { swagger: UpdatePatientPayloadSchema } = j2s(updateDto);
const { swagger: DeletePatientPayloadSchema } = j2s(params);
const { swagger: FilterPatientPayloadSchema } = j2s(filterDto);
const { swagger: PatientSuccessSchema } = j2s(successResponse(patientResponseDto));
const { swagger: PatientListSuccessSchema } = j2s(
  successResponse(Joi.array().items(patientResponseDto))
);


// Response Schema (success + error)

const { swagger: PatientSuccessCRUDSchema } = j2s(successResponse(messageDto));
const { swagger: ErrorSchema } = j2s(errorResponse);

// ---- Register to components (global) ----
global.swaggerComponents ??= {};
global.swaggerComponents.CreatePatientPayloadDto = CreatePatientPayloadSchema;
global.swaggerComponents.FilterPatientPayloadDto = FilterPatientPayloadSchema;
global.swaggerComponents.UpdatePatientPayloadDto = UpdatePatientPayloadSchema;
global.swaggerComponents.DeletePatientPayloadDto = DeletePatientPayloadSchema;
global.swaggerComponents.PatientListSuccessResponse = PatientListSuccessSchema;
global.swaggerComponents.PatientSuccessResponse = PatientSuccessSchema;
global.swaggerComponents.PatientSuccessCRUDResponse = PatientSuccessCRUDSchema;
global.swaggerComponents.ErrorResponse = ErrorSchema;

const router = express.Router();

/**
 * @openapi
 * /patient/create:
 *   post:
 *     tags:
 *       - Patient
 *     summary: Create Patient
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/CreatePatientPayloadDto"
 *     responses:
 *       201:
 *         description: Created Successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/PatientSuccessCRUDResponse"
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
  validateRequest(createPatientDto),
  roleGuard("Admin"),
  patientController.create
);


/**
 * @openapi
 * /patient/{oid}:
 *   put:
 *     tags: [Patient]
 *     summary: Update Patient
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
 *             $ref: "#/components/schemas/UpdatePatientPayloadDto"
 *     responses:
 *       200:
 *         description: Patient Updated Successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/PatientSuccessCRUDResponse"
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
  validateRequest(updatePatientDto),
  roleGuard("Admin"),
  patientController.update
);

/**
 * @openapi
 * /patient/delete/{oid}:
 *   delete:
 *     tags: [Patient]
 *     summary: Delete Patient
 *     parameters:
 *       - name: oid
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Patient Deleted Successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/PatientSuccessCRUDResponse"
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
  validateRequest(deletePatientDto),
  roleGuard("Admin"),
  patientController.remove
);

/**
 * @openapi
 * /patient:
 *   get:
 *     tags: [Patient]
 *     summary: Get All Patients
 *     responses:
 *       200:
 *         description: List of Patients
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/PatientListSuccessResponse"
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
  validateRequest(filterPatientDto),
  roleGuard("Admin"),
  patientController.findAll
);

/**
 * @openapi
 * /patient/q:
 *   post:
 *     tags: [Patient]
 *     summary: Paginated Patients
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/FilterPatientPayloadDto"
 *     responses:
 *       200:
 *         description: Paginated Patients List
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/PatientListSuccessResponse"
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
  validateRequest(filterPatientDto),
  roleGuard("Admin"),
  patientController.find
);

/**
 * @openapi
 * /patient/{oid}:
 *   get:
 *     tags: [Patient]
 *     summary: Get Patient By ID
 *     parameters:
 *       - name: oid
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Patient Detail
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/PatientSuccessResponse"
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
  validateRequest(getPatientDto),
  roleGuard("Admin"),
  patientController.findById
);


module.exports = router;
