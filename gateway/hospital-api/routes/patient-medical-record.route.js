const express = require("express");
const { roleGuard } = require("../middleware/role-guard");
const { validateRequest } = require("../misc/validation");
const patientMedicalRecordController = require("../controllers/patient-medical-record.controller");
const j2s = require("joi-to-swagger");
const Joi = require("joi");

// Payload DTO
const {
  createPatientMedicalRecordDto,
  updatePatientMedicalRecordDto,
  deletePatientMedicalRecordDto,
  getPatientMedicalRecordDto, filterPatientMedicalRecordDto, patientMedicalRecordResponseDto, createDto, updateDto, filterDto, params
} = require("../dtos/payload-patient-medical-record-dto");
 
// Response DTO
const { successResponse, errorResponse } = require("../dtos/response-dto");

// Message DTO
const { messageDto } = require("../dtos/message-dto");

// ---- Convert Joi to Swagger ----
const { swagger: CreatePatientMedicalRecordPayloadSchema } = j2s(createDto);
const { swagger: UpdatePatientMedicalRecordPayloadSchema } = j2s(updateDto);
const { swagger: DeletePatientMedicalRecordPayloadSchema } = j2s(params);
const { swagger: FilterPatientMedicalRecordPayloadSchema } = j2s(filterDto);
const { swagger: PatientMedicalRecordSuccessSchema } = j2s(successResponse(patientMedicalRecordResponseDto));
const { swagger: PatientMedicalRecordListSuccessSchema } = j2s(
  successResponse(Joi.array().items(patientMedicalRecordResponseDto))
);


// Response Schema (success + error)

const { swagger: PatientMedicalRecordSuccessCRUDSchema } = j2s(successResponse(messageDto));
const { swagger: ErrorSchema } = j2s(errorResponse);

// ---- Register to components (global) ----
global.swaggerComponents ??= {};
global.swaggerComponents.CreatePatientMedicalRecordPayloadDto = CreatePatientMedicalRecordPayloadSchema;
global.swaggerComponents.FilterPatientMedicalRecordPayloadDto = FilterPatientMedicalRecordPayloadSchema;
global.swaggerComponents.UpdatePatientMedicalRecordPayloadDto = UpdatePatientMedicalRecordPayloadSchema;
global.swaggerComponents.DeletePatientMedicalRecordPayloadDto = DeletePatientMedicalRecordPayloadSchema;
global.swaggerComponents.PatientMedicalRecordListSuccessResponse = PatientMedicalRecordListSuccessSchema;
global.swaggerComponents.PatientMedicalRecordSuccessResponse = PatientMedicalRecordSuccessSchema;
global.swaggerComponents.PatientMedicalRecordSuccessCRUDResponse = PatientMedicalRecordSuccessCRUDSchema;
global.swaggerComponents.ErrorResponse = ErrorSchema;

const router = express.Router();

/**
 * @openapi
 * /patient-medical-record/create:
 *   post:
 *     tags:
 *       - Patient Medical Record
 *     summary: Create Patient Medical Record
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/CreatePatientMedicalRecordPayloadDto"
 *     responses:
 *       201:
 *         description: Created Successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/PatientMedicalRecordSuccessCRUDResponse"
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
  validateRequest(createPatientMedicalRecordDto),
  roleGuard("Admin"),
  patientMedicalRecordController.create
);


/**
 * @openapi
 * /patient-medical-record/{oid}:
 *   put:
 *     tags: [Patient Medical Record]
 *     summary: Update Patient Medical Record
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
 *             $ref: "#/components/schemas/UpdatePatientMedicalRecordPayloadDto"
 *     responses:
 *       200:
 *         description: PatientMedicalRecord Updated Successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/PatientMedicalRecordSuccessCRUDResponse"
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
  validateRequest(updatePatientMedicalRecordDto),
  roleGuard("Admin"),
  patientMedicalRecordController.update
);

/**
 * @openapi
 * /patient-medical-record/delete/{oid}:
 *   delete:
 *     tags: [Patient Medical Record]
 *     summary: Delete Patient Medical Record
 *     parameters:
 *       - name: oid
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: PatientMedicalRecord Deleted Successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/PatientMedicalRecordSuccessCRUDResponse"
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
  validateRequest(deletePatientMedicalRecordDto),
  roleGuard("Admin"),
  patientMedicalRecordController.remove
);

/**
 * @openapi
 * /patient-medical-record:
 *   get:
 *     tags: [Patient Medical Record]
 *     summary: Get All Patient Medical Records
 *     responses:
 *       200:
 *         description: List of PatientMedicalRecords
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/PatientMedicalRecordListSuccessResponse"
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
  validateRequest(filterPatientMedicalRecordDto),
  roleGuard("Admin"),
  patientMedicalRecordController.findAll
);

/**
 * @openapi
 * /patient-medical-record/q:
 *   post:
 *     tags: [Patient Medical Record]
 *     summary: Paginated Patient Medical Records
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/FilterPatientMedicalRecordPayloadDto"
 *     responses:
 *       200:
 *         description: Paginated PatientMedicalRecords List
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/PatientMedicalRecordListSuccessResponse"
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
  validateRequest(filterPatientMedicalRecordDto),
  roleGuard("Admin"),
  patientMedicalRecordController.find
);

/**
 * @openapi
 * /patient-medical-record/{oid}:
 *   get:
 *     tags: [Patient Medical Record]
 *     summary: Get Patient Medical Record By ID
 *     parameters:
 *       - name: oid
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: PatientMedicalRecord Detail
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/PatientMedicalRecordSuccessResponse"
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
  validateRequest(getPatientMedicalRecordDto),
  roleGuard("Admin"),
  patientMedicalRecordController.findById
);


module.exports = router;
