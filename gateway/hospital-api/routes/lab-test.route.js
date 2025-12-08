const express = require("express");
const { roleGuard } = require("../middleware/role-guard");
const { validateRequest } = require("../misc/validation");
const labTestController = require("../controllers/lab-test.controller");
const j2s = require("joi-to-swagger");
const Joi = require("joi");

// Payload DTO
const {
  createLabTestDto,
  updateLabTestDto,
  deleteLabTestDto,
  getLabTestDto, filterLabTestDto, labTestResponseDto, createDto, updateDto, filterDto, params
} = require("../dtos/payload-lab-test-dto");
 
// Response DTO
const { successResponse, errorResponse } = require("../dtos/response-dto");

// Message DTO
const { messageDto } = require("../dtos/message-dto");

// ---- Convert Joi to Swagger ----
const { swagger: CreateLabTestPayloadSchema } = j2s(createDto);
const { swagger: UpdateLabTestPayloadSchema } = j2s(updateDto);
const { swagger: DeleteLabTestPayloadSchema } = j2s(params);
const { swagger: FilterLabTestPayloadSchema } = j2s(filterDto);
const { swagger: LabTestSuccessSchema } = j2s(successResponse(labTestResponseDto));
const { swagger: LabTestListSuccessSchema } = j2s(
  successResponse(Joi.array().items(labTestResponseDto))
);


// Response Schema (success + error)

const { swagger: LabTestSuccessCRUDSchema } = j2s(successResponse(messageDto));
const { swagger: ErrorSchema } = j2s(errorResponse);

// ---- Register to components (global) ----
global.swaggerComponents ??= {};
global.swaggerComponents.CreateLabTestPayloadDto = CreateLabTestPayloadSchema;
global.swaggerComponents.FilterLabTestPayloadDto = FilterLabTestPayloadSchema;
global.swaggerComponents.UpdateLabTestPayloadDto = UpdateLabTestPayloadSchema;
global.swaggerComponents.DeleteLabTestPayloadDto = DeleteLabTestPayloadSchema;
global.swaggerComponents.LabTestListSuccessResponse = LabTestListSuccessSchema;
global.swaggerComponents.LabTestSuccessResponse = LabTestSuccessSchema;
global.swaggerComponents.LabTestSuccessCRUDResponse = LabTestSuccessCRUDSchema;
global.swaggerComponents.ErrorResponse = ErrorSchema;

const router = express.Router();

/**
 * @openapi
 * /lab-test/create:
 *   post:
 *     tags:
 *       - Lab Test
 *     summary: Create Lab Test
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/CreateLabTestPayloadDto"
 *     responses:
 *       201:
 *         description: Created Successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/LabTestSuccessCRUDResponse"
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
  validateRequest(createLabTestDto),
  roleGuard("Admin"),
  labTestController.create
);


/**
 * @openapi
 * /lab-test/{oid}:
 *   put:
 *     tags: [Lab Test]
 *     summary: Update Lab Test
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
 *             $ref: "#/components/schemas/UpdateLabTestPayloadDto"
 *     responses:
 *       200:
 *         description: LabTest Updated Successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/LabTestSuccessCRUDResponse"
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
  validateRequest(updateLabTestDto),
  roleGuard("Admin"),
  labTestController.update
);

/**
 * @openapi
 * /lab-test/delete/{oid}:
 *   delete:
 *     tags: [Lab Test]
 *     summary: Delete Lab Test
 *     parameters:
 *       - name: oid
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: LabTest Deleted Successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/LabTestSuccessCRUDResponse"
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
  validateRequest(deleteLabTestDto),
  roleGuard("Admin"),
  labTestController.remove
);

/**
 * @openapi
 * /lab-test:
 *   get:
 *     tags: [Lab Test]
 *     summary: Get All Lab Tests
 *     responses:
 *       200:
 *         description: List of LabTests
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/LabTestListSuccessResponse"
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
  validateRequest(filterLabTestDto),
  roleGuard("Admin"),
  labTestController.findAll
);

/**
 * @openapi
 * /lab-test/q:
 *   post:
 *     tags: [Lab Test]
 *     summary: Paginated Lab Tests
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/FilterLabTestPayloadDto"
 *     responses:
 *       200:
 *         description: Paginated LabTests List
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/LabTestListSuccessResponse"
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
  validateRequest(filterLabTestDto),
  roleGuard("Admin"),
  labTestController.find
);

/**
 * @openapi
 * /lab-test/{oid}:
 *   get:
 *     tags: [Lab Test]
 *     summary: Get Lab Test By ID
 *     parameters:
 *       - name: oid
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: LabTest Detail
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/LabTestSuccessResponse"
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
  validateRequest(getLabTestDto),
  roleGuard("Admin"),
  labTestController.findById
);


module.exports = router;
