const express = require("express");
const { roleGuard } = require("../middleware/role-guard");
const { validateRequest } = require("../misc/validation");
const patientLabController = require("../controllers/patient-lab-test.controller");
const j2s = require("joi-to-swagger");
const Joi = require("joi");

// Payload DTO
const {
  createPatientLabTestDto,
  updatePatientLabTestDto,
  deletePatientLabTestDto,
  getPatientLabTestDto, filterPatientLabTestDto, patientLabTestResponseDto, createDto, updateDto, filterDto, params
} = require("../dtos/payload-patient-lab-test-dto");
 
// Response DTO
const { successResponse, errorResponse } = require("../dtos/response-dto");

// Message DTO
const { messageDto } = require("../dtos/message-dto");

// ---- Convert Joi to Swagger ----
const { swagger: CreatePatientLabTestPayloadSchema } = j2s(createDto);
const { swagger: UpdatePatientLabTestPayloadSchema } = j2s(updateDto);
const { swagger: DeletePatientLabTestPayloadSchema } = j2s(params);
const { swagger: FilterPatientLabTestPayloadSchema } = j2s(filterDto);
const { swagger: PatientLabTestSuccessSchema } = j2s(successResponse(patientLabTestResponseDto));
const { swagger: PatientLabTestListSuccessSchema } = j2s(
  successResponse(Joi.array().items(patientLabTestResponseDto))
);


// Response Schema (success + error)

const { swagger: PatientLabTestSuccessCRUDSchema } = j2s(successResponse(messageDto));
const { swagger: ErrorSchema } = j2s(errorResponse);

// ---- Register to components (global) ----
global.swaggerComponents ??= {};
global.swaggerComponents.CreatePatientLabTestPayloadDto = CreatePatientLabTestPayloadSchema;
global.swaggerComponents.FilterPatientLabTestPayloadDto = FilterPatientLabTestPayloadSchema;
global.swaggerComponents.UpdatePatientLabTestPayloadDto = UpdatePatientLabTestPayloadSchema;
global.swaggerComponents.DeletePatientLabTestPayloadDto = DeletePatientLabTestPayloadSchema;
global.swaggerComponents.PatientLabTestListSuccessResponse = PatientLabTestListSuccessSchema;
global.swaggerComponents.PatientLabTestSuccessResponse = PatientLabTestSuccessSchema;
global.swaggerComponents.PatientLabTestSuccessCRUDResponse = PatientLabTestSuccessCRUDSchema;
global.swaggerComponents.ErrorResponse = ErrorSchema;

const router = express.Router();

/**
 * @openapi
 * /patient-lab-test/create:
 *   post:
 *     tags:
 *       - Patient Lab Test
 *     summary: Create Patient Lab Test
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/CreatePatientLabTestPayloadDto"
 *     responses:
 *       201:
 *         description: Created Successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/PatientLabTestSuccessCRUDResponse"
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
  validateRequest(createPatientLabTestDto),
  roleGuard("Admin"),
  patientLabController.create
);


/**
 * @openapi
 * /patient-lab-test/{oid}:
 *   put:
 *     tags: [Patient Lab Test]
 *     summary: Update Patient Lab Test
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
 *             $ref: "#/components/schemas/UpdatePatientLabTestPayloadDto"
 *     responses:
 *       200:
 *         description: PatientLabTest Updated Successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/PatientLabTestSuccessCRUDResponse"
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
  validateRequest(updatePatientLabTestDto),
  roleGuard("Admin"),
  patientLabController.update
);

/**
 * @openapi
 * /patient-lab-test/delete/{oid}:
 *   delete:
 *     tags: [Patient Lab Test]
 *     summary: Delete Patient Lab Test
 *     parameters:
 *       - name: oid
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: PatientLabTest Deleted Successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/PatientLabTestSuccessCRUDResponse"
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
  validateRequest(deletePatientLabTestDto),
  roleGuard("Admin"),
  patientLabController.remove
);

/**
 * @openapi
 * /patient-lab-test:
 *   get:
 *     tags: [Patient Lab Test]
 *     summary: Get All Patient Lab Tests
 *     responses:
 *       200:
 *         description: List of PatientLabTests
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/PatientLabTestListSuccessResponse"
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
  validateRequest(filterPatientLabTestDto),
  roleGuard("Admin"),
  patientLabController.findAll
);

/**
 * @openapi
 * /patient-lab-test/q:
 *   post:
 *     tags: [Patient Lab Test]
 *     summary: Paginated Patient Lab Tests
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/FilterPatientLabTestPayloadDto"
 *     responses:
 *       200:
 *         description: Paginated PatientLabTests List
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/PatientLabTestListSuccessResponse"
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
  validateRequest(filterPatientLabTestDto),
  roleGuard("Admin"),
  patientLabController.find
);

/**
 * @openapi
 * /patient-lab-test/{oid}:
 *   get:
 *     tags: [Patient Lab Test]
 *     summary: Get Patient Lab Test By ID
 *     parameters:
 *       - name: oid
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: PatientLabTest Detail
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/PatientLabTestSuccessResponse"
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
  validateRequest(getPatientLabTestDto),
  roleGuard("Admin"),
  patientLabController.findById
);


module.exports = router;
